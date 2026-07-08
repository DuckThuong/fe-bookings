import { useMemo, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Empty,
  Pagination,
  Select,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  DownloadOutlined,
  FilterOutlined,
  PayCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getPaymentInvoices, getInvoiceSummary } from "@/api/configs/invoice.config";
import { formatCurrencyVND } from "@/common/contexts/format";
import { DEFAULT_MESSAGE, NOTI_ERROR } from "@/common/constants/constants";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import type { PaymentInvoice } from "@/api/dtos/invoice.dto";
import "./style.scss";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const PAYMENT_METHODS = [
  { value: "", label: "Tất cả" },
  { value: "PAYOS", label: "PayOS (VietQR)" },
  { value: "CASH", label: "Tiền mặt" },
];

const STATUS_CONFIG = {
  SUCCESS: { color: "#15803d", bg: "#dcfce7", label: "Thành công", icon: <CheckCircleOutlined /> },
  PENDING: { color: "#854d0e", bg: "#fef9c3", label: "Đang xử lý", icon: <ClockCircleOutlined /> },
  FAILED: { color: "#991b1b", bg: "#fee2e2", label: "Thất bại", icon: <ClockCircleOutlined /> },
};

export const PaymentHistoryPage = () => {
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [method, setMethod] = useState<string>("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const queryParams = useMemo(() => ({
    page,
    limit,
    method: method || undefined,
    fromDate: dateRange?.[0]?.format("YYYY-MM-DD") || undefined,
    toDate: dateRange?.[1]?.format("YYYY-MM-DD") || undefined,
  }), [page, limit, method, dateRange]);

  const summaryQuery = useQuery({
    queryKey: ["invoiceSummary"],
    queryFn: getInvoiceSummary,
  });

  const listQuery = useQuery({
    queryKey: ["paymentInvoices", queryParams],
    queryFn: () => getPaymentInvoices(queryParams),
  });

  const handleCopyCode = (code: string) => {
    void navigator.clipboard.writeText(code);
    showNotification("Đã sao chép mã hóa đơn", NOTI_ERROR);
  };

  const columns = [
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (code: string) => (
        <div className="invoice-code-cell">
          <Text strong className="invoice-code">{code}</Text>
          <Tooltip title="Sao chép mã">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              className="invoice-copy-btn"
              onClick={() => handleCopyCode(code)}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Tuyến xe",
      key: "route",
      width: 220,
      render: (_: unknown, record: PaymentInvoice) => (
        <div className="invoice-route-cell">
          {record.trip?.departure && record.trip?.arrival ? (
            <>
              <Text className="route-text">{record.trip.departure}</Text>
              <span className="route-arrow">→</span>
              <Text className="route-text">{record.trip.arrival}</Text>
            </>
          ) : (
            <Text type="secondary">-</Text>
          )}
          {record.trip?.date && (
            <Text type="secondary" className="invoice-date">
              {record.trip.date}
              {record.trip?.time && ` • ${record.trip.time}`}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: "Nhà xe",
      dataIndex: ["company", "companyName"],
      key: "company",
      width: 160,
      render: (name: string) => <Text>{name || "-"}</Text>,
    },
    {
      title: "Phương thức",
      dataIndex: "methodDisplay",
      key: "method",
      width: 140,
      render: (method: string) => (
        <Tag className="invoice-method-tag">{method}</Tag>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right" as const,
      render: (amount: number) => (
        <Text strong className="invoice-amount">
          {formatCurrencyVND(amount)}
        </Text>
      ),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paidAt",
      key: "paidAt",
      width: 150,
      render: (date: string | null) => (
        <Text type="secondary">
          {date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "-"}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center" as const,
      render: (status: string) => {
        const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
        return (
          <Tag
            icon={config.icon}
            className="invoice-status-tag"
            style={{ background: config.bg, color: config.color, borderColor: config.color }}
          >
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "actions",
      width: 80,
      align: "center" as const,
      render: (_: unknown, record: PaymentInvoice) => (
        <Tooltip title="Tải hóa đơn">
          <Button
            type="text"
            icon={<DownloadOutlined />}
            className="invoice-action-btn"
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="payment-history-page">
      <div className="payment-history-page__header">
        <div className="ph-header__text">
          <h2 className="ph-header__title">Hóa đơn thanh toán</h2>
          <p className="ph-header__desc">
            Quản lý và theo dõi các hóa đơn thanh toán của bạn.
          </p>
        </div>
        <span className="ph-header__count">
          {summaryQuery.data?.totalPayments ?? 0} hóa đơn
        </span>
      </div>

      <div className="payment-history-page__stats">
        <Card className="ph-stat-card">
          <div className="ph-stat-card__icon ph-stat-card__icon--success">
            <PayCircleOutlined />
          </div>
          <div className="ph-stat-card__content">
            <Text className="ph-stat-card__label">Tổng chi tiêu</Text>
            <Text className="ph-stat-card__value">
              {summaryQuery.isLoading ? (
                <Spin size="small" />
              ) : (
                formatCurrencyVND(summaryQuery.data?.totalSpent ?? 0)
              )}
            </Text>
          </div>
        </Card>

        <Card className="ph-stat-card">
          <div className="ph-stat-card__icon ph-stat-card__icon--primary">
            <CheckCircleOutlined />
          </div>
          <div className="ph-stat-card__content">
            <Text className="ph-stat-card__label">Tổng thanh toán</Text>
            <Text className="ph-stat-card__value">
              {summaryQuery.isLoading ? (
                <Spin size="small" />
              ) : (
                `${summaryQuery.data?.totalPayments ?? 0} giao dịch`
              )}
            </Text>
          </div>
        </Card>

        <Card className="ph-stat-card">
          <div className="ph-stat-card__icon ph-stat-card__icon--warning">
            <ClockCircleOutlined />
          </div>
          <div className="ph-stat-card__content">
            <Text className="ph-stat-card__label">Chờ hoàn tiền</Text>
            <Text className="ph-stat-card__value">
              {summaryQuery.isLoading ? (
                <Spin size="small" />
              ) : (
                `${summaryQuery.data?.pendingRefunds ?? 0} yêu cầu`
              )}
            </Text>
          </div>
        </Card>
      </div>

      <Card className="payment-history-page__filters">
        <div className="ph-filters">
          <div className="ph-filters__left">
            <FilterOutlined className="ph-filters__icon" />
            <Text className="ph-filters__label">Bộ lọc:</Text>

            <Select
              value={method}
              onChange={setMethod}
              options={PAYMENT_METHODS}
              className="ph-filter-select"
              placeholder="Phương thức thanh toán"
            />

            <RangePicker
              value={dateRange}
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null)}
              format="DD/MM/YYYY"
              className="ph-filter-date"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </div>

          <div className="ph-filters__right">
            <Button
              icon={<SearchOutlined />}
              onClick={() => setPage(1)}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </Card>

      <Card className="payment-history-page__table-card">
        {listQuery.isLoading ? (
          <div className="payment-history-page__loading">
            <Spin size="large" />
          </div>
        ) : listQuery.data?.items.length === 0 ? (
          <Empty
            description="Không có hóa đơn thanh toán nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <>
            <Table
              dataSource={listQuery.data?.items}
              columns={columns}
              rowKey="id"
              pagination={false}
              className="payment-history-table"
              size="middle"
            />

            <div className="payment-history-page__pagination">
              <div className="ph-pagination__info">
                <Text type="secondary">
                  Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, listQuery.data?.total ?? 0)} trong {listQuery.data?.total ?? 0} kết quả
                </Text>
              </div>
              <Pagination
                current={page}
                pageSize={limit}
                total={listQuery.data?.total ?? 0}
                onChange={(p, l) => {
                  setPage(p);
                  setLimit(l);
                }}
                showSizeChanger
                pageSizeOptions={["10", "20", "50"]}
                showQuickJumper
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
