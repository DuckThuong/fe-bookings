import { updateHoldPassenger } from "@/api/configs/bookings.config";
import {
  DEFAULT_MESSAGE,
  NOTI_ERROR,
} from "@/common/constants/constants";
import { HomeHeader } from "@/components/TopBar";
import { useLoading } from "@/providers/loadingProvider";
import { useNotification } from "@/providers/notificationProvider";
import { ROUTER_PATH } from "@/routers/Route";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Select } from "antd";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ProgressSteps from "../../component/ProgressSteps";
import type { BookingConfirmData } from "../../types/confirm.types";
import "./style.scss";

export const BookingInfoPage = ({ data }: { data: BookingConfirmData }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { setLoading } = useLoading();
  const { showNotification } = useNotification();

  const passengerMutation = useMutation({
    mutationFn: (values: {
      fullName: string;
      phone: string;
      pickupPoint: string;
      dropoffPoint: string;
    }) => updateHoldPassenger(data.holdId!, values),
  });

  useEffect(() => {
    setLoading(passengerMutation.isPending);
  }, [passengerMutation.isPending, setLoading]);

  const initialValues = {
    fullName: data.pageData.passenger.fullName,
    phone: data.pageData.passenger.phone,
    pickupPoint: data.pageData.passenger.pickupPointDefault,
    dropoffPoint: data.pageData.passenger.dropoffPointDefault,
  };

  const handleContinue = async (values: typeof initialValues) => {
    try {
      const draft = await passengerMutation.mutateAsync(values);

      const updatedData: BookingConfirmData = {
        ...data,
        holdSeconds: draft.holdSeconds,
        subTotal: draft.pricing.subTotal,
        addonsTotal: draft.pricing.addonsTotal,
        fee: draft.pricing.fee,
        promoCode: draft.pricing.promoCode ?? null,
        promoDiscount: draft.pricing.promoDiscount,
        total: draft.pricing.total,
        pageData: {
          ...data.pageData,
          passenger: {
            ...data.pageData.passenger,
            fullName: values.fullName,
            phone: values.phone,
            pickupPointDefault: values.pickupPoint,
            dropoffPointDefault: values.dropoffPoint,
          },
        },
      };

      navigate(ROUTER_PATH.BOOKING_CONFIRM, {
        state: { data: updatedData },
      });
    } catch (err) {
      let message = DEFAULT_MESSAGE;
      if (isAxiosError(err)) {
        const apiMessage = err.response?.data?.message;
        if (typeof apiMessage === "string") message = apiMessage;
        else if (Array.isArray(apiMessage) && apiMessage[0]) {
          message = apiMessage[0];
        }
      }
      showNotification(message, NOTI_ERROR);
    }
  };

  const handleBack = () => {
    navigate(ROUTER_PATH.BOOKING, {
      state: {
        trip: { id: data.tripId ?? String(data.companyTripId) },
        date: data.pageData.trip.date,
      },
    });
  };

  return (
    <div className="booking-info-page">
      <HomeHeader />

      <ProgressSteps activeIdx={1} />

      <nav className="info-bc" aria-label="Breadcrumb">
        {data.pageData.breadcrumb.map((item, idx) => (
          <span key={item.label + idx}>
            {idx > 0 && (
              <i className="ti ti-chevron-right" aria-hidden="true" />
            )}
            {idx < data.pageData.breadcrumb.length - 1 ? (
              <a href="#">{item.label}</a>
            ) : (
              item.label
            )}
          </span>
        ))}
        <i className="ti ti-chevron-right" aria-hidden="true" />
        <span>Thông tin hành khách</span>
      </nav>

      <div className="info-layout">
        <div className="info-left">
          <div className="info-summary-card">
            <div className="info-summary-card__header">
              <i className="ti ti-ticket" aria-hidden="true" />
              <span>Tóm tắt đặt vé</span>
            </div>

            <div className="info-summary-card__section">
              <div className="info-summary-card__section-title">
                <i className="ti ti-route" aria-hidden="true" />
                Hành trình
              </div>
              <div className="info-summary-card__trip">
                <div className="info-summary-card__trip-point">
                  <div className="info-summary-card__time">
                    {data.pageData.trip.departTime}
                  </div>
                  <div className="info-summary-card__city">
                    {data.pageData.trip.from}
                  </div>
                </div>
                <div className="info-summary-card__trip-arrow">
                  <i className="ti ti-arrow-right" aria-hidden="true" />
                </div>
                <div className="info-summary-card__trip-point">
                  <div className="info-summary-card__time">
                    {data.pageData.trip.arriveTime}
                    {data.pageData.trip.arriveNote && (
                      <span className="info-summary-card__note">
                        {data.pageData.trip.arriveNote}
                      </span>
                    )}
                  </div>
                  <div className="info-summary-card__city">
                    {data.pageData.trip.to}
                  </div>
                </div>
              </div>
            </div>

            <div className="info-summary-card__section">
              <div className="info-summary-card__section-title">
                <i className="ti ti-chair" aria-hidden="true" />
                Ghế đã chọn
              </div>
              <div className="info-summary-card__seats">
                {data.seats.map((seat) => (
                  <span key={seat.id} className="info-summary-card__seat">
                    {seat.id}
                  </span>
                ))}
              </div>
            </div>

            {data.addons.length > 0 && (
              <div className="info-summary-card__section">
                <div className="info-summary-card__section-title">
                  <i className="ti ti-package" aria-hidden="true" />
                  Dịch vụ thêm
                </div>
                <div className="info-summary-card__addons">
                  {data.addons.map((addon) => (
                    <div key={addon.id} className="info-summary-card__addon">
                      <i className={`ti ${addon.icon}`} aria-hidden="true" />
                      <span>{addon.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="info-right">
          <div className="info-form-card">
            <div className="info-form-card__title">
              <i className="ti ti-user" aria-hidden="true" />
              Thông tin hành khách
            </div>

            <Form
              form={form}
              initialValues={initialValues}
              onFinish={(values) => void handleContinue(values)}
              layout="vertical"
              className="info-form"
            >
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Nhập họ và tên" size="large" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "Số điện thoại phải gồm 10 chữ số",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" size="large" />
              </Form.Item>

              <div className="info-form__row2">
                <Form.Item
                  label="Điểm lên xe"
                  name="pickupPoint"
                  rules={[
                    { required: true, message: "Vui lòng chọn điểm lên xe" },
                  ]}
                >
                  <Select
                    options={data.pageData.passenger.pickupPointOptions}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Chọn điểm lên xe"
                  />
                </Form.Item>
                <Form.Item
                  label="Điểm xuống xe"
                  name="dropoffPoint"
                  rules={[
                    { required: true, message: "Vui lòng chọn điểm xuống xe" },
                  ]}
                >
                  <Select
                    options={data.pageData.passenger.dropoffPointOptions}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Chọn điểm xuống xe"
                  />
                </Form.Item>
              </div>

              <div className="info-form__actions">
                <Button
                  type="default"
                  block
                  onClick={handleBack}
                  className="info-btn-secondary"
                  size="large"
                  disabled={passengerMutation.isPending}
                >
                  ← Quay lại
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="info-btn-primary"
                  size="large"
                  loading={passengerMutation.isPending}
                >
                  Tiếp tục →
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BookingInfoRoute = () => {
  const location = useLocation();
  const state = location.state as { data?: BookingConfirmData } | null;
  const data = state?.data;

  if (!data?.holdId) {
    return <Navigate to={ROUTER_PATH.BOOKING} replace />;
  }

  return <BookingInfoPage data={data} />;
};
