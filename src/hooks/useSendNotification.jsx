import { createNotification, getArrayAdminId, getArrayUserId, sendNotification } from "@/services/doctorService";
import { generateUniqueKey } from "@/utils/UniqueKey";
import { message } from "antd";
import { useSelector } from "react-redux";

const useSendNotification = () => {
    let { user } = useSelector((state) => state.authen);

    const handleSocketNotification = (title, htmlDescription, firstName, lastName, date, attachedFiles, notiCode, receiverIds) => {
        try {
            // Gửi thông báo qua socket với tiêu đề và danh sách người nhận
            sendNotification(title, htmlDescription, firstName, lastName, date, attachedFiles, notiCode, receiverIds);
            console.log('Đã gửi thông báo socket');
        } catch (error) {
            console.error('Lỗi gửi thông báo socket:', error);
        }
    };

    const handleSendNoti = async (title, htmlDescription, attachedFiles, toAdmin, arrayUserId = []) => {
        if (!title) {
            message.warning('Vui lòng nhập tiêu đề thông báo');
            return;
        }

        if (!htmlDescription) {
            message.warning('Vui lòng nhập nội dung thông báo');
            return;
        }


        try {
            let res = null;

            if(arrayUserId.length === 0) {
                if (toAdmin) {
                    res = await getArrayAdminId();
                } else {
                    res = await getArrayUserId();
                }

                if (res && res.EC === 0) {
                    arrayUserId = res.DT.map(user => user.id);
                } else {
                    message.error('Lỗi lấy danh sách người dùng: ' + (res.EM || 'Có lỗi xảy ra'));
                    return;
                }
            }

            const receiverIds = arrayUserId;
            const notiCode = generateUniqueKey(16); // Giả sử bạn có hàm này để tạo mã thông báo duy nhất

            const data = {
                dataNoti: {
                    title: title,
                    htmlDescription: htmlDescription,
                    receiverId: receiverIds.join(','),
                    date: new Date().toISOString(),
                    status: 1
                },
                attachedFiles: attachedFiles,
                notiCode: notiCode, // Giả sử bạn có hàm này để tạo mã thông báo duy nhất
            };

            const response = await createNotification(data);

            const date = new Date().toISOString();
            const firstName = user.firstName || '';
            const lastName = user.lastName || '';

            if (response.EC === 0) {
                message.success('Thông báo đã được gửi thành công');

                // Sau khi lưu thành công vào database, gửi thông báo qua socket
                handleSocketNotification(title, htmlDescription, firstName, lastName, date, attachedFiles, notiCode, receiverIds);
            } else {
                message.error('Lỗi gửi thông báo: ' + (response.DT || 'Có lỗi xảy ra'));
            }
        } catch (error) {
            console.error('Chi tiết lỗi:', error);
            message.error('Lỗi gửi thông báo: ' + (error.message || 'Có lỗi xảy ra'));
        }
    }

    return {
        handleSendNoti
    };
}

export default useSendNotification;
