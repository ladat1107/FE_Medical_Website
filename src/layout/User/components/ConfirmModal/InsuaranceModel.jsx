import React, { useEffect } from "react";
import { Modal, Form, Input, DatePicker, Button, Typography, message } from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getThirdDigitFromLeft } from "@/utils/numberSeries";
import { COVERED } from "@/constant/value";
const { Link, Text } = Typography;
const arrCover = Object.keys(COVERED).map(Number);
const InsuaranceModel = ({ open, setOpen, handleCheckInsuarance, insuaranceUpdate }) => {
    const [form] = Form.useForm();
    const { user } = useSelector(state => state.authen);
    useEffect(() => {
        if (insuaranceUpdate) {
            form.setFieldsValue({
                ...insuaranceUpdate,
                id: insuaranceUpdate.id,
                dateOfIssue: insuaranceUpdate.dateOfIssue ? dayjs(insuaranceUpdate.dateOfIssue, "YYYY-MM-DD") : null,
                exp: insuaranceUpdate.exp ? dayjs(insuaranceUpdate.exp, "YYYY-MM-DD") : null,
                continuousFiveYearPeriod: insuaranceUpdate.continuousFiveYearPeriod ? dayjs(insuaranceUpdate.continuousFiveYearPeriod, "YYYY-MM-DD") : null,
            });
        }
    }, [insuaranceUpdate]);

    const handleCancel = () => setOpen(false);

    const onFinish = async (values) => {
        let _insuranceCode = values.insuranceCode.trim().slice(-10);
        if (_insuranceCode.length !== 10 || !arrCover.includes(+getThirdDigitFromLeft(_insuranceCode))) {
            message.error("Mã thẻ bảo hiểm không hợp lệ");
            return;
        }
        const formatted = {
            ...values,
            insuranceCode: _insuranceCode,
            dateOfIssue: values.dateOfIssue?.format("YYYY-MM-DD 00:00:00"),
            exp: values.exp?.format("YYYY-MM-DD 00:00:00"),
            continuousFiveYearPeriod: values.continuousFiveYearPeriod?.format("YYYY-MM-DD 00:00:00"),
            benefitLevel: getThirdDigitFromLeft(_insuranceCode),
            userId: user?.id,
        };
        handleCheckInsuarance(formatted);
    };

    return (
        <>
            <Modal
                title="Thông tin Bảo hiểm Y tế"
                open={open}
                onCancel={handleCancel}
                footer={null}
                width={600}
                maskClosable={false} // 👈 Không cho tắt khi click ngoài
                centered
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="space-y-3 p-3"
                >
                    <Form.Item name="insuranceCode" label="Mã thẻ bảo hiểm" rules={[{ required: true, message: "Mã thẻ bảo hiểm không được để trống" }]}>
                        <Input className="!rounded-md" placeholder="Nhập mã thẻ" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Form.Item className="mb-0" name="dateOfIssue" label="Ngày cấp">
                            <DatePicker
                                className="!w-full !rounded-md"
                                format="DD/MM/YYYY"
                            />
                        </Form.Item>

                        <Form.Item className="mb-0" name="exp" label="Ngày hết hạn">
                            <DatePicker
                                className="!w-full !rounded-md"
                                format="DD/MM/YYYY"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item name="residentialCode" label="Mã nơi cư trú">
                        <Input className="!rounded-md" placeholder="Nhập mã nơi cư trú" />
                    </Form.Item>

                    <Form.Item
                        name="initialHealthcareRegistrationCode"
                        label="Mã nơi đăng ký KCB ban đầu"
                    >
                        <Input
                            className="!rounded-md"
                            placeholder="Nhập mã cơ sở khám ban đầu"
                        />
                    </Form.Item>

                    <Form.Item
                        name="continuousFiveYearPeriod"
                        label="Thời điểm đủ 5 năm liên tục"
                    >
                        <DatePicker
                            className="!w-full !rounded-md"
                            format="DD/MM/YYYY"
                        />
                    </Form.Item>

                    <Form.Item className="mt-4 flex justify-end">
                        <Button type="primary" htmlType="submit" className="bg-primary-tw text-white">
                            Kiểm tra thông tin BHYT
                        </Button>
                    </Form.Item>
                </Form>

                <div className="text-center text-[11px] p-3">
                    <Text className="text-secondaryText-tw">
                        Bạn có thể tra cứu thông tin hộ gia đình tại{" "}
                        <Link
                            href="https://baohiemxahoi.gov.vn/tracuu/Pages/tra-cuu-thoi-han-su-dung-the-bhyt.aspx"
                            target="_blank"
                        >
                            Cổng tra cứu BHYT của Bộ Y Tế
                        </Link>
                    </Text>
                </div>
            </Modal>
        </>
    );
};

export default InsuaranceModel;
