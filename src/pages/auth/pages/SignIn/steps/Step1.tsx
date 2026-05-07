import {useState} from "react";
import "../style.scss";
import {Form, Input, type FormInstance} from "antd";
import {InputPhoneNumber} from "@pages/auth/component/InputPhoneNumber";
import type {SignInDto} from "@api/dtos/SignIn.dto";

interface SignInProps {
    form: FormInstance;
}

export const Step1 = (props: SignInProps) => {
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

    return (
        <>
            <div className="signin-header">
                <p className="signin-header__eyebrow">
                    Bước 1 / 3 — Thông tin tài khoản
                </p>
            </div>
            <div className="signin-form">
                <Form.Item
                    label="Họ và tên"
                    name="name"
                    rules={[{required: true, message: "Vui lòng nhập họ tên của bạn"}]}
                >
                    <Input
                        type="text"
                        size="large"
                        placeholder="Nhập họ và tên của bạn"
                        prefix={
                            <svg viewBox="0 0 17 17" fill="none" width="16" height="16">
                                <circle
                                    cx="8.5"
                                    cy="5.5"
                                    r="3"
                                    stroke="#9ca3af"
                                    strokeWidth="1.3"
                                />
                                <path
                                    d="M2 15c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6"
                                    stroke="#9ca3af"
                                    strokeWidth="1.3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        }
                    />
                </Form.Item>

                <InputPhoneNumber
                    value={props.form.getFieldValue("phone")}
                    onChange={(value) => props.form.setFieldValue("phone", value)}
                    onBlur={(value) => props.form.setFieldValue("phone", value)}
                />
            </div>
            <div className="signin-terms">
                <div
                    className={`signin-terms__check ${termsAccepted ? "signin-terms__check--checked" : ""}`}
                    onClick={() => {
                        setTermsAccepted(!termsAccepted);
                        props.form.setFieldValue("termsAccepted", !termsAccepted);
                    }}
                >
                    <svg viewBox="0 0 11 11" fill="none">
                        <path
                            d="M1.5 5.5l3 3 5-5"
                            stroke="#fff"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
                <p className="signin-terms__text">
                    Tôi đồng ý với <a href="/terms">Điều khoản sử dụng</a> và{" "}
                    <a href="/privacy">Chính sách bảo mật</a> của GoRide. Thông tin của
                    bạn được bảo vệ theo tiêu chuẩn cao nhất.
                </p>
            </div>
        </>
    );
};
