import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, Form, Input, message, Row, Tooltip } from 'antd';
import { handleConfirmUser, handleLogin } from '@/services/adminService';
import { useDispatch, useSelector } from 'react-redux';
import { login, addRememberLogin, removeRememberAccount } from '@/redux/authenSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROLE } from '@/constant/role';
import { PATHS } from '@/constant/path';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import Register from './Register';
import ForgotPassword from './ForgotPassword';
import socket, { authenticateSocket } from "@/Socket/socket";
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
const Login = () => {
    const open = {
        login: "login",
        register: "register",
        forgotPassword: "forgotPassword"
    }
    let [isShow, setIsShow] = useState(open.login);
    let [form] = Form.useForm();
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [loading, setLoading] = useState(true);
    let rememberLogins = useSelector((state) => state.authen.rememberLogin || []);
    const [showSavedAccounts, setShowSavedAccounts] = useState(false);
    const [rememberMe, setRememberMe] = useState(rememberLogins.length > 0 ? true : false);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        let confirmToken = queryParams.get('confirm');
        if (confirmToken !== null) {
            const fetchConfirmAsync = async () => {
                const response = await handleConfirmUser({ token: confirmToken });
                if (response?.EC === 0 || response?.EC === 1) {
                    message.success(response?.EM);
                } else {
                    message.error(response?.EM);
                }
            };
            fetchConfirmAsync();
        }
        let loginGoogle = queryParams.get('google');
        if (loginGoogle !== null) {
            let dataLogin = JSON.parse(loginGoogle);
            dispatch(login(dataLogin));
            redirect(dataLogin.user.role);
        }
        setLoading(false);
    }, []);

    const handleSelectAccount = (account) => {
        form.setFieldsValue({
            email: account.email,
            password: account.password,
        });
    };

    const onFinish = async (values) => {
        setIsLoading(true);
        try {
            let response = await handleLogin(values);
            if (response?.EC === 0) {
                dispatch(login(response.DT));
                // Xác thực socket sau khi đăng nhập thành công
                authenticateSocket(response.DT.accessToken);

                if (rememberMe) {
                    let remember = {
                        email: values.email,
                        password: values.password
                    }
                    dispatch(addRememberLogin(remember));
                }
                redirect(response.DT.user.role);
            } else {
                message.error(response?.EM || 'Đăng nhập thất bại')
            }
        } catch (e) {
            message.error('Đăng nhập thất bại')
        } finally {
            setIsLoading(false)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const redirect = (roleUser) => {
        if (roleUser) {
            if (roleUser === ROLE.ADMIN) {
                navigate(PATHS.ADMIN.DASHBOARD);
            } else if (roleUser === ROLE.PATIENT) {
                navigate(PATHS.HOME.HOMEPAGE);
            } else if (roleUser === ROLE.DOCTOR) {
                navigate(PATHS.STAFF.APPOINTMENT);
            } else if (roleUser === ROLE.RECEPTIONIST) {
                navigate(PATHS.RECEPTIONIST.DASHBOARD);
            } else if (roleUser === ROLE.PHARMACIST) {
                navigate(PATHS.RECEPTIONIST.PRESCRIBE);
            } else if (roleUser === ROLE.ACCOUNTANT) {
                navigate(PATHS.RECEPTIONIST.CASHIER);
            } else {
                navigate(PATHS.HOME.HOMEPAGE);
            }
        }
    }

    return (
        <div className='w-full min-h-screen flex items-center justify-center bg-cover bg-center'
            style={{ backgroundImage: "url('https://cdn.medpro.vn/prod-partner/92b6d682-4b5a-4c94-ac54-97a077c0c6c5-homepage_banner.webp')" }}>
            <div className='w-full max-w-md bg-white rounded-xl shadow-lg p-6 md:p-8 mx-4 relative overflow-hidden'>
                <div className='relative'>
                    {isShow === open.register && <Register login={() => setIsShow(open.login)} />}
                    {isShow === open.forgotPassword && <ForgotPassword login={() => setIsShow(open.login)} />}
                    {isShow === open.login && !loading &&
                        <div className='flex flex-col items-center'>
                            <span className="absolute top-2 left-2 text-primary-tw cursor-pointer" onClick={() => navigate(PATHS.HOME.HOMEPAGE)}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </span>
                            <div
                                className="w-12 h-12 bg-cover bg-center bg-no-repeat rounded-full cursor-pointer mb-[-10px]"
                                style={{ backgroundImage: "url('https://res.cloudinary.com/degcwwwii/image/upload/v1733207843/logo/rr7ytbrcco0hgilykrmo.png')" }}
                                onClick={() => navigate(PATHS.HOME.HOMEPAGE)}
                            ></div>
                            <h2 className="text-2xl font-bold text-primary-tw text-center my-6 tracking-wider"
                                onClick={() => navigate(PATHS.HOME.HOMEPAGE)}>
                                Hoa Sen
                            </h2>
                            <Form
                                name="basic"
                                form={form}
                                layout="vertical"
                                className="w-[90%]"
                                initialValues={{
                                    email: rememberLogins[0]?.email || '',
                                    password: rememberLogins[0]?.password || '',
                                }}
                                onFinish={onFinish}
                                onFinishFailed={onFinishFailed}>
                                {rememberLogins.length > 0 ?
                                    <Tooltip
                                        color='white'
                                        title={
                                            showSavedAccounts && rememberLogins.length > 0 ? (
                                                <div className="w-full">
                                                    {rememberLogins.map((account, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                                                        >
                                                            <div onClick={() => handleSelectAccount(account)} className='text-black w-[90%]'>{account.email}</div>
                                                            <FontAwesomeIcon className='text-gray-500' icon={faXmark} onClick={() => dispatch(removeRememberAccount(account))} />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : null
                                        }
                                        open={showSavedAccounts}
                                        placement="bottom"
                                        overlayClassName="w-[300px]"
                                        onOpenChange={(visible) => setShowSavedAccounts(visible)}
                                    >

                                        <Form.Item
                                            name="email"
                                            rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                                        >
                                            <Input
                                                className="border-2 border-primary-tw rounded-lg text-base h-10 px-3"
                                                placeholder="Email"
                                                onFocus={() => setShowSavedAccounts(true)}
                                                onBlur={() => setTimeout(() => setShowSavedAccounts(false), 200)}
                                                onClick={() => setShowSavedAccounts(true)}
                                            />
                                        </Form.Item>
                                    </Tooltip> : <Form.Item
                                        name="email"
                                        rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
                                    >
                                        <Input
                                            className="border-2 border-primary-tw rounded-lg text-base h-10 px-3"
                                            placeholder="Email"
                                        />
                                    </Form.Item>
                                }

                                <Form.Item name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
                                    <Input.Password className='border-2 border-primary-tw rounded-lg text-base h-10 px-3' placeholder='Mật khẩu' />
                                </Form.Item>
                                <Row>
                                    <Col span={12}>
                                        <Checkbox
                                            checked={rememberMe}
                                            onChange={() => setRememberMe(!rememberMe)}>
                                            Ghi nhớ tài khoản
                                        </Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <span className="block text-right text-xs text-secondary-tw cursor-pointer" onClick={() => setIsShow(open.forgotPassword)}>
                                            Quên mật khẩu?
                                        </span>
                                    </Col>
                                </Row>
                                <Button loading={isLoading} type="primary" htmlType="submit"
                                    className="w-full bg-primary-tw h-10 text-lg rounded-lg mt-4 hover:bg-blue-400 transition-colors">
                                    Đăng nhập
                                </Button>
                            </Form>
                            <div className='w-1/2 border-b border-gray-300 my-4'></div>
                            <div className="w-[90%] flex flex-col gap-2.5">
                                <Button icon={<FontAwesomeIcon icon={faGoogle} />}
                                    className="w-full bg-white text-black border rounded-lg hover:border-primary-tw hover:text-primary-tw transition-colors"
                                    onClick={() => window.location.href = `http://localhost:8843/auth/google`}>
                                    Đăng nhập với Google
                                </Button>
                            </div>
                            <div className='mt-3 text-primary-tw text-sm font-medium cursor-pointer hover:text-secondary-tw transition-colors'
                                onClick={() => setIsShow(open.register)}>
                                <span><FontAwesomeIcon size='lg' className='mr-2' icon={faAddressCard} /> Đăng ký tài khoản</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
export default Login;