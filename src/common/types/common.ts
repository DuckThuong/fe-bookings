export interface SelectOptionProps {
  key: number;
  value: string | number;
  label: string;
}

export interface TableCommonProps {
  key: number;
  label: string;
  className?: string;
  value?: string;
  render?: (value: any, record?: any) => React.ReactElement;
}
