"use client"

import { useEffect, useState } from "react"
import { useMutation } from "@/hooks/useMutation"
import { getAllNotification } from "@/services/doctorService"
import { removeExtraSpaces } from "@/utils/formatString"
import { Pagination, Spin, Empty, Badge, Skeleton } from "antd"
import NotiItem from "./NotiItem"
import { useNotification } from "@/contexts/NotificationContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBell,
  faSearch,
  faCheckDouble,
  faCalendarDay,
  faCalendarWeek,
} from "@fortawesome/free-solid-svg-icons"
import "./Notification.css"
import StatusFilter from "./StatusFilter"
const NotificationUser = () => {
  const { socketNotifications, totalUnreadCount, markAllNotificationsAsRead, updateApiUnreadCount, markNotificationAsRead } = useNotification()

  const [loading, setLoading] = useState(true)
  const [searchLoading, setSearchLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all") // "all", "read", "unread"

  // State for API notifications
  const [apiNotifications, setApiNotifications] = useState({ count: 0, rows: [] })
  const [todayNotifications, setTodayNotifications] = useState([])
  const [earlierNotifications, setEarlierNotifications] = useState([])

  // State for expanded notification
  const [expandedNotificationId, setExpandedNotificationId] = useState(null)

  // Handle search
  const handleSearchChange = (e) => {
    const value = removeExtraSpaces(e.target.value)
    setSearch(value)
  }

  const handleSearch = async () => {
    setSearchLoading(true)
    setCurrentPage(1) // Reset to first page when searching
    await fetchAllNoti()
    setSearchLoading(false)
  }

  // Handle key press for search
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  // Handle pagination
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page)
    setPageSize(pageSize)
    setExpandedNotificationId(null) // Close any expanded notification when changing page
  }

  // Handle status filter change
  const handleStatusFilterChange = (key) => {
    let _status = "all"
    if (key === "read") _status = 2
    if (key === "unread") _status = 1
    setStatusFilter(_status)
    setCurrentPage(1) // Reset to first page when changing filter
    setExpandedNotificationId(null) // Close any expanded notification when changing filter
  }

  // Toggle notification expansion
  const toggleNotificationExpansion = async (notification) => {
    // If this notification is already expanded, collapse it
    if (expandedNotificationId === notification.id) {
      setExpandedNotificationId(null)
      return
    }

    // Otherwise, expand this notification and collapse any other
    setExpandedNotificationId(notification.id)

    // Mark notification as read if it's not already read
    if (notification.status === 1) {
      try {
        await markNotificationAsRead(notification.id)
        // Update the notification in our lists
        updateNotificationReadStatus(notification.id)

        // Update unread count
        if (totalUnreadCount > 0) {
          updateApiUnreadCount(totalUnreadCount - 1)
        }
      } catch (error) {
        console.error("Error marking notification as read:", error)
      }
    }
  }

  // Update notification read status in our lists
  const updateNotificationReadStatus = (notificationId) => {
    // Update today's notifications
    setTodayNotifications((prevNotifications) =>
      prevNotifications.map((noti) => (noti.id === notificationId ? { ...noti, status: 2 } : noti)),
    )

    // Update earlier notifications
    setEarlierNotifications((prevNotifications) =>
      prevNotifications.map((noti) => (noti.id === notificationId ? { ...noti, status: 2 } : noti)),
    )
  }

  // Fetch notifications from API
  const {
    data: dataNoti,
    loading: listNotiLoading,
    execute: fetchAllNoti,
  } = useMutation((query) => getAllNotification(currentPage, pageSize, search))

  useEffect(() => {
    fetchAllNoti()
  }, [currentPage])

  // Update state when API data changes
  useEffect(() => {
    if (dataNoti && dataNoti.DT !== undefined) {
      setTotal(dataNoti.DT.totalNotifications)
      setApiNotifications(dataNoti.DT.notifications)
      updateApiUnreadCount(dataNoti.DT.unreadCount)
      setLoading(false)
    }
  }, [dataNoti])

  // Combine API and socket notifications, categorize by date
  useEffect(() => {
    if (!apiNotifications?.rows) return

    const allNotifications = {
      count: (apiNotifications?.rows?.length || 0) + socketNotifications.length,
      rows: [...socketNotifications, ...(apiNotifications?.rows || [])],
    }

    const today = new Date().toDateString()

    // Filter by read status if needed
    let filteredRows = allNotifications.rows
    if (statusFilter === 2) {
      filteredRows = filteredRows.filter((noti) => noti.status === 2)
    } else if (statusFilter === 1) {
      filteredRows = filteredRows.filter((noti) => noti.status === 1)
    }

    const todayNoti = filteredRows.filter((noti) => {
      const createdDate = noti.createdAt || noti.date
      const notiDate = new Date(createdDate).toDateString()
      return notiDate === today
    })

    const earlierNoti = filteredRows.filter((noti) => {
      const createdDate = noti.createdAt || noti.date
      const notiDate = new Date(createdDate).toDateString()
      return notiDate !== today
    })

    setTodayNotifications(todayNoti)
    setEarlierNotifications(earlierNoti)
  }, [apiNotifications, socketNotifications, statusFilter])

  return (
    <div className="min-h-screen bg-white py-6 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 animate-fadeIn">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="bg-primary-tw text-white p-2 rounded-lg mr-3">
              <FontAwesomeIcon icon={faBell} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Thông báo</h1>
            {totalUnreadCount > 0 && (
              <Badge count={totalUnreadCount} className="ml-3 animate-pulse" style={{ backgroundColor: "#ff4d4f" }} />
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Tìm kiếm thông báo..."
                className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-tw focus:border-transparent transition-all"
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-tw transition-colors"
                onClick={handleSearch}
                disabled={searchLoading}
              >
                {searchLoading ? <Spin size="small" /> : <FontAwesomeIcon icon={faSearch} />}
              </button>
            </div>

            <button
              className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all ${totalUnreadCount === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-primary-tw text-white hover:bg-primary-tw-hover hover:shadow-md"
                }`}
              onClick={markAllNotificationsAsRead}
              disabled={totalUnreadCount === 0}
            >
              <FontAwesomeIcon icon={faCheckDouble} className="mr-2" />
              <span >Đánh dấu đã đọc</span>
            </button>
          </div>
        </div>

        {/* Notification Content */}
        <div className="overflow-hidden animate-slideUp">

          <StatusFilter
            statusFilter={statusFilter}
            handleStatusFilterChange={handleStatusFilterChange}
            totalUnreadCount={totalUnreadCount}
          />

          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[120px] w-full rounded-xl border border-gray-100 bg-white animate-pulse mt-10 p-2">
                <Skeleton active />
              </div>
            ))
          ) : (
            <div className="p-6">
              {!todayNotifications.length && !earlierNotifications.length ? (
                <div className="py-16 flex flex-col items-center justify-center">
                  <Empty
                    description={
                      <span className="text-gray-500 text-lg">
                        {search
                          ? "Không tìm thấy thông báo nào phù hợp"
                          : statusFilter === "unread"
                            ? "Không có thông báo chưa đọc"
                            : statusFilter === "read"
                              ? "Không có thông báo đã đọc"
                              : "Bạn chưa có thông báo nào"}
                      </span>
                    }
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Today's Notifications */}
                  {todayNotifications.length > 0 && (
                    <div className="animate-fadeIn">
                      <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faCalendarDay} className="text-primary-tw mr-2" />
                        <h2 className="text-lg font-semibold text-gray-700">Hôm nay</h2>
                      </div>
                      <div className="space-y-3">
                        {todayNotifications.map((noti, index) => (
                          <NotiItem
                            key={noti.id || `today-${Date.now()}-${Math.random()}`}
                            noti={noti}
                            isExpanded={expandedNotificationId === noti.id}
                            onToggleExpand={() => toggleNotificationExpansion(noti)}
                            animationDelay={index * 50}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Earlier Notifications */}
                  {earlierNotifications.length > 0 && (
                    <div className="animate-fadeIn" style={{ animationDelay: "200ms" }}>
                      <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faCalendarWeek} className="text-gray-500 mr-2" />
                        <h2 className="text-lg font-semibold text-gray-700">Trước đó</h2>
                      </div>
                      <div className="space-y-3">
                        {earlierNotifications.map((noti, index) => (
                          <NotiItem
                            key={noti.id || `earlier-${Date.now()}-${Math.random()}`}
                            noti={noti}
                            isExpanded={expandedNotificationId === noti.id}
                            onToggleExpand={() => toggleNotificationExpansion(noti)}
                            animationDelay={index * 50 + 200}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {total > pageSize && (
                <div className="mt-8 flex justify-center">
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={handlePageChange}
                    showSizeChanger
                    pageSizeOptions={["5", "10", "20", "50"]}
                    className="notification-pagination"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default NotificationUser
