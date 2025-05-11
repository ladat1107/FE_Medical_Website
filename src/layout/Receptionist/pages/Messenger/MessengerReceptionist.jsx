"use client"

import { useEffect, useRef, useState } from "react"
import { Layout, Input, Avatar, List, Badge, Dropdown, Button, Form, message, Progress } from "antd"
import { SendOutlined, SearchOutlined, MenuOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux"
import { ROLE } from "@/constant/role"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowDown, faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { ArrowLeft, Check, CheckCheck, ImageIcon, Paperclip, Smile } from "lucide-react"
import { convertDateTimeToString, timeAgo } from "@/utils/formatDate"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
import { PATHS } from "@/constant/path"
import MessengerSkeleton from "./Skeleton/MessengerSkeleton"
import SkeletonChatContent from "./Skeleton/SkeletonChatContent"
import { STATUS_MESSAGE } from "@/constant/value"
import EmptyContent from "./Skeleton/EmptyContent"
import { uploadFileToCloudinary, uploadToCloudinary } from "@/utils/uploadToCloudinary"
import AttachedFile from "@/layout/Doctor/pages/Notification/NotiItem/attachedFile"
import { useConversation, useConversationForStaff, useCreateMessage } from "@/hooks/useConversations"
import TooltipMessage from "@/components/Tooltip/TooltipMessage"
import EmojiPicker from "emoji-picker-react"
import { useMobile } from "@/hooks/useMobile"

const { Header, Sider, Content } = Layout
const { TextArea } = Input

const MessengerReceptionist = () => {
    const { user, isLogin } = useSelector((state) => state.authen)
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const { data: conversationSidebar, isLoading: conversationSidebarLoading } = useConversationForStaff({
        enabled: isLogin,
    })
    const [conversationSelected, setConversationSelected] = useState(null)
    const {
        data: conversationData,
        isLoading: conversationLoading,
        isPending: conversationPending,
        refetch: refetchConversationData,
    } = useConversation({ receiverId: conversationSelected?.patientId, enabled: isLogin })
    const { mutate: createMessage, isPending: isCreatingMessage } = useCreateMessage()

    const [hovered, setHovered] = useState(null)

    const [isShowUploadFile, setIsShowUploadFile] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [search, setSearch] = useState("")
    const [conversations, setConversations] = useState([])
    const [showScrollDown, setShowScrollDown] = useState(false)
    const [messages, setMessages] = useState([])
    const [isUploading, setIsUploading] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [sidebarVisible, setSidebarVisible] = useState(true)

    const isMobile = useMobile()

    const chatContentRef = useRef(null)
    const inputRef = useRef(null)
    const emojiPickerRef = useRef(null)

    const scrollToBottom = () => {
        chatContentRef.current?.scrollTo({ top: chatContentRef.current.scrollHeight, behavior: "smooth" })
    }

    useEffect(() => {
        if (conversationSidebar?.DT?.length > 0 && conversationSidebar?.EC === 0) {
            setConversations(conversationSidebar?.DT)
        }
    }, [conversationSidebar])

    useEffect(() => {
        scrollToBottom()
        if (!user || !user?.id || user?.role !== ROLE.RECEPTIONIST) {
            navigate(PATHS.HOME.LOGIN)
            message.info("Vui lòng đăng nhập để nhắn tin")
        }

        const handleClickOutside = (event) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        if (conversationData?.EC === 0) {
            setMessages(conversationData?.DT?.messageData || [])
        }
    }, [conversationData])

    useEffect(() => {
        scrollToBottom()
        if (inputRef.current) inputRef.current.focus() // Tự động focus vào ô input khi mở chat
    }, [messages, isUploading, uploadProgress, isCreatingMessage])

    // Theo dõi vị trí thanh cuộn và hiển thị nút cuộn xuống nếu cần
    const handleScroll = () => {
        if (!chatContentRef.current) return
        const isAtBottom =
            chatContentRef.current.scrollTop + chatContentRef.current.clientHeight >= chatContentRef.current.scrollHeight - 50
        setShowScrollDown(!isAtBottom)
    }

    // Automatically hide sidebar on mobile when a conversation is selected
    useEffect(() => {
        if (isMobile && conversationSelected) {
            setSidebarVisible(false)
        }
    }, [conversationSelected, isMobile])

    // Set sidebar visible by default on desktop
    useEffect(() => {
        setSidebarVisible(!isMobile || !conversationSelected)
    }, [isMobile])

    const sendMessageStaff = async (data) => {
        if (!data.message || !data.message.trim()) return
        handleCreateMessage(null, data.message.trim())
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploadProgress(0)
        setIsUploading(true)
        try {
            // Gọi hàm upload với callback để cập nhật tiến trình
            const url = await uploadToCloudinary(file, "Messenger", (progress) => {
                setUploadProgress(progress)
            })
            handleCreateMessage(url, file.name)
        } catch (error) {
            message.error("Tải ảnh lên thất bại, vui lòng thử lại!")
            console.error("Upload failed:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleUploadFile = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploadProgress(0)
        setIsUploading(true)
        try {
            const url = await uploadFileToCloudinary(file, "Messenger", (progress) => {
                setUploadProgress(progress)
            })
            handleCreateMessage(url, file.name)
        } catch (error) {
            message.error("Tải file lên thất bại, vui lòng thử lại!")
            console.error("Upload failed:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const menu = [
        { label: "Ẩn", key: "1" },
        { label: "Xóa", key: "2" },
    ]

    const handleCreateMessage = (link, content) => {
        const message = {
            conversationId: conversationSelected?.id,
            senderId: user?.id,
            content: content,
            link: link,
            createdAt: new Date(),
            status: STATUS_MESSAGE.SENDING,
        }
        setMessages((pre) => [...pre, message])
        form.resetFields()
        createMessage(message, {
            onSuccess: () => {
                refetchConversationData()
            },
        })
    }

    const onEmojiClick = (emojiData) => {
        const currentMessage = form.getFieldValue("message") || ""
        form.setFieldsValue({
            message: currentMessage + emojiData.emoji,
        })
        // Focus lại vào input sau khi chọn emoji
        inputRef.current?.focus()
    }
    const handleBackToList = () => {
        setConversationSelected(null)
        setSidebarVisible(true)
    }
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible)
        handleBackToList()
    }



    return (
        <Layout className="h-screen bg-white">
            {conversationLoading || conversationSidebarLoading ? (
                <MessengerSkeleton />
            ) : (
                <>
                    {/* Sidebar - conditionally rendered based on sidebarVisible state */}
                    {sidebarVisible && (
                        <Sider
                            width={isMobile ? "100%" : 300}
                            className="bg-white border-r border-gray-300 overflow-hidden"
                            style={{
                                position: isMobile ? "absolute" : "relative",
                                zIndex: 10,
                                height: "100%",
                                width: isMobile ? "100%" : 300,
                            }}
                        >
                            <Header className="flex items-center justify-start gap-2 bg-primary-tw text-white p-4 text-center text-lg font-semibold">
                                <ArrowLeft className="cursor-pointer" onClick={() => navigate(PATHS.STAFF.DASHBOARD)} />
                                <span>Danh sách tin nhắn</span>
                            </Header>
                            <div className="p-2 mb-2">
                                <Input
                                    prefix={<SearchOutlined />}
                                    placeholder="Tìm kiếm bệnh nhân..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="border-none shadow-none bg-gray-200"
                                />
                            </div>
                            <List
                                itemLayout="horizontal"
                                className="overflow-y-auto max-h-[calc(100vh-100px)]"
                                dataSource={conversations}
                                renderItem={(item) => (
                                    <List.Item
                                        className={`p-3 cursor-pointer transition-all ${conversationSelected?.patientId === item.patientId ? "bg-blue-100" : ""}`}
                                        onClick={() => {
                                            setConversationSelected(item)
                                        }}
                                        onMouseEnter={() => setHovered(item.id)}
                                        onMouseLeave={() => setHovered(null)}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Badge>
                                                    <Avatar size={40} src={item?.patientData?.avatar || ""} />
                                                </Badge>
                                            }
                                            title={
                                                <div className="flex items-center justify-between">
                                                    <span className="truncate max-w-[150px]">
                                                        {item?.patientData?.lastName + " " + item?.patientData?.firstName}
                                                    </span>
                                                    {hovered === item.id ? (
                                                        <Dropdown menu={{ items: menu }} trigger={["click"]} className="chat-more-icon">
                                                            <FontAwesomeIcon icon={faEllipsis} />
                                                        </Dropdown>
                                                    ) : (
                                                        <span className="text-xs text-gray-500">
                                                            {" "}
                                                            {timeAgo(item?.updatedAt).replace("trước", "")}
                                                        </span>
                                                    )}
                                                </div>
                                            }
                                            description={
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-black truncate max-w-[180px]">{item.lastMessage}</span>
                                                    {item?.messageData?.length > 0 && item?.id !== conversationSelected?.id && (
                                                        <Badge count={item.messageData.length} offset={[0, 0]} />
                                                    )}
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Sider>
                    )}

                    {/* Main Chat Area */}
                    <Layout className="flex flex-col h-full">
                        <Header className="bg-white p-4 border-b border-gray-300 flex items-center justify-between">
                            {isMobile && <Button type="text" icon={<MenuOutlined />} onClick={toggleSidebar} className="mr-2" />}
                            {conversationSelected ? (
                                <div className="flex items-center gap-3 flex-1">
                                    <Avatar src={conversationSelected?.patientData?.avatar || ""} />
                                    <span className="font-medium text-lg truncate">
                                        {conversationSelected?.patientData?.lastName + " " + conversationSelected?.patientData?.firstName}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex-1 text-center font-medium">Chọn một cuộc trò chuyện</div>
                            )}
                        </Header>

                        {!conversationSelected && !isMobile ? (
                            <EmptyContent />
                        ) : (
                            <>
                                <Content
                                    className="flex-1 p-4 overflow-y-auto bg-gray-100"
                                    ref={chatContentRef}
                                    onScroll={handleScroll}
                                >
                                    {conversationLoading ? (
                                        <SkeletonChatContent />
                                    ) : (
                                        <>
                                            {messages.length > 0 ? (
                                                messages.map((msg, index) => {
                                                    const prevMsg = messages[index - 1]
                                                    const nextMsg = messages[index + 1]
                                                    const isShowTime =
                                                        !prevMsg || dayjs(msg.createdAt).diff(dayjs(prevMsg.createdAt), "hour") >= 2
                                                    const isShowAvatar =
                                                        msg.senderId !== user?.id && (msg.senderId !== nextMsg?.senderId || isShowTime)
                                                    const statusName =
                                                        msg.status === STATUS_MESSAGE.READ
                                                            ? "Đã xem"
                                                            : msg.status === STATUS_MESSAGE.SENT
                                                                ? "Đã gửi"
                                                                : msg.status === STATUS_MESSAGE.RECEIVED
                                                                    ? "Đã nhận"
                                                                    : msg.status === STATUS_MESSAGE.SENDING
                                                                        ? "Đang gửi"
                                                                        : "Lỗi"
                                                    return (
                                                        <div key={index}>
                                                            {isShowTime && (
                                                                <div className="text-center text-gray-500 my-3 text-xs">
                                                                    {dayjs(msg.createdAt).format("HH:mm")} {convertDateTimeToString(msg.createdAt)}
                                                                </div>
                                                            )}

                                                            <div
                                                                className={`flex items-end gap-2 mb-1 ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}
                                                            >
                                                                {/* Nếu là tin nhắn của người khác */}
                                                                {msg.senderId !== user?.id && (
                                                                    <>
                                                                        {isShowAvatar ? (
                                                                            <Avatar
                                                                                className="chat-avatar"
                                                                                size={30}
                                                                                src={conversationSelected?.patientData?.avatar}
                                                                            />
                                                                        ) : (
                                                                            // Avatar ẩn => tạo khoảng trống để căn chỉnh
                                                                            <div className="w-[30px]" />
                                                                        )}
                                                                    </>
                                                                )}

                                                                {/* Nội dung tin nhắn */}
                                                                <div
                                                                    className={`max-w-[85%] sm:max-w-[70%] w-fit ${msg.senderId !== user?.id && !isShowAvatar ? "ms-[5px]" : ""}`}
                                                                >
                                                                    {msg?.link ? (
                                                                        msg.link.includes("image") ? (
                                                                            <TooltipMessage statusName={statusName} createdAt={msg.createdAt}>
                                                                                <img
                                                                                    src={msg?.link || "/placeholder.svg"}
                                                                                    alt="Uploaded"
                                                                                    onClick={() => window.open(msg?.link, "_blank")}
                                                                                    className="rounded-lg object-cover h-40 sm:h-60 cursor-pointer shadow-md"
                                                                                />
                                                                            </TooltipMessage>
                                                                        ) : (
                                                                            <AttachedFile
                                                                                link={msg.link}
                                                                                type={msg?.link?.split(".")?.pop()?.toLowerCase()}
                                                                            />
                                                                        )
                                                                    ) : (
                                                                        <TooltipMessage statusName={statusName} createdAt={msg.createdAt}>
                                                                            <div
                                                                                className={`break-words whitespace-normal py-[8px] px-[12px] ${msg.senderId === user?.id ? "bg-primary-tw text-white" : "bg-gray-200"} ${msg.content.length > 110 ? "rounded-[20px]" : "rounded-[50px]"}`}
                                                                            >
                                                                                {msg.content}
                                                                            </div>
                                                                        </TooltipMessage>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {!nextMsg && msg.senderId === user?.id && !isUploading && (
                                                                <div className="text-right text-gray-500 mt-2 text-xs">
                                                                    {msg.status === STATUS_MESSAGE.SENDING && (
                                                                        <span className="flex items-center justify-end gap-1">Đang gửi...</span>
                                                                    )}
                                                                    {msg.status === STATUS_MESSAGE.SENT && (
                                                                        <span className="flex items-center justify-end gap-1">
                                                                            Đã gửi <Check size={10} />
                                                                        </span>
                                                                    )}
                                                                    {msg.status === STATUS_MESSAGE.RECEIVED && (
                                                                        <span className="flex items-center justify-end gap-1">
                                                                            Đã nhận <CheckCheck size={10} />
                                                                        </span>
                                                                    )}
                                                                    {msg.status === STATUS_MESSAGE.READ && (
                                                                        <span className="flex items-center justify-end gap-2">
                                                                            Đã xem{" "}
                                                                            <Avatar
                                                                                className="border border-primary-tw"
                                                                                size={17}
                                                                                src={conversationSelected?.patientData?.avatar}
                                                                            />
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })
                                            ) : (
                                                <div className="text-center text-gray-500 my-3 text-base">
                                                    Hãy bắt đầu cuộc trò chuyện với bệnh nhân
                                                </div>
                                            )}
                                            {isUploading && (
                                                <div className="flex flex-row-reverse">
                                                    <div className="flex flex-col items-end w-[85%] sm:w-[70%]">
                                                        <div className="mt-[8px] w-[60%] sm:w-[40%] h-[40px]">
                                                            <Progress percent={uploadProgress} status="active" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {showScrollDown && (
                                        <div
                                            className="absolute left-1/2 transform -translate-x-1/2 bottom-12 bg-primary-tw p-2 rounded-full w-9 h-9 text-white cursor-pointer shadow-md flex items-center justify-center transition-all hover:bg-primary-tw/80"
                                            onClick={scrollToBottom}
                                        >
                                            <FontAwesomeIcon icon={faArrowDown} />
                                        </div>
                                    )}
                                </Content>
                                <Form
                                    form={form}
                                    onFinish={sendMessageStaff}
                                    className="flex items-center px-[10px] py-[6px] bg-white border-t border-gray-300 w-full"
                                >
                                    <div className={`flex items-center gap-2 ${isShowUploadFile && "hidden"}`}>
                                        <div>
                                            <ImageIcon
                                                htmlFor={`input-upload-image-messenger`}
                                                onClick={() => document.getElementById(`input-upload-image-messenger`).click()}
                                                size={20}
                                                className="text-gray-500 cursor-pointer pt-1"
                                            />
                                            <input
                                                type="file"
                                                id={`input-upload-image-messenger`}
                                                hidden={true}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                            />
                                        </div>
                                        <div>
                                            <Paperclip
                                                htmlFor={`input-upload-file-messenger`}
                                                onClick={() => document.getElementById(`input-upload-file-messenger`).click()}
                                                size={20}
                                                className="text-gray-500 cursor-pointer pt-1"
                                            />
                                            <input
                                                type="file"
                                                id={`input-upload-file-messenger`}
                                                hidden={true}
                                                onChange={handleUploadFile}
                                                accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation"
                                            />
                                        </div>
                                    </div>
                                    <Form.Item name="message" className="flex-1 m-0">
                                        <TextArea
                                            className="chat-input border-none outline-none shadow-none resize-none overflow-y-auto max-h-24"
                                            autoComplete="off"
                                            disabled={isUploading}
                                            placeholder="Nhập tin nhắn"
                                            maxLength={500}
                                            ref={inputRef}
                                            onChange={(e) => setIsShowUploadFile(e.target.value.length > 0)}
                                            autoSize={{ maxRows: 4 }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.altKey) {
                                                    e.preventDefault()
                                                    form.submit()
                                                } else if (e.key === "Enter" && e.altKey) {
                                                    const { value } = e.target
                                                    form.setFieldsValue({ message: `${value}\n` })
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                    <div ref={emojiPickerRef} className="relative">
                                        <Smile
                                            size={25}
                                            className="text-gray-500 cursor-pointer pt-1"
                                            onClick={() => setShowEmojiPicker((prev) => !prev)}
                                        />
                                        {showEmojiPicker && (
                                            <div className="absolute bottom-12 right-[-25px] z-50">
                                                <EmojiPicker
                                                    onEmojiClick={onEmojiClick}
                                                    skinTonesDisabled={true}
                                                    previewConfig={{ showPreview: false }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        icon={<SendOutlined />}
                                        htmlType="submit"
                                        disabled={isUploading}
                                        className="outline-none border-none shadow-none"
                                    />
                                </Form>
                            </>
                        )}
                    </Layout>
                </>
            )}
        </Layout>
    )
}

export default MessengerReceptionist
