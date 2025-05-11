"use client"

import "./header-styles.css"
import { useState, useEffect } from "react"
import { Badge, Dropdown, Spin } from "antd"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendarCheck, faHospital } from "@fortawesome/free-regular-svg-icons"
import {
  faStethoscope,
  faSyringe,
  faUser,
  faBars,
  faBell,
  faSignOutAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons"
import { PATHS } from "@/constant/path"
import { TAGS } from "@/constant/value"
import { ROLE } from "@/constant/role"
import { handleLogout } from "@/redux/actions/authenActions"
import { useMobile } from "@/hooks/useMobile"
import { useNotification } from "@/contexts/NotificationContext"
import { useMutation } from "@/hooks/useMutation"
import { getAllNotification } from "@/services/doctorService"
import { timeAgo } from "@/utils/formatDate"
import ParseHtml from "@/components/ParseHtml"
import SvgIcon from "../SvgIcon"
import MobileDrawer from "./mobile-drawer"

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLogin } = useSelector((state) => state.authen)
  const isMobile = useMobile()
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)
  const { totalUnreadCount, socketNotifications } = useNotification()

  // States for notifications
  const [apiNotifications, setApiNotifications] = useState({ rows: [] })
  const [combinedNotifications, setCombinedNotifications] = useState([])

  // Fetch notifications from API
  const {
    data: dataNoti,
    loading: listNotiLoading,
    execute: fetchAllNoti,
  } = useMutation(() => getAllNotification(1, 5, ""))

  // Fetch notifications when dropdown is opened
  useEffect(() => {
    if (isDropdownVisible && user) {
      fetchAllNoti()
    }
  }, [isDropdownVisible])

  // Update API notifications when data changes
  useEffect(() => {
    if (dataNoti && dataNoti.DT !== undefined) {
      setApiNotifications(dataNoti.DT.notifications)
    }
  }, [dataNoti])

  // Combine socket and API notifications
  useEffect(() => {
    if (!apiNotifications.rows) return

    const allNotifications = [...socketNotifications, ...(apiNotifications.rows || [])]

    const uniqueNotiMap = new Map()

    allNotifications.forEach((noti) => {
      if (noti.notiCode) {
        const existingNoti = uniqueNotiMap.get(noti.notiCode)
        if (
          !existingNoti ||
          new Date(noti.createdAt || noti.date) > new Date(existingNoti.createdAt || existingNoti.date)
        ) {
          uniqueNotiMap.set(noti.notiCode, noti)
        }
      } else {
        const uniqueKey = noti.id || `temp-${Date.now()}-${Math.random()}`
        uniqueNotiMap.set(uniqueKey, noti)
      }
    })

    const uniqueNotifications = Array.from(uniqueNotiMap.values())
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date)
        const dateB = new Date(b.createdAt || b.date)
        return dateB - dateA
      })
      .slice(0, 5)

    setCombinedNotifications(uniqueNotifications)
  }, [apiNotifications, socketNotifications])

  // Navigation menu structure
  const navMenu = [
    {
      title: "Dịch vụ",
      inner: [
        {
          title: "Đặt lịch khám",
          icon: <FontAwesomeIcon icon={faCalendarCheck} />,
          action: PATHS.HOME.BOOKING,
        },
      ],
    },
    {
      title: "Bệnh viện",
      inner: [
        {
          title: "Bác sĩ",
          icon: <FontAwesomeIcon icon={faSyringe} />,
          action: PATHS.HOME.DOCTOR_LIST,
        },
        {
          title: "Khoa",
          icon: <FontAwesomeIcon icon={faHospital} />,
          action: PATHS.HOME.DEPARTMENT_LIST,
        },
        {
          title: "Chuyên khoa",
          icon: <FontAwesomeIcon icon={faStethoscope} />,
        },
      ],
    },
    {
      title: "Cẩm nang y tế",
      inner: [
        {
          title: TAGS[2].label,
          icon: null,
          action: `${PATHS.HOME.HANDBOOK_LIST}/${TAGS[2].value}`,
        },
        {
          title: TAGS[4].label,
          icon: null,
          action: `${PATHS.HOME.HANDBOOK_LIST}/${TAGS[4].value}`,
        },
        {
          title: TAGS[5].label,
          icon: null,
          action: `${PATHS.HOME.HANDBOOK_LIST}/${TAGS[5].value}`,
        },
      ],
    },
    {
      title: "Hướng dẫn",
      inner: [
        {
          title: "Các tài khoản",
          icon: null,
          action: PATHS.HOME.INSTRUCTION,
        },
      ],
    },
    ...(user
      ? [
        {
          title: (
            <div>
              <FontAwesomeIcon icon={faUser} /> Tài khoản
            </div>
          ),
          inner: [
            {
              title: "Thông tin cá nhân",
              icon: null,
              action: PATHS.HOME.PROFILE,
            },
            {
              title: "Lịch sử đặt hẹn",
              icon: null,
              action: PATHS.HOME.APPOINTMENT_LIST,
            },
            {
              title: "Thông báo cá nhân",
              icon: null,
              action: PATHS.HOME.NOTIFICATION,
            },
            ...(user.role === ROLE.ADMIN || user.staff
              ? [
                {
                  title: "Trang quản lý",
                  icon: null,
                  action: user.role === ROLE.ADMIN ? PATHS.ADMIN.DASHBOARD : PATHS.STAFF.DASHBOARD,
                },
              ]
              : []),
          ],
        },
      ]
      : []),
  ]

  // Social media links
  const socialLinks = [
    { name: "tiktok", text: "Tiktok" },
    { name: "facebook", text: "Facebook" },
    { name: "youtube", text: "Youtube" },
    { name: "instagram", text: "Instagram" },
  ]

  // Notification dropdown items
  const notificationItems = {
    items: [
      ...(combinedNotifications.map((noti, index) => ({
        key: noti.id || `noti-${index}`,
        label: (
          <div
            className="p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(PATHS.HOME.NOTIFICATION)}
          >
            <div className="font-semibold mb-1 flex items-center gap-2">
              {noti.title || "Thông báo mới"}
              {(noti.status === 1 || noti.isRead === false) && (
                <span className="w-2 h-2 bg-primary-tw rounded-full"></span>
              )}
            </div>
            <div className="text-sm text-gray-600 mb-1">
              {noti.htmlDescription ? (
                <ParseHtml htmlString={noti.htmlDescription} />
              ) : (
                <span>{noti.description || "Không có nội dung"}</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              {noti.date || noti.createdAt ? timeAgo(noti.date || noti.createdAt) : "Vừa nãy"}
            </div>
          </div>
        ),
      })) || []),
      {
        key: "view-all",
        label: (
          <div
            className="p-2 text-center cursor-pointer text-primary-tw hover:bg-gray-100"
            onClick={() => navigate(PATHS.HOME.NOTIFICATION)}
          >
            Xem tất cả thông báo
          </div>
        ),
      },
    ],
  }

  // Handle navigation
  const handleNavigation = (path) => {
    if (path) {
      navigate(path)
      setDrawerVisible(false)
    }
  }

  // Render desktop dropdown menu
  const renderDesktopDropdown = (item, index) => {
    return (
      <Dropdown
        key={index}
        menu={{
          items: item.inner.map((innerItem, innerIndex) => ({
            key: innerIndex,
            label: (
              <div
                className="text-secondaryText-tw flex items-center gap-2 p-2 whitespace-nowrap"
                onClick={() => handleNavigation(innerItem.action)}
              >
                {innerItem.icon && <span>{innerItem.icon}</span>}
                <span>{innerItem.title}</span>
              </div>
            ),
          })),
        }}
        placement="bottom"
      >
        <div className="text-secondaryText-tw cursor-pointer px-3 py-2 hover:text-primary-tw font-semibold text-base flex items-center">
          {typeof item.title === "string" ? item.title : item.title}
          <FontAwesomeIcon icon={faChevronDown} className="hidden lg:block ml-1 text-xs" />
        </div>
      </Dropdown>
    )
  }

  return (
    <div className="shadow-md bg-white">
      {/* Mobile Header */}
      {isMobile ? (
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center" onClick={() => navigate(PATHS.HOME.HOMEPAGE)}>
            <img
              src="https://res.cloudinary.com/utejobhub/image/upload/v1733740053/KHOA_500_x_200_px_dp7on2.png"
              alt="MedPro Logo"
              className="h-10"
            />
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <Badge dot={totalUnreadCount > 0} offset={[-5, 3]}>
                <FontAwesomeIcon
                  icon={faBell}
                  className="text-primary-tw text-xl cursor-pointer"
                  onClick={() => navigate(PATHS.HOME.NOTIFICATION)}
                />
              </Badge>
            )}
            <div
              className="w-9 h-9 flex items-center justify-center rounded-full text-primary-tw  cursor-pointer"
              onClick={() => setDrawerVisible(true)}
            >
              <FontAwesomeIcon icon={faBars} className="text-lg" />
            </div>
          </div>

          {/* Mobile Drawer */}
          <MobileDrawer
            visible={drawerVisible}
            onClose={() => setDrawerVisible(false)}
            user={user}
            handleNavigation={handleNavigation}
            handleLogout={() => {
              dispatch(handleLogout())
              setDrawerVisible(false)
            }}
            paths={PATHS}
            tags={TAGS}
            role={ROLE}
          />
        </div>
      ) : (
        /* Desktop Header */
        <div className="max-w-[1400px] mx-auto flex">
          <div className="flex items-center justify-center w-[150px]">
            <div className="flex items-center cursor-pointer" onClick={() => navigate(PATHS.HOME.HOMEPAGE)}>
              <img
                src="https://res.cloudinary.com/utejobhub/image/upload/v1733740053/KHOA_500_x_200_px_dp7on2.png"
                alt="MedPro Logo"
                className="h-12"
              />
            </div>
          </div>
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <div className="flex items-center gap-6">
                {socialLinks.map((social, index) => (
                  <div key={index} className="flex items-center gap-2 cursor-pointer hover:text-primary-tw">
                    <SvgIcon name={social.name} width={20} height={20} fill="#000" />
                    <span className="hidden lg:block text-sm font-bold text-secondaryText-tw">{social.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {user && (
                  <Dropdown
                    menu={notificationItems}
                    trigger={["click"]}
                    open={isDropdownVisible}
                    onOpenChange={setIsDropdownVisible}
                    overlayStyle={{ width: 350 }}
                    dropdownRender={(menu) => (
                      <div className="bg-white rounded-md shadow-lg">
                        {listNotiLoading ? (
                          <div className="p-5 text-center">
                            <Spin tip="Đang tải thông báo..." />
                          </div>
                        ) : (
                          menu
                        )}
                      </div>
                    )}
                  >
                    <div className="cursor-pointer flex items-center">
                      <Badge dot={totalUnreadCount > 0} offset={[-5, 3]}>
                        <FontAwesomeIcon icon={faBell} className="text-yellow-400 text-xl" />
                      </Badge>
                    </div>
                  </Dropdown>
                )}

                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary-tw text-xl">Chào, {user.firstName}</span>
                    <div
                      onClick={() => dispatch(handleLogout())}
                      className="text-base w-fit px-4  h-10 border-none text-white bg-gradient-primary rounded-full cursor-pointer flex items-center justify-center transition duration-300 hover:opacity-90"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Đăng xuất
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => navigate(PATHS.HOME.LOGIN)}
                    className="text-base w-fit px-4  h-10 border-none text-white bg-gradient-primary rounded-full cursor-pointer flex items-center justify-center transition duration-300 hover:opacity-90"
                  >
                    Đăng nhập
                  </div>
                )}
              </div>
            </div>

            {/* Main Header */}
            <div className="flex py-1">
              <div className="w-full flex justify-end lg:justify-between items-center">
                <div className="hidden lg:flex items-center gap-3 ">
                  <img
                    src="https://medpro.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fhp.a16c51cc.svg&w=1920&q=75"
                    alt="Logo Hoa Sen"
                    className="h-10"
                  />
                  <div>
                    <p className="text-sm text-gray-600">Hỗ trợ đặt khám</p>
                    <p className="text-xl font-bold text-orange-500">0353366459</p>
                  </div>
                </div>

                <div className="flex">{navMenu.map((item, index) => renderDesktopDropdown(item, index))}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header
