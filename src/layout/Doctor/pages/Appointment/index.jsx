import { getExaminations, getScheduleByStaffIdFromToday } from "@/services/doctorService";
import React, { useEffect, useState } from 'react'
import "./Appointment.scss";
import { useMutation } from "@/hooks/useMutation";
import { useNavigate } from "react-router-dom";
import { DatePicker, Pagination, Select, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import PatientItem from "@/layout/Receptionist/components/PatientItem/PatientItem";
import dayjs from "dayjs";
import { setSchedule } from "@/redux/scheduleSlice";

const Appointment = () => {
    const navigate = useNavigate();
    let { user } = useSelector((state) => state.authen);

    const [currentDate, setCurrentDate] = useState(dayjs());
    const [toDate, setToDate] = useState(dayjs());
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);
    const [time, setTime] = useState(null);
    const [search, setSearch] = useState('');
    const [listExam, setListExam] = useState([]);
    const [status, setStatus] = useState(5);
    const dispatch = useDispatch();
    const isAppointment = 0;

    const {
        data: dataSchedules,
        loading: loadingSchedules,
        error: errorSchedules,
        execute: fetchSchedules,
    } = useMutation(() => getScheduleByStaffIdFromToday())

    useEffect(() => {
        fetchSchedules();
    }, [user.staff]);

    useEffect(() => {
        if (dataSchedules?.DT.length > 0) {
            dispatch(setSchedule(dataSchedules.DT));
        }
    }, [dataSchedules]);

    const handleClickRow = (examinationId) => {
        navigate(`/doctorExamination/${examinationId}`);
    }

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const downItem = () => {
        fetchExaminations();
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const handelSelectChange = (value) => {
        setStatus(value);
    }

    // #region Fetch data 
    const {
        data: dataExaminations,
        loading: loadingExaminations,
        error: errorExaminations,
        execute: fetchExaminations,
    } = useMutation(() => getExaminations(currentDate, toDate, +status, user.staff, isAppointment, currentPage, pageSize, search, time))

    useEffect(() => {
        fetchExaminations();
    }, [isAppointment, status, search, time, currentPage, pageSize, currentDate]);

    useEffect(() => {
        if (dataExaminations) {
            setTotal(dataExaminations.DT.totalItems);
            setListExam(dataExaminations.DT.examinations);
        }
    }, [dataExaminations]);

    // #endregion

    return (
        <>
            <div className="appointment-content">
                <div className="search-container row">
                    <div className="col-2">
                        <p className="search-title">Trạng thái</p>
                        <Select className="select-box" defaultValue="5" onChange={handelSelectChange}>
                            <Select.Option value="5">Khám mới</Select.Option>
                            <Select.Option value="6">Đang khám</Select.Option>
                            <Select.Option value="7">Đã xong</Select.Option>
                        </Select>
                    </div>
                    {status == 7 && (
                        <>
                            <div className="col-2">
                                <p className="search-title">Từ ngày</p>
                                <DatePicker className="date-picker" 
                                    value={currentDate} allowClear={false}  
                                    onChange={(date) => setCurrentDate(date)}/>
                            </div>
                            <div className="col-2" >
                                <p className="search-title">Đến ngày</p>
                                <DatePicker className="date-picker" 
                                    value={toDate} allowClear={false}  
                                    onChange={(toDate) => setToDate(toDate)}/>
                            </div>
                        </>
                    )}
                    <div className="col-6">
                        <p className="search-title">Tìm kiếm đơn khám</p>
                        <input type="text" className="search-box" 
                                placeholder="Nhập tên bệnh nhân để tìm kiếm..." 
                                value={search}
                                onChange={handleSearch}/>
                    </div>
                </div>
                <div className="appointment-container mt-3 row">
                    <div className="header">
                        <p className="title">Danh sách đơn khám</p>
                    </div>
                    <div className="schedule-content text-center">
                        {loadingExaminations ? (
                            <div className="loading">
                                <Spin />
                            </div>
                        ) : ( listExam && listExam.length > 0 ? listExam.map((item, index) => (
                                <PatientItem
                                    key={item.id}
                                    index={index + 1}
                                    id={item.id}
                                    name={`${item.userExaminationData.lastName} ${item.userExaminationData.firstName}`}
                                    symptom={'Triệu chứng: ' + item.symptom}
                                    special={item.special}
                                    room={item.roomName}
                                    doctor={`${item.examinationStaffData.staffUserData.lastName} ${item.examinationStaffData.staffUserData.firstName}`}
                                    downItem={downItem}
                                    visit_status={item.visit_status}
                                    onClickItem={()=>handleClickRow(item.id)}
                                    sort={false}
                                />
                            )):(
                                <div className="no-patient d-flex justify-content-center mt-2">
                                    <p>Không tìm thấy bệnh nhân!</p>
                                </div>
                            )
                        )}
                    </div>
                    <div className='row'>
                        {!loadingExaminations && isAppointment !== 1 && listExam.length > 0 && (
                            <Pagination
                                align="center"
                                current={currentPage}
                                pageSize={pageSize}
                                total={total}
                                onChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Appointment