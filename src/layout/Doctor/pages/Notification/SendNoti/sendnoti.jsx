import { CSV, PDF, DOCX, JPG, PNG, RAR, TXT, PPT, XLS } from "@/components/TypeFile/typefile";
import { useRef, useEffect, useState } from "react";
import './SendNoti.scss';
import NotificationSelectionModal from "../NotiSelection/notiSelection";
import propTypes from 'prop-types';
import TextEditor from "@/components/TextEditor/TextEditor";
import { uploadFileToCloudinary } from "@/utils/uploadToCloudinary";
import { createNotification, sendNotification } from "@/services/doctorService";
import { message } from "antd";
import { useSelector } from "react-redux";
import { generateUniqueKey } from "@/utils/UniqueKey";

const SendNoti = ({ dataUser }) => {

    const textAreaRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [files, setFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [htmlDescription, setHtmlDescription] = useState('');
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [isSending, setIsSending] = useState(false);
    let { user } = useSelector((state) => state.authen);

    const handleSubmit = (selectedUsers) => {
        setSelectedUsers(selectedUsers);
        setIsModalOpen(false);
    }

    useEffect(() => {
        const handleInput = () => {
            if (textAreaRef.current) {
                textAreaRef.current.style.height = "1em";
                textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
            }
        };

        const textArea = textAreaRef.current;
        textArea?.addEventListener("input", handleInput);
        return () => textArea?.removeEventListener("input", handleInput);
    }, []);

    const handleContentChange = (value) => {
        setHtmlDescription(value);
    }

    const handleFileSelect = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setIsUploading(true);
            const selectedFiles = Array.from(e.target.files);

            const newFiles = selectedFiles.map((file) => {
                const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
                return {
                    name: file.name,
                    size: `${fileSizeInMB} MB`,
                    type: file.type,
                    extension: file.name.split(".").pop().toLowerCase(),
                    file: file,
                    progress: 0,
                    url: "",
                    uploading: true
                };
            });

            // Add new files to state
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);

            // Process uploads one by one
            const currentLength = files.length;
            for (let i = 0; i < newFiles.length; i++) {
                const fileData = newFiles[i];
                const index = currentLength + i;

                try {
                    const url = await uploadFileToCloudinary(fileData.file, "documents", (progress) => {
                        setFiles((prevFiles) => {
                            const updatedFiles = [...prevFiles];
                            if (updatedFiles[index]) {
                                updatedFiles[index].progress = progress;
                            }
                            return updatedFiles;
                        });
                    });

                    setFiles((prevFiles) => {
                        const updatedFiles = [...prevFiles];
                        if (updatedFiles[index]) {
                            updatedFiles[index].url = url;
                            updatedFiles[index].uploading = false;
                        }
                        return updatedFiles;
                    });

                    // Add to attachedFiles array in the format needed for DB insertion
                    const fileExtension = fileData.extension.toLowerCase();
                    setAttachedFiles(prev => [...prev, {
                        link: url,
                        type: fileExtension
                    }]);

                } catch (error) {
                    console.error("Upload failed for", fileData.name, error);
                    // Update file status to indicate failure
                    setFiles((prevFiles) => {
                        const updatedFiles = [...prevFiles];
                        if (updatedFiles[index]) {
                            updatedFiles[index].uploadFailed = true;
                            updatedFiles[index].uploading = false;
                        }
                        return updatedFiles;
                    });
                }
            }

            // Reset the file input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

            setIsUploading(false);
        }
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = [...files];
        const removedFile = updatedFiles[index];

        // Remove from attachedFiles array as well
        if (removedFile && removedFile.url) {
            setAttachedFiles(prev => prev.filter(file => file.link !== removedFile.url));
        }

        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const getFileIcon = (fileData) => {
        if (!fileData || !fileData.extension) {
            return <DOCX />;
        }

        const extension = fileData.extension.toLowerCase();

        switch (extension) {
            case 'csv':
                return <CSV />;
            case 'pdf':
                return <PDF />;
            case 'doc':
            case 'docx':
                return <DOCX />;
            case 'jpg':
            case 'jpeg':
                return <JPG />;
            case 'png':
                return <PNG />;
            case 'zip':
            case 'rar':
                return <RAR />;
            case 'txt':
                return <TXT />;
            case 'ppt':
            case 'pptx':
                return <PPT />;
            case 'xls':
            case 'xlsx':
                return <XLS />;
            default:
                return <DOCX />;
        }
    };

    const getFileStatusText = (fileData) => {
        if (fileData.uploadFailed) {
            return <span className="text-danger">Tải lên thất bại</span>;
        }
        if (fileData.uploading || fileData.progress < 100) {
            return <span>Đang tải: {fileData.progress}%</span>;
        }
        return null;
    };

    // Hàm xử lý khi gửi thông báo qua socket
    const handleSocketNotification = (title, htmlDescription, firstName, lastName, date, attachedFiles, notiCode, receiverIds) => {
        try {
            // Gửi thông báo qua socket với tiêu đề và danh sách người nhận
            sendNotification(title, htmlDescription, firstName, lastName, date, attachedFiles, notiCode, receiverIds);
            console.log('Đã gửi thông báo socket');
        } catch (error) {
            console.error('Lỗi gửi thông báo socket:', error);
        }
    };

    const handleSendNoti = async () => {
        if (!textAreaRef.current.value) {
            message.warning('Vui lòng nhập tiêu đề thông báo');
            return;
        }

        if (!htmlDescription) {
            message.warning('Vui lòng nhập nội dung thông báo');
            return;
        }

        if (selectedUsers.length === 0) {
            message.warning('Vui lòng chọn ít nhất một người nhận');
            return;
        }

        // Ngăn người dùng gửi nhiều lần
        if (isSending) {
            return;
        }

        setIsSending(true);

        try {
            const receiverIds = selectedUsers.map(user => user.id);
            const title = textAreaRef.current.value;
            const notiCode = generateUniqueKey(16); // Giả sử bạn có hàm này để tạo mã thông báo duy nhất

            const data = {
                dataNoti: {
                    title: title,
                    htmlDescription: htmlDescription,
                    receiverId: receiverIds.join(','),
                    date: new Date().toISOString(),
                    status: 1
                },
                attachedFiles: attachedFiles,
                notiCode: notiCode, // Giả sử bạn có hàm này để tạo mã thông báo duy nhất
            };

            const response = await createNotification(data);

            const date = new Date().toISOString();
            const firstName = user.firstName || '';
            const lastName = user.lastName || '';

            if (response.EC === 0) {
                message.success('Thông báo đã được gửi thành công');

                // Sau khi lưu thành công vào database, gửi thông báo qua socket
                handleSocketNotification(title, htmlDescription, firstName, lastName, date, attachedFiles, notiCode, receiverIds);

                // Reset form sau khi gửi thành công
                textAreaRef.current.value = '';
                setHtmlDescription('');
                setSelectedUsers([]);
                setFiles([]);
                setAttachedFiles([]);

            } else {
                message.error('Lỗi gửi thông báo: ' + (response.DT || 'Có lỗi xảy ra'));
            }
        } catch (error) {
            console.error('Chi tiết lỗi:', error);
            message.error('Lỗi gửi thông báo: ' + (error.message || 'Có lỗi xảy ra'));
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className="send-noti-cont">
            <div className="header-send-noti" >
                <textarea
                    ref={textAreaRef}
                    placeholder="Tiêu đề thông báo..."
                    className="send-noti-title"
                />
                <div className="row mt-2">
                    <div className="col-1 d-flex" style={{ paddingRight: '0px' }}>
                        <p>
                            <i className="fa-regular fa-user" style={{ color: "#787684" }}></i>
                        </p>
                        <p className="ms-2" style={{ color: '#787684' }}>Gửi tới:</p>
                    </div>
                    <div className="col-10 d-flex">
                        {selectedUsers.length > 0 && (
                            <div className="me-2 d-flex align-items-center">
                                <span style={{ padding: '8px 10px', fontSize: '12px' }} className="badge bg-primary">{selectedUsers.length} người nhận đã chọn</span>
                            </div>
                        )}
                        <button className="add-button" onClick={() => setIsModalOpen(true)}>
                            <i className="fa-solid fa-plus"></i>
                            <p className="ms-2">Người nhận</p>
                        </button>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 d-flex">
                        <p>
                            <i className="fa-regular fa-file-lines" style={{ color: "#787684" }}></i>
                        </p>
                        <p className="ms-2" style={{ color: '#787684' }}>Nội dung:</p>
                    </div>
                    <div className="col-12 mt-3 d-flex">
                        <TextEditor
                            value={htmlDescription}
                            onChange={handleContentChange}
                            placeholder="Nhập nội dung..."
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>
                <div className="row mt-2">
                    <div className="col-12 d-flex">
                        <p>
                            <i className="fa-solid fa-paperclip" style={{ color: "#787684" }}></i>
                        </p>
                        <p className="ms-2" style={{ color: '#787684' }}>Đính kèm:</p>
                        {files.length > 0 && (
                            <p className="ms-2 text-muted">({files.length} tệp)</p>
                        )}
                    </div>

                    <div className="col-12 mt-2">
                        <div className="row">
                            {files.map((fileData, index) => (
                                <div className="col-md-3 col-sm-6 mt-2" key={index}>
                                    <div className="attach-file d-flex">
                                        <div className="attach-file-icon" style={{ width: "50px", padding: "0px" }}>
                                            {getFileIcon(fileData)}
                                        </div>
                                        <div className="file-details" style={{ flex: 1, padding: "0px 5px" }}>
                                            <p className="attach-file-title" title={fileData.name}>
                                                {fileData.url ? (
                                                    <a href={fileData.url} target="_blank" rel="noopener noreferrer">
                                                        {fileData.name.length > 15 ? `${fileData.name.substring(0, 15)}...` : fileData.name}
                                                    </a>
                                                ) : (
                                                    fileData.name.length > 15 ? `${fileData.name.substring(0, 15)}...` : fileData.name
                                                )}
                                            </p>
                                            <p className="attach-file-capacity">{fileData.size}</p>
                                            {getFileStatusText(fileData)}
                                        </div>
                                        <div className="delete-btn" style={{ width: "24px", padding: "0px" }}>
                                            <button
                                                className="btn btn-sm text-danger"
                                                onClick={() => handleRemoveFile(index)}
                                                title="Xóa tệp"
                                                disabled={isSending}
                                            >
                                                <i className="fa-solid fa-times"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="col-md-3 col-sm-6 mt-2">
                                <button
                                    className="add-button d-flex align-items-center justify-content-center"
                                    style={{ height: '50px', width: '100%' }}
                                    onClick={handleUploadClick}
                                    disabled={isUploading || isSending}
                                >
                                    <i className="fa-solid fa-plus me-2"></i>
                                    <span>Thêm tệp</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                    multiple
                                    accept=".csv,.pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar,.txt,.ppt,.pptx,.xls,.xlsx"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-12">
                        <button
                            className="add-button"
                            style={{
                                padding: '8px 20px',
                                color: 'white',
                                background: '#00B5F1',
                                border: 'none'
                            }}
                            disabled={isUploading || isSending}
                            onClick={handleSendNoti}
                        >
                            {isSending ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin me-2"></i>
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-bell me-2"></i>
                                    Gửi thông báo
                                </>
                            )}
                        </button>
                        {isUploading && (
                            <span className="ms-3 text-muted">
                                <i className="fa-solid fa-spinner fa-spin me-1"></i>
                                Đang tải tệp lên...
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {dataUser && (
                <NotificationSelectionModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    data={dataUser}
                    checkedUsers={selectedUsers}
                />
            )}
        </div>
    );
};

SendNoti.propTypes = {
    dataUser: propTypes.object.isRequired,
}

export default SendNoti;