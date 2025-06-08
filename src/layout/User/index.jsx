import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatBubbleUser from "./components/ChatUser/ChatBubbleUser";
import 'bootstrap/dist/css/bootstrap.min.css';
import MenuMobile from "@/components/MenuMobile/MenuMobile";
import { useMobile } from "@/hooks/useMobile";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { urlAuthorization } from "@/utils/urlAuthorization";
import { ROLE } from "@/constant/role";
function MainLayout() {
    const isMobile = useMobile();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.authen);
    useEffect(() => {
        if (user?.role && user.role !== ROLE.PATIENT) {
            navigate(urlAuthorization(user.role));
        }
    }, [location, user])
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
