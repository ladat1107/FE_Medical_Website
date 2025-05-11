import "./ScheduleManage.scss";
import React, { useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomCalendar from "../../components/Calendar/CalendarAdmin";
import { getDepartmentDuty, getSchedule } from "@/services/adminService";
import { Button, DatePicker, Spin, Table } from "antd";
import dayjs from "dayjs";
import { formatDate1 } from "@/utils/formatDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ArrangeSchedule from "./ArrangeSchedule";
import { primaryColorAdmin } from "@/styles//variables";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ScheduleManage = () => {
    let [pdfExport, setPdfExport] = useState(false);
    let [showArrangement, setShowArrangement] = useState(false);
    let [currentWeek, setCurrentWeek] = useState(dayjs());
    let [schedules, setSchedules] = useState([]);
    let [departments, setDepartments] = useState([]);
    let daysOfWeek = Array(7).fill(0).map((_, i) => currentWeek.startOf("week").add(i + 1, "day"));
    let fecthSchedule = async (startDate) => {
        let res = await getSchedule({ startDate });
        if (res.EC === 0) {
            setSchedules(res.DT);
        }
    }
    let fecthDepartment = async () => {
        let res = await getDepartmentDuty();
        if (res.EC === 0) {
            setDepartments(res.DT);
        }
    }
    useEffect(() => {
        fecthDepartment();
    }, []);
    useEffect(() => {
        let startDate = new Date(currentWeek.startOf("week") + 1);
        setSchedules([]);
        fecthSchedule(startDate);
    }, [currentWeek]);
    let refresh = () => {
        setSchedules([]);
        setShowArrangement(false);
        fecthDepartment();
        fecthSchedule();
    };
    const handleWeekChange = (direction) => {
        setCurrentWeek(currentWeek.add(direction, "week"));
    };

    const columns = [
        {
            title: "Khoa",
            dataIndex: "departmentName",
            key: "departmentName",
            width: 50,
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
        })),
    ];
    return (
        <div className="schedule-manage-content">
            <div className="container">
                <div className="schedule-content-header d-flex align-items-center justify-content-between py-3">
                    <div className="text">QUẢN LÝ LỊCH TRỰC</div>
                    <div>
                        {!showArrangement &&
                            <button className=' py-1 px-2 btn-add-schedule' onClick={() => { setShowArrangement(true) }}>
                                <FontAwesomeIcon
                                    className='me-1 icon' icon={faPlus} style={{ color: primaryColorAdmin, }} /> Xếp lịch</button>
                        }
                    </div>
                </div>
                <div className={`p-1 animated-div ${showArrangement ? 'show' : ''}`}>
                    {showArrangement && <ArrangeSchedule
                        onClose={() => { setShowArrangement(false) }}
                        refresh={refresh}
                    />}
                </div>
                <div className="p-3 schedule1-content mb-3">
                    <div className="mb-4">
                        <Button onClick={() => handleWeekChange(-1)}>Tuần trước</Button>
                        <Button className="mx-2" onClick={() => handleWeekChange(1)} >
                            Tuần sau
                        </Button>
                        <DatePicker className="mx-2"
                            allowClear={false}
                            inputReadOnly
                            value={currentWeek}
                            onChange={(value) => setCurrentWeek(value)} />
                        <Button className="mx-2" onClick={() => { refresh() }}>Làm mới</Button>
                        <Button className="mx-2" onClick={() => setPdfExport(true)}>
                            Xuất Excel
                        </Button>
                    </div>
                    {departments.length > 0 && schedules.schedule?.length > 0 ?
                        <CustomCalendar
                            pdfExport={pdfExport}
                            setPdfExport={() => setPdfExport(false)}
                            listDepartment={departments}
                            schedules={schedules.schedule}
                            daysOfWeek={daysOfWeek}
                            refresh={refresh}
                        /> :
                        <Table
                            className="custom-schedule-table"
                            style={{ minHeight: "500px" }}
                            columns={columns}
                            dataSource={[{ key: 1 }]}
                            pagination={false}
                            loading={{ indicator: <div><Spin /></div> }} />
                    }
                </div>
            </div>
        </div>
    )
}

export default ScheduleManage;