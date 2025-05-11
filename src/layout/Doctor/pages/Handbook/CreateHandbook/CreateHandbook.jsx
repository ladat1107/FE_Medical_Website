import './CreateHandbook.scss';
import { Form, message, Progress, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CloudUploadOutlined, } from '@ant-design/icons';
import { getHandbookById, updateHandbook, createHandbook, sendNotification } from '@/services/doctorService';
import { CLOUDINARY_FOLDER } from '@/constant/value';
import { uploadAndDeleteToCloudinary, } from '@/utils/uploadToCloudinary';
import { useSelector } from 'react-redux';
import TextEditor from '@/components/TextEditor/TextEditor';
import useSendNotification from '@/hooks/useSendNotification';

const CreateHandbook = (props) => {
    const [form] = Form.useForm();
    let handbookId = props?.handbookId || null;
    let { user } = useSelector((state) => state.authen);
    let allTags = props?.allTags || [];
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [image, setImage] = useState("");
    let [isLoadingFetch, setIsLoadingFetch] = useState(false);
    let [isLoadingAction, setIsLoadingAction] = useState(false);
    let { handleSendNoti } = useSendNotification();

    useEffect(() => {
        if (handbookId) {
            fetchHandbookData(handbookId);
        }
    }, [handbookId]);

    const fetchHandbookData = async (id) => {
        try {
            setIsLoadingFetch(true);
            const response = await getHandbookById(id);
            if (response && response.DT) {
                let data = response.DT;
                form.setFieldsValue({
                    title: data?.title || '',
                    shortDescription: data?.shortDescription || '',
                    htmlDescription: data?.htmlDescription || '',
                });
                setImage(data?.image || '');
                let fetchedTags = data?.tags?.split(',') || [];
                let _tags = [...allTags];
                _tags = _tags.map(tag => ({
                    ...tag,
                    checked: fetchedTags.includes(tag.label),
                }));
                props.setAllTags(_tags);
            } else {
                message.error(response.EM);
            }
        } catch (error) { console.error(error); }
        finally { setIsLoadingFetch(false); }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true); // Bắt đầu upload
        setUploadProgress(0); // Đặt lại tiến trình về 0
        try {
            // Gọi hàm upload với callback để cập nhật tiến trình
            const url = await uploadAndDeleteToCloudinary(file, CLOUDINARY_FOLDER.HANDBOOK, image, (progress) => {
                setUploadProgress(progress);
            });
            setImage(url); // Cập nhật ảnh
            message.success("Upload thành công!");
        } catch (error) {
            message.error("Upload thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setUploading(false); // Kết thúc upload
        }
    };

    const handleSave = async () => {
        if (!image) {
            message.error('Vui lòng chọn ảnh bìa');
            return;
        }
        form
            .validateFields()
            .then(async (values) => {
                try {
                    setIsLoadingAction(true);
                    let activeTags = allTags.filter(tag => tag.checked).map(tag => tag.label);
                    let response;
                    if (props?.handbookId) {
                        response = await updateHandbook({ ...values, id: props.handbookId, tags: activeTags.join(','), image: image, author: user.staff });
                    } else {
                        response = await createHandbook({ ...values, tags: activeTags.join(','), image: image, author: user.staff });
                    }
                    if (response && response.EC === 0) {
                        message.success(response.EM);
                        form.resetFields();
                        props.refresh();

                        if (!props?.handbookId) {
                            handleSendNoti(
                                `[Cẩm nang mới] ${response.DT?.title}` || 'Cẩm nang mới',
                                `<p>
                                    <span style="color: rgb(234, 195, 148); font-weight: bold;">✨ Tin mới ✨</span> 
                                    Cẩm nang chăm sóc sức khỏe đã lên sóng! Quản trị viên xem và duyệt tại 💪  
                                    👉 <a href="http://localhost:3000/handbookDetail/${response.DT.id}" rel="noopener noreferrer" target="_blank" style="color: #007bff; font-weight: bold;">Xem ngay</a>
                                </p>` || response.DT?.htmlDescription,
                                [],
                                true,
                                []
                            )
                        }

                    } else {
                        message.error(response.EM);
                    }
                } catch (error) {
                    message.error('Không thể lưu cẩm nang');
                    console.error(error);
                }

            })
            .catch((info) => {
                message.error('Vui lòng điền đầy đủ thông tin');
                console.log('Validate Failed:', info);
            }).finally(() => { setIsLoadingAction(false) });
    }

    return (
        <>
            <div className='create-handbook-container'>
                <Form
                    form={form}
                    name="insertHandbook"
                    initialValues={{
                        ...form.getFieldsValue(),
                    }}
                    autoComplete="on"
                >
                    <div className='row mt-2 align-items-start'>
                        <div className='col-2'>
                            <p className='text-bold'>Tiêu đề:</p>
                        </div>
                        <div className='col-6'>
                            {isLoadingFetch ? <Skeleton.Input style={{ width: '100%' }} active={true} /> :
                                <Form.Item name="title">
                                    <div className="search-container">
                                        <i className="fa-solid fa-heading"></i>
                                        <input
                                            type="text"
                                            defaultValue={form.getFieldValue('title')}
                                            placeholder="Nhập tiêu đề..."
                                            maxLength={80}
                                        />
                                    </div>
                                </Form.Item>}
                        </div>
                    </div>
                    <div className='row mt-3 align-items-start'>
                        <div className='col-2'>
                            <p className='text-bold'>Mô tả:</p>
                        </div>
                        <div className='col-10'>
                            {isLoadingFetch ? <Skeleton.Input style={{ width: '100%' }} active={true} /> :
                                <Form.Item name="shortDescription">
                                    <div className="search-container">
                                        <i className="fa-solid fa-note-sticky"></i>
                                        <input
                                            type="text"
                                            defaultValue={form.getFieldValue('shortDescription')}
                                            placeholder="Nhập mô tả..."
                                            maxLength={130} />
                                    </div>
                                </Form.Item>}
                        </div>
                    </div>
                    <div className='row mt-3 align-items-start'>
                        <div className='col-2'>
                            <p className='text-bold text-start'>Ảnh bìa:</p>
                        </div>
                        <div className='col-6'>
                            {isLoadingFetch ? <Skeleton.Input style={{ width: '100%', height: "250px" }} active={true} /> :
                                <Form.Item>
                                    <div className='image-upload'>
                                        <div className='container'>
                                            <span className='image-cloud'><CloudUploadOutlined /></span>
                                            <div onClick={() => document.getElementById('input-upload').click()}>
                                                <span htmlFor={"input-upload"} className='input-upload'>
                                                    Chọn ảnh
                                                </span> đăng tải.
                                            </div>
                                            {uploading && (
                                                <div style={{ marginTop: '20px', width: '100%' }}>
                                                    <Progress percent={uploadProgress} status="active" />
                                                </div>
                                            )}
                                            {image && (
                                                <div>
                                                    <img src={image} alt="Uploaded" style={{ width: "100%" }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <input type="file" accept="image/*" id='input-upload' hidden={true} onChange={handleImageChange} />
                                </Form.Item>}
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-2'>
                            <p className='text-bold'>Nội dung:</p>
                        </div>
                    </div>
                    <div className='row mt-1'>
                        {isLoadingFetch ? <Skeleton style={{ width: '100%', height: "200px" }} active={true} /> :
                            <Form.Item name="htmlDescription">
                                <TextEditor
                                    value={form.getFieldValue("htmlDescription")}
                                    onChange={(value) => { form.setFieldsValue({ htmlDescription: value }) }}
                                    placeholder="Nhập nội dung..."
                                />
                            </Form.Item>}
                    </div>
                    <div className='row mt-3'>
                        <div className='button-container'>
                            <button
                                className='button'
                                onClick={() => { handleSave() }}>
                                {isLoadingAction ? <i className="fa-solid fa-spinner fa-spin-pulse"></i> : <i className="fa-solid fa-floppy-disk"></i>}
                                Lưu
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </>
    )
}
CreateHandbook.propTypes = {
    handbookId: PropTypes.string,
    allTags: PropTypes.array,
    setAllTags: PropTypes.func,
    refresh: PropTypes.func,
};

export default CreateHandbook;