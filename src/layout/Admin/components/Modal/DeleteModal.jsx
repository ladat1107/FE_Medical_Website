import { TABLE } from '@/constant/value';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { deleteUser, blockUser, deleteDepartment, blockDepartment, deleteServiceOfRoom, blockServiceOfRoom, deleteRoom, blockRoom, deleteSpecialty, blockSpecialty, deleteMedicine, blockMedicine } from "@/services/adminService";
import { Button, message, Modal } from "antd";
import { primaryColorAdmin } from '@/styles//variables';

const DeleteModal = (props) => {
    let [messageContent, setMessageContent] = useState("")
    let [isLoadingBlock, setIsLoadingBlock] = useState(false)
    let [isLoadingDelete, setIsLoadingDelete] = useState(false)
    let data = props.data;
    const handleClose = () => { props.isShow(false) }
    useEffect(() => {
        if (props.table === TABLE.USER) {
            setMessageContent("Xác nhận xóa người dùng " + data.lastName + " " + data.firstName + "?")
        } else if (props.table === TABLE.DEPARTMENT) {
            setMessageContent("Xác nhận xóa khoa " + data.name + "?")
        } else if (props.table === TABLE.SERVICE) {
            setMessageContent("Xác nhận xóa " + data.name + "?")
        } else if (props.table === TABLE.ROOM) {
            setMessageContent("Xác nhận xóa phòng " + data.name + "?")
        } else if (props.table === TABLE.SPECIALTY) {
            setMessageContent("Xác nhận xóa chuyên khoa " + data.name + "?")
        } else if (props.table === TABLE.MEDICINE) {
            setMessageContent("Xác nhận xóa thuốc " + data.name + "?")
        }
    }, [props.data])
    const handleDelete = async () => {
        setIsLoadingDelete(true)
        if (props.table === TABLE.USER) {
            let response = await deleteUser(data);
            notify(response);
        }
        else if (props.table === TABLE.DEPARTMENT) {
            let response = await deleteDepartment(data);
            notify(response);
        }
        else if (props.table === TABLE.SERVICE) {
            let response = await deleteServiceOfRoom(data);
            notify(response);
        } else if (props.table === TABLE.ROOM) {
            let response = await deleteRoom(data);
            notify(response);
        } else if (props.table === TABLE.SPECIALTY) {
            let response = await deleteSpecialty(data);
            notify(response);
        } else if (props.table === TABLE.MEDICINE) {
            let response = await deleteMedicine(data);
            notify(response);
        }
        setIsLoadingDelete(false)
    }
    const handleLock = async () => {
        setIsLoadingBlock(true)
        if (props.table === TABLE.USER) {
            let response = await blockUser(data);
            notify(response);
        }
        else if (props.table === TABLE.DEPARTMENT) {
            let response = await blockDepartment(data);
            notify(response);
        } else if (props.table === TABLE.SERVICE) {
            let response = await blockServiceOfRoom(data);
            notify(response);
        } else if (props.table === TABLE.ROOM) {
            let response = await blockRoom(data);
            notify(response);
        } else if (props.table === TABLE.SPECIALTY) {
            let response = await blockSpecialty(data);
            notify(response);
        } else if (props.table === TABLE.MEDICINE) {
            let response = await blockMedicine(data);
            notify(response);
        }
        setIsLoadingBlock(false)
    }
    const notify = (response) => {
        setIsLoadingBlock(false)
        setIsLoadingDelete(false)
        if (response?.EC === 0) {
            message.success(response?.EM || "Thành công");
            props.isShow(false)
            props.refresh()
        } else {
            message.error(response?.EM || "Thất bại");
        }
    }
    return (
        <>
            <Modal
                title={"Xác nhận"}
                open={props.show}
                onCancel={handleClose}
                maskClosable={false} // Ngăn đóng modal khi bấm bên ngoài
                footer={[
                    <Button disabled={isLoadingBlock || isLoadingDelete} key="cancel" onClick={() => handleClose()}>
                        Hủy
                    </Button>,
                    <Button disabled={isLoadingBlock || isLoadingDelete} loading={isLoadingBlock} key="submit" style={{ background: primaryColorAdmin, color: "#ffffff", border: "none" }} onClick={() => handleLock()}>
                        Khóa
                    </Button>,
                    <Button disabled={isLoadingBlock || isLoadingDelete} loading={isLoadingDelete} key="submit" style={{ background: "#f5222d", color: "#ffffff", border: "none" }} onClick={() => handleDelete()}>
                        Xóa
                    </Button>,
                ]}
            >
                <div className='px-3 pt-3'>
                    <p> {messageContent}</p>
                </div>
            </Modal>
        </>
    );
};

export default DeleteModal;