import React, { useState } from 'react';
import { Layout } from 'antd';
import './Sidebar.scss';
import { ALL_ROLE } from '@/constant/role';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import MenuSidebarAdmin from './MenuSidebarAdmin';
import MenuSidebar from './MenuSidebarStaff';

const { Sider } = Layout;
const Sidebar = (props) => {
    let { user } = useSelector((state) => state.authen);
    let role = ALL_ROLE.find(item => item.value === user?.role);
    let [broken, setBroken] = useState(false);

    return (
        <div className='sidebar-content'>
            <Sider
                theme="light"
                width={"250px"}
                collapsed={props.open}
                trigger={null}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    setBroken(broken);
                }}
                onCollapse={(collapsed, type) => {
                    //console.log(collapsed, type);
                    props.action(collapsed);
                }}
            >
                <div className='header-sideBar row ps-3 py-1'>
                    <div className='col-3 p-1'>
                        <div
                            className="logo"
                            style={{
                                backgroundImage: `url(${user?.avatar || 'https://ant-cra.cremawork.com/assets/images/avatar/A11.jpg'})`,
                            }}
                        ></div>

                    </div>
                    <div className='col-8 py-2 ps-2'>
                        <div className='d-flex justify-content-between'>
                            <span><b>{user?.firstName}</b></span>
                            {/* user?.lastName + " " +  */}
                        </div>
                        <div>
                            {role?.label}
                        </div>
                    </div>
                    {broken && <div className='icon' onClick={() => props.action(true)}>
                        <FontAwesomeIcon size="lg" icon={faXmark} />
                    </div>
                    }
                </div>
                {user.staff ? <MenuSidebar /> : <MenuSidebarAdmin />}
            </Sider >
        </div >

    );
}

export default Sidebar;