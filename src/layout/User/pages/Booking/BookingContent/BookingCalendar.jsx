import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Booking.scss";
import { faCircleLeft, faCircleRight, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import userService from "@/services/userService";
import { useMutation } from "@/hooks/useMutation";
import { primaryColorHome } from "@/styles//variables";
import { TIMESLOTS } from "@/constant/value";

const BookingCalendar = (props) => {
    let data = props?.doctor?.staffScheduleData.map(item => dayjs(item.date).format("YYYY-MM-DD"));
    const minDate = dayjs(); // Hôm nay
    const maxDate = dayjs(data[data.length - 1]);
    let [listSchedule, setListSchedule] = useState([]);
    const {
        data: dataSchedule,
        loading: loadingSchedule,
        execute: fetchSchedule,
    } = useMutation(() => userService.getScheduleApoinment({ date: data }));

    useEffect(() => {
        if (dataSchedule) {
            let _list = dataSchedule?.DT || [];
            let _listDate = props?.doctor?.staffScheduleData?.map(date => {
                let _schedules = _list.filter(item => item.date === dayjs(date.date).format("YYYY-MM-DD"));
                // console.log(date);
                return {
                    date: dayjs(date.date).format("YYYY-MM-DD"),
                    room: { id: date?.roomId, name: date?.scheduleRoomData?.name },
                    times: TIMESLOTS.map(item => {
                        // Kiểm tra nếu có bất kỳ _schedule nào trùng time và count >= 6
                        const isTimeUnavailable = _schedules.some(schedule =>
                            schedule.time === item.value && schedule.count >= 6
                        );

                        // Nếu thời gian không hợp lệ, trả về null, ngược lại trả về label
                        return isTimeUnavailable ? null : item;
                    }).filter(time => time !== null), // Lọc bỏ các giá trị null
                }
            });
            setListSchedule(_listDate);
        }
    }, [dataSchedule]);
    useEffect(() => {
        fetchSchedule();
    }, []);
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const handleMonthChange = (direction) => {
        setCurrentMonth((prev) => {
            setSelectedDate(null);
            if (direction === "next" && prev.isBefore(maxDate, "month")) {
                return prev.add(1, "month");
            } else if (direction === "back" && prev.isAfter(minDate, "month")) {
                return prev.subtract(1, "month");
            }
            return prev; // Không thay đổi nếu vượt giới hạn
        });
    };

    const renderCalendar = () => {
        const startOfMonth = currentMonth.startOf("month");
        const endOfMonth = currentMonth.endOf("month");
        const lastDateOfMonth = endOfMonth.date();

        // Tạo danh sách ngày từ đầu tháng đến ngày lớn nhất trong tháng
        const daysInMonth = Array.from(
            { length: lastDateOfMonth },
            (_, i) => startOfMonth.add(i, "day")
        );

        return daysInMonth.map((day) => {
            const dateStr = day.format("YYYY-MM-DD");
            const isAvailable = listSchedule.some((item) => item.date === dateStr);

            return (
                <div
                    key={dateStr}
                    className={`day ${isAvailable ? "" : "disabled"} ${selectedDate === dateStr ? "active" : ""
                        }`}
                    onClick={() => isAvailable && handleDateClick(dateStr)}
                >
                    <span>{day.date()}</span>
                </div>
            );
        });
    };

    const renderTimeSlots = () => {
        if (!selectedDate) return null;
        const schedule = listSchedule.find((item) => item.date === selectedDate);

        return (
            <div className="time-slots">
                {schedule?.times.map((slot, idx) => (
                    <div key={idx} className="slot" onClick={() => props.next({ date: schedule.date, room: schedule.room, time: slot })}>
                        {slot.label}
                    </div>
                ))
                }
            </div >
        );
    };
    return (
        <div>
            <div className="header" >
                <FontAwesomeIcon className='icon-back' icon={faLeftLong} onClick={() => { props.back() }} />
                Vui lòng chọn ngày khám
            </div>
            <div className='content'>
                <div className="month-booking">
                    <FontAwesomeIcon className="icon"
                        icon={faCircleLeft}
                        color={currentMonth.isAfter(minDate, "month") ? primaryColorHome : "lightgray"}
                        onClick={() => currentMonth.isAfter(minDate, "month") && handleMonthChange("back")}
                    />
                    <span>THÁNG {currentMonth.format("MM-YYYY")}</span>
                    <FontAwesomeIcon className="icon"
                        icon={faCircleRight}
                        color={currentMonth.isBefore(maxDate, "month") ? primaryColorHome : "lightgray"}
                        onClick={() => currentMonth.isBefore(maxDate, "month") && handleMonthChange("next")}
                    />
                </div>
                <div className="days">{renderCalendar()}</div>
                {renderTimeSlots()}
            </div>
        </div >
    );
}

export default BookingCalendar;