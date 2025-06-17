import Loading from "@/components/Loading/Loading";
import { useEffect, useState } from "react";
import userService from "@/services/userService";
import { useMutation } from "@/hooks/useMutation";
import socket from '@/Socket/socket'
import "./Numerical.scss";

const Numerical = () => {
    const [currentNumber, setCurrentNumber] = useState({});
    const [loading, setLoading] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);

    // Setup data fetching
    const {
        data: ticketData,
        execute: fetchTicketData,
        loading: fetchLoading
    } = useMutation((query) => userService.getTicket());

    // Kết nối socket và thiết lập listeners
    useEffect(() => {
        fetchTicketData();
    }, []);

    useEffect(() => {
        if (ticketData) {
            setCurrentNumber(ticketData?.DT[0]);
        }
    }, [ticketData]);

    useEffect(() => {
        const handleNumber = (ticket) => {
            setCurrentNumber(ticket);
        }

        socket.on("updateTicket", handleNumber)
        return () => {
            socket.off("updateTicket", handleNumber)
        }
    }, [ticketData]);


    return (
        <div className="get-number-bg2">
            {loading && (
                <div className="loading-overlay">
                    <Loading />
                </div>
            )}
            <div className={`content ${loading ? "disabled" : ""} d-flex flex-column justify-content-center align-items-center`}>
                <h1 className="get-number-title d-flex">Số thứ tự khám bệnh</h1>
                
                <div className="flip-card-container" onClick={() => { setIsFlipping(!isFlipping) }}>
                    <div className={`flip-card ${isFlipping ? 'flipped' : ''}`}>
                        {/* Mặt hiển thị số ưu tiên */}
                        <div className="flip-card-front">
                            <div className="card-content d-flex flex-column align-items-center justify-content-center w-100 h-100">
                                <div className="number-label">Số ưu tiên</div>
                                <div className="d-flex flex-row align-items-end" style={{color: "#08A476"}}>
                                    <div className="big-num ms-3">{currentNumber?.priorityNumberCurrent || 0}</div>
                                    <div className="ms-1 small-num">/{currentNumber?.priorityNumber || 0}</div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Mặt hiển thị số thường */}
                        <div className="flip-card-back">
                            <div className="card-content d-flex flex-column align-items-center justify-content-center w-100 h-100">
                                <div className="number-label">Số thường</div>
                                <div className="d-flex flex-row align-items-end" style={{color: "#0077F9"}}>
                                    <div className="big-num ms-3">{currentNumber?.normalNumberCurrent || 0}</div>
                                    <div className="ms-1 small-num">/{currentNumber?.normalNumber || 0}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flip-button-container" onClick={() => { setIsFlipping(!isFlipping) }}>
                    <div className={`flip-button ${isFlipping ? 'flipped' : ''}`}>
                        <div className="flip-button-front">
                            Xem STT thường
                        </div>
                        <div className="flip-button-back">
                            Xem STT ưu tiên
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Numerical;