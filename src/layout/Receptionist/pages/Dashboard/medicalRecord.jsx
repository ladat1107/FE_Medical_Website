import { useMutation } from "@/hooks/useMutation";
import { getMedicalRecords } from "@/services/doctorService";
import { message, Pagination, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import PatientItem from "../../components/PatientItem/PatientItem";
import RecordModal from "../../components/RecordModal/RecordModal";


const MedicalRecord = () => {
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(6);
    const [medicalTreatmentTier, setMedicalTreatmentTier] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const [listExam, setListExam] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeAddExam = () => {
        setIsModalOpen(false);
    }

    const handelSelectChange = (value) => {
        setStatus(value);
    }

    const handelTreatmentTierChange = (value) => {
        setMedicalTreatmentTier(+value);
    }

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    useEffect(() => {
        fetchExaminations();
    }, [currentPage, pageSize, search, status, medicalTreatmentTier]);

    const {
        data: dataExaminations,
        loading: loadingExaminations,
        execute: fetchExaminations,
    } = useMutation(() => getMedicalRecords(status, medicalTreatmentTier, currentPage, pageSize, search));

    useEffect(() => {
        if (dataExaminations) {
            setTotal(dataExaminations.DT.totalItems);
            setListExam(dataExaminations.DT.examinations);
        }
    }, [dataExaminations]);

    const handleItemClick = (index) => {
        const selectedItem = listExam[index];
        if (selectedItem) {
            setSelectedItem(selectedItem);
            setIsModalOpen(true);
        }
    }

    return (
        <>
            <div className="appointment-content">
                <div className="search-container row">
                    <div className="col-2">
                        <p className="search-title">Đối tượng </p>
                        <Select className="select-box" defaultValue="2" onChange={handelTreatmentTierChange}>
                            <Select.Option value="2">Ngoại trú</Select.Option>
                            <Select.Option value="1">Nội trú</Select.Option>
                            <Select.Option value="3">Cấp cứu</Select.Option>
                        </Select>
                    </div>
                    <div className="col-2">
                        <p className="search-title">Trạng thái</p>
                        <Select className="select-box" defaultValue="6" onChange={handelSelectChange}>
                            <Select.Option value="6">Đang điều trị</Select.Option>
                            <Select.Option value="7">Đã xuất viện</Select.Option>
                        </Select>
                    </div>
                    <div className="col-6">
                        <p className="search-title">Tìm kiếm đơn khám</p>
                        <input type="text" className="search-box"
                            placeholder="Nhập tên, SĐT, CCCD của bệnh nhân để tìm kiếm..."
                            value={search}
                            onChange={handleSearch} />
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
                            ) : (listExam && listExam.length > 0 ? listExam.map((item, index) => (
                                <div key={index}>
                                    <PatientItem
                                        key={item.id + index}
                                        index={index + 1}
                                        id={item.id}
                                        name={`${item?.userExaminationData.lastName} ${item?.userExaminationData.firstName}`}
                                        symptom={`CCCD: ${item?.userExaminationData?.cid}`}
                                        special={item.special}
                                        room={item.roomName}
                                        doctor={`${item?.userExaminationData?.phoneNumber || ''}`}
                                        visit_status={item.visit_status}
                                        onClickItem={() => handleItemClick(index)}
                                        sort={false}
                                        doctorHeader="Số điện thoại"
                                    />
                                </div>
                            )) : (
                                <div className="no-patient d-flex justify-content-center mt-2">
                                    <p>Không tìm thấy bệnh nhân!</p>
                                </div>
                            )
                        )}       
                    </div>
                    <div className='row mt-3'>
                        <Pagination
                            align="center"
                            current={currentPage}
                            pageSize={pageSize}
                            total={total}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
                {isModalOpen && (
                    <RecordModal
                        isOpen={isModalOpen}
                        onClose={closeAddExam}
                        record={selectedItem}
                    />
                )}
            </div>
        </>
    );
}

export default MedicalRecord;