import { useEffect, useState } from "react";
import { Badge, Drawer, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./ChatBubbleUser.scss";
import { clearContent } from "@/redux/chatSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAstronaut, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

import ChatContentAI from "./ChatContentAI";
import ChatContentStaff from "./ChatContentStaff";
import { useDispatch, useSelector } from "react-redux";
import { MessageCirclePlus } from "lucide-react";
import { useGetNumberMessageUnread } from "@/hooks";
import { backgroundColorAdmin, primaryColorAdmin, secondaryColorAdmin } from "@/styles/variables";
import { useMobile } from "@/hooks/useMobile";

const ChatBubbleUser = () => {
  const dispatch = useDispatch();
  const { user, isLogin } = useSelector(state => state.authen)
  const [typeMessage, setTypeMessage] = useState(2);
  const [visible, setVisible] = useState(false);
  const { data: numberMessageUnread } = useGetNumberMessageUnread(isLogin ? true : false);
  const count = numberMessageUnread?.DT || 0;
  const isMobile = useMobile();
  useEffect(() => {
    if (count > 0) { setTypeMessage(1) }
  }, [numberMessageUnread])

  return (
    <div className={`chat-bubble-container ${isMobile ? 'mobile' : ''}`}>
      <div className="chat-toggle" onClick={() => setVisible(!visible)}>
        {visible ? <CloseOutlined /> :
          <Badge count={count} offset={[6, -8]}>< MessageCirclePlus size={25} color="white" /> </Badge>}
      </div>
      <Drawer
        className="chat-drawer"
        title={<div className="chat-title">
          <FontAwesomeIcon style={{ cursor: "pointer" }} icon={faXmark} onClick={() => setVisible(false)} />
          <div className="title" >Hỗ trợ trực tuyến
            {!user?.staff && <FontAwesomeIcon title={typeMessage === 1 ? "Nhắn với Hoa Sen Mini" : "Nhắn với nhân viên hỗ trợ"} icon={faUserAstronaut} beat color={primaryColorAdmin} style={{ cursor: "pointer", }} onClick={() => setTypeMessage(typeMessage === 1 ? 2 : 1)} />
            }
          </div>
          <FontAwesomeIcon style={{ cursor: "pointer", color: "gray" }} icon={faTrashCan} onClick={() => dispatch(clearContent())} />
        </div>}
        placement="right"
        width={window.innerWidth > 700 ? 600 : '100vw'}
        closable={false}
        onClose={() => setVisible(false)}
        open={visible}
      >
        {typeMessage === 1 ? <ChatContentStaff count={count} /> : <ChatContentAI />}
      </Drawer >
    </div >
  );
};

export default ChatBubbleUser;
