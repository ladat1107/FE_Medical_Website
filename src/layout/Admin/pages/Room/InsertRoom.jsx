import { DEPARTMENT, STATUS, TYPE_ROOM } from "@/constant/value";
import { createRoom, updateRoom } from "@/services/adminService";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Input, InputNumber, message, Row, Select } from "antd";
import { useEffect, useState } from "react";
const typeArray = Object.values(TYPE_ROOM);

const InsertRoom = (props) => {
    let [form] = Form.useForm();
    let [isLoadingAction, setIsLoadingAction] = useState(false);
    let col = 8;
    let departments = props.departments;
    let [roomUpdate, setRoomUpdate] = useState(props.obUpdate);
    const [typeRoom, setTypeRoom] = useState(null);
    useEffect(() => {
        if (roomUpdate?.id) {
            let serviceIds = [];
            let _typeRoom = null;

            for (let i = 0; i < roomUpdate.serviceData.length; i++) {
                if (typeArray.includes(roomUpdate.serviceData[i].id)) {
                    _typeRoom = roomUpdate.serviceData[i].id
                } else {
                    serviceIds.push(roomUpdate.serviceData[i].id)
                }
            }
            form.setFieldsValue({
                name: roomUpdate.name,
                capacity: roomUpdate?.capacity || 0,
                status: roomUpdate.status,
                medicalExamination: roomUpdate?.medicalExamination || null,
                departmentId: roomUpdate.departmentId,
                typeRoom: _typeRoom,
                serviceIds: serviceIds,
            })
            setTypeRoom(_typeRoom)
        }
    }, [props.obUpdate])
    useEffect(() => {
        if (typeRoom === TYPE_ROOM.CLINIC) {
            form.setFieldsValue({
                departmentId: DEPARTMENT.CLINIC
            })
        } else if (typeRoom === TYPE_ROOM.EMERGENCY) {
            form.setFieldsValue({
                departmentId: DEPARTMENT.EMERGENCY
            })
        }
    }, [typeRoom])
    let handleInsert = () => {
        form.validateFields().then(async (values) => {
            setIsLoadingAction(true);
            let response = null;
            let ids = values?.serviceIds || [];
            ids.push(values.typeRoom)
            let data = {
                ...values,
                capacity: values?.capacity ? values.capacity + "" : "0",
                serviceIds: ids,
            }
            if (roomUpdate?.id) {
                response = await updateRoom({ ...data, id: roomUpdate.id });
            } else {
                response = await createRoom(data);
            }
            if (response?.EC === 0) {
                message.success(response.EM || "Thành công");
                handleCloseInsert();
            }
            else {
                message.error(response.EM || "Thất bại");
            }
        }).catch((error) => {
            console.log("error,", error)
        }).finally(() => {
            setIsLoadingAction(false);
        })
    }
    const handleCloseInsert = () => {
        form.resetFields()
        props.handleShowInsert(false)
        props.refresh();
    }
    return (
        <div className="px-3 bg-white rounded-bg-admin shadow-table-admin mb-4">
            <div className="w-full">
                <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <div className="text-base font-bold text-primary-tw mt-3">{roomUpdate?.id ? "CẬP NHẬT PHÒNG" : "THÊM PHÒNG"}</div>
                    <FontAwesomeIcon
                        className="text-primary-tw hover:scale-105 cursor-pointer"
                        onClick={() => { handleCloseInsert() }}
                        icon={faXmark} size="xl" />
                </div>

                <div className="mt-3">
                    <Form
                        layout={'horizontal'}
                        form={form}
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                        style={{
                            maxWidth: "100%",
                        }}
                    >
                        <Row gutter={[16, 8]}>
                            <Col sm={24} lg={col}>
                                <Form.Item
                                    name={"name"}
                                    label="Tên phòng"
                                    rules={[{
                                        required: true,
                                        message: 'Vui lòng nhập tên phòng!',
                                    }]}>
                                    <Input placeholder="Nhập tên phòng" />
                                </Form.Item>
                            </Col>
                            <Col sm={24} lg={col}>
                                <Form.Item
                                    name="typeRoom"
                                    label="Loại phòng"
                                    rules={[{ required: true, message: 'Vui lòng chọn loại phòng!' }]}>
                                    <Select
                                        placeholder="Chọn loại phòng"
                                        showSearch
                                        optionFilterProp="label"
                                        onChange={(value) => { setTypeRoom(value) }}
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={props?.typeRoom || []}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col sm={24} lg={col}>
                                <Form.Item
                                    name="departmentId"
                                    label="Khoa"
                                    rules={[{ required: true, message: 'Vui lòng chọn khoa!' }]}
                                >
                                    <Select
                                        placeholder="Chọn khoa"
                                        showSearch
                                        disabled={typeRoom === TYPE_ROOM.CLINIC || typeRoom === TYPE_ROOM.EMERGENCY}
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={departments}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            {(typeRoom === TYPE_ROOM.EMERGENCY || typeRoom === TYPE_ROOM.INPATIENT_NORMAL || typeRoom === TYPE_ROOM.INPATIENT_VIP) &&
                                <Col sm={24} lg={col}>
                                    <Form.Item
                                        name={"capacity"}
                                        label="Số lượng giường"

                                        rules={[{
                                            required: true,
                                            message: 'Vui lòng nhập số lượng giường!',
                                        },
                                        {
                                            pattern: /^[0-9]*$/g,
                                            message: 'Vui lòng nhập số!',
                                        },
                                        ]}>

                                        <InputNumber
                                            style={{ width: "100%" }}
                                            min={roomUpdate?.examinationRoomData?.length || 0}
                                            placeholder="Nhập số lượng giường" />
                                    </Form.Item>
                                </Col>
                            }
                            {typeRoom === TYPE_ROOM.LABORATORY &&
                                <Col sm={24} lg={col}>
                                    <Form.Item
                                        name="serviceIds"
                                        label="Các dịch vụ của phòng"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn loại dịch vụ!',
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Chọn dịch vụ"
                                            showSearch
                                            mode="multiple"
                                            optionFilterProp="label"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={props?.paraclinical || []}
                                        >
                                        </Select>
                                    </Form.Item>
                                </Col>
                            }
                            {typeRoom === TYPE_ROOM.CLINIC &&
                                <Col xs={24} lg={col}>
                                    <Form.Item
                                        name="medicalExamination"
                                        label="Chọn chuyên khoa"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn chuyên khoa!',
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Chọn chuyên khoa"
                                            showSearch
                                            optionFilterProp="label"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={props?.specialty}
                                        >
                                        </Select>
                                    </Form.Item>
                                </Col>
                            }
                            {roomUpdate?.id &&
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
                                    </Form.Item>
                                </Col>
                            }
                            <Col xs={24} className="flex justify-end">
                                <Form.Item>
                                    <Button loading={isLoadingAction} type="primary" htmlType="submit"
                                        className="bg-primary-tw hover:!bg-primary-tw-light"
                                        onClick={() => { handleInsert() }}>{roomUpdate?.id ? "Cập nhật" : "Thêm"}</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </div>
    );
}
export default InsertRoom;