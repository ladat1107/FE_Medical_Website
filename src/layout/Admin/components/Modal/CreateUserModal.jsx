
import React, { useEffect, useState } from 'react';
import { POSITION, STATUS } from '@/constant/value';
import { getNameDepartment, createUser, getSpecialtySelect, updateUser } from "@/services/adminService";
import "./Modal.scss";
import { ALL_ROLE, STAFF_ROLE } from '@/constant/role';
import { Form, Input, Select, message, Button, Modal, Col, Row, InputNumber } from 'antd';
import useQuery from '@/hooks/useQuery';
import TextEditor from '@/components/TextEditor/TextEditor';
import { set } from 'lodash';

const { TextArea } = Input;
const CreateUser = (props) => {
    let optionPosition = POSITION;
    let [optionRole, setOptionRole] = useState(ALL_ROLE);
    let listStaffRole = STAFF_ROLE.map((item) => item.value); // Lấy ra danh sách id của các role của nhân viên
    let [form] = Form.useForm();
    let [isShowStaff, setIsShowStaff] = useState(false);
    let [departments, setDepartments] = useState([]);
    let { data: departmentData } = useQuery(() => getNameDepartment())
    let [specialty, setSpecailty] = useState([]);
    let { data: specialtyData } = useQuery(() => getSpecialtySelect())
    let [isLoading, setIsLoading] = useState(false);
    let [userUpdate, setUserUpdate] = useState(props.obUpdate);
    useEffect(() => {
        if (specialtyData && specialtyData?.DT?.length > 0) {
            setSpecailty(specialtyData.DT);
        }
    }, [specialtyData])
    useEffect(() => {
        if (departmentData && departmentData?.DT?.length > 0) {
            setDepartments(departmentData.DT);
        }
    }, [departmentData])
    // Hàm xử lý khi submit thành công
    const handleModalSubmit = async () => {
        form
            .validateFields()
            .then(async (values) => {
                setIsLoading(true);
                let response = null;
                if (userUpdate?.id) {
                    response = await updateUser({
                        ...values, id: userUpdate.id,
                        staffId: userUpdate?.staffUserData?.id || "",
                    });
                } else {
                    response = await createUser(values);
                }
                if (response?.EC === 0) {
                    message.success(response?.EM || "Thành công!");
                    handleClose();
                } else {
                    message.error(response?.EM || "Thất bại!");
                }
            })
            .catch((errorInfo) => {
                onFinishFailed(errorInfo); // Gọi onFinishFailed khi form không hợp lệ
            }).finally(() => { setIsLoading(false) });
    };
    const handleClose = () => {
        form.resetFields()
        setUserUpdate(null);
        setIsShowStaff(false);
        props.refresh();
    }
    useEffect(() => {
        if (userUpdate?.id) {
            form.setFieldsValue({
                id: userUpdate?.id || "",
                lastName: userUpdate?.lastName || "",
                firstName: userUpdate?.firstName || "",
                email: userUpdate?.email || "",
                phoneNumber: userUpdate?.phoneNumber || "",
                cid: userUpdate?.cid || "",
                roleId: userUpdate?.roleId || "",
                status: userUpdate?.status,
            })
            if (listStaffRole.includes(userUpdate.roleId)) {
                setOptionRole(STAFF_ROLE);
                form.setFieldsValue({
                    departmentId: userUpdate?.staffUserData?.departmentId || "",
                    shortDescription: userUpdate?.staffUserData?.shortDescription || '',
                    specialtyId: userUpdate?.staffUserData?.specialtyId || null,
                    position: userUpdate?.staffUserData?.position?.split(",") || [],
                    price: userUpdate?.staffUserData?.price || "",
                    htmlDescription: userUpdate?.staffUserData?.htmlDescription || "",
                })
                setIsShowStaff(true);
            } else {
                setIsShowStaff(false);
            }
        } else {
            form.resetFields();
        }
    }, [props.obUpdate])

    let handlChangeRole = (value) => {
        // setPosition(value);
        if (listStaffRole.includes(value)) {
            setIsShowStaff(true);
        } else {
            setIsShowStaff(false);
        }
    }

    return (
        <>
            <div className='create-modal'>
                <Modal
                    title={userUpdate?.id ? "Cập nhật thông tin" : "Thêm người dùng mới"}
                    centered
                    open={props.show}
                    onCancel={() => handleClose()}
                    maskClosable={false} // Ngăn đóng modal khi bấm bên ngoài
                    footer={[
                        <Button key="cancel" onClick={() => handleClose()}>
                            Hủy
                        </Button>,
                        <Button loading={isLoading} key="submit" type="primary" onClick={() => handleModalSubmit()}>
                            {userUpdate?.id ? "Cập nhật" : "Thêm mới"}
                        </Button>,
                    ]}
                    width={"80vw"}
                >
                    <Form
                        form={form}
                        name="insertUser"
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        validateTrigger="onBlur"
                        initialValues={{}}
                        autoComplete="on"
                    >

                        <Row key={"normal"} gutter={[16, 8]}>
                            <Col xs={24} md={12} lg={6} >
                                <Form.Item
                                    label="Họ"
                                    name="lastName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập họ của bạn!',
                                        },
                                        {
                                            pattern: /^[^!@#$%^&*(),.?":{}|<>]*$/,
                                            max: 50,
                                            message: 'Không được chứa ký tự đặc biệt và không được vượt quá 50 ký tự!',
                                        },
                                    ]}
                                >
                                    <Input maxLength={50} placeholder='Vui lòng nhập họ' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6} >
                                <Form.Item
                                    label="Tên"
                                    name="firstName"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên của bạn!',
                                        },
                                        {
                                            max: 50,
                                            pattern: /^[^!@#$%^&*(),.?":{}|<>]*$/,
                                            message: 'Không được chứa ký tự đặc biệt và không được vượt quá 50 ký tự!',
                                        },
                                    ]}
                                >
                                    <Input maxLength={50} placeholder='Vui lòng nhập tên' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6} >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập email!',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Email không hợp lệ!',
                                        },
                                    ]}
                                >
                                    <Input type='email' placeholder='Vui lòng nhập email' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6} >
                                <Form.Item
                                    label="Số điện thoại"
                                    name="phoneNumber"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số điện thoại!',
                                        }
                                        , {
                                            pattern: /^\d{10}$/,
                                            message: 'Số điện thoại phải đúng 10 ký tự!',
                                        }
                                    ]}
                                >
                                    <Input type='number' placeholder='Vui lòng nhập số điện thoại' maxLength={10} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6} >
                                <Form.Item
                                    label="Căn cước công dân"
                                    name="cid"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập căn cước công dân!',
                                        },
                                        {
                                            pattern: /^\d{12}$/,
                                            message: 'Căn cước công dân phải có 12 ký tự!',
                                        },
                                    ]}
                                >
                                    <Input type='number' placeholder='Vui lòng nhập căn cước công dân' maxLength={12} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6} >
                                <Form.Item
                                    name="roleId"
                                    label="Vai trò"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn vai trò!',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Vui lòng chọn vai trò"
                                        showSearch
                                        disabled={userUpdate?.roleId === 1 || userUpdate?.roleId === 2 ? true : false}
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        onChange={(value) => handlChangeRole(value)}
                                        options={optionRole}
                                    />
                                </Form.Item>
                            </Col>
                            {userUpdate?.id &&
                                <Col sm={24} md={12} lg={6}>
                                    <Form.Item
                                        name={"status"}
                                        label="Trạng thái"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn trạng thái!',
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Chọn trạng thái"
                                            options={STATUS}
                                        >
                                        </Select>
                                    </Form.Item>
                                </Col>
                            }
                        </Row>
                        {isShowStaff && <Row gutter={[16, 8]}>
                            <Col xs={24} md={12} lg={6} >
                                <Form.Item
                                    name="departmentId"
                                    label="Khoa"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn khoa!',
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        placeholder="Vui lòng chọn khoa"
                                        options={departments}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6}>
                                <Form.Item
                                    name="specialtyId"
                                    label="Chọn chuyên khoa"
                                >
                                    <Select
                                        placeholder="Chọn chuyên khoa"
                                        allowClear
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={specialty}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6} >
                                <Form.Item
                                    name="position"
                                    label="Chức vụ"
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Vui lòng chọn chức vụ"
                                        options={optionPosition}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12} lg={6} >
                                <Form.Item
                                    name="price"
                                    label="Giá khám"
                                    rules={[{
                                        pattern: /^[0-9]*$/,
                                        message: 'Giá khám không hợp lệ!',

                                    }]
                                    }
                                >
                                    <InputNumber suffix="VNĐ" style={{ width: "100%" }} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="shortDescription"
                                    label="Giới thiệu"
                                >
                                    <TextArea rows={4} placeholder="Mô tả ngắn" />
                                </Form.Item>
                            </Col>
                            <Col span={24} >
                                <Form.Item
                                    name={"htmlDescription"}
                                    label="Mô tả"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập mô tả!',
                                        },
                                    ]}
                                >
                                    <TextEditor
                                        value={form.getFieldValue("htmlDescription")}
                                        onChange={(value) => { form.setFieldsValue({ htmlDescription: value }) }}
                                        placeholder="Nhập nội dung..."
                                    />
                                </Form.Item>
                            </Col>
                        </Row>}
                    </Form>
                </Modal>
            </div >

        </>
    );
};

export default CreateUser;