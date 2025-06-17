import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faKey, faMobileScreen, faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { Button, Col, Form, Input, message, Row } from "antd";
import { faAddressCard, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { handleRegisterUser } from "@/services/adminService";
import { useState } from "react";
import { PATHS } from "@/constant/path";

const Register = (props) => {
    let [form] = Form.useForm();
    let [text, setText] = useState(null);
    let [isLoading, setIsLoading] = useState(false);
    let messageError = 'Vui lòng nhập thông tin!';
    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            let response = await handleRegisterUser(values);
            if (response?.EC === 0) {
                setText(response?.EM);
                form.resetFields();
            } else {
                message.info(response?.EM);
            }
        } catch (error) {
            error.message("Có lỗi xảy ra!", error);
        } finally { setIsLoading(false) }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className='flex flex-col items-center w-full '>
            <span className="absolute top-2 left-2 text-primary-tw cursor-pointer" onClick={() => props.login()}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </span>
            <div
                className="w-12 h-12 bg-cover bg-center bg-no-repeat rounded-full cursor-pointer mb-[-10px]"
                style={{ backgroundImage: "url('https://res.cloudinary.com/degcwwwii/image/upload/v1733207843/logo/rr7ytbrcco0hgilykrmo.png')" }}
                onClick={() => navigate(PATHS.HOME.HOMEPAGE)}
            ></div>
            <h2 className="text-2xl font-bold text-primary-tw text-center my-6 tracking-wider">Đăng ký</h2>
            {text && <div className="text-green-600 font-semibold mb-3"><b>{text}</b></div>}
            <Form
                name="basic"
                form={form}
                layout="vertical"
                className="w-[90%]"
                initialValues={{
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}>
                <Row gutter={[16, 1]} className="w-full">
                    <Col xs={24} md={12}>
                        <Form.Item name="lastName" rules={[{ required: true, message: messageError }, {
                            pattern: /^[a-zA-ZÀ-ỹDđ'\s]+$/,
                            message: 'Không chứa ký tự đặc biệt!'
                        }]}>
                            <Input className='border-2 border-gray-300 rounded-lg h-10 hover:border-primary-tw focus:border-primary-tw shadow-sm' placeholder='Họ' maxLength={50} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="firstName" rules={[{ required: true, message: messageError }, {
                            pattern: /^[a-zA-ZÀ-ỹDđ'\s]+$/,
                            message: 'Không chứa ký tự đặc biệt!'
                        }]}>
                            <Input className='border-2 border-gray-300 rounded-lg h-10 hover:border-primary-tw focus:border-primary-tw shadow-sm' placeholder='Tên' maxLength={50} />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item name="email" rules={[{ required: true, message: messageError }, {
                            pattern: /^[a-zA-Z0-9'@.\s]*$/,
                            message: 'Không chứa ký tự đặc biệt!'
                        }, {
                            type: 'email',
                            message: 'Email không hợp lệ!'
                        }]}>
                            <Input
                                prefix={<FontAwesomeIcon className="text-gray-400 mr-2" icon={faEnvelope} />}
                                className='border-2 border-gray-300 rounded-lg h-10 hover:border-primary-tw focus:border-primary-tw shadow-sm'
                                placeholder='Email'
                                maxLength={50}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item name="cid" rules={[{ required: true, message: messageError }, {
                            pattern: /^[0-9]{12}$/,
                            message: 'Căn cước không hợp lệ!'
                        }]}>
                            <Input
                                prefix={<FontAwesomeIcon className="text-gray-400 mr-2" icon={faAddressCard} />}
                                className='border-2 border-gray-300 rounded-lg h-10 hover:border-primary-tw focus:border-primary-tw shadow-sm'
                                placeholder='Căn cước công dân'
                                maxLength={12}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item name="phoneNumber" rules={[{ required: true, message: messageError }, {
                            pattern: /^(0[3|5|7|8|9][0-9]{8})$/,
                            message: 'Số điện thoại không hợp lệ!'
                        }]}>
                            <Input
                                prefix={<FontAwesomeIcon className="text-gray-400 mr-2" icon={faMobileScreen} />}
                                className='border-2 border-gray-300 rounded-lg h-10 hover:border-primary-tw focus:border-primary-tw shadow-sm'
                                placeholder='Số điện thoại'
                                maxLength={10}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item name="password" rules={[{ required: true, message: messageError }, { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }]}
                            hasFeedback>
                            <Input.Password
                                prefix={<FontAwesomeIcon className="text-gray-400 mr-2" icon={faKey} />}
                                className='border-2 border-gray-300 rounded-lg h-10 hover:border-primary-tw focus:border-primary-tw shadow-sm'
                                placeholder='Mật khẩu'
                                minLength={6}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item name="confirmPassword" dependencies={['password']}
                            rules={[
                                { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Mật khẩu xác nhận không khớp!');
                                    },
                                }),
                            ]}
                            hasFeedback>
                            <Input.Password
                                prefix={<FontAwesomeIcon className="text-gray-400 mr-2" icon={faUnlockKeyhole} />}
                                className='border-2 border-gray-300 rounded-lg h-10 hover:border-primary-tw focus:border-primary-tw shadow-sm'
                                placeholder='Nhập lại mật khẩu'
                                minLength={6}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Button
                    loading={isLoading}
                    type="primary"
                    htmlType="submit"
                    className="w-[200px] mx-auto block bg-primary-tw h-10 text-lg rounded-lg mt-4 hover:bg-blue-400 transition-colors"
                >
                    Đăng ký
                </Button>
            </Form>
        </div>
    );
}
export default Register;