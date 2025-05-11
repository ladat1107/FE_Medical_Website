import { handleLogoutService } from '@/services/adminService';
import { logout } from '../authenSlice';
import { PATHS } from '@/constant/path';

// Hàm logout chung
export const handleLogout = () => async (dispatch) => {
    try {
        // Gọi API để xóa refresh token trong cookie
        const response = await handleLogoutService();
        if (response?.EC === 0) {
            dispatch(logout())
            window.location.href = PATHS.HOME.LOGIN;
        }
        
    } catch (error) {
        console.error('Error during logout:', error);
    }
};
