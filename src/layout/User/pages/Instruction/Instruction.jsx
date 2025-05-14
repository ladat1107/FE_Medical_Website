import React from "react";
import { Link } from "react-router-dom";
import Container from "@/components/Container";
const Instruction = () => {
    const data = [
        {
            key: "1",
            role: "Quản trị viên",
            description: "Quản lý toàn bộ hệ thống, bao gồm người dùng và nội dung.",
            email: "admin@gmail.com",
            password: "123456",
        },
        {
            key: "2",
            role: "Bác sĩ",
            description: "Khám bệnh tạo đơn thuốc, tạo đơn cận lâm sàn.",
            email: "doctorTu@gmail.com",
            password: "123456",
        },
        {
            key: "3",
            role: "Bác sĩ CLS",
            description: "Thêm kết quả xét nghiệm.",
            email: "doctorLan@gmail.com",
            password: "123456",
        },
        {
            key: "4",
            role: "Tiếp nhận",
            description: "Quản lý lịch hẹn, tạo phiếu khám bệnh.",
            email: "receptionist1@gmail.com",
            password: "123456",
        },
        {
            key: "5",
            role: "Thanh toán",
            description: "Thanh toán.",
            email: "Test11@gmail.com",
            password: "123456",
        },
        {
            key: "6",
            role: "Dược sĩ",
            description: "Xem đơn thuốc, thanh toán.",
            email: "receptionist@gmail.com",
            password: "123456",
        },
        {
            key: "7",
            role: "Người dùng",
            description: "Sử dụng website.",
            email: "ladat01626362980@gmail.com",
            password: "123456",
        },
    ];

    return (
        <div className="py-16 bg-white">
            <Container>
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-tw mb-2">
                        Các tài khoản đăng nhập vào hệ thống
                    </h1>
                    <p className="text-gray-700 text-sm sm:text-base">
                        Website hiện tại đang được triển khai miễn phí, do đó một số tính năng vẫn còn hạn chế và giao diện <b>chưa hoàn toàn tối ưu</b> trên một số thiết bị. 🖥️📱
                        Chúng tôi đang nỗ lực cải thiện và cập nhật để mang đến trải nghiệm tốt hơn. Rất mong bạn thông cảm và tiếp tục sử dụng!
                    </p>
                    <p className="text-gray-700 text-sm sm:text-base font-bold">
                        Dữ liệu có thể chưa đồng bộ do còn trong quá trình phát triển.
                    </p>
                </div>

                {/* Responsive Table */}
                <div className="overflow-x-auto rounded-lg shadow-md border text-sm">
                    <table className="min-w-full text-left text-gray-700">
                        <thead className="bg-blue-100 text-gray-700 text-sm sm:text-base">
                            <tr>
                                <th className="px-3 py-3 whitespace-nowrap">Vai trò</th>
                                <th className="px-3 py-3 whitespace-nowrap">Email</th>
                                <th className="px-3 py-3 whitespace-nowrap">Mật khẩu</th>
                                <th className="px-3 py-3 whitespace-nowrap">Mô tả</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {data.map((item) => (
                                <tr key={item.key} className="border-t">
                                    <td className="px-3 py-2 font-medium text-gray-900">{item.role}</td>
                                    <td className="px-3 py-2">{item.email}</td>
                                    <td className="px-3 py-2">{item.password}</td>
                                    <td className="px-3 py-2 whitespace-nowrap">{item.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Link GitHub (tuỳ chọn) */}
                <div className="flex flex-col items-end text-sm text-right text-primary-tw mt-4">
                    <Link to="https://github.com/ladat1107/Frontend_Medical_Website_v2.git" target="_blank" rel="noopener noreferrer">
                        Truy cập GitHub Frontend →
                    </Link>
                    <Link to="https://github.com/ladat1107/Backend_Medical_Website.git" target="_blank" rel="noopener noreferrer">
                        Truy cập GitHub Backend →
                    </Link>
                </div>
            </Container>
        </div>
    );
};

export default Instruction;
