import { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal, Select, Steps, Upload } from "antd";
import { useUser } from "@/common/contexts/UserContext";
import {
  createCompanyRegistration,
  getMyCompanyRegistration,
} from "@/api/configs/company-registration.config";
import { ROUTER_PATH } from "@/routers/Route";
import type { UploadFile } from "antd/es/upload/interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/providers/notificationProvider";
import { RegistrationStatus } from "@/api/dtos/company-registration.dto";
import "./style.scss";

type CompanyRegistrationFormValues = {
  companyName: string;
  address?: string;
  representativePhone?: string;
  representativeName?: string;
  representativePosition?: string;
  taxCode?: string;
  businessAddress?: string;
  businessLicenseDate?: string;
  businessLicenseUrl?: string;
  idCardUrl?: string;
  description?: string;
};

export const CompanyRegistrationPage = () => {
  const { user } = useUser();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [idCardFileList, setIdCardFileList] = useState<UploadFile[]>([]);

  const { data: existingRegistration, isLoading } = useQuery({
    queryKey: ["myCompanyRegistration"],
    queryFn: getMyCompanyRegistration,
    enabled: Boolean(user.id),
  });

  const createMutation = useMutation({
    mutationFn: createCompanyRegistration,
    onSuccess: () => {
      message.success("Gửi yêu cầu đăng ký nhà xe thành công");
      queryClient.invalidateQueries({ queryKey: ["myCompanyRegistration"] });
    },
    onError: (error) => {
      let errorMessage = "Gửi yêu cầu thất bại";
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      message.error(errorMessage);
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: CompanyRegistrationFormValues = {
        companyName: values.companyName,
        address: values.address,
        representativePhone: values.representativePhone,
        representativeName: values.representativeName,
        representativePosition: values.representativePosition,
        taxCode: values.taxCode,
        businessAddress: values.businessAddress,
        businessLicenseDate: values.businessLicenseDate
          ? new Date(values.businessLicenseDate).toISOString().split("T")[0]
          : undefined,
        businessLicenseUrl: fileList[0]?.url || fileList[0]?.thumbUrl,
        idCardUrl: idCardFileList[0]?.url || idCardFileList[0]?.thumbUrl,
        description: values.description,
      };
      createMutation.mutate(payload);
    } catch (errorInfo) {
      console.log("Validate Failed:", errorInfo);
    }
  };

  const handleNext = async () => {
    try {
      if (step === 0) {
        await form.validateFields(["companyName", "representativeName", "representativePhone"]);
      }
      setStep(step + 1);
    } catch {
      // validation failed
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  if (existingRegistration) {
    const statusLabel: Record<RegistrationStatus, string> = {
      [RegistrationStatus.PENDING]: "Đang chờ phê duyệt",
      [RegistrationStatus.APPROVED]: "Đã được phê duyệt",
      [RegistrationStatus.REJECTED]: "Đã bị từ chối",
    };

    return (
      <div className="registration-page">
        <div className="registration-card">
          <h2>Trạng thái đăng ký nhà xe</h2>
          <div className="registration-status">
            <span
              className={`registration-status__badge registration-status__badge--${existingRegistration.status.toLowerCase()}`}
            >
              {statusLabel[existingRegistration.status as RegistrationStatus]}
            </span>
            <p className="registration-company-name">
              Nhà xe: {existingRegistration.companyName}
            </p>
            {existingRegistration.rejectionReason && (
              <p className="registration-rejection-reason">
                Lý do: {existingRegistration.rejectionReason}
              </p>
            )}
            <p className="registration-note">
              {existingRegistration.status === RegistrationStatus.PENDING
                ? "Yêu cầu của bạn đang được admin xem xét. Bạn sẽ nhận được thông báo khi có kết quả."
                : existingRegistration.status === RegistrationStatus.APPROVED
                  ? "Chúc mừng! Bạn đã trở thành nhà xe. Vui lòng đăng nhập lại để sử dụng các chức năng dành cho nhà xe."
                  : "Vui lòng kiểm tra lại thông tin và gửi yêu cầu mới."}
            </p>
            {existingRegistration.status === RegistrationStatus.REJECTED && (
              <Button
                type="primary"
                onClick={() => {
                  setStep(0);
                  form.resetFields();
                  setFileList([]);
                  setIdCardFileList([]);
                }}
              >
                Đăng ký lại
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-page">
      <div className="registration-card">
        <h2>Đăng ký trở thành nhà xe</h2>
        <p className="registration-subtitle">
          Vui lòng điền đầy đủ thông tin để đăng ký trở thành nhà xe. Admin sẽ
          xem xét và phê duyệt hồ sơ của bạn.
        </p>

        <Steps
          current={step}
          className="registration-steps"
          items={[
            { title: "Thông tin nhà xe" },
            { title: "Giấy tờ pháp lý" },
            { title: "Xác nhận" },
          ]}
        />

        <Form
          form={form}
          layout="vertical"
          className="registration-form"
          initialValues={{
            companyName: "",
            address: "",
            representativePhone: "",
            representativeName: "",
            representativePosition: "",
            taxCode: "",
            businessAddress: "",
            businessLicenseDate: "",
            description: "",
          }}
        >
          {step === 0 && (
            <div className="registration-step">
              <Form.Item
                name="companyName"
                label="Tên nhà xe"
                rules={[
                  { required: true, message: "Vui lòng nhập tên nhà xe" },
                ]}
              >
                <Input placeholder="Nhập tên nhà xe" />
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ trụ sở">
                <Input placeholder="Nhập địa chỉ trụ sở" />
              </Form.Item>
              <Form.Item
                name="representativeName"
                label="Tên người đại diện pháp lý"
                rules={[
                  { required: true, message: "Vui lòng nhập tên đại diện" },
                ]}
              >
                <Input placeholder="Nhập tên người đại diện" />
              </Form.Item>
              <Form.Item
                name="representativePosition"
                label="Chức vụ"
                rules={[{ required: true, message: "Vui lòng nhập chức vụ" }]}
              >
                <Input placeholder="Nhập chức vụ" />
              </Form.Item>
              <Form.Item
                name="representativePhone"
                label="Số điện thoại đại diện"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item name="taxCode" label="Mã số thuế">
                <Input placeholder="Nhập mã số thuế" />
              </Form.Item>
              <Form.Item name="businessAddress" label="Địa chỉ theo GPKD">
                <Input placeholder="Nhập địa chỉ theo giấy phép kinh doanh" />
              </Form.Item>
            </div>
          )}

          {step === 1 && (
            <div className="registration-step">
              <Form.Item
                name="businessLicenseDate"
                label="Ngày cấp giấy phép kinh doanh"
              >
                <Input type="date" />
              </Form.Item>
              <Form.Item label="Giấy phép kinh doanh">
                <Upload
                  listType="picture"
                  fileList={fileList}
                  onChange={({ fileList }) => setFileList(fileList)}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button>Chọn file giấy phép kinh doanh</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="CMND/CCCD người đại diện">
                <Upload
                  listType="picture"
                  fileList={idCardFileList}
                  onChange={({ fileList }) => setIdCardFileList(fileList)}
                  beforeUpload={() => false}
                  maxCount={1}
                >
                  <Button>Chọn file CMND/CCCD</Button>
                </Upload>
              </Form.Item>
            </div>
          )}

          {step === 2 && (
            <div className="registration-step">
              <Form.Item name="description" label="Mô tả thêm">
                <Input.TextArea rows={4} placeholder="Nhập mô tả thêm về nhà xe" />
              </Form.Item>
              <div className="registration-summary">
                <h4>Xác nhận thông tin</h4>
                <p>
                  Vui lòng kiểm tra lại thông tin trước khi gửi yêu cầu. Sau khi
                  gửi, admin sẽ xem xét và phê duyệt hồ sơ của bạn.
                </p>
              </div>
            </div>
          )}
        </Form>

        <div className="registration-actions">
          {step > 0 && (
            <Button className="btn-ghost" onClick={handlePrev}>
              Quay lại
            </Button>
          )}
          {step < 2 ? (
            <Button className="btn-primary" onClick={handleNext}>
              Tiếp tục
            </Button>
          ) : (
            <Button
              className="btn-primary"
              onClick={handleSubmit}
              loading={createMutation.isPending}
            >
              Gửi yêu cầu
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
