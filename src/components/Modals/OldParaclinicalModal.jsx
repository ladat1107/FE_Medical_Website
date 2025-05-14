import { useState, useEffect } from "react"
import { Modal, Button, Upload, message, Spin, Row, Col, Card, Popconfirm, Image } from "antd"
import { PlusOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons"
import { deleteImageFromCloudinary, uploadToCloudinary } from "@/utils/uploadToCloudinary"
import { useSelector } from "react-redux"
import { ROLE } from "@/constant/role"

const OldParaclinacalModal = ({ visible, onCancel, oldParaclinical, onSave }) => {
    const { user } = useSelector(state => state.authen)
    const [images, setImages] = useState(oldParaclinical ? oldParaclinical?.split("^") : [])
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState("")
    useEffect(() => {
        if (visible) {
            setImages(oldParaclinical ? oldParaclinical?.split("^") : [])
        }
    }, [visible, oldParaclinical])

    const handleUpload = async (fileList) => {
        setUploading(true)
        setUploadProgress(0)

        try {
            const uploadPromises = fileList.map(async (file) => {
                // Upload to Cloudinary
                return await uploadToCloudinary(file, `OldParaclinical`, (progress) => {
                    // For multiple files, we'll just show the overall progress
                    setUploadProgress(Math.floor(progress / fileList.length))
                })
            })

            const uploadedUrls = await Promise.all(uploadPromises)
            setImages([...images, ...uploadedUrls])
        } catch (error) {
            console.error("Error uploading images:", error)
            message.error("Failed to upload images")
        } finally {
            setUploading(false)
            setUploadProgress(0)
        }
    }

    const handleDelete = async (image) => {
        try {
            const publicId = `OldParaclinical/${image.split('/').pop().split('.')[0]}`;  // Lấy public_id từ URL
            let result = await deleteImageFromCloudinary(publicId);
            if (result) {
                setImages(images.filter(img => img !== image))
            }
        } catch (error) {
            console.error("Error deleting image:", error)
            message.error("Failed to delete image")
        }
    }

    const handlePreview = (imageUrl) => {
        setPreviewImage(imageUrl)
        setPreviewVisible(true)
    }

    const handleSave = () => {
        if (onSave) {
            if (images.length === 0) onSave("")
            else onSave(images.join("^"))
        }
        onCancel()
    }

    return (
        <>
            <Modal
                title="Thêm phiếu xét nghiệm trước đây"
                open={visible}
                onCancel={onCancel}
                width={800}
                footer={[
                    <Button key="back" onClick={onCancel}>
                        Close
                    </Button>,
                    user?.role === ROLE.PATIENT && <Button key="save" type="primary" onClick={handleSave}>Save</Button>
                ]}
            >
                <Row gutter={[16, 16]} style={{ marginTop: 16, padding: "0 16px" }}>
                    {images?.map((image, index) => (
                        <Col xs={24} sm={12} md={8} lg={6} key={index}>
                            <div style={{ height: 120, overflow: "hidden", position: "relative", borderRadius: "10px", boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)", border: "1px solid #e0e0e0" }}
                                onMouseEnter={(e) => e.currentTarget.querySelector('.actions').style.display = 'block'}
                                onMouseLeave={(e) => e.currentTarget.querySelector('.actions').style.display = 'none'}>
                                <img
                                    alt={"Examination image"}
                                    src={image || null}
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                />
                                <div className="actions" style={{ display: 'none', position: "absolute", top: 0, right: 0 }}>
                                    <EyeOutlined size={25} key="view" onClick={() => handlePreview(image)} style={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "10px", padding: "5px" }} />
                                    <DeleteOutlined size={25} key="delete" onClick={() => handleDelete(image)} style={{ color: "white", backgroundColor: "rgba(0, 0, 0, 0.5)", borderRadius: "10px", padding: "5px", marginLeft: "5px" }} />
                                </div>
                            </div>
                        </Col>

                    ))}
                    {user?.role === ROLE.PATIENT && <Col xs={24} sm={12} md={8} lg={6}>
                        <Upload
                            listType="picture-card"
                            showUploadList={false}
                            multiple={true}
                            accept="image/*"
                            beforeUpload={(file, fileList) => {
                                if (file === fileList[0]) {
                                    // Filter valid files
                                    const validFiles = fileList.filter((f) => {
                                        // Check file type
                                        const isImage = f.type.startsWith("image/")
                                        if (!isImage) {
                                            message.error(`${f.name} is not an image file!`)
                                            return false
                                        }

                                        // Check file size (limit to 5MB)
                                        const isLt5M = f.size / 1024 / 1024 < 5
                                        if (!isLt5M) {
                                            message.error(`${f.name} is larger than 5MB!`)
                                            return false
                                        }

                                        return true
                                    })

                                    if (validFiles.length > 0) {
                                        handleUpload(validFiles)
                                    }
                                }
                                return false // Prevent default upload behavior
                            }}
                            disabled={uploading}
                        >
                            {uploading ? (
                                <div>
                                    <Spin />
                                    <div style={{ marginTop: 8 }}>{uploadProgress}%</div>
                                </div>
                            ) : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Col>}
                </Row>

            </Modal>

            <Image
                width={0}
                style={{ display: "none" }}
                preview={{
                    visible: previewVisible,
                    src: previewImage,
                    onVisibleChange: (visible) => setPreviewVisible(visible),
                }}
            />
        </>
    )
}

export default OldParaclinacalModal
