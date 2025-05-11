import userService from "@/services/userService";
import "./GetNumber.scss";
import { useMutation } from '@/hooks/useMutation';
import { useEffect, useState } from "react";
import { message } from "antd";
import Loading from "@/components/Loading/Loading";
import { TYPE_NUMBER } from "@/constant/value";
import useSocket from "@/hooks/useSocket";
import { SOCKET } from "@/constant/socket";

const GetNumber = () => {
    let socket = useSocket();
    let [currentNumber, setCurrentNumber] = useState({});
    let [loading, setLoading] = useState(false);
    let {
        data: ticketData,
        execute: fetchTicketData,
    } = useMutation((query) => userService.getTicket());
    useEffect(() => {
        fetchTicketData();
    }, []);

    useEffect(() => {
        if (ticketData?.EC === 0) {
            setLoading(false);
            setCurrentNumber(ticketData.DT[0])
        }
    }, [ticketData]);
    
    useEffect(() => {
        if (!socket) return;
        // Lắng nghe cập nhật số thứ tự từ server
        socket.on(SOCKET.EMIT_UPDATE_TICKET_NEW_DAY, () => {
            fetchTicketData();
        });

        return () => {
            socket.off(SOCKET.EMIT_UPDATE_TICKET_NEW_DAY); // Cleanup
        };
    }, [socket]);
    const handleGeneralNumber = async (type) => {
        setLoading(true);
        let response = await userService.generateNumber({ type });
        if (response?.EC === 0) {
            message.success("Số của bạn là: " + response?.DT)
        } else {
            message.error(response?.EM || "Lỗi lấy số")
        }
        fetchTicketData();
    }
    return (
        <div className="get-number-bg">
            {loading && currentNumber && (
                <div className="loading-overlay">
                    <Loading />
                </div>
            )}
            <div className={`content ${loading ? "disabled" : ""}`}>
                <h1 className="get-number-title">Hệ thống lấy số Bệnh viện Hoa Sen</h1>
                <div className="btn-group">
                    <button className="get-number-btn priority" onClick={() => handleGeneralNumber(TYPE_NUMBER.PRIORITY)}>
                        <div>Lấy số ưu tiên</div>
                        <div>({currentNumber?.priorityNumber})</div>
                    </button>
                    <button className="get-number-btn normal" onClick={() => handleGeneralNumber(TYPE_NUMBER.NORMAL)}>
                        <div>Lấy số thường</div>
                        <div>({currentNumber?.normalNumber})</div>
                    </button>
                </div>
                <img className="bg-hospital" src="https://medpro.vn/_next/image?url=https%3A%2F%2Fcdn.medpro.vn%2Fprod-partner%2Fd53ed2b9-dcae-4509-90be-8ecd11cdc628-dat-kham-co-so.webp&w=1920&q=75" alt="get-number" />

            </div>
        </div>
    )
}

export default GetNumber;