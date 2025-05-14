import { useEffect, useState } from 'react';
import './Notification.scss'
import ViewNoti from './ViewNoti/viewnoti';
import SendNoti from './SendNoti/sendnoti';
import { useMutation } from '@/hooks/useMutation';
import { getAllNotification, getAllUserToNotify, markAllRead } from '@/services/doctorService';
import { message, Pagination } from 'antd';
import { useSelector } from 'react-redux';
import { removeExtraSpaces } from '@/utils/formatString';
import { useNotification } from '@/contexts/NotificationContext';
import NotificationSkeleton from './Skeletons/NotificationSkeleton';

const Notification = () => {
    let { user } = useSelector((state) => state.authen);
    const { markAllNotificationsAsRead } = useNotification();

    const [selectedRadio, setSelectedRadio] = useState('viewnoti');
    const [userData, setUserData] = useState({});
    const [notiData, setNotiData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userDataLoaded, setUserDataLoaded] = useState(false);
    const [notiDataLoaded, setNotiDataLoaded] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const [searchValue, setSearchValue] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [socketUnreadCount, setSocketUnreadCount] = useState(0);

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const handleRadioChange = (e) => {
        setSelectedRadio(e.target.value);
    };

    const handleSearchChange = (e) => {
        const value = removeExtraSpaces(e.target.value);
        setSearch(value);
        setSearchValue(value);
    };

    const handleSeach = async () => {
        setSearchLoading(true);
        await fetchAllNoti();
        setSearchLoading(false);
    };

    const isDeanById = (id) => {
        const numId = Number(id);
        return userData?.userGroups.some(group =>
            group.users.some(user =>
                Number(user?.id) === numId && user?.isDean === true
            )
        );
    };


    const handleMarkAllAsRead = async () => {
        try {
            // Sử dụng hàm từ context để đảm bảo cập nhật tất cả các component
            await markAllNotificationsAsRead();

            // Cập nhật local state của component này
            setNotiData(prev => ({
                ...prev,
                rows: prev?.rows?.map((noti) => ({ ...noti, status: 2 })) || []
            }));

            setUnreadCount(0);
            setSocketUnreadCount(0);

        } catch (error) {
            console.error("Lỗi khi đánh dấu tất cả thông báo đã đọc", error);
            message.error("Có lỗi xảy ra khi đánh dấu thông báo đã đọc");
        }
    };

    let {
        data: dataUser,
        loading: listUserLoading,
        execute: fetchAllUser,
    } = useMutation((query) => getAllUserToNotify())

    useEffect(() => {
        if (dataUser && dataUser.DT !== undefined) {
            setUserData(dataUser.DT);
            setUserDataLoaded(true);
        }
    }, [dataUser]);

    let {
        data: dataNoti,
        loading: listNotiLoading,
        execute: fetchAllNoti,
    } = useMutation((query) => getAllNotification(currentPage, pageSize, search))

    useEffect(() => {
        if (dataNoti && dataNoti.DT !== undefined) {
            setTotal(dataNoti.DT.totalNotifications);
            setNotiData(dataNoti.DT.notifications);
            setUnreadCount(dataNoti.DT.unreadCount);
            setNotiDataLoaded(true);
        }
    }, [dataNoti]);

    // Theo dõi cả hai trạng thái đã tải để cập nhật loading chính
    useEffect(() => {
        if (userDataLoaded && notiDataLoaded) {
            setLoading(false);
        }
    }, [userDataLoaded, notiDataLoaded]);

    useEffect(() => {
        fetchAllUser();
    }, []);

    useEffect(() => {
        fetchAllNoti();
    }, [currentPage]);

    const renderContent = () => {
        if (selectedRadio === 'viewnoti') {
            return (
                <div className='view-noti-container'>
                    <div className='d-flex align-items-center justify-content-between gap-2'>
                        <div className='noti-search'>
                            <input type="text" placeholder="Nhập để tìm kiếm..." onChange={handleSearchChange} />
                            {searchLoading ? (
                                <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                                <i className="fa-solid fa-magnifying-glass"
                                    style={{ color: searchValue ? "#003D80" : "" }}
                                    onClick={handleSeach}
                                />
                            )}
                        </div>
                        <button
                            className='button'
                            onClick={handleMarkAllAsRead}
                            disabled={(unreadCount === 0) && (socketUnreadCount === 0) && (notiData?.count === 0)}
                        >
                            <i className="fa-solid fa-check" ></i>
                            Đánh dấu tất cả đã đọc
                        </button>
                    </div>

                    <ViewNoti
                        initialNotifications={notiData}
                        onUnreadCountChange={(count) => setSocketUnreadCount(count)}
                    />

                    <div className='row mt-3'>
                        {notiData?.count > 0 && (
                            <Pagination
                                align="center"
                                current={currentPage}
                                pageSize={pageSize}
                                total={total}
                                onChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            )
        } else {
            if (userData) {
                return <SendNoti dataUser={userData} />;
            } else {
                return (
                    <div className='loading'>
                        <div className='spinner-border text-primary' role='status'>
                            <span className='visually-hidden'>Loading...</span>
                        </div>
                        <span className='ms-3'>Đang tải danh sách người dùng...</span>
                    </div>
                )
            }
        }
    };

    return (
        <div className="send-noti-container">
            <div className='header-send-noti'>
                <div className="d-flex justify-content-between align-items-center">
                    <div className='text'>Thông báo</div>
                </div>
                {!loading &&
                    <>
                        {unreadCount === 0 ? (<div>Không có thông báo mới nào!</div>)
                            : (<div>Bạn có {unreadCount} thông báo chưa đọc!</div>)}
                    </>}
            </div>
            {loading ? (
                <NotificationSkeleton />
            ) : (
                <div className='send-noti-content'>
                    <div className="radio-noti-inputs row">
                        <div className="col-6 col-lg-2 d-flex justify-content-center">
                            <label className="radio-noti">
                                <input type="radio" name="radio-noti"
                                    value="viewnoti"
                                    defaultChecked={selectedRadio === 'viewnoti'}
                                    onChange={handleRadioChange} />
                                <span className="name">Thông báo</span>
                            </label>
                        </div>
                        {(isDeanById(user.id) || user.role === 1) &&
                            <div className="col-6 col-lg-2 d-flex justify-content-center">
                                <label className="radio-noti">
                                    <input type="radio" name="radio-noti"
                                        value="sendnoti"
                                        onChange={handleRadioChange} />
                                    <span className="name">
                                        Gửi thông báo
                                    </span>
                                </label>
                            </div>
                        }
                    </div>
                    <div className='radio-noti-content'>
                        {renderContent()}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notification