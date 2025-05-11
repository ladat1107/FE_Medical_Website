"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
    faCircleInfo,
    faCircleCheck,
    faCircleExclamation,
    faClock,
    faChevronDown,
    faChevronUp,
} from "@fortawesome/free-solid-svg-icons"
import { Badge } from "antd"

const NotiItem = ({ noti, isExpanded, onToggleExpand, animationDelay = 0 }) => {
    // Format date to display
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const hours = date.getHours().toString().padStart(2, "0")
        const minutes = date.getMinutes().toString().padStart(2, "0")
        return `${hours}:${minutes}`
    }

    // Format full date for expanded view
    const formatFullDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const truncateText = (html, maxLength = 100) => {
        if (!html) return "";

        // 1. Tạo một element tạm để loại bỏ các thẻ HTML
        const tempElement = document.createElement("div");
        tempElement.innerHTML = html;
        const plainText = tempElement.textContent || tempElement.innerText || "";

        // 2. Lấy dòng đầu tiên (tính đến \n hoặc hết chuỗi)
        const firstLine = plainText.split("\n")[0].trim();

        // 3. Truncate nếu dài hơn maxLength
        return firstLine.length > maxLength
            ? `${firstLine.substring(0, maxLength)}...`
            : firstLine;
    };

    return (
        <div
            className={`rounded-xl border transition-all ${noti.status === 2 ? "bg-white border-gray-100" : "bg-blue-50 border-blue-100"
                }`}
            style={{ animationDelay: `${animationDelay}ms` }}
        >
            {/* Notification Header */}
            <div className={`p-4 cursor-pointer ${isExpanded ? "border-b border-gray-100" : ""}`} onClick={onToggleExpand}>
                <div className="flex items-center">

                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <h3 className={`font-medium ${noti.isRead ? "text-gray-700" : "text-gray-900"}`}>
                                {noti.title || "Thông báo mới"}
                                {!noti.isRead && <Badge status="processing" className="ml-2" />}
                            </h3>

                            <div className="flex items-start text-xs text-gray-500">
                                <FontAwesomeIcon icon={faClock} className="mr-1" />
                                <span>{formatDate(noti.createdAt || noti.date)}</span>
                            </div>
                        </div>

                        <p className={`mt-1 w-[80%] text-sm ${noti.isRead ? "text-gray-500" : "text-gray-700"}`}>
                            {isExpanded ? "" : truncateText(noti.htmlDescription)}
                        </p>

                        <div className="mt-2 flex justify-end items-center">
                            <span className="text-xs text-secondaryText-tw flex items-center">
                                {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                                <FontAwesomeIcon
                                    icon={isExpanded ? faChevronUp : faChevronDown}
                                    className="ml-1 text-xs transition-transform"
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="p-4 bg-gray-50 animate-slideDown">
                    <div className="mb-3 text-xs text-gray-500">{formatFullDate(noti.createdAt || noti.date)}</div>

                    {/* HTML Description Content */}
                    {noti.htmlDescription ? (
                        <div
                            className="notification-html-content prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: noti.htmlDescription }}
                        />
                    ) : (
                        <div className="text-gray-500 italic text-center py-4">Không có nội dung chi tiết</div>
                    )}
                </div>
            )}
        </div>
    )
}

export default NotiItem
