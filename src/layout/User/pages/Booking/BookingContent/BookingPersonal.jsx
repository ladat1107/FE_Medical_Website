import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "../Booking.scss"
import { faLeftLong } from "@fortawesome/free-solid-svg-icons"
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd"
import dayjs from "dayjs"
import { GENDER, SPECIAL_EXAMINATION } from "@/constant/value"
import { apiService } from "@/services/apiService"
import { useEffect, useState } from "react"
import useQuery from "@/hooks/useQuery"
import userService from "@/services/userService"
import { OldParaclinicalModal } from "@/components/Modals"

const BookingPersonal = (props) => {
    let [form] = Form.useForm();
    let profileData = props?.profile || useQuery(() => userService.getUserById({ id: "null" }))?.data?.DT;
    let messageError = 'Vui lòng nhập thông tin!';
    let listSpecialExamination = Object.values(SPECIAL_EXAMINATION).map((item) => { return { value: item.value, label: item.label + (item?.description ? " (" + item.description + ")" : "") } });
    let currentResidentData = profileData?.currentResident?.split("%") || [];
    let [province, setProvince] = useState([]);
    let [listFolk, setListFolk] = useState([]);
    let [showOldParaclinicalModal, setShowOldParaclinicalModal] = useState(false);
    let [oldParaclinical, setOldParaclinical] = useState(null);
    let [currentListDistrict, setCurrentListDistrict] = useState([]);
    let [currentListWard, setCurrentListWard] = useState([]);
    let [currentProvinceId, setCurrentProvinceId] = useState(+currentResidentData[3] || null);
    let [currentDistrictId, setCurrentDistrictId] = useState(+currentResidentData[2] || null);
    let { data: provinceData } = useQuery(() => apiService.getAllProvince())
    let { data: folkData } = useQuery(() => userService.getFolk());
    
    useEffect(() => {
        if (provinceData) {
            let _province = provinceData.data?.map((item) => {
                return {
                    value: +item.id,
                    label: item.full_name
                }
            })
            setProvince(_province);
            setCurrentProvinceId(+currentResidentData[3]);

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
                setCurrentListDistrict(_district);
                setCurrentDistrictId(+currentResidentData[2]);
            }).catch(error => {
                console.error("Lỗi khi lấy danh sách quận/huyện:", error);
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
                setCurrentListWard(_ward);
            }).catch(error => {
                console.error("Error fetching wards:", error);
            });
        } else {
            setCurrentListWard([]);
        }
    }, [currentDistrictId]);

    useEffect(() => {
        if (folkData) {
            let _folk = folkData.DT.map((item) => { return { value: +item.id, label: item.name } })
            setListFolk(_folk);
        }
    }, [folkData])
   
    useEffect(() => {
        if (profileData) {
            let profile = profileData;
            form.setFieldsValue({
                dob: profile?.dob ? dayjs(dayjs(profile?.dob).format('DD/MM/YYYY'), "DD/MM/YYYY") : null,
                lastName: profile?.lastName || "",
                firstName: profile?.firstName || "",
                email: profile?.email || "",
                cid: profile?.cid || "",
                symptom: profile?.symptom || "",
                gender: +(profile?.gender || 0),
                phoneNumber: profile?.phoneNumber || "",
                folk: profile?.folk || null,
                province: +currentResidentData[3] || null,
                district: +currentResidentData[2] || null,
                ward: +currentResidentData[1] || null,
                address: currentResidentData[0] || "",
                special: profile?.special || listSpecialExamination[0].value,
            })
            setOldParaclinical(profile?.oldParaclinical || null);
        }
    }, [profileData])

    const onFinish = async (values) => {
        const obFolk = listFolk.find((item) => item.value === values.folk);
        const obProvince = province.find((item) => item.value === values.province);
        const obDistrict = currentListDistrict.find((item) => item.value === values.district);
        const obWard = currentListWard.find((item) => item.value === values.ward);
        let data = {
            id: profileData?.id,
            dob: values.dob.format('YYYY-MM-DD'),
            lastName: values.lastName,
            firstName: values.firstName,
            email: values.email,
            cid: values.cid,
            currentResident: `${values.address}%${values.ward}%${values.district}%${values.province}`,
            phoneNumber: values.phoneNumber,
            gender: values.gender,
            folk: values.folk,
            symptom: values.symptom,
            special: values.special,
            obFolk,
            obProvince,
            obDistrict,
            obWard,
            address: values.address,
            oldParaclinical: oldParaclinical,
        }
        props.next(data);
        form.resetFields();
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <div className="header">
                <FontAwesomeIcon className="icon-back" icon={faLeftLong} onClick={() => { props.back() }} />
                Thông tin cá nhân
            </div>
            <div className="content">
                <div className="warning">
                    <span >Vui lòng cung cấp thông tin chính xác để được phục vụ tốt nhất. Trong trường hợp cung cấp sai thông tin bệnh nhân & email, việc xác nhận cuộc hẹn sẽ không hiệu lực trước khi đặt khám.</span>
                </div>
                <div className="booking-personal p-3">
                    <Form
                        name="basic"
                        form={form}
                        layout="vertical"
                        className="login-form"
                        initialValues={{
                        }}
                        width={100}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}>
                        <Row gutter={[16, 1]} width={100}>
                            <Col xs={24} md={12}>
                                <Form.Item label={"Họ"} name="lastName" rules={[{ required: true, message: messageError }, {
                                    pattern: /^[a-zA-ZÀ-ỹDđ'\s]+$/,
                                    message: 'Không chứa ký tự đặc biệt!'
                                }]}>
                                    <Input className='input-register' placeholder='Họ' maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label={"Tên"} name="firstName" rules={[{ required: true, message: messageError }, {
                                    pattern: /^[a-zA-ZÀ-ỹDđ'\s]+$/,
                                    message: 'Không chứa ký tự đặc biệt!'
                                }]}>
                                    <Input className='input-register' placeholder='Tên' maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Địa chỉ email" name="email" rules={[{ required: true, message: messageError }, {
                                    pattern: /^[a-zA-Z0-9'@.\s]*$/,
                                    message: 'Không chứa ký tự đặc biệt!'
                                }, {
                                    type: 'email',
                                    message: 'Email không hợp lệ!'
                                }]}>
                                    <Input className='input-register' placeholder='Email' maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Căn cước công dân" name="cid" rules={[{ required: true, message: messageError }, {
                                    pattern: /^[0-9]{12}$/,
                                    message: 'Căn cước không hợp lệ!'
                                }]}>
                                    <Input className='input-register' placeholder='Căn cước công dân' maxLength={12} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: messageError }, {
                                    pattern: /^(0[3|5|7|8|9][0-9]{8})$/,
                                    message: 'Số điện thoại không hợp lệ!'
                                }]}>
                                    <Input className='input-register' placeholder='Số điện thoại' maxLength={10} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Ngày tháng năm sinh" name="dob" rules={[{ required: true, message: messageError }]}>
                                    <DatePicker className='input-register'
                                        allowClear={false}
                                        placeholder="DD/MM/YYYY"
                                        format={'DD/MM/YYYY'} style={{ width: "100%" }}
                                        disabledDate={(current) => current && current.valueOf() >= dayjs().startOf("day").valueOf()} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="gender" label="Giới tính" rules={[{ required: true, message: messageError }]}>
                                    <Select
                                        className='select-inf'
                                        placeholder="Vui lòng giới tính"
                                        options={GENDER} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="folk" label="Dân tộc" rules={[{ required: true, message: messageError }]}>
                                    <Select
                                        className='select-inf'
                                        placeholder="Vui lòng chọn dân tộc"
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        } options={listFolk} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="province" label="Tỉnh/ thành phố" rules={[{ required: true, message: messageError }]}>
                                    <Select
                                        className='select-inf'
                                        placeholder="Vui lòng chọn tỉnh/ thành phố"
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        onChange={(value) => {
                                            setCurrentProvinceId(value); // Update the state
                                            form.setFieldsValue({
                                                district: null, // Reset district field
                                                ward: null,
                                                address: "",
                                            });
                                            setCurrentDistrictId(null)// Reset district state
                                        }}
                                        options={province} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="district" label="Quận/ huyện" rules={[{ required: true, message: messageError }]}>
                                    <Select
                                        className='select-inf'
                                        placeholder="Vui lòng chọn quận/ huyện"
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        onChange={(value) => {
                                            setCurrentDistrictId(value); // Update the state
                                            form.setFieldsValue({// Reset district field
                                                ward: null,
                                                address: "",
                                            });
                                        }}
                                        options={currentListDistrict} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="ward" label="Xã/ phường" rules={[{ required: true, message: messageError }]}>
                                    <Select
                                        className='select-inf'
                                        placeholder="Vui lòng chọn xã/ phường"
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        onChange={() => { form.setFieldsValue({ address: "" }) }}
                                        options={currentListWard} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="address" label="Địa chỉ nhà" rules={[{ required: true, message: messageError }]}>
                                    <Input className='input-register' placeholder='Nhập địa chỉ nhà' maxLength={50} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item name="special" label="Ưu tiên" rules={[{ required: true, message: messageError }]}>
                                    <Select
                                        className='select-inf'
                                        placeholder="Vui lòng chọn loại ưu tiên"
                                        options={listSpecialExamination} />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <Form.Item name="symptom" label="Triệu chứng" rules={[{ required: true, message: messageError }]}>
                                    <Input.TextArea className='input-register' placeholder='Mô tả triệu chứng của bạn (ví dụ: Sốt, đau đầu,...)' maxLength={250} />
                                </Form.Item>
                            </Col>
                            <Col className="mt-2" xs={24}>
                                <div className="d-flex flex-wrap justify-content-end w-100 gap-2">
                                    <Button onClick={() => setShowOldParaclinicalModal(true)} className="btn-old-paraclinical">Thêm phiếu xét nghiệm</Button>
                                    <Button type="primary" htmlType="submit" className="register-button" >
                                        Tiếp theo
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
            <OldParaclinicalModal
                visible={showOldParaclinicalModal}
                onCancel={() => setShowOldParaclinicalModal(false)}
                oldParaclinical={oldParaclinical}
                onSave={(value) => setOldParaclinical(value)}
            />

        </>
    )
}

export default BookingPersonal