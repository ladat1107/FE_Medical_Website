
import { Modal, Form, Select, message, Button } from 'antd';

import { formatDate } from "@/utils/formatDate";
import { ROLE } from '@/constant/role';
import { useEffect, useState } from 'react';
import { createSchedule } from '@/services/adminService';
import "./Modal.scss";
import useSendNotification from '@/hooks/useSendNotification';
import { FRONTEND_URL } from '@/constant/environment';

const ScheduleModal = (props) => {
    let date = formatDate(props?.data?.date);
    let roomName = props?.data?.roomName;
    let listStaff = props.data.departmentId === 2 ? props?.data?.listStaff : props?.data?.listStaff?.roomDepartmentData?.staffDepartmentData
    let listStaffOnSchedule = props?.data?.schedule;
    let [listDoctor, setListDoctor] = useState([]);
    let [listNurse, setListNurse] = useState([]);
    let [errorText, setErrorText] = useState('');
    let { handleSendNoti } = useSendNotification();

    useEffect(() => {
        let _listDoctor = [];
        let _listNurse = [];
        if (listStaff?.length > 0) {
            listStaff?.forEach((staff) => {
                if (staff.staffUserData.roleId === ROLE.DOCTOR) {
                    _listDoctor.push({ label: `${staff.staffUserData.lastName} ${staff.staffUserData.firstName}`, value: +staff.id });
                }
                if (staff.staffUserData.roleId === ROLE.NURSE) {
                    _listNurse.push({ label: `${staff.staffUserData.lastName} ${staff.staffUserData.firstName}`, value: +staff.id });
                }
            });
            setListDoctor(_listDoctor);
            setListNurse(_listNurse);
        }
        let arrDoctor = [];
        let arrNurse = [];
        if (listStaffOnSchedule?.length > 0) {
            listStaffOnSchedule?.forEach((staff) => {
                if (staff.staffScheduleData.staffUserData.roleId === ROLE.DOCTOR) {
                    arrDoctor.push(+staff.staffId);
                }
                if (staff.staffScheduleData.staffUserData.roleId === ROLE.NURSE) {
                    arrNurse.push(+staff.staffId);
                }
            });
        }
        form.setFieldsValue({
            doctorId: arrDoctor,
            nurseId: arrNurse
        });
    }, []);
    const [form] = Form.useForm();
    const handleAdd = () => {
        form.validateFields().then(async (values) => {
            let data = [];
            values.doctorId.forEach((doctorId) => {
                data.push({
                    roomId: props.data.roomId,
                    date: props.data.date,
                    staffId: doctorId,
                });
            });
            values.nurseId.forEach((nurseId) => {
                data.push({
                    roomId: props.data.roomId,
                    date: props.data.date,
                    staffId: nurseId,
                });
            });
            let response = await createSchedule(data);
            if (response.EC === 0) {
                message.success(response.EM)
                handleClose();
                props.refresh();

                handleSendNoti(
                    `📆 Thông báo lịch trực`,
                    `<p>
                        <span style="color: rgb(234, 195, 148); font-weight: bold;">✨ Lịch trực ✨</span> 
                        Đã có thông báo về lịch trực mới! Các bác sĩ xem thông tin và thực hiện tại  
                        👉 <a href="${FRONTEND_URL}/doctorSchedule" rel="noopener noreferrer" target="_blank" style="color: #007bff; font-weight: bold;">Xem lịch trực</a>
                    </p>`,
                    [],
                    false,
                    response.DT.map((item) => item?.staffScheduleData?.staffUserData?.id) // Chỉ lấy id của người nhận thông báo
                )

            } else if (response.EC === 2) {
                setErrorText(response.EM);
            } else {
                message.error(response.EM)
            }
        }).catch((info) => {
            message.info('Vui lòng chọn bác sĩ và điều dưỡng');
            console.log('Validate Failed:', info);
        });
    };
    const handleClose = () => {
        setErrorText('');
        form.resetFields();
        props.closeModal()
    }
    return (
        <Modal
            name="scheduleModal"
            title={<span>Thêm lịch trực</span>}
            open={props.open}
            onCancel={() => handleClose()}
            footer={[
                <Button key="cancel" onClick={() => handleClose()}>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={() => handleAdd()}>
                    Cập nhật lịch trực
                </Button>,
            ]}
            maskClosable={false}
        >
            <Form
                className='px-3'
                form={form}
                labelCol={{
                    span: 24,
                }}
                wrapperCol={{
                    span: 24,
                }}
                initialValues={{
                    doctorId: [],
                    nurseId: []
                }}
                onFinish={() => handleAdd()}>
                <Form.Item className='mt-4' name="roomId">
                    <>
                        <div><b>{roomName}</b></div>
                        <div style={{ color: 'gray', fontSize: "0.9em" }}> Ngày: {date}</div>
                        {errorText && <div style={{ color: 'red' }}>{errorText}</div>}
                    </>
                </Form.Item>
                <Form.Item name="doctorId" label="Bác sĩ">
                    <Select
                        mode="multiple"
                        onChange={() => setErrorText('')}
                        options={listDoctor} />
                </Form.Item>
                <Form.Item name="nurseId" label="Điều dưỡng">
                    <Select
                        mode="multiple"
                        onChange={() => setErrorText('')}
                        options={listNurse} />
                </Form.Item>
            </Form>
        </Modal >
    )
}
export default ScheduleModal;