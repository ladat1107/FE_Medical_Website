import { message, Modal } from "antd";
import "./ConfirmModal.scss";
import { useEffect, useState } from "react";
import { TABLE, TIMESLOTS } from "@/constant/value";
import userService from "@/services/userService";
import { formatDate } from "@/utils/formatDate";

const ConfirmModal = (props) => {
    let [messageContent, setMessageContent] = useState("")
    let data = props.data;
    const handleClose = () => {
        props.isShow(false)
    }
    useEffect(() => {
        if (props.table === TABLE.EXAMINATION) {
            if (data?.paymentId) {
                setMessageContent(
                    "Lưu ý: <strong>Bạn đã thanh toán cho lịch hẹn này, xóa lịch hẹn sẽ được hoàn lại 80% số tiền đã thanh toán.</strong> <br />" +
                    "Xác nhận xóa lịch hẹn lúc " + TIMESLOTS[data?.time - 1]?.label +
                    " ngày " + formatDate(data?.admissionDate || new Date()) + " ?"
                );
            }
            else {
                setMessageContent("Xác nhận xóa lịch hẹn lúc " + TIMESLOTS[data?.time - 1]?.label + " ngày " + formatDate(data?.admissionDate || new Date()) + " ?")
            }
        }
    }, [props.data])
    let handleDelete = async () => {
        if (props.table === TABLE.EXAMINATION) {
            let response = await userService.cancelAppoinment(data);
            if (response.EC === 0) {
                susscess(response?.EM)
            } else {
                message.error(response.EM);
            }
        }

    }
    let susscess = (text) => {
        message.success(text);
        props.refresh()
    }
    return (
        <Modal
            title="Xác nhận"
            open={props.show}
            onOk={() => handleDelete()}
            onCancel={() => handleClose()}
            okText="Xác nhận"
            cancelText="Đóng"
            maskClosable={false}
        >
            <div className="p-3" dangerouslySetInnerHTML={{ __html: messageContent }} />
        </Modal>
    )
}

export default ConfirmModal;