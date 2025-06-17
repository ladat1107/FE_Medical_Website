import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Input, message } from "antd";
import { handleForgotPassword } from "@/services/adminService";
import { useState } from "react";
import { PATHS } from "@/constant/path";
const ForgotPassword = (props) => {
    let [form] = Form.useForm();
    let [text, setText] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            let response = await handleForgotPassword({ email: values.email });
            if (response?.EC === 0) {
                setText(response?.EM);
                form.resetFields();
            } else {
                message.info(response?.EM);
            }
        } catch (e) { message.error("Có lỗi xảy ra!", e) }
        finally { setIsLoading(false) }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='flex flex-col items-center w-full'>
            <span className="absolute top-2 left-2 text-primary-tw cursor-pointer" onClick={() => props.login()}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </span>
            <div
                className="w-12 h-12 bg-cover bg-center bg-no-repeat rounded-full cursor-pointer mb-[-10px]"
                style={{ backgroundImage: "url('https://res.cloudinary.com/degcwwwii/image/upload/v1733207843/logo/rr7ytbrcco0hgilykrmo.png')" }}
                onClick={() => navigate(PATHS.HOME.HOMEPAGE)}
            ></div>
            <h2 className="text-2xl font-bold text-primary-tw text-center my-6 tracking-wider">Hoa Sen</h2>
            {text && <div className="text-green-600">{text}</div>}
            <Form
                name="basic"
                form={form}
                layout="vertical"
                className="w-[90%] h-full"
                initialValues={{
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}>
                <div className="mb-3 pl-2 text-base">Lấy lại mật khẩu</div>
                <Form.Item name="email" rules={[{ required: true, message: "Vui lòng nhập email!" }, {
                    pattern: /^[a-zA-Z0-9'@.\s]*$/,
                    message: 'Không chứa ký tự đặc biệt!'
                }, {
                    type: 'email',
                    message: 'Email không hợp lệ!'
                }]}>
                    <Input className='border-2 border-primary-tw rounded-lg text-base h-10 px-3' placeholder='Nhập email đã đăng ký' maxLength={50} />
                </Form.Item>
                <Form.Item className="mt-8">
                    <Button
                        loading={isLoading}
                        type="primary"
                        htmlType="submit"
                        className="w-full bg-primary-tw h-10 text-lg rounded-lg hover:bg-blue-400 transition-colors"
                    >
                        Lấy lại mật khẩu
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ForgotPassword;