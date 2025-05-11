"use client"
import { useNavigate, useLocation } from "react-router-dom"
import { Home, BookOpen, FileText, Bell, User } from "lucide-react"
import { Badge } from "antd"
import { PATHS } from "@/constant/path"
import "./menu-mobile-styles.css"

const MenuMobile = ({ unreadNotifications = 0 }) => {
    const navigate = useNavigate()
    const location = useLocation()

    // Menu items configuration
    const menuItems = [
        {
            icon: <Home size={20} />,
            label: "Trang chủ",
            path: PATHS.HOME.HOMEPAGE,
        },
        {
            icon: <BookOpen size={20} />,
            label: "Hướng dẫn",
            path: PATHS.HOME.INSTRUCTION,
        },
        {
            icon: <FileText size={20} />,
            label: "Phiếu khám",
            path: PATHS.HOME.APPOINTMENT_LIST,
        },
        {
            icon: <Bell size={20} />,
            label: "Thông báo",
            path: PATHS.HOME.NOTIFICATION,
            badge: unreadNotifications,
        },
        {
            icon: <User size={20} />,
            label: "Hồ sơ",
            path: PATHS.HOME.PROFILE,
        },
    ]

    // Check if the current path matches the menu item path
    const isActive = (path) => {
        return location.pathname === path
    }

    return (
        <div className="menu-mobile-container">
            <div className="menu-mobile-wrapper">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`menu-mobile-item ${isActive(item.path) ? "active" : ""}`}
                        onClick={() => navigate(item.path)}
                    >
                        {item.badge ? (
                            <Badge count={item.badge} size="small" offset={[2, -2]}>
                                {item.icon}
                            </Badge>
                        ) : (
                            item.icon
                        )}
                        <span className="menu-mobile-label">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MenuMobile
