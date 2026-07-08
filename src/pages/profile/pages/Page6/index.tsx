import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, message, Modal, Select, Steps, Upload } from "antd";
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
import { uploadImage } from "@/api/configs/common.config";
import {
  CheckCircleOutlined,
  EnvironmentOutlined,
  FileProtectOutlined,
  PhoneOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  IdcardOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  type CompanyRegistrationFormValues,
} from "../../../../common/constants/profile.constant";
import { StatusView } from "./components";
import "./style.scss";

const handleUploadFile = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await uploadImage(formData);
  return { url: res.imageUrl };
};

export const CompanyRegistrationPage = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [idCardFileList, setIdCardFileList] = useState<UploadFile[]>([]);
  const [isReapplying, setIsReapplying] = useState(false);

  const { data: existingRegistration, isLoading } = useQuery({
    queryKey: ["myCompanyRegistration"],
    queryFn: getMyCompanyRegistration,
    enabled: Boolean(user.id),
  });

  const createMutation = useMutation({
    mutationFn: createCompanyRegistration,
    onSuccess: () => {
      message.success("Gửi yêu cầu đăng ký nhà xe thành công");
      setIsReapplying(false);
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

  const handleReapply = () => {
    setStep(0);
    form.resetFields();
    setFileList([]);
    setIdCardFileList([]);
    setIsReapplying(true);
  };

  if (isLoading) {
    return <div className="loading-container">Đang tải...</div>;
  }

  if (existingRegistration && !isReapplying) {
    return (
      <div className="registration-page">
        <div className="registration-card">
          <StatusView
            existingRegistration={existingRegistration}
            onReapply={handleReapply}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="registration-page">
      <div className="registration-hero">
        <div className="registration-hero__icon">
          <ShopOutlined />
        </div>
        <div className="registration-hero__info">
          <div className="registration-hero__greeting">Trở thành đối tác</div>
          <div className="registration-hero__title">Đăng ký nhà xe</div>
          <div className="registration-hero__desc">
            Cung cấp dịch vụ vận tải hành khách trên nền tảng GoRide
          </div>
        </div>
      </div>

      <div className="registration-card">
        <Steps
          current={step}
          className="registration-steps"
          items={[
            { title: "Thông tin nhà xe", icon: <ShopOutlined /> },
            { title: "Giấy tờ pháp lý", icon: <FileProtectOutlined /> },
            { title: "Xác nhận", icon: <CheckCircleOutlined /> },
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
          <div className="registration-step" style={{ display: step === 0 ? "block" : "none" }}>
            <Form.Item
              name="companyName"
              label="Tên nhà xe"
              rules={[{ required: true, message: "Vui lòng nhập tên nhà xe" }]}
            >
              <Input prefix={<ShopOutlined />} placeholder="Nhập tên nhà xe" />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ trụ sở">
              <Input prefix={<EnvironmentOutlined />} placeholder="Nhập địa chỉ trụ sở" />
            </Form.Item>
            <Form.Item
              name="representativeName"
              label="Tên người đại diện pháp lý"
              rules={[{ required: true, message: "Vui lòng nhập tên đại diện" }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập tên người đại diện" />
            </Form.Item>
            <Form.Item
              name="representativePosition"
              label="Chức vụ"
              rules={[{ required: true, message: "Vui lòng nhập chức vụ" }]}
            >
              <Input prefix={<TeamOutlined />} placeholder="Nhập chức vụ" />
            </Form.Item>
            <Form.Item
              name="representativePhone"
              label="Số điện thoại đại diện"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item name="taxCode" label="Mã số thuế">
              <Input prefix={<IdcardOutlined />} placeholder="Nhập mã số thuế" />
            </Form.Item>
            <Form.Item name="businessAddress" label="Địa chỉ theo GPKD">
              <Input prefix={<EnvironmentOutlined />} placeholder="Nhập địa chỉ theo giấy phép kinh doanh" />
            </Form.Item>
          </div>

          <div className="registration-step" style={{ display: step === 1 ? "block" : "none" }}>
            <Form.Item
              name="businessLicenseDate"
              label="Ngày cấp giấy phép kinh doanh"
            >
              <DatePicker
                format="DD/MM/YYYY"
                className="registration-date-picker"
                size="large"
                style={{ width: "100%" }}
                placeholder="Chọn ngày cấp giấy phép kinh doanh"
              />
            </Form.Item>
            <Form.Item label="Giấy phép kinh doanh">
              <Upload
                listType="picture"
                fileList={fileList}
                style={{ width: "100%" }}
                onChange={({ fileList }) => {
                  const processed = fileList.map((f) => {
                    if (
                      f.status === "done" &&
                      typeof f.response === "object" &&
                      f.response?.url
                    ) {
                      return {
                        ...f,
                        url: f.response.url,
                        thumbUrl: f.response.url,
                      };
                    }
                    return f;
                  });
                  setFileList(processed);
                }}
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    const { url } = await handleUploadFile(file as File);
                    onSuccess({ url });
                  } catch (e) {
                    onError(e as any);
                  }
                }}
                maxCount={1}
              >
                <Button className="btn-ghost" style={{ width: "100%" }}>
                  Chọn file giấy phép kinh doanh
                </Button>
              </Upload>
            </Form.Item>
            <Form.Item label="CMND/CCCD người đại diện">
              <Upload
                listType="picture"
                fileList={idCardFileList}
                style={{ width: "100%" }}
                onChange={({ fileList }) => {
                  const processed = fileList.map((f) => {
                    if (
                      f.status === "done" &&
                      typeof f.response === "object" &&
                      f.response?.url
                    ) {
                      return {
                        ...f,
                        url: f.response.url,
                        thumbUrl: f.response.url,
                      };
                    }
                    return f;
                  });
                  setIdCardFileList(processed);
                }}
                customRequest={async ({ file, onSuccess, onError }) => {
                  try {
                    const { url } = await handleUploadFile(file as File);
                    onSuccess({ url });
                  } catch (e) {
                    onError(e as any);
                  }
                }}
                maxCount={1}
              >
                <Button className="btn-ghost" style={{ width: "100%" }}>
                  Chọn file CMND/CCCD
                </Button>
              </Upload>
            </Form.Item>
          </div>

          <div className="registration-step" style={{ display: step === 2 ? "block" : "none" }}>
            <Form.Item name="description" label="Mô tả thêm">
              <Input.TextArea
                rows={4}
                placeholder="Nhập mô tả thêm về nhà xe (fleets, routes, experience...)"
              />
            </Form.Item>
            <div className="registration-summary">
              <h4>Xác nhận thông tin</h4>
              <p>
                Vui lòng kiểm tra lại thông tin trước khi gửi yêu cầu. Sau khi gửi,
                admin sẽ xem xét và phê duyệt hồ sơ của bạn trong vòng 24h.
              </p>
            </div>
          </div>
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
