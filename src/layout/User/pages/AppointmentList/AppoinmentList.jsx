"use client"

import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { message, Skeleton, Tabs, Badge, Empty, DatePicker, Pagination } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAddressCard, faCalendarCheck, faCircleUser, faClock, faEnvelope } from "@fortawesome/free-regular-svg-icons"
import {
    faBriefcaseMedical,
    faLocationDot,
    faMobileScreen,
    faCalendarDays,
    faCircleCheck,
    faCircleXmark,
    faHourglassHalf,
    faMoneyBill,
    faFileCirclePlus,
    faBan,
} from "@fortawesome/free-solid-svg-icons"
import dayjs from "dayjs"
import Container from "@/components/Container"
import { formatDate } from "@/utils/formatDate"
import { STATUS_BE, TABLE, TIMESLOTS } from "@/constant/value"
import { PATHS } from "@/constant/path"
import { useMutation } from "@/hooks/useMutation"
import userService from "@/services/userService"
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal"
import { OldParaclinicalModal } from "@/components/Modals"
import "./AppoimentList.css"
const AppointmentList = () => {
    const [show, setShow] = useState(false)
    const [showOldParaclinicalModal, setShowOldParaclinicalModal] = useState(false)
    const [obAppoinment, setObAppoinment] = useState(null)
    const [listAppoinment, setListAppoinment] = useState([])
    const [isLoading, setIsLoading] = useState(null)
    const [activeTab, setActiveTab] = useState("all")
    const [dateFilter, setDateFilter] = useState("all")
    const [expandedCard, setExpandedCard] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [showDatePicker, setShowDatePicker] = useState(false)

    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search)

    const {
        data: appoinmentData,
        loading: appoinmentLoading,
        execute: getAppoinment,
    } = useMutation(() => userService.getAppoinment({ status: 2 }))

    useEffect(() => {
        const confirmToken = queryParams.get("confirm")
        if (confirmToken !== null) {
            const fetchConfirmAsync = async () => {
                const response = await userService.confirmTokenBooking({ token: confirmToken })
                if (response?.EC === 0 || response?.EC === 1) {
                    message.success(response?.EM)
                    navigate(PATHS.HOME.APPOINTMENT_LIST)
                } else {
                    message.error(response?.EM)
                    navigate(PATHS.HOME.APPOINTMENT_LIST)
                }
            }
            fetchConfirmAsync()
        }
    }, [])

    useEffect(() => {
        getAppoinment()
    }, [location])

    useEffect(() => {
        if (appoinmentData) {
            setListAppoinment(appoinmentData.DT)
            setCurrentPage(1) // Reset to first page when data changes
        }
    }, [appoinmentData])

    const handleCheckOut = async (profile) => {
        setIsLoading(profile.id)
        try {
            const response = await userService.checkOutAppointment({ id: profile.id })
            if (response?.EC === 0) {
                window.location.href = response?.DT?.shortLink
            } else {
                message.error(response?.EM)
            }
        } catch (e) {
            console.log(e)
        } finally {
            setIsLoading(null)
        }
    }

    const refresh = () => {
        setObAppoinment(null)
        getAppoinment()
    }

    const handleUpdateOldParaclinical = async (images) => {
        try {
            const response = await userService.updateOldParaclinical({
                id: obAppoinment.id,
                oldParaclinical: images,
            })
            if (response?.EC === 0) {
                message.success(response?.EM)
                refresh()
            } else {
                message.error(response?.EM)
            }
        } catch (e) {
            console.log(e)
            message.error("Lỗi cập nhật phiếu khám cũ")
        }
    }

    const dateFilterOptions = [
        { key: "all", label: "Tất cả ngày" },
        { key: "today", label: "Hôm nay" },
        { key: "tomorrow", label: "Ngày mai" },
        { key: "week", label: "Tuần này" },
        { key: "custom", label: "Tùy chọn" },
    ]

    const handleDateChange = (date) => {
        setSelectedDate(date)
        if (date) {
            setDateFilter("custom")
        } else {
            setDateFilter("all")
        }
    }

    const filteredAppointments = listAppoinment.filter((appointment) => {
        // Filter by status tab
        if (activeTab !== "all") {
            if (activeTab === "pending" && appointment.status !== STATUS_BE.PENDING) return false
            if (
                activeTab === "completed" &&
                (appointment.status === STATUS_BE.INACTIVE || appointment.status === STATUS_BE.PENDING)
            )
                return false
            if (activeTab === "inactive" && appointment.status !== STATUS_BE.INACTIVE) return false
        }

        // Filter by date
        if (dateFilter !== "all") {
            const appointmentDate = dayjs(appointment.admissionDate)
            const today = dayjs().startOf("day")

            if (dateFilter === "today" && !appointmentDate.isSame(today, "day")) return false
            if (dateFilter === "tomorrow" && !appointmentDate.isSame(today.add(1, "day"), "day")) return false
            if (dateFilter === "week" && (appointmentDate.isBefore(today) || appointmentDate.isAfter(today.add(7, "day"))))
                return false
            if (dateFilter === "custom" && selectedDate && !appointmentDate.isSame(dayjs(selectedDate), "day")) return false
        }

        return true
    })

    // Pagination
    const paginatedAppointments = filteredAppointments.slice((currentPage - 1) * pageSize, currentPage * pageSize)

    // Count appointments by status
    const pendingCount = listAppoinment.filter((app) => app.status === STATUS_BE.PENDING).length
    const completedCount = listAppoinment.filter(
        (app) => app.status !== STATUS_BE.INACTIVE && app.status !== STATUS_BE.PENDING,
    ).length
    const inactiveCount = listAppoinment.filter((app) => app.status === STATUS_BE.INACTIVE).length

    const tabItems = [
        {
            key: "all",
            label: (
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarDays} />
                    <span>Tất cả</span>
                    <Badge count={listAppoinment.length} className="ml-1" />
                </div>
            ),
        },
        {
            key: "pending",
            label: (
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faHourglassHalf} />
                    <span>Chờ xác nhận</span>
                    <Badge count={pendingCount} className="ml-1" />
                </div>
            ),
        },
        {
            key: "completed",
            label: (
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircleCheck} />
                    <span>Đã hoàn thành</span>
                    <Badge count={completedCount} className="ml-1" />
                </div>
            ),
        },
        {
            key: "inactive",
            label: (
                <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCircleXmark} />
                    <span>Đã hủy</span>
                    <Badge count={inactiveCount} className="ml-1" />
                </div>
            ),
        },
    ]

    const toggleCardExpand = (id) => {
        if (expandedCard === id) {
            setExpandedCard(null)
        } else {
            setExpandedCard(id)
        }
    }

    const getStatusColor = (profile) => {
        if (profile.status === STATUS_BE.INACTIVE) return "bg-red-500"
        if (profile.status !== STATUS_BE.INACTIVE && profile.status !== STATUS_BE.PENDING) return "bg-green-500"
        if (profile.status === STATUS_BE.PENDING) {
            if (profile.paymentId) return "bg-blue-500"
            return "bg-yellow-500"
        }
        return "bg-gray-500"
    }

    const getStatusText = (profile) => {
        if (profile.status === STATUS_BE.INACTIVE) return profile.paymentId ? "Đã hoàn tiền" : "Đã hủy"
        if (profile.status !== STATUS_BE.INACTIVE && profile.status !== STATUS_BE.PENDING) return "Đã hoàn thành"
        if (profile.status === STATUS_BE.PENDING) {
            if (profile.paymentId) return "Đã thanh toán"
            return "Chờ thanh toán"
        }
        return "Không xác định"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
            <Container>
                <div className="py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div className="animate-fadeIn">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                                <span className="bg-[#00B5F1] text-white p-2 rounded-lg mr-3">
                                    <FontAwesomeIcon icon={faCalendarCheck} />
                                </span>
                                Lịch hẹn khám bệnh
                            </h1>
                            <p className="text-gray-500">Quản lý và theo dõi các cuộc hẹn khám bệnh của bạn</p>
                        </div>

                        <div className="flex flex-wrap gap-2 animate-fadeIn w-full md:w-auto">
                            <div className="relative w-full md:w-auto flex flex-wrap gap-2">
                                {dateFilterOptions.map((option) => (
                                    <button
                                        key={option.key}
                                        onClick={() => {
                                            if (option.key === "custom") {
                                                setShowDatePicker(!showDatePicker)
                                            } else {
                                                setDateFilter(option.key)
                                                setSelectedDate(null)
                                                setShowDatePicker(false)
                                            }
                                        }}
                                        className={`px-3 py-1.5 text-sm rounded-full transition-all duration-300 ${dateFilter === option.key
                                            ? "bg-[#00B5F1] text-white shadow-md"
                                            : "bg-white text-gray-600 hover:bg-gray-100"
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                                {showDatePicker && (
                                    <div className="absolute top-full mt-2 right-0 z-10 bg-white shadow-lg rounded-lg p-2">
                                        <DatePicker
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            format="DD/MM/YYYY"
                                            placeholder="Chọn ngày"
                                            className="w-full"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-slideUp">
                        <Tabs
                            activeKey={activeTab}
                            onChange={setActiveTab}
                            items={tabItems}
                            className="appointment-tabs"
                            tabBarStyle={{ padding: "0 16px", marginBottom: 0 }}
                        />

                        <div className="p-6">
                            {appoinmentLoading ? (
                                <div className="space-y-6">
                                    {Array.from({ length: 3 }, (_, index) => (
                                        <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-md p-4 animate-pulse">
                                            <div className="flex items-center gap-4 mb-4">
                                                <Skeleton.Avatar active size={64} />
                                                <div className="flex-1">
                                                    <Skeleton active paragraph={{ rows: 1 }} />
                                                </div>
                                            </div>
                                            <Skeleton active paragraph={{ rows: 3 }} />
                                        </div>
                                    ))}
                                </div>
                            ) : filteredAppointments.length > 0 ? (
                                <div>
                                    <div className="grid grid-cols-1 gap-6">
                                        {paginatedAppointments.map((profile, index) => (
                                            <div
                                                key={index}
                                                className={`bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden transition-all duration-500 animate-fadeIn ${expandedCard === profile.id ? "ring-2 ring-[#00B5F1]" : "hover:shadow-lg"
                                                    }`}
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                {/* Card Header */}
                                                <div
                                                    className="flex items-center cursor-pointer p-2 md:p-4 border-b border-gray-100"
                                                    onClick={() => toggleCardExpand(profile.id)}
                                                >
                                                    <div
                                                        className={`hidden md:block w-3 h-12 rounded-full mr-4 ${getStatusColor(profile)}`}
                                                        style={{ transition: "all 0.3s ease" }}
                                                    ></div>

                                                    <div className="flex-1">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#00B5F1]">
                                                                    <FontAwesomeIcon icon={faCircleUser} size="lg" />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-lg text-gray-800">
                                                                        {profile?.userExaminationData?.lastName +
                                                                            " " +
                                                                            profile?.userExaminationData?.firstName}
                                                                    </h3>
                                                                    <p className="text-sm text-gray-500">
                                                                        {profile?.userExaminationData?.gender === 0 ? "Nam" : "Nữ"} •{" "}
                                                                        {profile?.userExaminationData?.dob
                                                                            ? formatDate(profile?.userExaminationData?.dob)
                                                                            : "Chưa cập nhật"}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Improved responsive design for status and time */}
                                                            <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
                                                                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                                                                    <FontAwesomeIcon icon={faClock} className="text-[#00B5F1] text-xs" />
                                                                    <span className="text-xs font-medium text-blue-700">
                                                                        {TIMESLOTS[profile?.time - 1].label}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
                                                                    <FontAwesomeIcon icon={faCalendarDays} className="text-[#00B5F1] text-xs" />
                                                                    <span className="text-xs font-medium text-blue-700">
                                                                        {formatDate(profile?.admissionDate || new Date())}
                                                                    </span>
                                                                </div>

                                                                <div
                                                                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs ${getStatusColor(
                                                                        profile,
                                                                    )}`}
                                                                >
                                                                    <span className="font-medium">{getStatusText(profile)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="ml-2 transform transition-transform duration-300">
                                                        <svg
                                                            className={`w-5 h-5 text-gray-500 ${expandedCard === profile.id ? "rotate-180" : ""}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth="2"
                                                                d="M19 9l-7 7-7-7"
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Card Content - Expanded View */}
                                                <div
                                                    className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedCard === profile.id ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                                        }`}
                                                >
                                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        {/* Left Column */}
                                                        <div className="space-y-4">
                                                            <h4 className="font-semibold text-gray-700 border-b pb-2">Thông tin bệnh nhân</h4>

                                                            <div className="space-y-3">
                                                                <div className="flex items-start">
                                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                                                        <FontAwesomeIcon icon={faAddressCard} className="text-[#00B5F1]" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-500">CCCD/CMND</p>
                                                                        <p className="font-medium text-gray-800">
                                                                            {profile?.userExaminationData?.cid || "Chưa cập nhật"}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-start">
                                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                                                        <FontAwesomeIcon icon={faEnvelope} className="text-[#00B5F1]" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-500">Email</p>
                                                                        <p className="font-medium text-gray-800 break-all">
                                                                            {profile?.userExaminationData?.email || "Chưa cập nhật"}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-start">
                                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                                                        <FontAwesomeIcon icon={faMobileScreen} className="text-[#00B5F1]" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-500">Số điện thoại</p>
                                                                        <p className="font-medium text-gray-800">
                                                                            {profile?.userExaminationData?.phoneNumber || "Chưa cập nhật"}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Right Column */}
                                                        <div className="space-y-4">
                                                            <h4 className="font-semibold text-gray-700 border-b pb-2">Thông tin cuộc hẹn</h4>

                                                            <div className="space-y-3">
                                                                <div className="flex items-start">
                                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                                                        <FontAwesomeIcon icon={faBriefcaseMedical} className="text-[#00B5F1]" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-500">
                                                                            {profile?.examinationStaffData?.positon || "Bác sĩ"}
                                                                        </p>
                                                                        <p className="font-medium text-gray-800">
                                                                            {profile?.examinationStaffData?.staffUserData?.lastName +
                                                                                " " +
                                                                                profile?.examinationStaffData?.staffUserData?.firstName}
                                                                        </p>
                                                                        <p className="text-sm text-blue-600 mt-1">
                                                                            Chuyên khoa: {profile?.examinationStaffData?.staffSpecialtyData?.name}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-start">
                                                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 mt-0.5">
                                                                        <FontAwesomeIcon icon={faLocationDot} className="text-[#00B5F1]" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm text-gray-500">Phòng khám</p>
                                                                        <p className="font-medium text-gray-800">{profile?.roomName || "Chưa cập nhật"}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Symptoms Section */}
                                                    <div className="px-6 pb-6">
                                                        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-4">
                                                            <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-5 w-5 mr-2 text-[#00B5F1]"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                    />
                                                                </svg>
                                                                Triệu chứng
                                                            </h4>
                                                            <p className="text-[#00B5F1] font-medium">{profile?.symptom || "Chưa cập nhật"}</p>
                                                        </div>
                                                    </div>

                                                    {/* Actions Section */}
                                                    {profile?.status === STATUS_BE.PENDING && (
                                                        <div className="px-6 pb-6 flex flex-wrap justify-end gap-3">
                                                            {!profile?.paymentId && (
                                                                <button
                                                                    disabled={isLoading === profile?.id}
                                                                    className="bg-[#00B5F1] text-white px-4 py-2 rounded-xl font-medium transition-all hover:bg-[#0095c8] hover:shadow-md disabled:opacity-70 flex items-center group text-sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        handleCheckOut(profile)
                                                                    }}
                                                                >
                                                                    {isLoading === profile?.id ? (
                                                                        <span className="flex items-center">
                                                                            <svg
                                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <circle
                                                                                    className="opacity-25"
                                                                                    cx="12"
                                                                                    cy="12"
                                                                                    r="10"
                                                                                    stroke="currentColor"
                                                                                    strokeWidth="4"
                                                                                ></circle>
                                                                                <path
                                                                                    className="opacity-75"
                                                                                    fill="currentColor"
                                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                                ></path>
                                                                            </svg>
                                                                            Thanh toán
                                                                        </span>
                                                                    ) : (
                                                                        <>
                                                                            <FontAwesomeIcon
                                                                                icon={faMoneyBill}
                                                                                className="mr-2 transform group-hover:scale-110 transition-transform"
                                                                            />
                                                                            Thanh toán
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}

                                                            <button
                                                                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-xl font-medium transition-all hover:from-purple-600 hover:to-purple-700 hover:shadow-md flex items-center group text-sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation()
                                                                    setObAppoinment(profile)
                                                                    setShowOldParaclinicalModal(true)
                                                                }}
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={faFileCirclePlus}
                                                                    className="mr-2 transform group-hover:scale-110 transition-transform"
                                                                />
                                                                Thêm phiếu xét nghiệm
                                                            </button>

                                                            {!dayjs(profile?.admissionDate).isBefore(dayjs().add(1, "day").startOf("day")) && (
                                                                <button
                                                                    className="bg-white text-red-500 border-2 border-red-500 px-4 py-2 rounded-xl font-medium transition-all hover:bg-red-50 hover:shadow-md flex items-center group text-sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation()
                                                                        setObAppoinment(profile)
                                                                        setShow(true)
                                                                    }}
                                                                >
                                                                    <FontAwesomeIcon
                                                                        icon={faBan}
                                                                        className="mr-2 transform group-hover:scale-110 transition-transform"
                                                                    />
                                                                    Hủy lịch hẹn
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {filteredAppointments.length > pageSize && (
                                        <div className="mt-6 flex justify-center">
                                            <Pagination
                                                current={currentPage}
                                                pageSize={pageSize}
                                                total={filteredAppointments.length}
                                                onChange={(page) => setCurrentPage(page)}
                                                showSizeChanger
                                                onShowSizeChange={(current, size) => {
                                                    setPageSize(size)
                                                    setCurrentPage(1)
                                                }}
                                                pageSizeOptions={["5", "10", "20", "50"]}
                                                className="appointment-pagination"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="py-12 flex flex-col items-center justify-center animate-fadeIn">
                                    <Empty
                                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                                        description={
                                            <div className="text-center">
                                                <p className="text-lg font-medium text-gray-500 mb-2">Không có lịch hẹn nào</p>
                                                <p className="text-gray-400">
                                                    {activeTab !== "all"
                                                        ? `Không tìm thấy lịch hẹn nào trong mục "${tabItems.find((tab) => tab.key === activeTab)?.label?.props?.children[1]?.props
                                                            ?.children
                                                        }"`
                                                        : "Hiện tại bạn chưa có lịch hẹn khám bệnh nào"}
                                                </p>
                                            </div>
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>

            <ConfirmModal
                show={show}
                isShow={(value) => setShow(value)}
                data={obAppoinment}
                refresh={refresh}
                table={TABLE.EXAMINATION}
                key={obAppoinment ? obAppoinment.id + " " + Date.now() : "modal-closed"}
            />

            <OldParaclinicalModal
                visible={showOldParaclinicalModal}
                onCancel={() => setShowOldParaclinicalModal(false)}
                oldParaclinical={obAppoinment?.oldParaclinical}
                onSave={handleUpdateOldParaclinical}
            />

        </div>
    )
}

export default AppointmentList
