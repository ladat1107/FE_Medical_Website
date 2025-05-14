import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ScheduleManage.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Col, DatePicker, Form, Input, message, Row } from "antd";
import dayjs from "dayjs";
import { primaryColorAdmin } from "@/styles//variables";
import { arrangeSchedule } from "@/services/adminService";
import useSendNotification from "@/hooks/useSendNotification";
import { FRONTEND_URL } from "@/constant/environment";
const ArrangeSchedule = (props) => {
    let [form] = Form.useForm();
    let { handleSendNoti } = useSendNotification();

    let handleArrangeSchedule = () => {
        form.validateFields().then(async (values) => {
            let response = await arrangeSchedule(values);
            if (response.EC === 0) {
                message.success("Xếp lịch thành công!");
                props.refresh();

                handleSendNoti(
                    `📆 Thông báo lịch trực`,
                    `<p>
                        <span style="color: rgb(234, 195, 148); font-weight: bold;">✨ Lịch trực ✨</span> 
                        Đã có thông tin về lịch trực mới! Các bác sĩ xem thông tin và thực hiện tại  
                        👉 <a href="${FRONTEND_URL}/doctorSchedule" rel="noopener noreferrer" target="_blank" style="color: #007bff; font-weight: bold;">Xem lịch trực</a>
                    </p>`,
                    [],
                    false,
                    [...new Set(
                        response.DT.schedule
                            .map(item => item?.staffScheduleData?.staffUserData?.id)
                            .filter(id => id !== undefined)
                    )] // Chỉ lấy id của người nhận thông báo
                )
            } else {
                message.error(response.EM);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
    return (
        <div className="insert-schedule-content px-3">
            <div className="content p-2">
                <div className="first d-flex justify-content-between align-items-center py-1">
                    <div className="text mt-2">Xếp lịch trực bệnh viện</div>
                    <FontAwesomeIcon className='icon'
                        onClick={() => { props.onClose() }}
                        icon={faXmark} size="xl" />
                </div>
                <div className="mt-3">
                    <Form
                        layout={'horizontal'}
                        form={form}
                        labelCol={{ span: 24, }}
                        wrapperCol={{ span: 24, }}
                        initialValues={{
                            startDate: dayjs(),
                            doctorNedeed: 1,
                            nurseNedeed: 1,
                        }}
                        style={{ maxWidth: "100%" }}
                    >
                        <Row >
                            <Col sm={12} >
                                <Form.Item
                                    name={"startDate"}
                                    label="Ngày bắt đầu xếp lịch"
                                    rules={[{
                                        required: true,
                                        message: 'Vui chọn ngày bắt đầu xếp lịch!',
                                    }]}>
                                    <DatePicker
                                        allowClear={false}
                                        minDate={dayjs()}
                                        placeholder="Chọn ngày bắt đầu xếp lịch"
                                        format={'DD/MM/YYYY'} style={{ width: "60%" }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[24, 8]}>
                            <Col sm={12}>
                                <Form.Item
                                    name={"doctorNedeed"}
                                    label="Số lượng bác sĩ cho mỗi phòng trực"
                                    rules={[{
                                        required: true,
                                        message: 'Vui lòng nhập số lượng!',
                                    },
                                    {
                                        pattern: /^[0-9]*$/g,
                                        message: 'Vui lòng nhập số!',
                                    },
                                    ]}>
                                    <Input placeholder="Nhập số lượng bác sĩ" min={1} />
                                </Form.Item>
                            </Col>
                            <Col sm={12} >
                                <Form.Item
                                    name="nurseNedeed"
                                    label="Số lượng điều dưỡng cho mỗi phòng trực"
                                    rules={[{
                                        required: true,
                                        message: 'Vui lòng nhập số lượng!',
                                    },
                                    {
                                        pattern: /^[0-9]*$/g,
                                        message: 'Vui lòng nhập số!',
                                    },
                                    ]}
                                >
                                    <Input placeholder="Nhập số lượng điều dưỡng" min={1} />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
                                <div className="flex flex-col text-start ">
                                    <div className="text-red-500 text-base font-bold">Lưu ý:</div>
                                    <div className="ps-2 text-secondaryText-tw">
                                        - Khi nhấn <b>Xếp lịch</b> sẽ cập nhật lịch trực cho 30 ngày kể từ ngày bạn chọn bắt đầu.
                                    </div>
                                    <div className="ps-2 text-secondaryText-tw">
                                        - Ngày bắt đầu xếp lịch phải là ngày hiện tại hoặc sau đó.
                                        Việc xếp lịch cho ngày đã có lịch trực sẽ có thể xảy ra lỗi dữ liệu!</div>
                                    <div className="ps-2 text-secondaryText-tw">
                                        - Số lượng bác sĩ và điều dưỡng có thể không đáp ứng được số lượng bạn nhập. Bạn có thể điều chỉnh cụ thể trong bảng lịch trực.
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                                <Form.Item>
                                    <Button type="primary" htmlType="submit"
                                        style={{ background: primaryColorAdmin }}
                                        onClick={() => { handleArrangeSchedule() }}>Xếp lịch</Button>
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </div>
            </div>
        </div>
    );
}
export default ArrangeSchedule;