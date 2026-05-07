import { Table } from "antd";
import type { ColumnType } from "antd/es/table";
import { useMemo } from "react";
import type { TableCommonProps } from "../../common/types/common";
import "./style.scss";
import { Pagination } from "../PaginationCommon/paginationCommon";

interface CommonTableProps {
  header: TableCommonProps[];
  body: any[] | [];
  className?: string;
  loading?: boolean;
  hasPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export const CommonTable = ({
  header,
  body,
  className = "",
  loading = false,
  hasPagination = false,
  currentPage = 1,
  totalPages = 0,
  onPageChange,
}: CommonTableProps) => {
  const columns: ColumnType<any>[] = useMemo(() => {
    return header.map((col) => ({
      title: col.label,
      dataIndex: col.value || col.label.toLowerCase(),
      key: col.key,
      className: col.className || "",
      render: col.render
        ? (text: any, record: any) => col.render!(text, record)
        : undefined,
    }));
  }, [header]);

  return (
    <div className={`common__table ${className}`}>
      <Table
        columns={columns}
        dataSource={body || []}
        pagination={false}
        loading={loading}
        rowKey={(record, index) => record.key || index}
        bordered
        size="middle"
        scroll={{ x: "max-content" }}
      />

      {hasPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange ?? (() => {})}
        />
      )}
    </div>
  );
};
