import { handleLogoutService } from '@/services/adminService';
import { logout, setIsLogout } from '../authenSlice';
import { PATHS } from '@/constant/path';

// Hàm logout chung
export const handleLogout = (navigate) => async (dispatch) => {
    try {
        const response = await handleLogoutService();
        if (response?.EC === 0) {
            dispatch(logout());
            navigate(PATHS.HOME.LOGIN); // 👉 không reload trang

            setTimeout(() => {
                dispatch(setIsLogout(false));
            }, 500);
        }
    } catch (error) {
        console.error('Error during logout:', error);
    }
};
