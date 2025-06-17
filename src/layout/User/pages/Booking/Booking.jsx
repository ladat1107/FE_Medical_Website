import Container from "@/components/Container";
import BookingInformation from "./BookingInformation";
import BookingContent from "./BookingContent/BookingContent";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/constant/path";
import { message } from "antd";

const Booking = () => {
    let { user } = useSelector(state => state.authen);
    let navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate(PATHS.HOME.LOGIN);
            message.info("Vui lòng đăng nhập để đặt lịch hẹn");
        }
    }, []);

    return (
        <div className="bg-bgHomePage py-8">
            <Container>
                <div className="flex flex-wrap items-start">
                    <div className="w-full lg:w-1/4 py-2 pr-0 lg:pr-3">
                        <BookingInformation />
                    </div>
                    <div className="w-full lg:w-3/4 py-2 pl-0 lg:pl-2">
                        <BookingContent />
                    </div>
                </div>
            </Container>
        </div>
    );
}

export default Booking;