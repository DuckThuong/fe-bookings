import {
  FILTER_CHIPS,
  SORT_OPTIONS,
  type FilterKey,
  type SortKey,
} from "@/common/types/ticket";
import { Button, Select, Tag } from "antd";
import { CloseOutlined } from "@ant-design/icons";

interface FilterBarProps {
  activeFilters: FilterKey[];
  sortKey: SortKey;
  resultCount: number;
  from: string;
  to: string;
  date: string;
  companyName?: string;
  onClearCompany?: () => void;
  onToggleFilter: (key: FilterKey) => void;
  onSortChange: (key: SortKey) => void;
}

export const FilterBar = ({
  activeFilters,
  sortKey,
  resultCount,
  from,
  to,
  date,
  companyName,
  onClearCompany,
  onToggleFilter,
  onSortChange,
}: FilterBarProps) => (
  <div className="filter-bar">
    <p className="filter-bar__count">
      {from != "" && to != "" && (
        <>
          Tìm thấy <strong>{resultCount} chuyến xe</strong> — {from} → {to},{" "}
          {date}
        </>
      )}
      {from == "" && to == "" && companyName && (
        <>
          Tìm thấy <strong>{resultCount} chuyến xe</strong> của nhà xe{" "}
          <strong>{companyName}</strong>
        </>
      )}
    </p>

    <div className="filter-bar__controls">
      <span className="filter-bar__label">Lọc:</span>

      {companyName && onClearCompany && (
        <Tag
          className="filter-bar__company-chip"
          color="blue"
          closable
          closeIcon={<CloseOutlined />}
          onClose={(e) => {
            e.preventDefault();
            onClearCompany();
          }}
        >
          Nhà xe: {companyName}
        </Tag>
      )}

      <div className="filter-bar__chips">
        {FILTER_CHIPS.map((f) => (
          <Button
            key={f.key}
            className={`filter-chip${activeFilters.includes(f.key) ? " filter-chip--active" : ""}`}
            onClick={() => onToggleFilter(f.key)}
            type="default"
            size="small"
          >
            {f.label}
          </Button>
        ))}
      </div>

      <div className="filter-bar__sort">
        <span className="filter-bar__sort-label">⚙ Sắp xếp:</span>
        <Select
          className="filter-bar__sort-select"
          value={sortKey}
          onChange={onSortChange}
          popupMatchSelectWidth={false}
          options={SORT_OPTIONS.map((o) => ({
            value: o.key,
            label: o.label,
          }))}
        />
      </div>
    </div>
  </div>
);
