import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import AdminHeader from './components/AdminHeader/AdminHeader';
import './Admin.scss';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROLE } from '@/constant/role';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '@/components/Sidebar/SidebarAdmin';
import { handleLogout } from '@/redux/actions/authenActions';
import 'bootstrap/dist/css/bootstrap.min.css';
const { Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    let navigate = useNavigate();
    let { user } = useSelector((state) => state.authen);
    let dispatch = useDispatch();
    const location = useLocation();
    useEffect(() => {
        if (user.role !== ROLE.ADMIN) {  // Clears the localStorage (optional)
            dispatch(handleLogout());
        }
    }, [location, user.role, dispatch, navigate]);
    // Cập nhật kích thước màn hình khi thay đổi
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup để gỡ bỏ sự kiện khi component bị hủy
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const action = (value) => {
        setCollapsed(value);
    }
    const isMobileView = screenWidth < 700;
    return (
        <div className='admin-content'>
            <Layout>
                <Sidebar
                    open={collapsed}
                    action={action} />
                <Layout style={{ marginLeft: !isMobileView && !collapsed ? 250 : 0 }}>
                    <AdminHeader
                        open={collapsed}
                        action={action} />
                    <div className='content-data'>
                        <Content>
                            <Outlet />
                        </Content>
                    </div>
                    {/* <AdminFooter /> */}
                </Layout>
            </Layout>
        </div>
    );
};
export default AdminLayout;