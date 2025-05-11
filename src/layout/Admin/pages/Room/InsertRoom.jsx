import { STATUS } from "@/constant/value";
import useQuery from "@/hooks/useQuery";
import { createRoom, getNameDepartment, getServiceSearch, getSpecialtySelect, updateRoom } from "@/services/adminService";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Input, InputNumber, message, Row, Select } from "antd";
import { set } from "lodash";
import { useEffect, useState } from "react";

const InsertRoom = (props) => {
    let [form] = Form.useForm();
    let [departmentChoose, setDepartmentChoose] = useState(null);
    let [minBed, setMinBed] = useState(0);
    let [isLoadingAction, setIsLoadingAction] = useState(false);
    let col = 8;
    let departments = props.departments;
    let [roomUpdate, setRoomUpdate] = useState(props.obUpdate);
    useEffect(() => {
        if (roomUpdate?.id) {
            setMinBed(roomUpdate?.bedRoomData.length);
            let serviceIds = [];
            for (let i = 0; i < roomUpdate.serviceData.length; i++) {
                serviceIds.push(roomUpdate.serviceData[i].id)
            }
            form.setFieldsValue({
                name: roomUpdate.name,
                bedQuantity: roomUpdate?.bedRoomData.length || 0,
                status: roomUpdate.status,
                medicalExamination: roomUpdate?.medicalExamination || null,
                departmentId: roomUpdate.departmentId,
                serviceIds: serviceIds,
            })
            setDepartmentChoose(roomUpdate.departmentId)
        }
    }, [props.obUpdate])
    let handleInsert = () => {
        form.validateFields().then(async (values) => {
            setIsLoadingAction(true);
            let response = null;
            if (roomUpdate?.id) {
                response = await updateRoom({ ...values, oldBed: minBed, newBed: values.bedQuantity, id: roomUpdate.id });
            } else {
                response = await createRoom({ ...values, bedQuantity: values.bedQuantity + "" });
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
        <div className="insert-room-content px-3">
            <div className="content ">
                <div className="first d-flex justify-content-between align-items-center py-1">
                    <div className="text mt-3">{roomUpdate?.id ? "CẬP NHẬT PHÒNG" : "THÊM PHÒNG"}</div>
                    <FontAwesomeIcon className='icon'
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
                        initialValues={{

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
                                    <Input placeholder="Nhập tên khoa" />
                                </Form.Item>
                            </Col>
                            <Col sm={24} lg={col}>
                                <Form.Item
                                    name={"bedQuantity"}
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
                                        min={minBed}
                                        placeholder="Nhập số lượng giường" />
                                </Form.Item>
                            </Col>
                            <Col sm={24} lg={col}>
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
                                        placeholder="Chọn khoa"
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        onChange={(value) => { setDepartmentChoose(value) }}
                                        options={departments}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col sm={24} lg={col}>
                                <Form.Item
                                    name="serviceIds"
                                    label="Các dịch vụ của phòng"
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
                                        options={props?.services}
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            {
                                departmentChoose === 2 &&
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
                            <Col xs={24} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                                <Form.Item>
                                    <Button loading={isLoadingAction} type="primary" htmlType="submit"
                                        style={{ background: "#04a9f3" }}
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