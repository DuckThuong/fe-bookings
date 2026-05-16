import {
  FILTER_CHIPS,
  SORT_OPTIONS,
  type FilterKey,
  type SortKey,
} from "@/common/types/ticket";
import { Button, Select } from "antd";

interface FilterBarProps {
  activeFilters: FilterKey[];
  sortKey: SortKey;
  resultCount: number;
  from: string;
  to: string;
  date: string;
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
  onToggleFilter,
  onSortChange,
}: FilterBarProps) => (
  <div className="filter-bar">
    <p className="filter-bar__count">
      Tìm thấy <strong>{resultCount} chuyến xe</strong> — {from} → {to}, {date}
    </p>

    <div className="filter-bar__controls">
      <span className="filter-bar__label">Lọc:</span>

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
