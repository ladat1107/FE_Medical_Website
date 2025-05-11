import { Avatar, Button, Form, Input, message, Progress } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { SendOutlined } from "@ant-design/icons";
import "./ChatBubbleUser.scss";
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
    const { user, isLogin } = useSelector(state => state.authen);
    const { data: conversationData, isLoading: conversationLoading, refetch: refetchConversationData } = useConversation({ enabled: isLogin ? true : false })
    const { mutate: createMessage, isPending: isCreatingMessage } = useCreateMessage();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const [form] = Form.useForm();

    const chatContentRef = useRef(null);
    const inputRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const navigate = useNavigate();

    const scrollToBottom = () => {
        chatContentRef.current?.scrollTo({ top: chatContentRef.current.scrollHeight, behavior: "smooth" });
    };
    useEffect(() => {
        if (conversationData?.EC === 0) {
            setMessages(conversationData?.DT?.messageData || []);
            setReceiver(conversationData?.DT?.staffData || null);
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
        if (inputRef.current) inputRef.current.focus();
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
        form.resetFields();
        setShowEmojiPicker(false);
        createMessage(message, {
            onSuccess: () => {
                refetchConversationData();
            },
        });
    }

    const onEmojiClick = (emojiData) => {
        const currentMessage = form.getFieldValue('message') || '';
        form.setFieldsValue({
            message: currentMessage + emojiData.emoji,
        });
        // Focus lại vào input sau khi chọn emoji
        inputRef.current?.focus();
    };
    return (
        <>
            {conversationLoading ? <SkeletonChatContent /> :
                <div className="chat-content" ref={chatContentRef} onScroll={handleScroll}>
                    {messages.length === 0 ? (
                        <div className="empty-chat">
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
                                        <div className="text-center text-muted my-3" style={{ fontSize: "12px" }}>
                                            {dayjs(msg.createdAt).format("HH:mm")} {convertDateTimeToString(msg.createdAt)}
                                        </div>
                                    )}

                                    <div className={`chat-message ${msg.senderId === user?.id ? "user" : "bot"}`}>
                                        {isShowAvatar && <Avatar className="chat-avatar" size={30} src={receiver?.avatar} ></Avatar>}

                                        <div className="chat-text">
                                            {msg?.link ?
                                                <div style={{ marginLeft: isShowAvatar ? "" : "50px", display: "flex", justifyContent: msg.senderId === user?.id ? "flex-end" : "flex-start" }}>
                                                    {msg.link.includes("image") ?
                                                        <TooltipMessage statusName={statusName} createdAt={msg.createdAt}>
                                                            <img src={msg?.link} onClick={() => window.open(msg?.link, "_blank")} alt="Uploaded" className="chat-image" />
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
                                                    <span className={`chat-text-content ${msg.senderId === user?.id ? "user" : "bot"}`} style={{ marginLeft: isShowAvatar ? "" : "50px" }}> {msg?.content}</span>
                                                </TooltipMessage>
                                            }
                                            {msg.senderId === user?.id && !nextMsg && !isUploading && (
                                                <div className="message-status">
                                                    {msg.status === STATUS_MESSAGE.SENDING && <span className="d-flex align-items-center gap-1">Đang gửi...</span>}
                                                    {msg.status === STATUS_MESSAGE.SENT && <span className="d-flex align-items-center gap-1">Đã gửi <Check size={10} /></span>}
                                                    {msg.status === STATUS_MESSAGE.RECEIVED && <span className="d-flex align-items-center gap-1">Đã nhận <CheckCheck size={10} /></span>}
                                                    {msg.status === STATUS_MESSAGE.READ && <span className="d-flex align-items-center gap-1">Đã xem</span>}
                                                    {msg.status === STATUS_MESSAGE.FAILED && <span className="d-flex align-items-center gap-1 text-danger">Gửi thất bại</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div >
                            )
                        })}
                    {isUploading && (
                        <div className="d-flex flex-row-reverse">
                            <div className="d-flex flex-column align-items-end" style={{ width: "70%" }}>
                                <Progress type="circle" percent={uploadProgress} status="active" size={80} />
                            </div>
                        </div>
                    )
                    }
                    {showScrollDown && (
                        <div className="scroll-to-bottom" onClick={scrollToBottom}>
                            <FontAwesomeIcon icon={faArrowDown} />
                        </div>
                    )}
                </div >}
            <Form form={form} onFinish={sendMessageStaff} className="chat-input-container">
                <div className="d-flex align-items-center gap-2">
                    <div>
                        <Image htmlFor={`input-upload-image-messenger`} onClick={() => document.getElementById(`input-upload-image-messenger`).click()} size={20} style={{ color: "gray", cursor: "pointer", paddingTop: "2px" }} />
                        <input type="file" id={`input-upload-image-messenger`} hidden={true} onChange={handleImageUpload} accept="image/*" />
                    </div>
                    <div>
                        <Paperclip htmlFor={`input-upload-file-messenger`} onClick={() => document.getElementById(`input-upload-file-messenger`).click()}
                            size={20} style={{ color: "gray", cursor: "pointer", paddingTop: "2px" }} />
                        <input type="file" id={`input-upload-file-messenger`} hidden={true} onChange={handleUploadFile}
                            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation" />
                    </div>
                </div>
                <Form.Item name="message" style={{ flex: 1, marginBottom: 0 }}>
                    <TextArea
                        className="chat-input"
                        disabled={!user?.id}
                        autoComplete="off"
                        placeholder="Nhập tin nhắn (tối đa 250 ký tự)..."
                        maxLength={500}
                        ref={inputRef}
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
                <div ref={emojiPickerRef} style={{ position: 'relative' }}>
                    <Smile
                        size={20}
                        style={{ color: 'gray', cursor: 'pointer', paddingTop: '2px' }}
                        onClick={() => setShowEmojiPicker(prev => !prev)}
                    />
                    {showEmojiPicker && (
                        <div
                            style={{ position: 'absolute', bottom: '50px', right: 0, zIndex: 999 }}
                        >
                            <EmojiPicker size={20} onEmojiClick={onEmojiClick} skinTonesDisabled={true} previewConfig={{ showPreview: false }}
                                style={{ backgroundColor: "#f4f4f4" }} />
                        </div>
                    )}
                </div>
                <Button icon={<SendOutlined />} htmlType="submit"
                    disabled={!user?.id || isCreatingMessage || conversationLoading} />
            </Form>
        </>

    )
}
export default ChatContentStaff;