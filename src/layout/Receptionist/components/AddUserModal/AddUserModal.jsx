import { Col, DatePicker, Form, message, Row, Select, Spin } from 'antd';
import './AddUserModal.scss'
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Input from '@/components/Input';
import { createUser } from '@/services/adminService';
import dayjs from 'dayjs';
import { apiService } from '@/services/apiService';
import useQuery from '@/hooks/useQuery';

const AddUserModal = ({ isOpen, onClose, handleAddUserSuscess, dataQRCode }) => {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [addressData, setAddressData] = useState([]);
    const [province, setProvince] = useState([]);
    const [currentProvinceId, setCurrentProvinceId] = useState(null);
    const [currentDistrictId, setCurrentDistrictId] = useState(null);
    const [currentWardId, setCurrentWardId] = useState(null);
    const [currentListDistrict, setCurrentListDistrict] = useState([]);
    const [currentListWard, setCurrentListWard] = useState([]);
    const { data: provinceData } = useQuery(() => apiService.getAllProvince())

    const addUser = async () => {
        const formData = form.getFieldsValue()
        if (!formData.lastName || !formData.firstName || !formData.cid) {
            message.error('Vui lòng nhập đầy đủ thông tin!')
            return
        }

        if (formData.cid.length !== 12) {
            message.error('CCCD phải đủ 12 ký tự!')
            return
        }
        const address = (formData?.address || " ") + "%" + (formData?.ward || " ") + "%" + (formData?.district || " ") + "%" + (formData?.province || " ")

        const data = {
            lastName: formData.lastName,
            firstName: formData.firstName,
            address: address,
            cid: formData.cid,
            phoneNumber: formData.phone,
            dob: formData.dob,
            gender: formData.gender,
            insuranceCode: formData.insuranceCode,
            dateOfIssue: formData.dateOfIssue,
            exp: formData.exp,
            residentialCode: formData.residentialCode,
            continuousFiveYearPeriod: formData.continuousFiveYearPeriod,
            roleId: 2
        }
        setLoading(true);

        try {
            let response = await createUser(data)
            if (response.EC === 0 && response.DT) {
                message.success('Thêm người dùng thành công!')
                handleAddUserSuscess(response.DT)
                form.resetFields()
                onClose()
            } else {
                message.error('Thêm người dùng thất bại! ' + response.EM)
            }
        } catch (error) {
            console.log(error)
            message.error('Thêm người dùng thất bại!')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Thêm logic ngăn cuộn trang khi modal mở
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup effect khi component unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (dataQRCode?.EC === 1) {
            const userInfo = dataQRCode?.DT?.data;
            form.setFieldsValue({
                lastName: userInfo?.lastName || "",
                firstName: userInfo?.firstName || "",
                cid: userInfo?.cid || "",
                phone: userInfo?.phoneNumber || "",
                dob: userInfo?.dob ? dayjs(dayjs(userInfo.dob).format('DD/MM/YYYY'), "DD/MM/YYYY") : null,
                gender: userInfo?.gender + "" || "",
            })
            if (dataQRCode?.DT?.type === "cid") {
                setAddressData(userInfo?.address?.split(",") || []);
                form.setFieldsValue({
                    address: userInfo?.address.split(",").slice(0, -3).join(",") || "",
                })

            } else if (dataQRCode?.DT?.type === "insuranceCode") {                
                form.setFieldsValue({
                    insuranceCode: userInfo?.insuranceCode || "",
                    dateOfIssue: userInfo?.dateOfIssue ? dayjs(dayjs(userInfo.dateOfIssue).format('DD/MM/YYYY'), "DD/MM/YYYY") : null,
                    exp: userInfo?.exp ? dayjs(dayjs(userInfo.exp).format('DD/MM/YYYY'), "DD/MM/YYYY") : null,
                    residentialCode: userInfo?.residentialCode || "",
                    continuousFiveYearPeriod: userInfo?.continuousFiveYearPeriod ? dayjs(dayjs(userInfo.continuousFiveYearPeriod).format('DD/MM/YYYY'), "DD/MM/YYYY") : null,
                })
            }
        }
    }, [dataQRCode])

    useEffect(() => {
        if (provinceData) {
            let _province = provinceData.data?.map((item) => {
                return {
                    value: +item.id,
                    label: item.full_name
                }
            })
            const currentProvinceId = _province.find((item) => item.label.includes(addressData[addressData.length - 1]));
            setProvince(_province);
            setCurrentProvinceId(currentProvinceId?.value);
            form.setFieldsValue({ province: currentProvinceId?.value })
        }
    }, [provinceData])

    useEffect(() => {
        if (currentProvinceId) {
            apiService.getDistrictByProvinceId(currentProvinceId).then((districtList) => {
                let _district = districtList.data?.map((item) => {
                    return {
                        value: +item.id,
                        label: item.full_name
                    }
                });
                const currentDistrictId = _district.find((item) => item.label.includes(addressData[addressData.length - 2]));
                setCurrentListDistrict(_district);
                setCurrentDistrictId(currentDistrictId?.value);
                form.setFieldsValue({ district: currentDistrictId?.value })
            }).catch(error => {
                console.error("Error fetching districts:", error);
            });
        } else {
            setCurrentListDistrict([]);
        }
    }, [currentProvinceId]);

    useEffect(() => {
        if (currentDistrictId) {
            apiService.getWardByDistrictId(currentDistrictId).then((wardList) => {
                let _ward = wardList.data?.map((item) => {
                    return {
                        value: +item.id,
                        label: item.full_name
                    }
                });
                const currentWardId = _ward.find((item) => item.label.includes(addressData[addressData.length - 3]));
                setCurrentListWard(_ward);
                setCurrentWardId(currentWardId?.value);
                form.setFieldsValue({ ward: currentWardId?.value })
            }).catch(error => {
                console.error("Error fetching wards:", error);
            });
        } else {
            setCurrentListWard([]);
        }
    }, [currentDistrictId]);

    if (!isOpen) return null

    return (
        <div className="add-user-container">
            <div className="add-user-content">
                <div className='add-user-header'>
                    Thêm người dùng mới
                </div>
                <div className="relative">
                    {loading && (
                        <div className="loading absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                            <Spin size="large" />
                        </div>
                    )}
                    <div className={`${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Form
                            layout={'horizontal'}
                            form={form}
                            labelCol={{
                                span: 24,
                            }}
                            wrapperCol={{
                                span: 24,
                            }}
                            initialValues={{
                            }}
                            style={{
                                maxWidth: "100%",
                            }}
                            validateTrigger="onBlur"
                        >
                            <Row gutter={[16, 8]}>
                                <Col sm={24} lg={12}>
                                    <Form.Item
                                        name={"cid"}
                                        className='mb-0'
                                        label="Căn cước công dân"
                                        rules={[{
                                            required: true,
                                            message: 'CCCD không được để trống!',
                                        }, {
                                            pattern: /^[0-9]*$/g,
                                            message: 'Vui lòng nhập số!',
                                        }, {
                                            validator: (_, value) => {
                                                if (value && value.length !== 12) {
                                                    return Promise.reject(new Error('Căn cước công dân phải đủ 12 ký tự!'));
                                                }
                                                return Promise.resolve();
                                            },
                                        },]}>
                                        <Input placeholder="Nhập căn cước công dân" maxLength={12} className='input-add-user' />
                                    </Form.Item>
                                </Col>
                                <Col sm={24} lg={12}>
                                    <Form.Item
                                        name={"phone"}
                                        className='mb-0'
                                        label="Số điện thoại"
                                        rules={[{
                                            pattern: /^[0-9]*$/g,
                                            len: 10,
                                            message: 'Vui lòng nhập đúng định dạng!',
                                        }]}
                                    >
                                        <Input placeholder="Nhập số điện thoại" maxLength={10} className='input-add-user' />
                                    </Form.Item>
                                </Col>
                                <Col sm={24} lg={12}>
                                    <Form.Item
                                        name={"lastName"}
                                        className='mb-0'
                                        label="Họ và tên lót"
                                        rules={[{
                                            required: true,
                                            message: 'Họ và tên lót không được để trống!',
                                        }]}>
                                        <Input placeholder="Nhập họ và tên lót" className='input-add-user' />
                                    </Form.Item>
                                </Col>
                                <Col sm={24} lg={12}>
                                    <Form.Item
                                        name={"firstName"}
                                        className='mb-0'
                                        label="Tên"
                                        rules={[{
                                            required: true,
                                            message: 'Tên không được để trống!',
                                        }]}>
                                        <Input placeholder="Nhập tên" className='input-add-user' />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item className='mb-0' name="province" label="Tỉnh/ thành phố" >
                                        <Select
                                            className='select-add-user'
                                            placeholder="Vui lòng chọn tỉnh/ thành phố"
                                            showSearch
                                            optionFilterProp="label"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            onChange={(value) => {
                                                setCurrentProvinceId(value); // Update the state
                                                form.setFieldsValue({ district: null, ward: null });
                                                setCurrentDistrictId(null)// Reset district state
                                            }}
                                            options={province} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item className='mb-0' name="district" label="Quận/ huyện" >
                                        <Select
                                            className='select-add-user'
                                            placeholder="Vui lòng chọn quận/ huyện"
                                            showSearch
                                            optionFilterProp="label"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            onChange={(value) => {
                                                setCurrentDistrictId(value); // Update the state
                                                form.setFieldsValue({ ward: null });
                                            }}
                                            options={currentListDistrict} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item className='mb-0' name="ward" label="Xã/ phường">
                                        <Select
                                            className='select-add-user'
                                            placeholder="Vui lòng chọn xã/ phường"
                                            showSearch
                                            optionFilterProp="label"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={currentListWard} />
                                    </Form.Item>
                                </Col>
                                <Col sm={24} lg={12}>
                                    <Form.Item
                                        name={"address"}
                                        label="Địa chỉ"
                                        className='mb-0 '>
                                        <Input placeholder="Nhập địa chỉ" className='input-add-user' />
                                    </Form.Item>
                                </Col>
                                <Col sm={24} lg={6}>
                                    <Form.Item
                                        name={"dob"}
                                        label="Ngày sinh">
                                        <DatePicker
                                            format={'DD/MM/YYYY'} style={{ width: "100%" }}
                                            placeholder="Chọn ngày sinh"
                                            className='input-add-user' />
                                    </Form.Item>
                                </Col>
                                <Col sm={24} lg={6}>
                                    <Form.Item
                                        name={"gender"}
                                        label="Giới tính">
                                        <Select
                                            placeholder="Chọn giới tính"
                                            className='select-add-user'
                                            options={[
                                                { value: null, label: "Chọn giới tính", disabled: true },
                                                { value: '0', label: 'Nam' },
                                                { value: '1', label: 'Nữ' }
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col sm={24} lg={12}>
                                    <Form.Item
                                        name={"insuranceCode"}
                                        label="Bảo hiểm y tế"
                                        rules={[{
                                            pattern: /^[0-9]*$/g,
                                            message: 'Vui lòng nhập số!',
                                        }]}
                                    >
                                        <Input placeholder="Nhập số BHYT" maxLength={10} className='input-add-user' />
                                    </Form.Item>
                                </Col>
                            </Row>
                            {form.getFieldValue("insuranceCode") && (
                                <Row gutter={[16, 8]}>
                                    <Col sm={24} lg={12}>
                                        <Form.Item name={"dateOfIssue"} label="Ngày cấp" className='mb-0 '>
                                            <DatePicker
                                                format={'DD/MM/YYYY'} style={{ width: "100%" }}
                                                placeholder="Ngày có hiệu lực"
                                                className='input-add-user' />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} lg={12}>
                                        <Form.Item name={"exp"} label="Ngày hết hạn" className='mb-0 '>
                                            <DatePicker
                                                format={'DD/MM/YYYY'} style={{ width: "100%" }}
                                                placeholder="Ngày hết hạn"
                                                className='input-add-user' />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} lg={12}>
                                        <Form.Item name={"residentialCode"} label="Mã đăng ký khám bệnh" className='mb-0 '>
                                            <Input placeholder="Nhập mã đăng ký" className='input-add-user' />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} lg={12}>
                                        <Form.Item name={"continuousFiveYearPeriod"} label="Thời điểm đủ 5 năm liên tục" className='mb-0 '>
                                            <DatePicker
                                                format={'DD/MM/YYYY'} style={{ width: "100%" }}
                                                placeholder="Ngày đủ 5 năm liên tục"
                                                className='input-add-user' />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                        </Form>

                        <div className='add-user-footer mt-4'>
                            <button className="close-user-btn" onClick={onClose}>Đóng</button>
                            <button className='add-user-btn' onClick={addUser}>Thêm</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

AddUserModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    handleAddUserSuscess: PropTypes.func.isRequired
}

export default AddUserModal