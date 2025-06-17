"use client"

import { useState, useEffect } from "react"
import { Modal, Input, Select, DatePicker, Button, Form, Spin, Avatar, Divider, message, Skeleton } from "antd"
import {
    SearchOutlined,
    IdcardOutlined,
    ManOutlined,
    WomanOutlined,
    CloseCircleOutlined,
    MailOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import useQuery from "@/hooks/useQuery"
import userService from "@/services/userService"
import { getUser } from "@/services/adminService"
import { useMutation } from "@/hooks/useMutation"
import useDebounce from "@/hooks/useDebounce"
import { LINK, MEDICAL_TREATMENT_TIER, SPECIAL_EXAMINATION, STATUS, STATUS_BE, TIMESLOTS } from "@/constant/value"
import AddUserModal from "@/layout/Receptionist/components/AddUserModal/AddUserModal"
import { CirclePlus } from "lucide-react"
import { createAppointment, getDoctorBooking, getScheduleByDateAndDoctor } from "@/services/doctorService"

const { TextArea } = Input
const { Option } = Select

const CreateAppointmentModal = ({ visible, onCancel, onSubmit }) => {
    const [form] = Form.useForm()
    const [isUserModalOpen, setIsUserModalOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("")
    const [userList, setUserList] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [specialtyId, setSpecialtyId] = useState(null)
    const [selectedDoctor, setSelectedDoctor] = useState(null)
    const [doctors, setDoctors] = useState([])
    const [specialties, setSpecialties] = useState([])
    const [timeSlots, setTimeSlots] = useState([])
    const [loading, setLoading] = useState(false)
    const listSpecialExamination = Object.values(SPECIAL_EXAMINATION).map((item) => { return { value: item.value, label: item.label + (item?.description ? " (" + item.description + ")" : "") } });
    const { data: dataSpecialty } = useQuery(() => userService.getSpecialty({ date: dayjs().format("YYYY-MM-DD 00:00:00") }));
    const { data: dataUser, loading: loadingUser, execute: fetchUsers, } = useMutation(() => getUser(1, 25, searchValue, [2]))
    const { data: dataDoctorBooking, loading: loadingDoctorBooking, execute: fetchDoctorBooking, } = useMutation(() => getDoctorBooking({ specialtyId: specialtyId, date: dayjs(selectedDate).format("YYYY-MM-DD 00:00:00") }));
    const {
        data: dataSchedule,
        execute: fetchSchedule,
    } = useMutation(() => getScheduleByDateAndDoctor({ date: dayjs(selectedDate).format("YYYY-MM-DD 00:00:00"), doctorId: selectedDoctor?.id }));

    useEffect(() => {
        form.resetFields()
        form.setFieldsValue({
            priority: listSpecialExamination[0].value,
        })
        setSelectedUser(null)
        setSelectedDate(null)
        setSelectedDoctor(null)
        setSpecialtyId(null)
        setTimeSlots([])
        setSearchValue("")
        setUserList([])
        setIsUserModalOpen(false)
    }, [visible])

    useEffect(() => {
        if (dataUser?.EC === 0) {
            let _listUser = dataUser?.DT?.rows.map(item => ({ ...item })) || [];
            setUserList(_listUser);
        }
    }, [dataUser])

    useEffect(() => {
        if (searchValue.trim() === "") {
            setUserList([])
            return
        }
        fetchUsers();
    }, [useDebounce(searchValue, 500)]);

    useEffect(() => {
        if (dataSpecialty) {
            setSpecialties(dataSpecialty?.DT?.map(item => ({
                value: item?.id,
                label: item?.name
            })) || []);
        }
    }, [dataSpecialty]);

    useEffect(() => {
        if (selectedDate) {
            fetchDoctorBooking();
        }
    }, [selectedDate, specialtyId]);

    useEffect(() => {
        if (selectedDoctor && selectedDate) {
            fetchSchedule();
        } else {
            setTimeSlots([])
        }
    }, [selectedDoctor, selectedDate]);

    useEffect(() => {
        if (dataDoctorBooking?.EC === 0) {
            let _listDoctorBooking = dataDoctorBooking?.DT?.map(item => ({ ...item })) || [];
            setDoctors(_listDoctorBooking);
        }
    }, [dataDoctorBooking]);

    useEffect(() => {
        if (dataSchedule?.EC === 0) {
            let _listTimeSlots = TIMESLOTS.map(item => {
                let _schedule = dataSchedule?.DT?.find(schedule => schedule.time === item.value)
                return {
                    value: item.value,
                    label: item.label,
                    count: _schedule?.count || 0,
                }
            })
            setTimeSlots(_listTimeSlots)
        }
    }, [dataSchedule]);

    const handleUserSelect = (user) => {
        setSelectedUser(user)
        // Store the user ID in the form for submission
        form.setFieldsValue({
            userId: user.id,
        })
        setSearchValue(`${user.firstName} ${user.lastName}`)
        setUserList([])
    }

    const clearSelectedUser = () => {
        setSelectedUser(null)
        form.setFieldsValue({
            userId: undefined,
            userSearch: "",
        })
        setSearchValue("")
        setUserList([])
    }

    const handleSubmit = () => {

        form.validateFields().then(async (values) => {
            if (!selectedUser) { message.error("Vui lòng chọn người dùng"); return; }
            if (!selectedDoctor) { message.error("Vui lòng chọn bác sĩ"); return; }
            const data = {
                userId: selectedUser.id,
                staffId: selectedDoctor.id,
                time: values.timeSlot,
                special: values.priority,
                symptom: values.symptom,
                admissionDate: dayjs(selectedDate).format("YYYY-MM-DD"),
                price: selectedDoctor?.price || 0,
                medicalTreatmentTier: MEDICAL_TREATMENT_TIER.OUTPATIENT,
                status: STATUS_BE.PENDING,
                is_appointment: 1,
                roomName: selectedDoctor?.staffScheduleData[0]?.scheduleRoomData?.name || "",
                roomId: selectedDoctor?.staffScheduleData[0]?.roomId || "",
            }
            setLoading(true)
            let response = await createAppointment(data)
            if (response?.EC === 0) {
                message.success("Tạo lịch khám thành công")
                onSubmit()
                onCancel()
            } else {
                message.error(response?.EM)
            }
            setLoading(false)
        })

    }


    // Function to get gender text
    const getOld = (dob) => {
        if (!dob) return 0;
        const birthDate = dayjs(dob);
        const today = dayjs();
        let age = today.year() - birthDate.year();

        if (today.isBefore(birthDate.add(age, 'year'))) {
            age -= 1;
        }
        return age;
    }

    const handleDoctorSelect = (value) => {
        if (!value) {
            setSelectedDoctor(null)
            setTimeSlots([])
            return
        }
        let _doctor = doctors.find(item => item.id === value)
        form.setFieldsValue({
            specialty: _doctor?.specialtyId,
        })
        setSpecialtyId(_doctor?.specialtyId)
        setSelectedDoctor(_doctor)
    }

    const handleAddUserSuscess = (data) => {
        setSearchValue(data?.user?.cid || "")
        form.setFieldsValue({
            userSearch: data?.user?.cid || "",
        })
    }
    return (
        <>
            <Modal
                title="Tạo lịch hẹn khám bệnh"
                open={visible && !isUserModalOpen}
                maskClosable={false}
                onCancel={onCancel}
                width={700}
                centered
                footer={[
                    <Button key="cancel" onClick={onCancel}>
                        Hủy
                    </Button>,
                    <Button loading={loading} key="submit" type="primary" onClick={handleSubmit}>
                        Tạo lịch hẹn
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical" className="mt-4" validateTrigger={['onSubmit']} autoComplete="off">
                    {/* Group 1: User Information */}
                    <div className="bg-white px-4 rounded-lg mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Thông tin người dùng</h3>

                        {!selectedUser ? (
                            <div className="relative mb-4">
                                <div className="flex items-center gap-2 justify-between">
                                    <Form.Item name="userSearch" className="flex-1 items-center mb-0">
                                        <Input
                                            placeholder="Nhập tên hoặc CCCD để tìm kiếm"
                                            prefix={<SearchOutlined />}
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            className="w-full "
                                        />
                                    </Form.Item>
                                    <CirclePlus className="text-primary-tw cursor-pointer text-2xl" onClick={() => setIsUserModalOpen(true)} />
                                </div>

                                {loadingUser ?
                                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        <Skeleton active paragraph={{ rows: 10 }} />
                                    </div>
                                    :
                                    userList.length > 0 && (
                                        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                            {userList.map((user) => (
                                                <div
                                                    key={user.id}
                                                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                                    onClick={() => handleUserSelect(user)}
                                                >
                                                    <Avatar src={user?.avatar || LINK.AVATAR_NULL} className="mr-2" />
                                                    <div className="w-[50%]">
                                                        {user?.lastName || ""} {user?.firstName || ""}
                                                    </div>
                                                    <div className="w-[50%] text-gray-400">
                                                        {user?.cid ? <span><IdcardOutlined className="mr-2" /> CCCD: {user.cid}</span> :
                                                            user?.email ? <span><MailOutlined className="mr-2" />  {user.email}</span> : null
                                                        }
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ) : (
                            <div className="bg-green-50 rounded-lg border border-gray-200 p-4 relative">
                                <Button
                                    type="text"
                                    icon={<CloseCircleOutlined />}
                                    className="absolute top-2 right-2"
                                    onClick={clearSelectedUser}
                                    aria-label="Xóa người dùng đã chọn"
                                />

                                <div className="flex items-center mb-4 rounded-lg">
                                    <Avatar
                                        size={64}
                                        src={selectedUser?.avatar || LINK.AVATAR_NULL}
                                    />
                                    <div className="ml-4 w-full">
                                        <h4 className="text-xl font-medium text-gray-800">
                                            {selectedUser?.lastName || ""} {selectedUser?.firstName || ""}
                                        </h4>
                                        <div className="flex flex-wrap gap-4">
                                            <p className="text-gray-500 w-20">
                                                <Avatar style={{ backgroundColor: selectedUser?.gender === 1 ? "#eb2f96" : "#1890ff" }} size={16} icon={selectedUser?.gender === 1 ? <WomanOutlined /> : <ManOutlined />} className="mr-2" />
                                                {selectedUser?.gender === 1 ? "Nữ" : "Nam"}
                                            </p>
                                            {getOld(selectedUser.dob) !== 0 &&
                                                <p className="text-gray-500">
                                                    <b>{getOld(selectedUser.dob)}</b> tuổi
                                                </p>
                                            }
                                        </div>

                                    </div>
                                </div>

                                <Divider className="my-3" />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">CCCD/CMND</p>
                                        <p className="font-medium flex items-center">
                                            <IdcardOutlined className="mr-2 text-gray-400" />
                                            {selectedUser?.cid || ""}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Liên hệ</p>
                                        <p className="font-medium flex items-center">
                                            <MailOutlined className="mr-2 text-gray-400" />
                                            {selectedUser?.email ? selectedUser.email : selectedUser?.phoneNumber || ""}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Group 2: Appointment Information */}
                    <div className="bg-gray-50 px-4 rounded-lg mb-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-2">Thông tin đặt lịch</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                className="col-span-1"
                                name="specialty"
                                label="Chuyên khoa"
                                rules={[{ required: true, message: "Vui lòng chọn chuyên khoa" }]}
                            >
                                <Select placeholder="Chọn chuyên khoa"
                                    showSearch
                                    allowClear
                                    optionFilterProp="label"
                                    onChange={(value) => { setSpecialtyId(value) }}
                                    value={specialtyId}
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    options={specialties}
                                />
                            </Form.Item>
                            <Form.Item
                                className="col-span-1"
                                name="appointmentDate"
                                label="Ngày khám"
                                rules={[{ required: true, message: "Vui lòng chọn ngày khám" }]}
                            >
                                <DatePicker
                                    className="w-full"
                                    allowClear
                                    format="DD/MM/YYYY"
                                    onChange={(date) => setSelectedDate(date)}
                                    disabledDate={(current) => {
                                        return current && current < dayjs().startOf("day")
                                    }}
                                />
                            </Form.Item>
                        </div>
                        <Form.Item name="doctor" label="Bác sĩ" rules={[{ required: true, message: "Vui lòng chọn bác sĩ" }]}>
                            <Select
                                placeholder="Chọn bác sĩ"
                                loading={loadingDoctorBooking}
                                showSearch
                                optionFilterProp="children"
                                allowClear
                                onChange={(value) => { handleDoctorSelect(value) }}
                            >
                                {doctors.map((doctor) => (
                                    <Option key={doctor.id} value={doctor.id}>
                                        <div className="flex items-center justify-between gap-2">
                                            <span>{doctor?.staffUserData?.lastName || ""} {doctor?.staffUserData?.firstName || ""}</span>
                                            <span className="text-gray-500 text-sm">{doctor?.staffDepartmentData?.name || ""}</span>
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item name="timeSlot" label="Khung giờ" rules={[{ required: true, message: "Vui lòng chọn khung giờ" }]}>
                                <Select placeholder="Chọn khung giờ">
                                    {timeSlots.map((slot, index) => (
                                        <Option key={index} value={slot.value}>
                                            <div className="flex items-center justify-between gap-2">
                                                <span>{slot.label}</span>
                                                <span className="text-gray-500 text-sm">{slot.count}</span>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name="priority" label="Đối tượng ưu tiên" rules={[{ required: true, message: "Vui lòng chọn đối tượng ưu tiên" }]}>
                                <Select
                                    placeholder="Chọn đối tượng ưu tiên"
                                    options={listSpecialExamination}
                                />
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="symptom"
                            label="Triệu chứng"
                            rules={[{ required: true, message: "Vui lòng nhập triệu chứng" }]}
                        >
                            <TextArea placeholder="Mô tả triệu chứng của bạn" rows={4} showCount maxLength={500} />
                        </Form.Item>
                    </div>

                </Form>
            </Modal >

            <AddUserModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                handleAddUserSuscess={handleAddUserSuscess}
            />

        </>

    )
}

export default CreateAppointmentModal
