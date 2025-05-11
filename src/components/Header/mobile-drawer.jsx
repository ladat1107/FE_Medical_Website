"use client"

import { useState } from "react"
import { Drawer } from "antd"
import {
    Home,
    Calendar,
    Clock,
    Stethoscope,
    Building2,
    Hospital,
    FileText,
    BookOpen,
    Handshake,
    User,
    FileCheck,
    Bell,
    Settings,
    Phone,
    Mail,
    Download,
    LogOut,
    ChevronDown,
    Heart,
    Search,
    Newspaper,
    X,
} from "lucide-react"

const MobileDrawer = ({ visible, onClose, user, handleNavigation, handleLogout, paths, tags, role }) => {
    // State for expanded menu items
    const [expandedItems, setExpandedItems] = useState({})

    // Toggle expanded state for menu items
    const toggleExpand = (itemTitle) => {
        setExpandedItems((prev) => ({
            ...prev,
            [itemTitle]: !prev[itemTitle],
        }))
    }

    // Drawer menu items with Lucide React icons
    const drawerMenuItems = [
        {
            title: "Dịch vụ y tế",
            icon: <Heart size={20} className="text-primary-tw" />,
            hasChildren: true,
            children: [
                {
                    title: "Đặt lịch khám",
                    icon: <Calendar size={18} className="text-primary-tw" />,
                    action: paths.HOME.BOOKING,
                },
                {
                    title: "Đặt khám theo bác sĩ",
                    icon: <Stethoscope size={18} className="text-primary-tw" />,
                    action: paths.HOME.DOCTOR_LIST,
                },
                {
                    title: "Đặt khám theo giờ",
                    icon: <Clock size={18} className="text-primary-tw" />,
                },
            ],
        },
        {
            title: "Khám sức khỏe doanh nghiệp",
            icon: <Building2 size={20} className="text-primary-tw" />,
        },
        {
            title: "Bệnh viện & Phòng khám",
            icon: <Hospital size={20} className="text-primary-tw" />,
            hasChildren: true,
            children: [
                {
                    title: "Danh sách bệnh viện",
                    icon: <Building2 size={18} className="text-primary-tw" />,
                },
                {
                    title: "Danh sách phòng khám",
                    icon: <Hospital size={18} className="text-primary-tw" />,
                },
                {
                    title: "Tìm bác sĩ",
                    icon: <Search size={18} className="text-primary-tw" />,
                    action: paths.HOME.DOCTOR_LIST,
                },
                {
                    title: "Khoa",
                    icon: <Hospital size={18} className="text-primary-tw" />,
                    action: paths.HOME.DEPARTMENT_LIST,
                },
                {
                    title: "Chuyên khoa",
                    icon: <Stethoscope size={18} className="text-primary-tw" />,
                },
            ],
        },
        {
            title: "Tin tức",
            icon: <Newspaper size={20} className="text-primary-tw" />,
            hasChildren: true,
            children: [
                {
                    title: tags[2].label,
                    icon: <FileText size={18} className="text-primary-tw" />,
                    action: `${paths.HOME.HANDBOOK_LIST}/${tags[2].value}`,
                },
                {
                    title: tags[4].label,
                    icon: <FileText size={18} className="text-primary-tw" />,
                    action: `${paths.HOME.HANDBOOK_LIST}/${tags[4].value}`,
                },
                {
                    title: tags[5].label,
                    icon: <FileText size={18} className="text-primary-tw" />,
                    action: `${paths.HOME.HANDBOOK_LIST}/${tags[5].value}`,
                },
            ],
        },
        {
            title: "Hướng dẫn",
            icon: <BookOpen size={20} className="text-primary-tw" />,
            action: paths.HOME.INSTRUCTION,
        },
        {
            title: "Liên hệ hợp tác",
            icon: <Handshake size={20} className="text-primary-tw" />,
        },
    ]

    // User account menu items if user is logged in
    const userMenuItems = user
        ? [
            {
                title: "Tài khoản của tôi",
                icon: <User size={20} className="text-primary-tw" />,
                hasChildren: true,
                children: [
                    {
                        title: "Thông tin cá nhân",
                        icon: <User size={18} className="text-primary-tw" />,
                        action: paths.HOME.PROFILE,
                    },
                    {
                        title: "Lịch sử đặt hẹn",
                        icon: <FileCheck size={18} className="text-primary-tw" />,
                        action: paths.HOME.APPOINTMENT_LIST,
                    },
                    {
                        title: "Thông báo cá nhân",
                        icon: <Bell size={18} className="text-primary-tw" />,
                        action: paths.HOME.NOTIFICATION,
                    },
                    ...(user.role === role.ADMIN || user.staff
                        ? [
                            {
                                title: "Trang quản lý",
                                icon: <Settings size={18} className="text-primary-tw" />,
                                action: user.role === role.ADMIN ? paths.ADMIN.DASHBOARD : paths.STAFF.DASHBOARD,
                            },
                        ]
                        : []),
                ],
            },
        ]
        : []

    // Support section items
    const supportItems = [
        {
            title: "Hỗ trợ Zalo",
            icon: <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" className="w-5 h-5" />,
        },
        {
            title: "Hỗ trợ Facebook",
            icon: <img src="https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FFacebook.5a7382d8.svg&w=3840&q=75" alt="Facebook" className="w-5 h-5" />,
        },
        {
            title: "Hỗ trợ đặt khám: 1900-2115",
            icon: <Phone size={20} className="text-primary-tw" />,
        },
        {
            title: "benhvienhoasen@gmail.com",
            icon: <img src="https://res.cloudinary.com/degcwwwii/image/upload/v1745237642/4202011_email_gmail_mail_logo_social_icon_xpsc4r.svg" alt="Email" className="w-5 h-5" />,
        },
        {
            title: "Tải ứng dụng tại đây",
            icon: <Download size={20} className="text-primary-tw" />,
            description: "Ứng dụng đặt khám nhanh tại hơn 300 bệnh viện hàng đầu Việt Nam",
        },
    ]

    // Combine all menu items
    const allMenuItems = [...userMenuItems, ...drawerMenuItems]

    return (
        <Drawer
            title={
                <div className="flex items-center gap-2 text-primary-tw">
                    <span className="font-bold">Bệnh viện Hoa Sen</span>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width={360}
            headerStyle={{ borderBottom: "1px solid #f0f0f0", padding: "12px 16px" }}
            bodyStyle={{ padding: 0 }}
            closeIcon={
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100">
                    <X size={18} />
                </div>
            }
        >
            <div className="flex flex-col h-full">

                {/* Main menu items */}
                <div className="overflow-y-auto flex-1">
                    {/* User info in drawer */}
                    {user && (
                        <div className="p-4 bg-gradient-primary text-white mb-2 rounded-xl mx-3 my-2">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary-tw">
                                    <User size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-lg">
                                        {user.lastName} {user.firstName}
                                    </div>
                                    <div className="text-sm text-gray-200"><i>{user?.email}</i></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {allMenuItems.map((item, index) => (
                        <div key={index} className="border-b border-gray-100">
                            <div
                                className={`flex items-center justify-between p-3 cursor-pointer ${expandedItems[item.title] ? "bg-gray-50" : "hover:bg-gray-50"
                                    }`}
                                onClick={() => {
                                    if (item.hasChildren) {
                                        toggleExpand(item.title)
                                    } else if (item.action) {
                                        handleNavigation(item.action)
                                    }
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="font-medium">{item.title}</span>
                                </div>
                                {item.hasChildren && (
                                    <div className={`transition-transform duration-200 ${expandedItems[item.title] ? "rotate-180" : ""}`}>
                                        <ChevronDown size={18} />
                                    </div>
                                )}
                            </div>

                            {/* Submenu items */}
                            {item.hasChildren && expandedItems[item.title] && (
                                <div className="bg-gray-50 pl-10">
                                    {item.children.map((child, childIndex) => (
                                        <div
                                            key={childIndex}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-t border-gray-100"
                                            onClick={() => child.action && handleNavigation(child.action)}
                                        >
                                            {child.icon}
                                            <span>{child.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Support section */}
                    <div className="mt-2 border-t border-gray-200 pt-2">
                        <div className="px-4 py-2 text-sm font-bold text-gray-500 uppercase">Hỗ trợ</div>
                        {supportItems.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                                onClick={() => item.action && handleNavigation(item.action)}
                            >
                                {item.icon}
                                <div>
                                    <div className="font-medium">{item.title}</div>
                                    {item.description && <div className="text-xs text-gray-500 mt-1">{item.description}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logout button */}
                {user && (
                    <div
                        className="mt-auto mx-4 px-3 py-2 mb-4 bg-gradient-primary text-white rounded-xl text-center cursor-pointer flex items-center justify-center gap-2"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} />
                        <span className="font-medium">Đăng xuất</span>
                    </div>
                )}
            </div>
        </Drawer>
    )
}

export default MobileDrawer
