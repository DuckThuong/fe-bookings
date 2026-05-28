import { HomeHeader } from "@/components/TopBar";
import { Alert, Button, Form, Input, Select, Spin, message } from "antd";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { ROUTER_PATH } from "@/routers/Route";
import ProgressSteps from "../../component/ProgressSteps";
import type { BookingConfirmData } from "../../types/confirm.types";
import {
  useBookingConfigQuery,
  useBookingResultQuery,
  useUpdateHoldPassengerMutation,
} from "@/features/booking/hooks/useBookingApi";
import { buildConfirmDataFromResult } from "@/features/booking/utils/bookingMappers";
import { getApiErrorMessage } from "@/common/utils/apiError";
import type { PassengerDto } from "@/api/dtos/client-booking.dto";
import "./style.scss";

export const BookingInfoPage = ({ data }: { data: BookingConfirmData }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const updatePassengerMutation = useUpdateHoldPassengerMutation();
  const holdId = data.holdId ?? "";

  const initialValues = {
    fullName: data.pageData.passenger.fullName,
    phone: data.pageData.passenger.phone,
    pickupPoint: data.pageData.passenger.pickupPointDefault,
    dropoffPoint: data.pageData.passenger.dropoffPointDefault,
  };

  const handleContinue = (values: typeof initialValues) => {
    if (!holdId) {
      message.error("Khong tim thay ma giu cho.");
      return;
    }

    const passenger: PassengerDto = {
      fullName: values.fullName,
      phone: values.phone,
      pickupPoint: values.pickupPoint,
      dropoffPoint: values.dropoffPoint,
    };

    updatePassengerMutation.mutate(
      {
        holdId,
        payload: passenger,
      },
      {
        onSuccess: (response) => {
          const updatedData: BookingConfirmData = {
            ...data,
            holdSeconds: response.holdSeconds,
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

          navigate(
            `${ROUTER_PATH.BOOKING_CONFIRM}?holdId=${encodeURIComponent(
              holdId,
            )}`,
            {
              state: { data: updatedData },
            },
          );
        },
        onError: (error) => {
          message.error(getApiErrorMessage(error));
        },
      },
    );
  };

  const handleBack = () => {
    if (data.tripId) {
      navigate(`${ROUTER_PATH.BOOKING}?tripId=${encodeURIComponent(data.tripId)}`);
      return;
    }
    navigate(ROUTER_PATH.BOOKING);
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
              <a href={item.href}>{item.label}</a>
            ) : (
              item.label
            )}
          </span>
        ))}
        <i className="ti ti-chevron-right" aria-hidden="true" />
        <span>Thong tin hanh khach</span>
      </nav>

      <div className="info-layout">
        <div className="info-left">
          <div className="info-summary-card">
            <div className="info-summary-card__header">
              <i className="ti ti-ticket" aria-hidden="true" />
              <span>Tom tat dat ve</span>
            </div>

            <div className="info-summary-card__section">
              <div className="info-summary-card__section-title">
                <i className="ti ti-route" aria-hidden="true" />
                Hanh trinh
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
                Ghe da chon
              </div>
              <div className="info-summary-card__seats">
                {data.seats.map((seat) => (
                  <span key={seat.id} className="info-summary-card__seat">
                    {seat.label || seat.id}
                  </span>
                ))}
              </div>
            </div>

            {data.addons.length > 0 && (
              <div className="info-summary-card__section">
                <div className="info-summary-card__section-title">
                  <i className="ti ti-package" aria-hidden="true" />
                  Dich vu them
                </div>
                <div className="info-summary-card__addons">
                  {data.addons.map((addon) => (
                    <div key={addon.id} className="info-summary-card__addon">
                      <i className={`ti ti-${addon.icon}`} aria-hidden="true" />
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
              Thong tin hanh khach
            </div>

            <Form
              form={form}
              initialValues={initialValues}
              onFinish={handleContinue}
              layout="vertical"
              className="info-form"
            >
              <Form.Item
                label="Ho va ten"
                name="fullName"
                rules={[{ required: true, message: "Vui long nhap ho va ten" }]}
              >
                <Input placeholder="Nhap ho va ten" size="large" />
              </Form.Item>

              <Form.Item
                label="So dien thoai"
                name="phone"
                rules={[
                  { required: true, message: "Vui long nhap so dien thoai" },
                  {
                    pattern: /^[0-9]{10}$/,
                    message: "So dien thoai khong hop le",
                  },
                ]}
              >
                <Input placeholder="Nhap so dien thoai" size="large" />
              </Form.Item>

              <div className="info-form__row2">
                <Form.Item
                  label="Diem len xe"
                  name="pickupPoint"
                  rules={[
                    { required: true, message: "Vui long chon diem len xe" },
                  ]}
                >
                  <Select
                    options={data.pageData.passenger.pickupPointOptions}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Chon diem len xe"
                  />
                </Form.Item>
                <Form.Item
                  label="Diem xuong xe"
                  name="dropoffPoint"
                  rules={[
                    { required: true, message: "Vui long chon diem xuong xe" },
                  ]}
                >
                  <Select
                    options={data.pageData.passenger.dropoffPointOptions}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="Chon diem xuong xe"
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
                >
                  Quay lai
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  className="info-btn-primary"
                  size="large"
                  loading={updatePassengerMutation.isPending}
                >
                  Tiep tuc
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
  const [searchParams] = useSearchParams();
  const state = location.state as { data?: BookingConfirmData } | null;
  const stateData = state?.data;
  const holdId = searchParams.get("holdId") ?? stateData?.holdId ?? "";
  const configQuery = useBookingConfigQuery();
  const resultQuery = useBookingResultQuery(holdId, Boolean(holdId && !stateData));

  if (!holdId && !stateData) {
    return <Navigate to={ROUTER_PATH.BOOKING} replace />;
  }

  if (stateData) {
    return <BookingInfoPage data={stateData} />;
  }

  if (configQuery.isLoading || resultQuery.isLoading) {
    return (
      <div className="booking-info-page">
        <HomeHeader />
        <ProgressSteps activeIdx={1} />
        <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
          <Spin />
        </div>
      </div>
    );
  }

  const error = configQuery.error ?? resultQuery.error;
  if (error || !resultQuery.data) {
    return (
      <div className="booking-info-page">
        <HomeHeader />
        <ProgressSteps activeIdx={1} />
        <div style={{ padding: 24 }}>
          <Alert type="error" showIcon message={getApiErrorMessage(error)} />
        </div>
      </div>
    );
  }

  return (
    <BookingInfoPage
      data={buildConfirmDataFromResult(resultQuery.data, configQuery.data)}
    />
  );
};
