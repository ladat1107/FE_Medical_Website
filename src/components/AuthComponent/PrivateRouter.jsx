
import { Outlet, Navigate } from "react-router-dom";
import { PATHS } from "@/constant/path";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { message } from "antd";
const PrivateRouter = () => {
    let { user, isLoggedIn, isLogout } = useSelector((state) => state.authen);
    useEffect(() => {
        if ((!user || isLoggedIn === false) && isLogout === false) {
            message.info("Vui lòng đăng nhập để sử dụng tính năng này");
        }
    }, [user])
    return user && isLoggedIn === true ? <Outlet /> : <Navigate to={PATHS.HOME.LOGIN} />;
}
export default PrivateRouter;