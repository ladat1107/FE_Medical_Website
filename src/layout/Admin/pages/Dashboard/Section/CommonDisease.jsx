import { useEffect, useState } from "react";
import { STATUS_BE } from "@/constant/value";
import { Card, Table } from "antd";
import { ClipboardPlus } from "lucide-react";
import dayjs from "dayjs";

const CommonDisease = ({ examinationList, doneExaminations, dateRange }) => {
    const [topDiseases, setTopDiseases] = useState([])

    useEffect(() => {
        if (examinationList?.EC === 0) {
            const examinations = (examinationList?.DT);
            let _topDiseases = [];
            // Thống kê về bệnh phổ biến nhất
            _topDiseases = examinations.reduce((acc, item) => {
                const disease = item?.diseaseName;
                if (!disease || (item.status !== STATUS_BE.DONE && item.status !== STATUS_BE.DONE_INPATIENT)) return acc;
                if (!acc[disease]) {
                    const [code, ...nameParts] = disease.split(" - ");
                    const name = nameParts.join(" - ");
                    acc[disease] = {
                        id: code,
                        name: name,
                        count: 0,
                        percentage: 0,
                    };
                }
                acc[disease].count += 1;
                return acc;
            }, {});

            _topDiseases = Object.values(_topDiseases).sort((a, b) => b.count - a.count);
            _topDiseases = _topDiseases.slice(0, 10).map(item => ({
                ...item,
                percentage: ((item.count / (doneExaminations)) * 100).toFixed(1),
            }));
            setTopDiseases(_topDiseases)
        }
    }, [examinationList, doneExaminations])

    const diseaseColumns = [
        {
            title: "Mã bệnh",
            dataIndex: "id",
            key: "id",
            width: 130,
        },
        {
            title: "Bệnh",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số ca",
            dataIndex: "count",
            key: "count",
            width: 80,
            className: "text-center",
            sorter: (a, b) => a.count - b.count,
        },
        {
            title: "Tỷ lệ",
            dataIndex: "percentage",
            key: "percentage",
            width: 80,
            className: "text-center",
            render: (percentage) => `${percentage}%`,
            sorter: (a, b) => a.percentage - b.percentage,
        },
    ]

    return (
        <Card title={<div className="flex items-center gap-2 text-base font-bold"><ClipboardPlus size={18} /><span>Danh sách bệnh phổ biến nhất <span className="font-normal">{dayjs(dateRange[0]).format("DD/MM/YYYY")} - {dayjs(dateRange[1]).format("DD/MM/YYYY")} </span></span></div>}
            className="shadow-table-admin rounded-xl  [&_.ant-card-body]:!p-2 mt-5">
            <Table
                columns={diseaseColumns}
                dataSource={topDiseases}
                rowKey="id"
                pagination={false}
                size="middle"
                scroll={{ y: 340 }}
                className="p-2 h-[400px] "
            />
        </Card>
    )
}

export default CommonDisease;