import { NavLink, useNavigate } from "react-router-dom";
import { MenuUnfoldOutlined, MenuFoldOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Layout, theme, Input } from 'antd';
const { Header } = Layout;
const { Search } = Input;
import "./AdminHeader.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faLanguage } from "@fortawesome/free-solid-svg-icons";
import { faBell, faEnvelope } from '@fortawesome/free-regular-svg-icons'
const AdminHeader = (props) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    let handleClick = () => {
        props.action(!props.open);
    }
    return (
        <div className="admin-header-content">
            <Header
                style={{
                    padding: 0,
                    background: colorBgContainer,
                }}
            >
                <div className="header row d-flex align-items-center">
                    <div className="btn col-1">
                        <Button
                            type="text"
                            icon={<FontAwesomeIcon icon={faBars} />}
                            onClick={() => handleClick()}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </div>
                    <div className="col-10 col-lg-11 d-flex row">
                        <div className="logo-search col-7 col-lg-10 d-flex justify-content-lg-between justify-content-end align-items-center row">
                            <div className="logo d-none d-lg-block col-6 d-flex align-items-end"></div>
                            <div className="col-lg-6 col-12  d-flex align-items-center">
                                <Input className='my-3 ms-3' placeholder="Tìm kiếm" prefix={<SearchOutlined />}
                                />
                            </div>
                        </div>
                        <div className="icon col-5 col-lg-2 d-flex justify-content-end ">
                            <FontAwesomeIcon icon={faLanguage} size="xl" />
                            <FontAwesomeIcon icon={faEnvelope} size="xl" />
                            <FontAwesomeIcon icon={faBell} size="xl" />
                        </div>
                        <div />
                    </div>
                </div>

            </Header>
        </div>
    );
}

export default AdminHeader;