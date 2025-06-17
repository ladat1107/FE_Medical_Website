import { Avatar, Button, Form, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SendOutlined } from "@ant-design/icons";
import { clearContent, setChatLoading, setContent } from "@/redux/chatSlice";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import "./ChatBubbleUser.css";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import MarkdownIt from 'markdown-it';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import userService from "@/services/userService";
const { TextArea } = Input;

const ChatContentAI = ({ setTypeMessage }) => {
    const { content, chatLoading, _persistedAt } = useSelector(state => state.chat);
    const [showScrollDown, setShowScrollDown] = useState(false); // Hiển thị mũi tên cuộn xuống
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const chatContentRef = useRef(null); // Tham chiếu vùng nội dung chat
    const inputref = useRef(null);

    const mdParser = new MarkdownIt({
        html: true, // Cho phép xử lý HTML
        linkify: true, // Tự động nhận diện link
        breaks: true,  // Xử lý xuống dòng thành <br/>
    })

    const scrollToBottom = () => {
        chatContentRef.current?.scrollTo({ top: chatContentRef.current.scrollHeight, behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom(); // Nếu không cuộn lên, tự động cuộn xuống
        if (inputref.current) inputref.current.focus(); // Tự động focus vào ô input khi mở chat

        if (_persistedAt) {
            const expired = Date.now() - _persistedAt > 24 * 60 * 60 * 1000;
            if (expired) {
                dispatch(clearContent()); // Gọi action để xóa chat
            }
        }
    }, [content]);

    // Theo dõi vị trí thanh cuộn và hiển thị nút cuộn xuống nếu cần
    const handleScroll = () => {
        if (!chatContentRef.current) return;
        const isAtBottom = chatContentRef.current.scrollTop + chatContentRef.current.clientHeight >= chatContentRef.current.scrollHeight - 50;
        setShowScrollDown(!isAtBottom);
    };

    const sendMessageAI = async (data) => {
        if (!data.message) return;

        let history = [...content];
        const userMessage = { sender: "user", text: data.message };
        dispatch(setContent(userMessage)); // Lưu tin nhắn của user vào Redux
        form.resetFields();
        dispatch(setChatLoading(true)); // Hiển thị loading khi chờ phản hồi từ bot
        try {
            const response = await userService.sendMessage({ message: data.message, history: history.slice(-8) })
            if (response?.EC !== 0) return;
            const botResponse = { sender: "bot", text: response?.DT?.text?.trim(), link: response?.DT?.link || [], action: response?.DT?.action || undefined };
            dispatch(setContent(botResponse));
        } catch (error) {
            clearContent(); // Xóa nội dung chat nếu có lỗi
        } finally {
            dispatch(setChatLoading(false)); // Tắt loading sau khi bot phản hồi
        }
    };

    return (
        <>
            <div
                className="flex-grow overflow-y-auto p-2.5 flex flex-col gap-1.5 scroll-smooth"
                ref={chatContentRef}
                onScroll={handleScroll}
            >
                {content?.map((msg, index) => (
                    <div key={index} className={`flex items-end mb-0.5 w-full ${msg.sender === "user" ? "flex-row-reverse" : "justify-start"}`}>
                        {msg.sender === "bot" &&
                            <Avatar
                                style={{ backgroundColor: "#000", border: "2px solid #00B5F1", borderRadius: "50%" }}
                                src={"https://media.gettyimages.com/id/1492548051/vector/chatbot-logo-icon.jpg?s=612x612&w=0&k=20&c=oh9mrvB70HTRt0FkZqOu9uIiiJFH9FaQWW3p4M6iNno="}
                                className="mx-2.5 w-[10%]"
                                size={30}
                            />
                        }
                        <div className="max-w-[70%]">
                            <span
                                className={`inline-block p-2.5 rounded-lg break-words ${msg.sender === "user"
                                    ? "bg-primary-tw text-white"
                                    : "bg-gray-200 text-black"
                                    }`}
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(mdParser.render(msg?.text)),
                                }}
                            />

                            {msg?.link && msg?.link?.length > 0 && (
                                <div className="mt-2">
                                    {msg?.link?.map((linkItem, linkIndex) => (
                                        <Link
                                            key={linkIndex}
                                            to={linkItem?.url}
                                            onClick={() => setVisible(false)}
                                            className="inline-block px-4 py-1 text-primary-tw border-2 border-primary-tw no-underline rounded-lg transition-colors hover:bg-primary-tw hover:text-white mt-0.5"
                                        >
                                            {linkItem?.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {msg?.action && <div className="text-sm text-center mt-2 text-primary-tw border-2 border-primary-tw rounded-lg p-1 cursor-pointer"
                                onClick={() => setTypeMessage(1)}>
                                Nhắn tin với tiếp nhận viên</div>}
                        </div>
                    </div>
                ))}
                {chatLoading && (
                    <div className="flex items-end mb-0.5">
                        <Avatar
                            className="mx-2.5 w-[10%]"
                            size={30}
                            src={"https://media.gettyimages.com/id/1492548051/vector/chatbot-logo-icon.jpg?s=612x612&w=0&k=20&c=oh9mrvB70HTRt0FkZqOu9uIiiJFH9FaQWW3p4M6iNno="}
                        />
                        <div className="py-1.5 px-2.5 rounded-lg bg-gray-200 text-black">
                            <span className="dot-animation">
                                <span>●</span><span>●</span><span>●</span>
                            </span>
                        </div>
                    </div>
                )}
                {showScrollDown && (
                    <div
                        className="fixed flex items-center justify-center bottom-[60px] right-[300px] md:right-20 bg-primary-tw p-2 rounded-full w-[35px] h-[35px] text-white cursor-pointer shadow-md transition-all duration-300 hover:bg-blue-700"
                        onClick={scrollToBottom}
                    >
                        <FontAwesomeIcon icon={faArrowDown} />
                    </div>
                )}
            </div>
            <Form form={form} onFinish={sendMessageAI} className="flex items-center p-2 border-t border-gray-200">
                <Form.Item name="message" style={{ flex: 1, marginBottom: 0 }}>
                    <TextArea
                        className="mr-2.5 border-none outline-none shadow-none resize-none overflow-y-auto max-h-24 scrollbar-none"
                        autoComplete="off"
                        placeholder="Nhập tin nhắn (tối đa 250 ký tự)..."
                        maxLength={500}
                        ref={inputref}
                        autoSize={{ maxRows: 4 }} // Giới hạn tối đa 4 hàng
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.altKey) {
                                e.preventDefault(); // Ngăn xuống dòng mặc định
                                form.submit(); // Gửi tin nhắn khi nhấn Enter
                            } else if (e.key === "Enter" && e.altKey) {
                                const { value } = e.target;
                                form.setFieldsValue({ message: `${value}\n`, });// Thêm ký tự xuống dòng
                            }
                        }}
                    />
                </Form.Item>
                <Button
                    icon={<SendOutlined />}
                    htmlType="submit"
                    className="border-none shadow-none"
                />
            </Form>
        </>
    )
}
export default ChatContentAI;