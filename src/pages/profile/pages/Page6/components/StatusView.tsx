import { Button } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { RegistrationStatus } from "@/api/dtos/company-registration.dto";
import "./StatusView.scss";

interface StatusViewProps {
  existingRegistration: {
    status: RegistrationStatus;
    companyName: string;
    rejectionReason?: string;
  };
  onReapply: () => void;
}

export const StatusView = ({ existingRegistration, onReapply }: StatusViewProps) => {
  const statusConfig: Record<
    RegistrationStatus,
    { label: string; icon: React.ReactNode; className: string }
  > = {
    [RegistrationStatus.PENDING]: {
      label: "Đang chờ phê duyệt",
      icon: <ClockCircleOutlined />,
      className: "pending",
    },
    [RegistrationStatus.APPROVED]: {
      label: "Đã được phê duyệt",
      icon: <CheckCircleOutlined />,
      className: "approved",
    },
    [RegistrationStatus.REJECTED]: {
      label: "Đã bị từ chối",
      icon: <CloseCircleOutlined />,
      className: "rejected",
    },
  };

  const cfg = statusConfig[existingRegistration.status as RegistrationStatus];

  const noteMessages: Record<RegistrationStatus, string> = {
    [RegistrationStatus.PENDING]:
      "Yêu cầu của bạn đang được admin xem xét. Bạn sẽ nhận được thông báo khi có kết quả.",
    [RegistrationStatus.APPROVED]:
      "Chúc mừng! Bạn đã trở thành nhà xe. Vui lòng đăng nhập lại để sử dụng các chức năng dành cho nhà xe.",
    [RegistrationStatus.REJECTED]:
      "Vui lòng kiểm tra lại thông tin và gửi yêu cầu mới.",
  };

  return (
    <div className="registration-status">
      <span className={`registration-status__badge registration-status__badge--${cfg.className}`}>
        {cfg.icon}
        {cfg.label}
      </span>
      <p className="registration-company-name">
        <span>Thông tin nhà xe: </span>
        <ShopOutlined style={{ marginRight: 8, color: "#6b7280" }} />
        {existingRegistration.companyName}
      </p>
      {existingRegistration.rejectionReason && (
        <p className="registration-rejection-reason">
          <strong>Lý do:</strong> {existingRegistration.rejectionReason}
        </p>
      )}
      <p className="registration-note">{noteMessages[existingRegistration.status as RegistrationStatus]}</p>
      {existingRegistration.status === RegistrationStatus.REJECTED && (
        <div className="action">
          <Button
            type="primary"
            className="btn-primary"
            onClick={onReapply}
            style={{ marginTop: 8 }}
          >
            Đăng ký lại
          </Button>
        </div>
      )}
    </div>
  );
};
