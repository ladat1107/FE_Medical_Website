import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    const maxDate = dayjs(data?.length > 0 ? data[data.length - 1] : dayjs());
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
                    className={`text-center cursor-pointer py-4 px-0 lg:!px-4 font-semibold ${isAvailable ? "" : "text-gray-400 pointer-events-none"} ${selectedDate === dateStr ? "flex justify-center items-center" : ""}`}
                    onClick={() => isAvailable && handleDateClick(dateStr)}
                >
                    {selectedDate === dateStr ?
                        <span className="bg-primary-tw rounded text-white w-3/5 h-full flex items-center justify-center">
                            {day.date()}
                        </span> :
                        <span>{day.date()}</span>
                    }
                </div>
            );
        });
    };

    const renderTimeSlots = () => {
        if (!selectedDate) return null;
        const schedule = listSchedule.find((item) => item.date === selectedDate);

        return (
            <div className="mt-8">
                {schedule?.times.map((slot, idx) => (
                    <div
                        key={idx}
                        className="inline-block mr-2 mb-2 px-4 py-2 border border-primary-tw rounded cursor-pointer hover:bg-primary-tw hover:text-white transition-colors"
                        onClick={() => props.next({ date: schedule.date, room: schedule.room, time: slot })}>
                        {slot.label}
                    </div>
                ))}
            </div>
        );
    };
    return (
        <div>
            <div className="relative bg-gradient-primary text-white text-center text-lg font-bold py-2 px-4 rounded-t-lg mb-2">
                <FontAwesomeIcon className='absolute top-[15px] left-[25px] cursor-pointer' icon={faLeftLong} onClick={() => { props.back() }} />
                Vui lòng chọn ngày khám
            </div>
            <div className='p-4 min-h-[500px]'>
                <div className="flex justify-center items-center w-full mb-4 text-lg font-semibold text-primary-tw gap-4">
                    <FontAwesomeIcon
                        className="cursor-pointer"
                        icon={faCircleLeft}
                        color={currentMonth.isAfter(minDate, "month") ? primaryColorHome : "lightgray"}
                        onClick={() => currentMonth.isAfter(minDate, "month") && handleMonthChange("back")}
                    />
                    <span>THÁNG {currentMonth.format("MM-YYYY")}</span>
                    <FontAwesomeIcon
                        className="cursor-pointer"
                        icon={faCircleRight}
                        color={currentMonth.isBefore(maxDate, "month") ? primaryColorHome : "lightgray"}
                        onClick={() => currentMonth.isBefore(maxDate, "month") && handleMonthChange("next")}
                    />
                </div>
                <div className="grid grid-cols-7">{renderCalendar()}</div>
                {renderTimeSlots()}
            </div>
        </div>
    );
}

export default BookingCalendar;