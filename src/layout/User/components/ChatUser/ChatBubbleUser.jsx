import { useEffect, useState } from "react";
import { Badge, Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { clearContent } from "@/redux/chatSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAstronaut, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import ChatContentAI from "./ChatContentAI";
import ChatContentStaff from "./ChatContentStaff";
import { useDispatch, useSelector } from "react-redux";
import { MessageCirclePlus } from "lucide-react";
import { useGetNumberMessageUnread } from "@/hooks";
import { primaryColorAdmin } from "@/styles/variables";
import { useMobile } from "@/hooks/useMobile";

const ChatBubbleUser = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useSelector(state => state.authen)
  const [typeMessage, setTypeMessage] = useState(2);
  const [visible, setVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { data: numberMessageUnread } = useGetNumberMessageUnread(isLoggedIn);
  const count = numberMessageUnread?.DT || 0;
  const isMobile = useMobile();

  useEffect(() => {
    if (count > 0) { setTypeMessage(1) }
  }, [numberMessageUnread]);

  useEffect(() => {
    // Xử lý bàn phím trên mobile
    const handleResize = () => {
      const visualViewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;

      if (windowHeight - visualViewportHeight > 100) {
        // Bàn phím đang hiển thị
        setKeyboardHeight(windowHeight - visualViewportHeight);
      } else {
        setKeyboardHeight(0);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={`fixed bottom-20 right-5 z-[1000] ${isMobile ? 'md:bottom-5' : 'bottom-5'}`}>
      <div
        className="w-[50px] h-[50px] bg-primary-tw rounded-full flex items-center justify-center cursor-pointer text-white text-2xl shadow-md"
        onClick={() => setVisible(!visible)}
      >
        {visible ? <CloseOutlined /> :
          <Badge count={count} offset={[6, -8]}>< MessageCirclePlus size={25} color="white" /> </Badge>}
      </div>
      <Drawer
        className="chat-drawer"
        title={
          <div className="flex justify-between items-center">
            <FontAwesomeIcon
              className="cursor-pointer"
              icon={faXmark}
              onClick={() => setVisible(false)}
            />
            <div className="flex gap-2.5 font-bold text-lg text-primary-tw">
              Hỗ trợ trực tuyến
              {!user?.staff &&
                <FontAwesomeIcon
                  title={typeMessage === 1 ? "Nhắn với Hoa Sen Mini" : "Nhắn với nhân viên hỗ trợ"}
                  icon={faUserAstronaut}
                  beat
                  color={primaryColorAdmin}
                  className="cursor-pointer"
                  onClick={() => setTypeMessage(typeMessage === 1 ? 2 : 1)}
                />
              }
            </div>
            <FontAwesomeIcon
              className="cursor-pointer text-gray-500"
              icon={faTrashCan}
              onClick={() => dispatch(clearContent())}
            />
          </div>
        }
        placement="right"
        width={window.innerWidth > 700 ? 600 : '100vw'}
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
        style={{
          height: `calc(100vh - ${keyboardHeight}px)`,
          transition: 'height 0.3s ease'
        }}
        bodyStyle={{
          padding: '10px 0 0 0',
          display: 'flex',
          flexDirection: 'column',
          height: `calc(100% - 60px - ${keyboardHeight}px)`,
        }}
      >
        {typeMessage === 1 ? <ChatContentStaff count={count} /> : <ChatContentAI setTypeMessage={setTypeMessage} />}
      </Drawer >
    </div >
  );
};

export default ChatBubbleUser;
