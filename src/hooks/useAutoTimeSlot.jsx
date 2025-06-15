import { useEffect, useState } from "react";

const useAutoTimeSlot = () => {
    const [time, setTime] = useState(null);

    // Hàm tính toán timeslot dựa trên giờ hiện tại
    const getCurrentTimeSlot = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Chuyển đổi thời gian hiện tại thành phút từ 00:00
        const currentMinutes = hours * 60 + minutes;
        
        // Thời gian bắt đầu: 7:00 = 420 phút
        const startTime = 7 * 60; // 7:00
        const endTime = 17 * 60;   // 17:00
        
        //Nếu chưa đến 7:00 hoặc sau 17:00 thì return null
        if (currentMinutes < startTime || currentMinutes >= endTime) {
            return null;
        }
        
        // Tính toán slot (mỗi slot = 30 phút)
        const slotIndex = Math.floor((currentMinutes - startTime) / 30);
        
        // Return value tương ứng (bắt đầu từ 1)
        return slotIndex + 1;
    };

    // Effect để set initial value và setup interval
    useEffect(() => {
        // Set giá trị ban đầu
        const initialSlot = getCurrentTimeSlot();
        setTime(initialSlot);

        // Setup interval để check mỗi phút
        const interval = setInterval(() => {
            const currentSlot = getCurrentTimeSlot();
            setTime(prevTime => {
                // Chỉ update nếu slot thay đổi
                if (prevTime !== currentSlot) {
                    console.log(`Auto switched to timeslot: ${currentSlot}`);
                    return currentSlot;
                }
                return prevTime;
            });
        }, 60000); // Check mỗi phút

        return () => clearInterval(interval);
    }, []);

    const handleTimeChange = (value) => {
        setTime(value);
    };

    return {
        time,
        setTime: handleTimeChange,
        getCurrentTimeSlot
    };
};

export default useAutoTimeSlot;