import { useMutation } from "@/hooks/useMutation";
import { getParaclinicals } from "@/services/doctorService";
import { DatePicker, message, Pagination, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PatientItem from "../../components/PatientItem/PatientItem";
import ParacModal from "./ParacModal/ParacModal";
import dayjs from "dayjs";


const ParaclinicalList = () => {
    let { user } = useSelector((state) => state.authen);

    const [currentDate, setCurrentDate] = useState(dayjs());
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [listExam, setListExam] = useState([]);
    const [status, setStatus] = useState(5);

    const [patientData, setPatientData] = useState({});
    const [examId, setExamId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleParac = (id) => {
        const selectedPatient = listExam.find(item => item.id === id);

        if (selectedPatient) {
            setExamId(id);
            setPatientData(selectedPatient);
            setIsModalOpen(true);
        } else {
            message.error('Không tìm thấy thông tin bệnh nhân');
        }
    }
    const closePay = () => setIsModalOpen(false);

    const onSusscess = (data) => {
        fetchExaminations();
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
    } = useMutation(() => getParaclinicals(currentDate, status, user.staff, currentPage, pageSize, search))

    useEffect(() => {
        fetchExaminations();
    }, [status, search, currentPage, pageSize, currentDate]);

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
                            <Select.Option value="7">Đã xong</Select.Option>
                        </Select>
                    </div>
                    {status == 7 && (
                        <div className="col-2">
                            <p className="search-title">Ngày</p>
                            <DatePicker className="date-picker" 
                                value={currentDate} allowClear={false}  
                                onChange={(date) => setCurrentDate(date)}/>
                        </div>
                    )}
                    <div className="col-6">
                        <p className="search-title">Tìm kiếm bệnh nhân</p>
                        <input type="text" className="search-box" 
                                placeholder="Nhập thông tin bệnh nhân để tìm kiếm..." 
                                value={search}
                                onChange={handleSearch}/>
                    </div>
                </div>
                <div className="appointment-container mt-3 row">
                    <div className="header">
                        <p className="title">Danh sách cận lâm sàng</p>
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
                                        name={`${item.examinationResultParaclincalData.userExaminationData.lastName} ${item.examinationResultParaclincalData.userExaminationData.firstName}`}
                                        symptom={item.paraclinicalData.name}
                                        special={item.examinationResultParaclincalData.special}
                                        room={item.roomParaclinicalData.name}
                                        doctor={`${item.doctorParaclinicalData.staffUserData.lastName} ${item.doctorParaclinicalData.staffUserData.firstName}`}
                                        downItem={downItem}
                                        visit_status={item.name}
                                        onClickItem={()=>handleParac(item.id)}
                                        sort={false}
                                        isEmergency={item.examinationResultParaclincalData?.medicalTreatmentTier === 3 ? true : false}
                                    />
                            )):(
                                <div className="no-patient d-flex justify-content-center mt-2">
                                    <p>Không tìm thấy bệnh nhân!</p>
                                </div>
                            )
                        )}
                    </div>
                    <div className='row'>
                        {!loadingExaminations !== 1 && listExam?.length > 0 && (
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
                {listExam?.length > 0 && examId &&
                    <ParacModal
                        isOpen={isModalOpen}
                        onClose={closePay}
                        onSusscess={onSusscess}
                        patientData={patientData}
                        paracId={examId}
                    />
                }
            </div>
        </>
    )
}

export default ParaclinicalList;