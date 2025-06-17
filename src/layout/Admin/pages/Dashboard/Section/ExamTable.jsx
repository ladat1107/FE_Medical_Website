import { STATUS_BE } from "@/constant/value";
import ExaminationDrawer from "../../ExaminationManage/ExaminationDetail";
import { useState } from "react";
import { Input } from "antd";
import { SearchOutlined } from "@mui/icons-material";
const ExamTable = ({ inPatientData, outPatientData }) => {
    const [currentExamination, setCurrentExamination] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [searchTextOutPatient, setSearchTextOutPatient] = useState("");
    const [searchTextInPatient, setSearchTextInPatient] = useState("");

    const filteredOutPatientData = outPatientData.filter((patient) => {
        return patient.userExaminationData?.lastName?.toLowerCase().includes(searchTextOutPatient.toLowerCase()) ||
            patient.userExaminationData?.firstName?.toLowerCase().includes(searchTextOutPatient.toLowerCase()) ||
            patient.id?.toString().includes(searchTextOutPatient);
    });
    const filteredInPatientData = inPatientData.filter((patient) => {
        return patient.userExaminationData?.lastName?.toLowerCase().includes(searchTextInPatient.toLowerCase()) ||
            patient.userExaminationData?.firstName?.toLowerCase().includes(searchTextInPatient.toLowerCase()) ||
            patient.id?.toString().includes(searchTextInPatient);
    });

    const handleSearchOutPatient = (e) => {
        setSearchTextOutPatient(e.target.value);
    }
    const handleSearchInPatient = (e) => {
        setSearchTextInPatient(e.target.value);
    }

    const showDetailModal = (record) => {
        setCurrentExamination(record)
        setIsDetailModalVisible(true)
    }
    return (
        <div className="bg-bgAdmin grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

            {/* Bảng khám ngoại trú */}
            <div className="bg-white rounded-xl p-3 shadow-table-admin">
                <div className="flex items-center justify-between text-lg mb-3">
                    <div className="font-bold text-primary-tw px-2 py-1">Bảng khám ngoại trú</div>
                    <div>
                        <Input
                            placeholder="Tìm kiếm đơn khám"
                            prefix={<SearchOutlined />}
                            className="w-full sm:w-64 border-gray-300"
                            value={searchTextOutPatient}
                            onChange={handleSearchOutPatient}
                        />
                    </div>
                </div>
                <div className="overflow-auto h-[350px]">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chẩn đoán</th>

                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOutPatientData.length > 0 ? (
                                filteredOutPatientData.map((patient, index) => (
                                    <tr key={index} className="bg-white hover:!bg-hoverTable cursor-pointer" onClick={() => showDetailModal(patient)}>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{patient.id}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{(patient.userExaminationData?.lastName || "") + " " + (patient.userExaminationData?.firstName || "")}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{(patient.examinationStaffData?.staffUserData?.lastName || "") + " " + (patient.examinationStaffData?.staffUserData?.firstName || "")}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${patient.status === STATUS_BE.DONE ? 'bg-green-100 text-green-800' :
                                                        patient.status === STATUS_BE.EXAMINING ? 'bg-blue-100 text-blue-800' :
                                                            patient.status === STATUS_BE.WAITING || patient.status === STATUS_BE.PAID ? 'bg-yellow-100 text-yellow-800' :
                                                                patient.status === STATUS_BE.INACTIVE ? 'bg-red-100 text-red-800' :
                                                                    'bg-gray-100 text-gray-800'}`}
                                            >
                                                {patient.status === STATUS_BE.DONE ? 'Hoàn thành' :
                                                    patient.status === STATUS_BE.EXAMINING ? 'Đang khám' :
                                                        patient.status === STATUS_BE.WAITING || patient.status === STATUS_BE.PAID ? 'Chờ khám' :
                                                            patient.status === STATUS_BE.INACTIVE ? 'Đã hủy' :
                                                                'Chờ xử lý'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 max-w-[100px] overflow-hidden text-ellipsis">{patient.diseaseName || ''}</td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-500">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bảng khám nội trú */}
            <div className="bg-white rounded-xl p-3 shadow-table-admin">
                <div className="flex items-center justify-between text-lg mb-3">
                    <div className="font-bold text-primary-tw px-2 py-1">Bảng khám nội trú</div>
                    <div>
                        <Input
                            placeholder="Tìm kiếm đơn khám"
                            prefix={<SearchOutlined />}
                            className="w-full sm:w-64 border-gray-300"
                            value={searchTextInPatient}
                            onChange={handleSearchInPatient}
                        />
                    </div>
                </div>
                <div className="overflow-auto h-[350px]">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày nhập viện</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tình trạng</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lý do</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInPatientData.length > 0 ? (
                                filteredInPatientData.map((patient, index) => (
                                    <tr key={index} className="bg-white hover:!bg-hoverTable cursor-pointer" onClick={() => showDetailModal(patient)}>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{patient.id}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{(patient.userExaminationData?.lastName || "") + " " + (patient.userExaminationData?.firstName || "")}</td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(patient.dischargeDate).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${patient.status === STATUS_BE.DONE_INPATIENT ? 'bg-green-100 text-green-800' :
                                                        'bg-blue-100 text-blue-800'}`}
                                            >
                                                {patient.status === STATUS_BE.DONE_INPATIENT ? 'Đã xuất viện' : 'Đang điều trị'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 max-w-[100px] overflow-hidden text-ellipsis">{patient.reason || ''}</td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-3 py-4 text-center text-sm text-gray-500">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {currentExamination &&
                <ExaminationDrawer open={isDetailModalVisible}
                    onClose={() => setIsDetailModalVisible(false)}
                    examinationId={currentExamination.id} />}
        </div>
    )
}

export default ExamTable;