import ParseHtml from '@/components/ParseHtml';
import { timeAgo } from '@/utils/formatDate';
import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import AttachedFile from './attachedFile';
import { useNotification } from '@/contexts/NotificationContext';
import './NotiItem.scss'
import truncate from 'html-truncate';

const NotiItem = ({ noti }) => {
    const [isContentVisible, setIsContentVisible] = useState(false);
    const contentRef = useRef(null);
    const previewRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(0);
    const [previewHeight, setPreviewHeight] = useState(0);
    const [isPreviewVisible, setIsPreviewVisible] = useState(true);
    const [isRead, setIsRead] = useState(noti.status === 2);
    const { markNotificationAsRead } = useNotification();

    useEffect(() => {
        if (contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        }
        if (previewRef.current) {
            setPreviewHeight(previewRef.current.scrollHeight);
        }
    }, [noti.htmlDescription]);

    // Lắng nghe sự kiện đánh dấu tất cả đã đọc
    useEffect(() => {
        const handleMarkAllAsRead = () => {
            setIsRead(true);
        }

        document.addEventListener('markAllNotificationsAsRead', handleMarkAllAsRead)
        return () => {
            document.removeEventListener('markAllNotificationsAsRead', handleMarkAllAsRead)
        }
    }, []);

    const toggleContent = async () => {
        if (!isContentVisible) {
            setIsPreviewVisible(false);
            setTimeout(() => {
                setIsContentVisible(true);
            }, 300);

            if (!isRead) {
                await markNotificationAsRead(noti.id);
                setIsRead(true);
            }
        } else {
            setIsContentVisible(false);
            setTimeout(() => {
                setIsPreviewVisible(true);
            }, 300);
        }
    };

    return (
        <div className="noti-item"
            style={{
                backgroundColor: `${isRead ? 'white' : 'rgb(239, 250, 255)'}`,
                border: `${isRead ? '1px solid #e0e0e0' : '1px solid rgb(54, 151, 255)'}`
            }}>
            <div
                className="noti-item-header row"
                onClick={toggleContent}
                style={{ cursor: 'pointer' }}
            >
                <div className="row col-9">
                    <div className='d-flex'>
                        <p className={`noti-item-title me-2`}>
                            {noti.title || 'Title'}
                        </p>
                        <p className='noti-item-time' style={{ opacity: '0.8' }}>
                            {timeAgo(noti.date) || ''}
                        </p>
                        <span style={{ marginLeft: '5px', transition: 'transform 0.3s' }}>
                            {isContentVisible ? <i className="fa-solid fa-caret-up"></i> : <i className="fa-solid fa-caret-down"></i>}
                        </span>
                    </div>
                    <div
                        ref={previewRef}
                        className="noti-item-preview col-12 mt-1"
                        style={{
                            height: isPreviewVisible ? `${previewHeight}px` : '0px',
                            overflow: 'hidden',
                            transition: 'height 0.2 ease-in-out',
                            transform: isPreviewVisible ? 'translateY(0)' : 'translateY(-10px)',
                            transitionProperty: 'height, opacity, transform',
                            transitionDuration: '0.3s',
                        }}
                    >
                        {noti.htmlDescription && noti.htmlDescription.length > 146
                            ? <ParseHtml htmlString={truncate(noti.htmlDescription, 146)}/>
                            : <ParseHtml htmlString={noti.htmlDescription} />
                        }
                    </div>
                </div>
                <div className="d-flex row col-3">
                    <p className="noti-item-title">
                        Người gửi
                    </p>
                    <p className='noti-item-time mt-1'>
                        {noti.NotificationSenderData?.lastName + ' '
                            + noti.NotificationSenderData?.firstName
                            || 'Bác sĩ: Nguyễn Văn A'}
                    </p>
                </div>
            </div>

            <div
                ref={contentRef}
                className="noti-item-content-container"
                style={{
                    height: isContentVisible ? `${contentHeight}px` : '0px',
                    overflow: 'hidden',
                    transition: 'height 0.3s ease-in-out',
                    transform: isContentVisible ? 'translateY(0)' : 'translateY(-10px)',
                    transitionProperty: 'height, opacity, transform',
                    transitionDuration: '0.3s',
                }}
            >
                <div className="noti-item-content">
                    <ParseHtml htmlString={noti.htmlDescription} />
                    {noti.NotificationAttachFileData && noti.NotificationAttachFileData.length > 0 && (
                        <div className="noti-item-attach-file mt-3">
                            {noti.NotificationAttachFileData.map((file, index) => (
                                <AttachedFile
                                    key={index}
                                    link={file.link}
                                    type={file.type?.toLowerCase()}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

NotiItem.propTypes = {
    noti: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        htmlDescription: PropTypes.string,
        date: PropTypes.string,
        status: PropTypes.number,
        NotificationAttachFileData: PropTypes.array,
        NotificationSenderData: PropTypes.shape({
            firstName: PropTypes.string,
            lastName: PropTypes.string
        })
    }).isRequired
};

export default NotiItem;