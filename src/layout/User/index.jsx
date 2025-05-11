import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBubbleUser from "./components/ChatUser/ChatBubbleUser";
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuMobile from "@/components/MenuMobile/MenuMobile";
import { useMobile } from "@/hooks/useMobile";
function MainLayout() {
    const isMobile = useMobile();
    return (
        <>
            <Header />
            <Outlet />
            <ChatBubbleUser />
            <Footer />
            {isMobile && <MenuMobile />}
        </>

    );
}

export default MainLayout;
