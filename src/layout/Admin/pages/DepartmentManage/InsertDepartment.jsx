import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, message, Progress, Row, Select } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { createDepartment, getStaffByRole, updateDepartment } from '@/services/adminService';
import useQuery from '@/hooks/useQuery';
import { uploadAndDeleteToCloudinary } from '@/utils/uploadToCloudinary';

import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CLOUDINARY_FOLDER, STATUS } from '@/constant/value';
import { ROLE } from '@/constant/role';
import TextEditor from '@/components/TextEditor/TextEditor';
const { TextArea } = Input;
const InsertDepartment = (props) => {
    const [form] = Form.useForm();
    let [departmentUpdate, setDepartmentUpdate] = useState(props.obUpdate);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState(""); // Lưu trữ URL ảnh sau khi upload
    let [listDoctors, setListDoctors] = useState([]);
    let { data: doctors } = useQuery(() => getStaffByRole(ROLE.DOCTOR));
    let [isLoadingAction, setIsLoadingAction] = useState(false);
    let [col, setCol] = useState(8);
    useEffect(() => {
        if (doctors && doctors?.DT?.length > 0) {
            let _doctor = doctors.DT.map((item) => {
                return {
                    value: item.id,
                    label: item?.staffUserData?.lastName + ' ' + item?.staffUserData?.firstName
                }
            })
            setListDoctors(_doctor);
        }
    }, [doctors])
    useEffect(() => {
        if (departmentUpdate?.id) {
            setDepartmentUpdate(props.obUpdate);
            form.setFieldsValue({
                name: departmentUpdate?.name || "",
                address: departmentUpdate?.address || "",
                deanId: departmentUpdate?.deanId || null,
                shortDescription: departmentUpdate?.shortDescription || "",
                status: departmentUpdate?.status || 1,
                image: departmentUpdate.image,
                htmlDescription: departmentUpdate?.htmlDescription || ""
            })
            setImageUrl(departmentUpdate?.image || "");
            setCol(6);
        }
    }, [props.obUpdate])

    const handleCloseInsert = () => {
        form.resetFields()
        setImageUrl("");
        setDepartmentUpdate(null);
        props.refresh();
    }

    // Xử lý khi người dùng chọn ảnh
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true); // Bắt đầu upload
        setUploadProgress(0); // Đặt lại tiến trình về 0
        try {
            // Gọi hàm upload với callback để cập nhật tiến trình
            const url = await uploadAndDeleteToCloudinary(file, CLOUDINARY_FOLDER.DEPARTMENT, imageUrl, (progress) => {
                setUploadProgress(progress);
            });
            setImageUrl(url); // Lưu URL ảnh sau khi upload
            message.success("Upload thành công!");
        } catch (error) {
            message.error("Upload thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setUploading(false); // Kết thúc upload
        }
    };

    const handleInsert = () => {
        if (!imageUrl) {
            message.error('Vui lòng chọn ảnh khoa!')
            return;
        }
        form.validateFields().then(async (values) => {
            setIsLoadingAction(true);
            let respone;
            if (departmentUpdate.id) {
                respone = await updateDepartment({ ...values, image: imageUrl, id: departmentUpdate.id })
            } else {
                respone = await createDepartment({ ...values, image: imageUrl })
            }
            if (respone?.EC == 0) {
                message.success(respone?.EM || "Thành công")
                handleCloseInsert();
            }
            else {
                message.error(respone?.EM || "Thêm khoa thất bại")
                return;
            }
        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setIsLoadingAction(false);
        })
    }
    return (
        <div className="insert-department">
            <div className="content px-3 py-3">
                <div className='d-flex justify-content-between align-items-center'>
                    <div >{departmentUpdate.id ? "CẬP NHẬT KHOA" : "THÊM KHOA"}</div>
                    <FontAwesomeIcon className='icon'
                        onClick={() => { handleCloseInsert() }}
                        icon={faXmark} size="xl" />
                </div>
                <hr />
                <div>
                    <Form
                        layout={'horizontal'}
                        form={form}
                        labelCol={{ span: 24, }}
                        wrapperCol={{ span: 24, }}
                        initialValues={{}}
                        style={{ maxWidth: "100%", }}
                    >
                        <Row gutter={[16, 8]}>
                            <Col sm={24} lg={col}>
                                <Form.Item
                                    name={"name"}
                                    label="Tên khoa"
                                    rules={[{
                                        required: true,
                                        message: 'Vui lòng nhập tên khoa!',
                                    }]}>
                                    <Input placeholder="Nhập tên khoa" />
                                </Form.Item>
                            </Col>
                            <Col sm={24} lg={col}>
                                <Form.Item
                                    name={"address"}
                                    label="Địa điểm"
                                    rules={[{
                                        required: true,
                                        message: 'Vui lòng nhập địa điểm của khoa!',
                                    }]}>

                                    <Input placeholder="Nhập vị trí của khoa" />
                                </Form.Item>
                            </Col>
                            <Col sm={24} lg={col}>
                                <Form.Item
                                    name="deanId"
                                    label="Trưởng khoa"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn trưởng khoa!',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn trưởng khoa"
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={listDoctors}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            {departmentUpdate.id &&
                                <Col sm={24} lg={col}>
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
                                    </Form.Item></Col>
                            }
                            <Col sm={24} lg={8}>
                                <Form.Item
                                    name={"image"}
                                    label="Ảnh khoa"

                                >
                                    <div className='image-upload' htmlFor={"input-upload"}
                                        onClick={() => document.getElementById('input-upload').click()}>
                                        <input type="file" id='input-upload' hidden={true} onChange={handleImageChange} />
                                        {imageUrl ?
                                            <div className='img-department' style={{
                                                backgroundImage: `url(${imageUrl})`,
                                            }}
                                            >
                                            </div>
                                            :
                                            <div className='container'>
                                                <span><CloudUploadOutlined /></span>
                                                <div><span >Chọn ảnh</span> đăng tải.</div>
                                            </div>
                                        }
                                        {uploading && (
                                            <div style={{ marginTop: '20px', width: '100%' }}>
                                                <Progress percent={uploadProgress} status="active" />
                                            </div>
                                        )}
                                    </div>
                                </Form.Item>
                            </Col>
                            <Col sm={24} lg={16}>
                                <Form.Item
                                    name="shortDescription"
                                    label="Giới thiệu"
                                >
                                    <TextArea rows={9} placeholder="Mô tả về khoa" />
                                </Form.Item>
                            </Col>
                            <Col sm={24}>
                                <Form.Item
                                    name={"htmlDescription"}
                                    label="Mô tả"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập mô tả!', },
                                    ]}
                                >
                                    <TextEditor
                                        value={form.getFieldValue("htmlDescription")}
                                        onChange={(value) => { form.setFieldsValue({ htmlDescription: value }) }}
                                        placeholder="Nhập nội dung..."
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                                <Form.Item>
                                    <Button loading={isLoadingAction} type="primary" htmlType="submit"
                                        onClick={() => { handleInsert() }}>{departmentUpdate.id ? "Cập nhật" : "Thêm"}</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>


        </div >
    )
}

export default InsertDepartment;