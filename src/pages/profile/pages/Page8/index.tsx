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
  CloseCircleOutlined,
  ClockCircleOutlined,
  CopyOutlined,
  FilterOutlined,
  RefundOutlined,
  SearchOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import { getRefundInvoices } from "@/api/configs/invoice.config";
import { formatCurrencyVND } from "@/common/contexts/format";
import type { RefundInvoice } from "@/api/dtos/invoice.dto";
import "./style.scss";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const REFUND_STATUS_CONFIG = {
  SUCCESS: {
    color: "#15803d",
    bg: "#dcfce7",
    label: "Hoàn tiền thành công",
    icon: <CheckCircleOutlined />,
  },
  PENDING: {
    color: "#854d0e",
    bg: "#fef9c3",
    label: "Đang xử lý",
    icon: <ClockCircleOutlined />,
  },
  REJECTED: {
    color: "#991b1b",
    bg: "#fee2e2",
    label: "Từ chối hoàn tiền",
    icon: <CloseCircleOutlined />,
  },
};

export const RefundHistoryPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [status, setStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  const queryParams = useMemo(() => ({
    page,
    limit,
    status: status || undefined,
    fromDate: dateRange?.[0]?.format("YYYY-MM-DD") || undefined,
    toDate: dateRange?.[1]?.format("YYYY-MM-DD") || undefined,
  }), [page, limit, status, dateRange]);

  const listQuery = useQuery({
    queryKey: ["refundInvoices", queryParams],
    queryFn: () => getRefundInvoices(queryParams),
  });

  const handleCopyCode = (code: string) => {
    void navigator.clipboard.writeText(code);
  };

  const columns = [
    {
      title: "Mã hoàn tiền",
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
      render: (_: unknown, record: RefundInvoice) => (
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
      title: "Mã thanh toán gốc",
      dataIndex: ["payment", "code"],
      key: "paymentCode",
      width: 140,
      render: (code: string) => (
        <Text type="secondary" className="payment-ref-code">
          {code || "-"}
        </Text>
      ),
    },
    {
      title: "Số tiền hoàn",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      align: "right" as const,
      render: (amount: number) => (
        <Text strong className="invoice-amount invoice-amount--refund">
          {formatCurrencyVND(amount)}
        </Text>
      ),
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      width: 180,
      ellipsis: true,
      render: (reason: string | null) => (
        <Tooltip title={reason || "Không có lý do"}>
          <Text type="secondary">{reason || "Không có lý do"}</Text>
        </Tooltip>
      ),
    },
    {
      title: "Ngày hoàn tiền",
      dataIndex: "refundedAt",
      key: "refundedAt",
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
      width: 160,
      align: "center" as const,
      render: (status: string) => {
        const config = REFUND_STATUS_CONFIG[status as keyof typeof REFUND_STATUS_CONFIG] || REFUND_STATUS_CONFIG.PENDING;
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
  ];

  return (
    <div className="refund-history-page">
      <div className="refund-history-page__header">
        <div className="rh-header__text">
          <h2 className="rh-header__title">Hóa đơn hoàn tiền</h2>
          <p className="rh-header__desc">
            Theo dõi trạng thái hoàn tiền cho các giao dịch đã hủy.
          </p>
        </div>
        <span className="rh-header__count">
          {listQuery.data?.total ?? 0} yêu cầu
        </span>
      </div>

      <Card className="refund-history-page__filters">
        <div className="rh-filters">
          <div className="rh-filters__left">
            <FilterOutlined className="rh-filters__icon" />
            <Text className="rh-filters__label">Bộ lọc:</Text>

            <Select
              value={status}
              onChange={(val) => {
                setStatus(val);
                setPage(1);
              }}
              options={[
                { value: "", label: "Tất cả" },
                { value: "SUCCESS", label: "Hoàn tiền thành công" },
                { value: "PENDING", label: "Đang xử lý" },
                { value: "REJECTED", label: "Từ chối" },
              ]}
              className="rh-filter-select"
              placeholder="Trạng thái hoàn tiền"
            />

            <RangePicker
              value={dateRange}
              onChange={(dates) => {
                setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null] | null);
                setPage(1);
              }}
              format="DD/MM/YYYY"
              className="rh-filter-date"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </div>

          <div className="rh-filters__right">
            <Button
              icon={<SearchOutlined />}
              onClick={() => setPage(1)}
            >
              Tìm kiếm
            </Button>
          </div>
        </div>
      </Card>

      <Card className="refund-history-page__table-card">
        {listQuery.isLoading ? (
          <div className="refund-history-page__loading">
            <Spin size="large" />
          </div>
        ) : listQuery.data?.items.length === 0 ? (
          <Empty
            description="Không có yêu cầu hoàn tiền nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <>
            <Table
              dataSource={listQuery.data?.items}
              columns={columns}
              rowKey="id"
              pagination={false}
              className="refund-history-table"
              size="middle"
            />

            <div className="refund-history-page__pagination">
              <div className="rh-pagination__info">
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

      <Card className="refund-history-page__info">
        <div className="rh-info">
          <WarningOutlined className="rh-info__icon" />
          <div className="rh-info__content">
            <Text strong className="rh-info__title">Lưu ý về hoàn tiền</Text>
            <ul className="rh-info__list">
              <li>Thời gian xử lý hoàn tiền thông thường từ 3-7 ngày làm việc.</li>
              <li>Đối với thanh toán qua thẻ, tiền sẽ được hoàn vào tài khoản ngân hàng của bạn.</li>
              <li>Đối với thanh toán qua ví điện tử (PayOS, MoMo, ZaloPay), tiền sẽ được hoàn vào ví tương ứng.</li>
              <li>Nếu có thắc mắc về trạng thái hoàn tiền, vui lòng liên hệ bộ phận hỗ trợ.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
