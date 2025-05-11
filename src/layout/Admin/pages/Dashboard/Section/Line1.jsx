import { STATUS_BE } from "@/constant/value";
import IconCircle from "@/layout/Admin/components/IconCircle/IconCircle";
import { getStatisticalAppoinment } from "@/services/adminService";
import { faHourglassHalf, faSyringe, faThumbsUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { forEach, set } from "lodash";
import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { name } from "dayjs/locale/vi";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const SectionLine1 = () => {
    let [examination, setExamination] = useState({
        success: 0, processing: 0, waiting: 0, cancel: 0, all: 0
    });
    let [medicine, setMedicine] = useState({
        name: [], quantity: []
    });
    useEffect(() => {
        fetchExampination();
    }, [])
    let fetchExampination = async () => {
        let respone = await getStatisticalAppoinment();
        if (respone?.EC === 0) {
            let appoinment = respone?.DT?.appoinment;
            let success = 0, processing = 0, waiting = 0, cancel = 0;
            forEach(appoinment, (item) => {
                if (item.status === STATUS_BE.DONE) success++;
                else if (item.status === STATUS_BE.WAITING) waiting++;
                else if (item.status === STATUS_BE.INACTIVE) cancel++;
                else processing++;
            })
            setExamination({ success, processing, waiting, cancel, all: appoinment.length });

            let medicine = respone?.DT?.medicine;
            let name = [], quantity = [];
            forEach(medicine, (item) => {
                name.push(item.name);
                let quantityItem = 0;
                item?.prescriptionData?.forEach((item) => {
                    quantityItem += item.PrescriptionDetail.quantity;
                    ;
                })
                quantity.push(quantityItem);
            })
            setMedicine({ name, quantity });
        }
    }
    const data = {
        labels: medicine?.name, // Tên thuốc
        datasets: [
            {
                label: 'Số lượng đã sử dụng',
                data: medicine?.quantity, // Số lượng thuốc đã sử dụng
                backgroundColor: 'rgba(75, 192, 192, 0.6)', // Màu cột
                borderColor: 'rgba(75, 192, 192, 1)', // Màu viền cột
                borderWidth: 1,
            },
        ],
    };

    // Cấu hình biểu đồ
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top', // Vị trí chú thích
            },
            title: {
                display: true,
                text: 'Số lượng thuốc đã sử dụng trong hôm nay',
            },
        },
        scales: {
            x: {
                ticks: {
                    display: false, // Ẩn nhãn trên trục X
                },
                title: {
                    display: false,
                    text: 'Loại thuốc',
                },
            },
            y: {
                title: {
                    display: false,
                    text: 'Số lượng đã sử dụng',
                },
                beginAtZero: true, // Đảm bảo trục Y bắt đầu từ 0
            },
        },
    };
    return (
        <div className="dashboard-line1">
            <div className="appoinment-statistical bg-bor15">
                <div className="head">
                    <div className="text-head">Hôm nay</div>
                    <div>
                        <span className="number">{new Intl.NumberFormat('vi-VN').format(examination?.all)}</span> <span> đơn khám</span>
                    </div>
                </div>
                <div className="body mt-4">
                    <div className="item">
                        <IconCircle
                            icon={faThumbsUp}
                            color={"#1AB8F9"}
                            background={"#D7FFFD"}
                            size={"50px"} />

                        <div className="text">{new Intl.NumberFormat('vi-VN').format(examination.success)} Hoàn thành</div>
                    </div>
                    <div className="item">
                        <IconCircle
                            icon={faSyringe}
                            color={"#5ECF37"}
                            background={"#D1F3C5"}
                            size={"50px"} />

                        <div className="text">{new Intl.NumberFormat('vi-VN').format(examination?.processing)} Đang xử lý</div>
                    </div>
                    <div className="item">
                        <IconCircle
                            icon={faHourglassHalf}
                            color={"#E4C80D"}
                            background={"#FFFBD7"}
                            size={"50px"} />

                        <div className="text">{new Intl.NumberFormat('vi-VN').format(examination?.waiting)} Đang đợi</div>
                    </div>
                    <div className="item">
                        <IconCircle
                            icon={faXmark}
                            color={"#F92637"}
                            background={"#F9DDDF"}
                            size={"50px"} />

                        <div className="text">{new Intl.NumberFormat('vi-VN').format(examination?.cancel)} Đã hủy</div>
                    </div>
                </div>
            </div>
            <div className="bg-bor15 medicine">
                <Bar data={data} options={options} />
            </div>
        </div>
    )
}
export default SectionLine1;