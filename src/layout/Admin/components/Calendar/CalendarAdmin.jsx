import React, { useEffect, useState } from "react";
import { Table } from 'antd';
import dayjs from "dayjs";
import { formatDate, formatDate1 } from "@/utils/formatDate";
import { secondaryColorAdmin } from "@/styles//variables";
import "./Calendar.scss";
import { ROLE } from "@/constant/role";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { getSchedule } from "@/services/adminService";
import ScheduleModal from "../Modal/ScheduleModal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
const ScheduleTable = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    let [scheduleUpdate, setScheduleUpdate] = useState(null);
    const [shifts, setShifts] = useState([
        props?.schedules?.map((schedule) => ({
            doctorId: schedule.staffId,
            roomId: schedule.roomId,
            doctor: schedule.staffScheduleData.staffUserData.lastName + " " + schedule.staffScheduleData.staffUserData.firstName,
            date: dayjs(schedule.date).format('YYYY-MM-DD'),
            roleId: schedule.staffScheduleData.staffUserData.roleId,
        })),
    ]);
    const departments = props?.listDepartment;
    const daysOfWeek = props?.daysOfWeek;
    useEffect(() => {
        if (props.pdfExport) {
            exportToExcel();
            props.setPdfExport(false);
        }
    }, [props.pdfExport]);
    const columns = [
        {
            title: "Khoa",
            dataIndex: "departmentName",
            key: "departmentName",
            width: 50,
            onCell: (record) => ({
                rowSpan: record.rowSpan, // Gộp hàng
            }),
            render: (text) => text,
        },
        {
            title: "Phòng",
            dataIndex: "roomName",
            key: "roomName",
            width: 50,
        },
        ...daysOfWeek?.map((date) => ({
            title: formatDate1(date),
            dataIndex: date.format("YYYY-MM-DD"),
            key: date.format("YYYY-MM-DD"),
            onCell: (record) => ({
                onClick: () => handleGetSchedule(date, record.roomId, record.roomName, record.departmentId),
            }),
            render: (_, record) => {
                // Lọc lịch trực cho roomId và ngày tương ứng
                const shiftsForDate = shifts[0]?.filter(
                    (shift) =>
                        shift.roomId === record.roomId &&
                        shift.date === date.format("YYYY-MM-DD")
                );
                // Hiển thị danh sách bác sĩ và giờ trực
                return shiftsForDate?.length > 0 ? (
                    <div style={{ cursor: "pointer" }} >
                        <ul style={{ padding: 0, listStyleType: "none" }}>
                            {shiftsForDate
                                ?.filter((shift) => shift.roleId === ROLE.DOCTOR)
                                ?.map((shift) => (
                                    <li key={`doctor-${shift.doctor}-${shift.doctorId}-${shift.date}-${shift.roomId}`}>
                                        <div
                                            style={{
                                                color: secondaryColorAdmin,
                                                fontWeight: "600",
                                            }}
                                        >  BS.{shift.doctor}</div>
                                    </li>
                                ))}
                            {shiftsForDate
                                ?.filter((shift) => shift.roleId !== ROLE.DOCTOR)
                                ?.map((shift) => (
                                    <li key={`nurse-${shift.doctor}-${shift.doctorId}-${shift.date}-${shift.roomId}`}>
                                        {shift.roleId === ROLE.NURSE && (
                                            <span
                                                style={{
                                                    color: secondaryColorAdmin,
                                                    textTransform: "italic",
                                                }}
                                            >
                                                {shift.doctor}
                                            </span>
                                        )}
                                    </li>
                                ))}
                        </ul>
                    </div >
                ) : (<div >
                    <FontAwesomeIcon className="icon-plus-center" icon={faPlus} />
                </div>);
            },
        })),
    ];
    const prepareTableData = (data) => {
        const tableData = [];
        data?.forEach((dept) => {
            dept?.roomData?.forEach((room, index) => {
                tableData?.push({
                    key: `${dept.name}-${room.id}`,
                    departmentName: dept.name,
                    departmentId: dept.id,
                    roomId: room.id,
                    roomName: room.name,
                    rowSpan: index === 0 ? dept.roomData.length : 0, // Gộp hàng
                });
            });
        });
        return tableData;
    };
    const tableData = prepareTableData(departments);
    const handleGetSchedule = async (date, roomId, roomName, departmentId) => {
        date = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
        let response = await getSchedule({ date, roomId });
        if (response.EC === 0) {
            setScheduleUpdate({ ...response.DT, date, roomName, departmentId, roomId });
            setIsModalOpen(true);
        }
    }
    let refresh = () => {
        setScheduleUpdate(null);
        setIsModalOpen(false);
        props.refresh();
    }

    const exportToExcel = () => {
        // Chuẩn bị dữ liệu để xuất
        const excelData = [];
        // Đưa dữ liệu departments vào Excel
        departments.forEach((dept) => {
            dept?.roomData?.forEach((room) => {
                const row = {
                    Khoa: dept.name,
                    Phòng: room.name,
                };

                // Thêm thông tin các ngày trong tuần vào hàng này
                daysOfWeek.forEach((date) => {
                    const formattedDate = formatDate1(date);
                    const shiftsForDate = shifts[0]?.filter(
                        (shift) =>
                            shift.roomId === room.id &&
                            shift.date === date.format("YYYY-MM-DD")
                    );
                    row[formattedDate] = shiftsForDate?.length
                        ? shiftsForDate
                            ?.map(
                                (shift) =>
                                    `${shift.roleId === ROLE.DOCTOR ? 'BS' : 'DD'}: ${shift.doctor}`
                            )
                            .join(', ')
                        : "Trống"; // Nếu không có ca trực
                });
                excelData.push(row);
            });
        });
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Lịch trực");

        // Xuất file Excel
        XLSX.writeFile(workbook, `Lich_truc_${dayjs().format("DD-MM-YYYY")}.xlsx`);
    };

    return (
        <div className="admin-calender">
            <Table
                className="custom-schedule-table"
                style={{ userSelect: "none" }}
                columns={columns}
                dataSource={tableData}
                pagination={false}
            />
            {scheduleUpdate &&
                <ScheduleModal
                    open={isModalOpen}
                    data={scheduleUpdate}
                    closeModal={() => { setScheduleUpdate(null); setIsModalOpen(false) }}
                    refresh={refresh} />}
        </div>
    );
};

export default ScheduleTable;
