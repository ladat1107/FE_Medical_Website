import { Input, message, Pagination, Select, Spin, Form } from "antd";
import { useEffect, useRef, useState } from "react";
import AddExamModal from "../../components/AddExamModal/AddExamModal";
import { useMutation } from "@/hooks/useMutation";
import { getAllDisease, getExaminations, getPatienSteps, getSpecialties } from "@/services/doctorService";
import PatientItem from "../../components/PatientItem/PatientItem";
import { TIMESLOTS, TYPE_NUMBER } from "@/constant/value";
import { convertDateTime } from "@/utils/formatDate";
import DropdownSpecialty from "../../components/Dropdown/DropdownSpecialty";
import userService from "@/services/userService";
import Loading from "@/components/Loading/Loading";
import dayjs from "dayjs";
import StepModal from "../../components/StepModal/StepModal";
import { useGetUserByQRCode } from "@/hooks";

const ReceptionistDashboard = () => {
    // Form
    const [form] = Form.useForm();

    // States
    const [type, setType] = useState(TYPE_NUMBER.NORMAL);
    const [currentNumber, setCurrentNumber] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingSteps, setLoadingSteps] = useState(false);
    const today = dayjs();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalStepOpen, setIsModalStepOpen] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [patientData, setPatientData] = useState({});
    const [examId, setExamId] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [total, setTotal] = useState(0);
    const [isAppointment, setIsAppointment] = useState(1);
    const [time, setTime] = useState(null);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState(2);
    const [listExam, setListExam] = useState([]);
    const [listStep, setListStep] = useState([]);

    const [totalPatient, setTotalPatient] = useState(0);
    const [totalAppointment, setTotalAppointment] = useState(0);

    const [comorbiditiesOptions, setComorbiditiesOptions] = useState([]);
    const [specialtyOptions, setSpecialtyOptions] = useState([]);

    // QR Code scanning
    const [scannedQR, setScannedQR] = useState("");
    const { data: dataUserByQRCode, refetch: refetchUserByQRCode } = useGetUserByQRCode({ qrCode: scannedQR });
    const [dataQRCode, setDataQRCode] = useState(null);
    // QR Code scanning refs
    const hiddenInputRef = useRef(null);
    const lastScanTimeRef = useRef(0);
    const scanningInProgressRef = useRef(false);
    const qrTimeoutRef = useRef(null);
    const previousActiveElementRef = useRef(null);
    const keystrokeSequenceRef = useRef([]);

    // QR Code scanning setup
    useEffect(() => {
        fetchComorbidities();
        fetchSpecialties();
        fetchTicketData();
        // This function handles all keystrokes to detect QR scanner patterns
        const handleKeyDown = (e) => {
            const now = Date.now();
            const timeSinceLastKey = now - lastScanTimeRef.current;
            lastScanTimeRef.current = now;

            // Only process if it's a printable character
            if (e.key.length === 1) {
                // Store keystroke info (time difference and key)
                keystrokeSequenceRef.current.push({
                    timeDiff: timeSinceLastKey,
                    key: e.key
                });

                // Keep buffer at reasonable size
                if (keystrokeSequenceRef.current.length > 10) {
                    keystrokeSequenceRef.current.shift();
                }

                // Check if we have enough keystrokes to analyze
                if (keystrokeSequenceRef.current.length >= 3) {
                    // Check the last few keystrokes to see if they match QR scanner pattern
                    // (multiple consecutive fast keystrokes under 25ms)
                    const recentStrokes = keystrokeSequenceRef.current.slice(-3);
                    const fastStrokes = recentStrokes.filter(stroke => stroke.timeDiff < 25);
                    const isLikelyQRScanner = fastStrokes.length >= 2;

                    // Check if we're in an input field
                    const activeElement = document.activeElement;
                    const isInputElement = activeElement.tagName === 'INPUT' ||
                        activeElement.tagName === 'TEXTAREA';
                    const isOurHiddenInput = activeElement === hiddenInputRef.current;

                    // Start QR scan mode if scanner detected AND:
                    // 1. We're not in an input field, OR
                    // 2. We're already in scanning mode, OR
                    // 3. We're in our hidden input
                    if (isLikelyQRScanner && (!isInputElement || scanningInProgressRef.current || isOurHiddenInput)) {
                        if (!scanningInProgressRef.current) {
                            // Start of a new scan
                            scanningInProgressRef.current = true;

                            // Store current focus for later restoration
                            previousActiveElementRef.current = activeElement;

                            // Focus our hidden input
                            if (!isOurHiddenInput) {
                                hiddenInputRef.current.focus();
                            }

                            // Recreate the start of the QR code from our keystroke buffer
                            const qrPrefix = keystrokeSequenceRef.current
                                .slice(-3)  // Take the last 3 keystrokes
                                .map(stroke => stroke.key)  // Extract just the keys
                                .join('');   // Join them into a string

                            // Set the hidden input value to include the start of the QR code
                            hiddenInputRef.current.value = qrPrefix;

                            // Prevent this keystroke from being processed elsewhere
                            e.preventDefault();
                        }
                    }
                }

                // Reset scan timeout if we're in scanning mode
                if (scanningInProgressRef.current) {
                    if (qrTimeoutRef.current) clearTimeout(qrTimeoutRef.current);
                    qrTimeoutRef.current = setTimeout(() => {
                        // QR scan completed
                        if (hiddenInputRef.current.value) {
                            setScannedQR(hiddenInputRef.current.value);
                            hiddenInputRef.current.value = "";
                        }

                        // Clean up state
                        scanningInProgressRef.current = false;
                        keystrokeSequenceRef.current = [];

                        // Restore focus
                        if (previousActiveElementRef.current && previousActiveElementRef.current !== hiddenInputRef.current) {
                            try {
                                previousActiveElementRef.current.focus();
                            } catch (err) {
                                console.log("Error returning focus:", err);
                            }
                        }
                    }, 100);
                }
            }
        };

        // Listen for all keydown events to catch QR scanner input
        document.addEventListener("keydown", handleKeyDown, true);

        return () => {
            document.removeEventListener("keydown", handleKeyDown, true);
            if (qrTimeoutRef.current) {
                clearTimeout(qrTimeoutRef.current);
            }
        };
    }, []);

    // Process QR code when it's scanned
    useEffect(() => {
        if (scannedQR) {
            setIsModalOpen(false);
            setDataQRCode(null);
            refetchUserByQRCode();

            // Reset QR code after processing
            const timeout = setTimeout(() => {
                setScannedQR("");
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [scannedQR, refetchUserByQRCode]);

    // Process user data from QR code
    useEffect(() => {
        if (dataUserByQRCode) {
            if (dataUserByQRCode?.EC === 0 || dataUserByQRCode?.EC === 1) {
                setDataQRCode(dataUserByQRCode);
                setIsModalOpen(true);
            } else {
                message.error(dataUserByQRCode?.EM);
            }
        }
    }, [dataUserByQRCode]);

    // Data fetching
    const {
        data: dataComorbidities,
        execute: fetchComorbidities,
    } = useMutation(() => getAllDisease());

    const {
        data: ticketData,
        execute: fetchTicketData,
    } = useMutation((query) => userService.getTicket());

    const {
        data: dataSpecialties,
        execute: fetchSpecialties,
    } = useMutation(() => getSpecialties());

    const {
        data: dataExaminations,
        loading: loadingExaminations,
        execute: fetchExaminations,
    } = useMutation(() => getExaminations(today, today, status, '', isAppointment, currentPage, pageSize, search, time));

    // Data updates
    useEffect(() => {
        if (ticketData?.EC === 0) {
            setCurrentNumber(ticketData.DT[0]);
            setLoading(false);
        }
    }, [ticketData, type]);

    useEffect(() => {
        if (dataComorbidities?.DT) {
            const options = dataComorbidities.DT.map(item => ({
                id: item.code,
                label: item.disease,
            }));
            setComorbiditiesOptions(options);
        }
    }, [dataComorbidities]);

    useEffect(() => {
        if (dataSpecialties?.DT) {
            const options = dataSpecialties.DT.map(item => ({
                value: item.id,
                label: item.name,
                staffId: item.staffId,
                staffName: item.staffName,
                staffPrice: item.staffPrice
            }));
            setSpecialtyOptions(options);
        }
    }, [dataSpecialties]);

    useEffect(() => {
        if (dataExaminations) {
            setTotal(dataExaminations.DT.totalItems);
            setListExam(dataExaminations.DT.examinations);
            setTotalPatient(dataExaminations.DT.totalPatient);
            setTotalAppointment(dataExaminations.DT.totalAppointment);
        }
    }, [dataExaminations]);

    useEffect(() => {
        fetchExaminations();
    }, [isAppointment, search, time, currentPage, pageSize]);

    // Event handlers
    const openAddExam = (timeSlot) => {
        setIsEditMode(false);
        setIsModalOpen(true);
        setSelectedTimeSlot(timeSlot);
    };

    const closeAddExam = () => {
        setIsModalOpen(false);
        setDataQRCode(null);
    }

    const handleGeneralNumber = async (type) => {
        setLoading(true);
        let response = await userService.generateNumberCurrent({ type });
        if (response?.EC !== 0) {
            message.error(response?.EM);
        }
        fetchTicketData();
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const handleAddExamSuscess = () => {
        fetchExaminations();
    };

    const handleSelectChange = (value) => {
        setStatus(value === 'appointment' ? 2 : 4);
        setIsAppointment(value === 'appointment' ? 1 : 0);
    };

    const handleTimeChange = (value) => {
        setTime(value);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const downItem = () => {
        fetchExaminations();
    };

    const handleClickItem = (id) => {
        const selectedPatient = listExam.find(item => item.id === id);
        console.log("Selected Patient:", selectedPatient);
        if (selectedPatient) {
            setExamId(id);
            setIsEditMode(true);
            setPatientData(selectedPatient);
            setIsModalOpen(true);
        } else {
            message.error('Không tìm thấy thông tin bệnh nhân');
        }
    };

    const handleClickStep = async (id) => {
        const selectedPatient = listExam.find(item => item.id === id);
        if (selectedPatient) {
            try {
                setLoadingSteps(true);
                const response = await getPatienSteps(selectedPatient.id);
                if (response.EC === 0) {
                    setListStep(response);
                    setIsModalStepOpen(true);
                }
            } catch (error) {
                console.error("Error:", error);
                message.error('Lấy dữ liệu bước khám thất bại');
            } finally {
                setLoadingSteps(false);
            }
        } else {
            message.error('Không tìm thấy thông tin bệnh nhân');
        }
    };

    const handleCloseModal = () => {
        setIsModalStepOpen(false);
    };

    const getSpecialClass = (special) => {
        switch (special) {
            case 'old':
                return 'bg-[#ffe3dc] text-[#FF7752] border border-[#FF7752]';
            case 'children':
                return 'bg-[#DDFCED] text-[#3AA472] border border-[#3AA472]';
            case 'disabled':
                return 'bg-[#DFEFFF] text-[#007BFF] border border-[#007BFF]';
            case 'pregnant':
                return 'bg-[#FFD5D8] text-[#ff4851] border border-[#ff4851]';
            default:
                return '';
        }
    };

    // Render functions
    const renderExaminationByTimeSlot = () => {
        // Nếu có chọn time cụ thể, chỉ render time đó
        if (time) {
            const selectedTimeSlot = TIMESLOTS.find(slot => slot.value === time);
            const examsInTimeSlot = listExam.filter(exam => exam.time === time);

            return (
                <div key={time} className="mt-4">
                    <p className="text-base font-medium text-gray-500">{selectedTimeSlot.label}</p>
                    {examsInTimeSlot.length === 0 ? (
                        <div className="p-2.5 bg-white rounded-md border-[1.5px] border-dashed border-[#c9cccc] mx-2.5 flex justify-center mt-2">
                            <p>Không tìm thấy bệnh nhân!</p>
                        </div>
                    ) : (
                        examsInTimeSlot.map((item, index) => (
                            <PatientItem
                                key={item.id}
                                index={index + 1}
                                id={item.id}
                                name={`${item.userExaminationData.lastName} ${item.userExaminationData.firstName}`}
                                symptom={'Triệu chứng: ' + item.symptom}
                                special={item.special}
                                room={item.roomName}
                                doctor={`${item?.examinationStaffData?.staffUserData?.lastName} ${item?.examinationStaffData?.staffUserData?.firstName}`}
                                downItem={downItem}
                                visit_status={item.visit_status}
                                onClickItem={() => handleClickItem(item.id)}
                                sort={true}
                            />
                        ))
                    )}
                    <div className="p-2.5 bg-white rounded-md border-[1.5px] border-dashed border-[#c9cccc] mx-2.5 justify-center mt-2 cursor-pointer hover:shadow-md hover:mx-1.5 transition-all duration-200" onClick={() => openAddExam(time.value)}>
                        <div className="flex justify-center items-center">
                            <i className="fa-solid mr-2 fa-plus"></i>
                            <p className="leading-tight text-center inline-block hover:font-semibold">Thêm bệnh nhân</p>
                        </div>
                    </div>
                </div>
            );
        }

        // Nếu không chọn time, render toàn bộ như cũ
        return TIMESLOTS.map((timeSlot) => {
            const examsInTimeSlot = listExam.filter(exam => exam.time === timeSlot.value);

            return (
                <div key={timeSlot.value} className="mt-4">
                    <p className="text-base font-medium text-gray-500">{timeSlot.label}</p>
                    {examsInTimeSlot.length === 0 ? (
                        <div className="p-2.5 bg-white rounded-md border-[1.5px] border-dashed border-[#c9cccc] mx-2.5 flex justify-center mt-2">
                            <p>Không tìm thấy bệnh nhân!</p>
                        </div>
                    ) : (
                        examsInTimeSlot.map((item, index) => (
                            <PatientItem
                                key={item.id}
                                index={index + 1}
                                id={item.id}
                                name={`${item.userExaminationData.lastName} ${item.userExaminationData.firstName}`}
                                symptom={'Triệu chứng: ' + item.symptom}
                                special={item.special}
                                room={item.roomName}
                                doctor={`${item?.examinationStaffData?.staffUserData?.lastName} ${item?.examinationStaffData?.staffUserData?.firstName}`}
                                downItem={downItem}
                                visit_status={item.visit_status}
                                onClickItem={() => handleClickItem(item.id)}
                                sort={true}
                            />
                        ))
                    )}
                    <div className="p-2.5 bg-white rounded-md border-[1.5px] border-dashed border-[#c9cccc] mx-2.5 justify-center mt-2 cursor-pointer hover:shadow-md hover:mx-1.5 transition-all duration-200" onClick={() => openAddExam(timeSlot.value)}>
                        <div className="flex justify-center items-center">
                            <i className="fa-solid mr-2 fa-plus"></i>
                            <p className="leading-tight text-center inline-block hover:font-semibold">Thêm bệnh nhân</p>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="p-2.5 min-h-screen font-['Be_Vietnam_Pro',_sans-serif]">
            <div className="mx-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-2.5 bg-white h-[105px] rounded-[10px] border-2 border-[#e6eaeb] transition duration-200 ease-in-out hover:shadow-md">
                    <div className="grid grid-cols-7 md:grid-cols-7">
                        <div className="col-span-5 md:col-span-7 lg:col-span-5">
                            <div className="text-gray-500">
                                <p className="m-0 ml-1.5 text-sm text-gray-500">Số bệnh nhân</p>
                            </div>
                            <div className="ms-2 text-[#007BFF] text-3xl font-semibold">
                                <p className="m-0 ml-2.5 text-3xl">{totalPatient}</p>
                            </div>
                            <div className="text-gray-500">
                                <p className="m-0 ml-1.5 text-sm text-gray-500">Ngày {convertDateTime(new Date())}</p>
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-7 lg:col-span-2 text-[#007BFF] flex justify-center">
                            <div className="p-2.5 rounded-full w-[75px] h-[75px] flex justify-center items-center cursor-pointer transition-all duration-200 bg-[#dfefff] hover:scale-105">
                                <i className="text-2xl fa-solid fa-head-side-mask"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-2.5 bg-white h-[105px] rounded-[10px] border-2 border-[#e6eaeb] transition duration-200 ease-in-out hover:shadow-md">
                    <div className="grid grid-cols-7 md:grid-cols-7">
                        <div className="col-span-5 md:col-span-7 lg:col-span-5">
                            <div className="text-gray-500">
                                <p className="m-0 ml-1.5 text-sm text-gray-500">Số lịch hẹn</p>
                            </div>
                            <div className="ms-2 text-[#3AA472] text-3xl font-semibold">
                                <p className="m-0 ml-2.5 text-3xl">{totalAppointment}</p>
                            </div>
                            <div className="text-gray-500">
                                <p className="m-0 ml-1.5 text-sm text-gray-500">Ngày {convertDateTime(new Date())}</p>
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-7 lg:col-span-2 text-[#3AA472] flex justify-center">
                            <div className="p-2.5 rounded-full w-[75px] h-[75px] flex justify-center items-center cursor-pointer transition-all duration-200 bg-[#ddfced] hover:scale-105">
                                <i className="text-2xl fa-solid fa-bookmark"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-2.5 bg-white h-[105px] rounded-[10px] border-2 border-[#e6eaeb] transition duration-200 ease-in-out hover:shadow-md">
                    <div className="grid grid-cols-7 md:grid-cols-7">
                        <div className="col-span-5 md:col-span-7 lg:col-span-5">
                            <div className="text-gray-500">
                                <p className="m-0 ml-1.5 text-sm text-gray-500">
                                    {type === TYPE_NUMBER.NORMAL ? "Số khám thường" : "Số khám ưu tiên"}
                                    <DropdownSpecialty value={type} setValue={(value) => { setType(value) }} />
                                </p>
                            </div>
                            <div className="ms-2 text-[#3AA472] text-3xl font-semibold">
                                <p className="m-0 ml-2.5 text-3xl">{type === TYPE_NUMBER.NORMAL ? currentNumber?.normalNumberCurrent : currentNumber?.priorityNumberCurrent}</p>
                            </div>
                            <div className="text-gray-500">
                                <p className="m-0 ml-1.5 text-sm text-gray-500">Ngày {convertDateTime(new Date())}</p>
                            </div>
                        </div>
                        <div className="col-span-2 md:col-span-7 lg:col-span-2 text-[#3AA472] flex justify-center">
                            <div
                                className="p-2.5 rounded-full w-[75px] h-[75px] flex justify-center items-center cursor-pointer transition-all duration-200 bg-[#ddfced] hover:scale-105"
                                onClick={() => handleGeneralNumber(type)}
                            >
                                {loading ? <Loading /> :
                                    <i className="text-2xl fa-solid fa-user-plus"></i>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Form
                form={form}
                className="mt-4"
                layout="horizontal"
            >
                <div className="flex flex-wrap gap-2 justify-between">
                    <div className="flex flex-wrap gap-2">
                        <div className="w-fit lg:w-40">
                            <Form.Item className="m-0">
                                <Select
                                    className="w-full"
                                    defaultValue="appointment"
                                    onChange={handleSelectChange}
                                >
                                    <Select.Option value="appointment">Hẹn khám</Select.Option>
                                    <Select.Option value="getnumber">Đang chờ khám</Select.Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <div className="w-fit lg:w-48">
                            <Form.Item className="m-0">
                                <Select
                                    className="w-full"
                                    allowClear
                                    placeholder="Chọn khung giờ"
                                    onChange={handleTimeChange}
                                    value={time}
                                    options={TIMESLOTS}
                                />
                            </Form.Item>
                        </div>
                        <div className="w-fit lg:w-64">
                            <Form.Item className="m-0">
                                <Input
                                    className="w-full"
                                    placeholder="Tìm kiếm bệnh nhân..."
                                    onChange={handleSearch}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="w-fit">
                        <button
                            className="h-8 border border-gray-300 py-0 px-5 rounded-md bg-[#007BFF] text-white transition-all duration-200 hover:shadow-md hover:scale-105 w-full md:w-auto"
                            onClick={() => openAddExam(null)}
                        >
                            Thêm bệnh nhân trực tiếp
                        </button>
                    </div>
                </div>
            </Form>

            <input
                ref={hiddenInputRef}
                type="text"
                className="opacity-0 h-0 w-0 absolute pointer-events-none"
                autoComplete="off"
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        // Enter key often signals the end of QR code data
                        setScannedQR(e.target.value);
                        e.target.value = "";
                        scanningInProgressRef.current = false;
                        keystrokeSequenceRef.current = [];
                    }
                }}
            />

            <div className="relative">
                {loadingSteps && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                        <Spin size="large" />
                    </div>
                )}
                <div className={`${loadingSteps ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="mt-4">
                        {loadingExaminations ? (
                            <div className="flex justify-center items-center h-[20vh]">
                                <Spin />
                            </div>
                        ) : (
                            <>
                                {isAppointment === 1 && (
                                    renderExaminationByTimeSlot()
                                )}
                                {isAppointment === 0 && (
                                    listExam && listExam.length > 0 ? listExam.map((item, index) => (
                                        <PatientItem
                                            key={item.id}
                                            index={index + 1}
                                            id={item.id}
                                            name={`${item.userExaminationData.lastName} ${item.userExaminationData.firstName}`}
                                            symptom={item.symptom}
                                            special={item.special}
                                            room={item.roomName}
                                            doctor={'Đang ở đâu'}
                                            downItem={downItem}
                                            visit_status={item.visit_status}
                                            onClickItem={() => handleClickStep(item.id)}
                                            sort={true}
                                            status={+item.status}
                                        />
                                    )) : (
                                        <div className="p-2.5 bg-white rounded-md border-[1.5px] border-dashed border-[#c9cccc] mx-2.5 flex justify-center mt-2">
                                            <p>Không tìm thấy bệnh nhân!</p>
                                        </div>
                                    )
                                )}
                            </>
                        )}
                    </div>
                    <div className="mt-4 flex justify-center">
                        {!loadingExaminations && isAppointment !== 1 && listExam.length > 0 && (
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={total}
                                onChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <AddExamModal
                    dataQRCode={dataQRCode}
                    isOpen={isModalOpen}
                    onClose={closeAddExam}
                    timeSlot={selectedTimeSlot}
                    handleAddExamSuscess={handleAddExamSuscess}
                    isEditMode={isEditMode}
                    patientData={patientData}
                    examId={examId}
                    comorbiditiesOptions={comorbiditiesOptions}
                    specialtyOptions={specialtyOptions}
                //key={patientData ? patientData.id + " " + Date.now() : "modal-closed"}
                />
            )}
            <StepModal
                isOpen={isModalStepOpen}
                onClose={handleCloseModal}
                examinationData={listStep}
            />
        </div>
    );
};

export default ReceptionistDashboard;