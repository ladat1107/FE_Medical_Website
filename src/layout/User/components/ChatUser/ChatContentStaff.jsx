import { Avatar, Button, Form, Input, message, Progress } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { SendOutlined } from "@ant-design/icons";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Check, CheckCheck, Image, Paperclip, Smile } from "lucide-react";
import { STATUS_MESSAGE } from "@/constant/value";
import { PATHS } from "@/constant/path";
import dayjs from "dayjs";
import { convertDateTimeToString } from "@/utils/formatDate";
import { useConversation, useCreateMessage } from "@/hooks";
import SkeletonChatContent from "../../../Receptionist/pages/Messenger/Skeleton/SkeletonChatContent";
import AttachedFile from "@/layout/Doctor/pages/Notification/NotiItem/attachedFile";
import { uploadFileToCloudinary, uploadToCloudinary } from "@/utils/uploadToCloudinary";
import TooltipMessage from "@/components/Tooltip/TooltipMessage";
import EmojiPicker from 'emoji-picker-react';

const { TextArea } = Input;
const ChatContentStaff = () => {
    const { user, isLoggedIn } = useSelector(state => state.authen);
    const { data: conversationData, isLoading: conversationLoading, refetch: refetchConversationData } = useConversation({ enabled: isLoggedIn })
    const { mutate: createMessage, isPending: isCreatingMessage } = useCreateMessage();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState(null);
    const [emptyStaff, setEmptyStaff] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const [form] = Form.useForm();

    const chatContentRef = useRef(null);
    const inputref = useRef(null);
    const emojiPickerRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        chatContentRef.current?.scrollTo({ top: chatContentRef.current.scrollHeight, behavior: "smooth" });
    };
    useEffect(() => {
        if (conversationData?.EC === 0) {
            setMessages(conversationData?.DT?.messageData || []);
            setReceiver(conversationData?.DT?.staffData || null);
            setEmptyStaff(conversationData?.DT?.staffData ? false : true);
        }
    }, [conversationData])

    useEffect(() => {
        if (!user || !user?.id) {
            navigate(PATHS.HOME.LOGIN);
            message.info("Vui lòng đăng nhập để nhắn tin với nhân viên hỗ trợ");
        }
        const handleClickOutside = (event) => {
            if (
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    useEffect(() => {
        scrollToBottom();
        if (inputref.current) inputref.current.focus();
    }, [messages, isUploading, uploadProgress, isCreatingMessage]);

    const handleScroll = () => {
        if (!chatContentRef.current) return;
        const isAtBottom = chatContentRef.current.scrollTop + chatContentRef.current.clientHeight >= chatContentRef.current.scrollHeight - 50;
        setShowScrollDown(!isAtBottom);
    };

    const sendMessageStaff = async (data) => {
        if (!data.message || !data.message.trim()) return;
        handleCreateMessage(data.message.trim(), null);
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadProgress(0);
        setIsUploading(true);
        try {
            // Gọi hàm upload với callback để cập nhật tiến trình
            const url = await uploadToCloudinary(file, 'Messenger', (progress) => {
                setUploadProgress(progress);
            });
            handleCreateMessage(file.name, url);
        } catch (error) {
            message.error('Tải ảnh lên thất bại, vui lòng thử lại!');
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    }

    const handleUploadFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadProgress(0);
        setIsUploading(true);
        try {
            const url = await uploadFileToCloudinary(file, 'Messenger', (progress) => {
                setUploadProgress(progress);
            });
            handleCreateMessage(file.name, url);
        } catch (error) {
            message.error('Tải file lên thất bại, vui lòng thử lại!');
            console.error('Upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    }

    const handleCreateMessage = (content, link) => {
        const message = {
            conversationId: conversationData?.DT?.id,
            senderId: user?.id,
            content: content,
            link: link,
            createdAt: new Date(),
            status: STATUS_MESSAGE.SENDING
        }
        setMessages(pre => [...pre, message]);
        setEmptyStaff(false);
        form.resetFields();
        setShowEmojiPicker(false);
        createMessage(message, {
            onSuccess: () => {
                refetchConversationData();
                if (!conversationData?.DT?.staffId) {
                    setEmptyStaff(true);
                }
            },
        });
    }

    const onEmojiClick = (emojiData) => {
        const currentMessage = form.getFieldValue('message') || '';
        form.setFieldsValue({
            message: currentMessage + emojiData.emoji,
        });
        // Focus lại vào input sau khi chọn emoji
        inputref.current?.focus();
    };
    return (
        <>
            {conversationLoading ? <SkeletonChatContent /> :
                <div className="flex-grow overflow-y-auto p-2 flex flex-col gap-2 scroll-smooth" ref={chatContentRef} onScroll={handleScroll}>
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                        </div>
                    ) :
                        messages?.map((msg, index) => {
                            const prevMsg = messages[index - 1];
                            const nextMsg = messages[index + 1];
                            const isShowTime = !prevMsg || dayjs(msg.createdAt).diff(dayjs(prevMsg.createdAt), "hour") >= 2;
                            const isShowAvatar = msg.senderId !== user?.id && (msg.senderId !== nextMsg?.senderId || isShowTime)
                            const statusName = msg.status === STATUS_MESSAGE.READ ? "Đã xem" : msg.status === STATUS_MESSAGE.SENT ? "Đã gửi" : msg.status === STATUS_MESSAGE.RECEIVED ? "Đã nhận" : msg.status === STATUS_MESSAGE.SENDING ? "Đang gửi" : "Lỗi";
                            return (
                                <div key={index}>
                                    {isShowTime && (
                                        <div className="text-center text-gray-500 my-3 text-xs">
                                            {dayjs(msg.createdAt).format("HH:mm")} {convertDateTimeToString(msg.createdAt)}
                                        </div>
                                    )}

                                    <div className={`flex items-end mb-1 w-full ${msg.senderId === user?.id ? "flex-row-reverse" : "justify-start"}`}>
                                        {isShowAvatar && <Avatar className="mx-2.5 w-[10%]" size={30} src={receiver?.avatar} />}

                                        <div className="max-w-[70%]">
                                            {msg?.link ?
                                                <div className={`${isShowAvatar ? "" : "ml-[50px]"} flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"}`}>
                                                    {msg.link.includes("image") ?
                                                        <TooltipMessage statusName={statusName} createdAt={msg.createdAt}>
                                                            <img src={msg?.link} onClick={() => window.open(msg?.link, "_blank")} alt="Uploaded" className="max-w-[80%] max-h-60 rounded-xl object-fill my-1 cursor-pointer shadow-md" />
                                                        </TooltipMessage>
                                                        :
                                                        <TooltipMessage statusName={statusName} createdAt={msg.createdAt}>
                                                            <AttachedFile
                                                                link={msg.link}
                                                                type={msg?.link?.split(".")?.pop()?.toLowerCase()}
                                                            />
                                                        </TooltipMessage>}
                                                </div>
                                                :
                                                <TooltipMessage statusName={statusName} createdAt={msg.createdAt}>
                                                    <span
                                                        className={`inline-block p-2.5 rounded-lg w-full break-words ${isShowAvatar ? "" : "ml-[50px]"} ${msg.senderId === user?.id
                                                            ? "bg-primary-tw text-white !ml-0"
                                                            : "bg-gray-200 text-black"
                                                            }`}
                                                    >
                                                        {msg?.content}
                                                    </span>
                                                </TooltipMessage>
                                            }
                                            {msg.senderId === user?.id && !nextMsg && !isUploading && (
                                                <div className="text-xs text-gray-500 mt-0.5 flex items-center justify-end gap-1">
                                                    {msg.status === STATUS_MESSAGE.SENDING && <span className="flex items-center gap-1">Đang gửi...</span>}
                                                    {msg.status === STATUS_MESSAGE.SENT && <span className="flex items-center gap-1">Đã gửi <Check size={10} /></span>}
                                                    {msg.status === STATUS_MESSAGE.RECEIVED && <span className="flex items-center gap-1">Đã nhận <CheckCheck size={10} /></span>}
                                                    {msg.status === STATUS_MESSAGE.READ && <span className="flex items-center gap-1">Đã xem</span>}
                                                    {msg.status === STATUS_MESSAGE.FAILED && <span className="flex items-center gap-1 text-red-500">Gửi thất bại</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div >
                            )
                        })}

                    {emptyStaff && (
                        <div className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1 transition-all duration-300">
                            <span className="flex items-center gap-1">Hiện tại chưa có nhân viên hỗ trợ, vui lòng chờ...</span>
                        </div>
                    )}
                    {isUploading && (
                        <div className="flex flex-row-reverse">
                            <div className="flex flex-col items-end w-[70%]">
                                <Progress type="circle" percent={uploadProgress} status="active" size={80} />
                            </div>
                        </div>
                    )
                    }
                    {showScrollDown && (
                        <div
                            className="fixed flex items-center justify-center bottom-[60px] right-[300px] md:right-20 bg-primary-tw p-2 rounded-full w-[35px] h-[35px] text-white cursor-pointer shadow-md transition-all duration-300 hover:bg-blue-700"
                            onClick={scrollToBottom}
                        >
                            <FontAwesomeIcon icon={faArrowDown} />
                        </div>
                    )}
                </div >}
            <Form form={form} onFinish={sendMessageStaff} className="flex items-center p-2 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <div>
                        <Image htmlFor={`input-upload-image-messenger`} onClick={() => document.getElementById(`input-upload-image-messenger`).click()} size={20} className="text-gray-500 cursor-pointer pt-0.5" />
                        <input type="file" id={`input-upload-image-messenger`} hidden={true} onChange={handleImageUpload} accept="image/*" />
                    </div>
                    <div>
                        <Paperclip htmlFor={`input-upload-file-messenger`} onClick={() => document.getElementById(`input-upload-file-messenger`).click()}
                            size={20} className="text-gray-500 cursor-pointer pt-0.5" />
                        <input type="file" id={`input-upload-file-messenger`} hidden={true} onChange={handleUploadFile}
                            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation" />
                    </div>
                </div>
                <Form.Item name="message" style={{ flex: 1, marginBottom: 0 }}>
                    <TextArea
                        className="mx-2 border-none outline-none shadow-none resize-none overflow-y-auto max-h-24 scrollbar-none"
                        disabled={!user?.id}
                        autoComplete="off"
                        placeholder="Nhập tin nhắn (tối đa 250 ký tự)..."
                        maxLength={500}
                        ref={inputref}
                        autoSize={{ maxRows: 4 }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.altKey) {
                                e.preventDefault();
                                form.submit();
                            } else if (e.key === "Enter" && e.altKey) {
                                const { value } = e.target;
                                form.setFieldsValue({ message: `${value}\n` });
                            }
                        }}
                    />
                </Form.Item>
                <div ref={emojiPickerRef} className="relative">
                    <Smile
                        size={20}
                        className="text-gray-500 cursor-pointer pt-0.5"
                        onClick={() => setShowEmojiPicker(prev => !prev)}
                    />
                    {showEmojiPicker && (
                        <div
                            className="absolute bottom-[50px] right-0 z-[999]"
                        >
                            <EmojiPicker size={20} onEmojiClick={onEmojiClick} skinTonesDisabled={true} previewConfig={{ showPreview: false }}
                                style={{ backgroundColor: "#f4f4f4" }} />
                        </div>
                    )}
                </div>
                <Button
                    icon={<SendOutlined />}
                    htmlType="submit"
                    className="border-none shadow-none ml-2"
                    disabled={!user?.id || isCreatingMessage || conversationLoading}
                />
            </Form>
        </>

    )
}
export default ChatContentStaff;