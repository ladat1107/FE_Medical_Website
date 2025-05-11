import "./SpecialtyManage.scss"
import { useMutation } from "@/hooks/useMutation";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faRotateRight } from "@fortawesome/free-solid-svg-icons";
import DropdownPaginate from "../../components/Dropdown/DropdownPaginate";
import PaginateCustom from "../../components/Paginate/PaginateCustom";
import { Button, Checkbox, Col, Form, Input, InputNumber, message, Progress, Row, Select } from "antd";
import { CloudUploadOutlined, SearchOutlined } from "@ant-design/icons";
import { CLOUDINARY_FOLDER, STATUS, TABLE } from "@/constant/value";
import Status from "../../components/Status";
import DropdownAction from "../../components/Dropdown/DropdownAction";
import { createSpecialty, getAllSpecialtyAdmin, getSpecialtyById, updateSpecialty } from "@/services/adminService";
import { uploadAndDeleteToCloudinary } from "@/utils/uploadToCloudinary";
import SkeletonTable from "./SkeletonTable";
const { TextArea } = Input;
const Specialty = () => {
    let [form] = Form.useForm();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    let [currentPage, setCurrentPage] = useState(1);
    let [rowsPerPage, setRowPaper] = useState(10);
    let [totalPages, setTotalPage] = useState(0);
    let [listSpecialty, setListSpecialty] = useState([]);
    let [checkAll, setCheckAll] = useState(false);
    let [search, setSearch] = useState("");
    let [obUpdate, setObUpdate] = useState(null);
    let [urlImage, setUrlImage] = useState("");
    let [isLoadingAction, setIsLoadingAction] = useState(false);
    let searchDebounce = "";
    let {
        data: dataSpecialty,
        loading: listSpecialtyLoading,
        execute: fetchSpecialtys,
    } = useMutation((query) =>
        getAllSpecialtyAdmin(currentPage, rowsPerPage, searchDebounce)
    )
    useEffect(() => {
        if (dataSpecialty && dataSpecialty.DT && dataSpecialty.DT.rows && dataSpecialty.DT) {
            let _listSpecialty = [...dataSpecialty.DT.rows];
            for (let i = 0; i < _listSpecialty.length; i++) {
                _listSpecialty[i].checked = false;
            }
            setListSpecialty(_listSpecialty);
            setTotalPage(dataSpecialty.DT.count / rowsPerPage);
        }
    }, [dataSpecialty])

    useEffect(() => {
        fetchSpecialtys();
    }, [currentPage, useDebounce(search, 500), rowsPerPage]);
    useEffect(() => {
        if (obUpdate && obUpdate.id) {
            form.setFieldsValue({
                name: obUpdate?.name || "",
                shortDescription: obUpdate?.shortDescription || "",
                status: obUpdate.status
            })
        }
        setUrlImage(obUpdate?.image || "")
    }, [obUpdate]);
    const handleChange = (item) => {
        let _listSpecialty = [...listSpecialty];
        _listSpecialty = _listSpecialty.map(obj =>
            obj.id === item.id ? { ...obj, checked: !item.checked } : obj
        );
        setCheckAll(false);
        setListSpecialty(_listSpecialty);
    };
    const handleChangeSelectedAll = () => {
        let _listSpecialty = [...listSpecialty];
        setCheckAll(!checkAll);
        _listSpecialty = _listSpecialty.map(obj =>
            checkAll === true ? { ...obj, checked: false } : { ...obj, checked: true }
        );
        setListSpecialty(_listSpecialty);
    }
    const handleChangePaginate = (item) => {
        setRowPaper(item);
        setCurrentPage(1);
    }
    searchDebounce = useDebounce(search, 500);
    const handleChangeSearch = (event) => {
        setSearch(event.target.value);
        setCurrentPage(1)
    }
    const refresh = () => {
        form.resetFields();
        setUrlImage("");
        setCheckAll(false);
        setObUpdate(null);
        setSearch("");
        fetchSpecialtys();
    }
    const handleUpdate = async (item) => {
        let response = await getSpecialtyById(item.id);
        if (response?.EC == 0) {
            let value = response?.DT;
            setObUpdate(value)
        } else {
            message.error(response?.EM || "Không thể chọn chuyên khoa")
            refresh();
        }
    }
    const handleInsertUpdate = async () => {
        if (!urlImage) {
            message.error("Vui lòng chọn ảnh");
            return;
        }
        form.validateFields().then(async (values) => {
            setIsLoadingAction(true);
            let response = null;
            if (obUpdate) {
                response = await updateSpecialty({ ...values, image: urlImage, id: obUpdate.id })
            } else {
                response = await createSpecialty({ ...values, image: urlImage })
            }
            if (response?.EC === 0) {
                message.success(response?.EM || "Thành công");
                refresh();
            } else {
                message.error(response?.EM)
            }
        }).catch((error) => {
            console.log("error", error)
        }).finally(() => {
            setIsLoadingAction(false);
        })
    }
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true); // Bắt đầu upload
        setUploadProgress(0); // Đặt lại tiến trình về 0
        try {
            // Gọi hàm upload với callback để cập nhật tiến trình
            const url = await uploadAndDeleteToCloudinary(file, CLOUDINARY_FOLDER.SPECIALTY, urlImage, (progress) => {
                setUploadProgress(progress);
            });
            setUrlImage(url); // Lưu URL ảnh sau khi upload
            message.success("Upload thành công!");
        } catch (error) {
            message.error("Upload thất bại. Vui lòng thử lại.");
            console.error(error);
        } finally {
            setUploading(false); // Kết thúc upload
        }
    };
    return (
        < div className="specialty-of-room-content" >
            <div className="container">
                <div className="specialty-of-room-content-header d-flex align-items-center justify-content-between py-3">
                    <div className="text">CHUYÊN KHOA</div>
                    <button className='py-1 px-2 btn-refresh-specialty ms-3' onClick={() => refresh()}>
                        <FontAwesomeIcon
                            className='me-1 icon' icon={faRotateRight} style={{ color: "#04a9f3", }} /> Tải lại</button>
                </div>
                <div className="row d-flex flex-lg-row-reverse justify-content-between align-items-start">
                    <div className="ps-3 pb-3 col-12 col-lg-4">
                        <div className="insert-update p-3">
                            <div className=""><span className="me-2">{obUpdate ? "CẬP NHẬT" : "THÊM CHUYÊN KHOA "}</span>
                                <FontAwesomeIcon onClick={() => { form.resetFields(); setObUpdate(null) }}
                                    icon={faArrowsRotate} spinPulse style={{ color: "#04a9f3", cursor: "pointer" }} /></div>
                            <hr />
                            <Form
                                layout={'horizontal'}
                                form={form}
                                labelCol={{ span: 24, }}
                                wrapperCol={{ span: 24, }}
                                initialValues={{}}
                                style={{ maxWidth: "100%", }}
                            >
                                <Row >
                                    <Col span={24}>
                                        <Form.Item
                                            name={"name"}
                                            label="Chuyên khoa"
                                            rules={[{
                                                required: true,
                                                message: 'Vui lòng nhập tên chuyên khoa!',
                                            }]}>
                                            <Input placeholder="Nhập chuyên khoa" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name="shortDescription"
                                            label="Triệu chứng"
                                        >
                                            <TextArea rows={5} placeholder="Mô tả triệu chứng của chuyên khoa" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item
                                            name={"image"}
                                            label="Hình ảnh"

                                        >
                                            <div className='image-upload'>
                                                <input type="file" id='input-upload' hidden={true} onChange={handleImageChange} />
                                                <div className='container'>
                                                    <span><CloudUploadOutlined /></span>
                                                    <div><span htmlFor={"input-upload"}
                                                        onClick={() => document.getElementById('input-upload').click()}>Chọn ảnh</span> đăng tải.</div>
                                                    {uploading && (
                                                        <div style={{ marginTop: '20px', width: '100%' }}>
                                                            <Progress percent={uploadProgress} status="active" />
                                                        </div>
                                                    )}
                                                    {urlImage && (
                                                        <div>
                                                            <img src={urlImage} alt="Uploaded" style={{ width: "100%", borderRadius: "10px" }} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                        </Form.Item>

                                    </Col>
                                    {obUpdate &&
                                        <Col span={24}>
                                            <Form.Item
                                                name={"status"}
                                                label="Trạng thái"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng chọn trạng thái!',
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    placeholder="Chọn trạng thái"
                                                    options={STATUS}
                                                >
                                                </Select>
                                            </Form.Item></Col>
                                    }
                                    <Col xs={24} style={{ display: 'flex', justifyContent: 'flex-end' }} >
                                        <Form.Item>
                                            <Button loading={isLoadingAction} type="primary" htmlType="submit"
                                                style={{ background: "#04a9f3" }}
                                                onClick={() => { handleInsertUpdate() }}>{obUpdate ? "Cập nhật" : "Thêm"}</Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>

                    <div className="col-12 col-lg-8">
                        <div className="specialty bg-white mb-3">
                            <div >
                                <Input placeholder="Tìm kiếm" prefix={<SearchOutlined />} className="ms-4 my-3 w-25"
                                    value={search}
                                    onChange={(event) => { handleChangeSearch(event) }} />
                            </div>
                            <div className="px-4">
                                <table className="w-100">
                                    <thead className="header">
                                        <tr>
                                            <th scope="col" className="rounded-top-left p-2">
                                                <div>
                                                    <Checkbox
                                                        checked={checkAll}
                                                        onChange={() => { handleChangeSelectedAll() }}
                                                        size="small"
                                                    />
                                                </div>
                                            </th>
                                            <th scope="col" className="px-1">NO</th>
                                            <th scope="col" className="text-start px-1">Chuyên khoa</th>
                                            <th scope="col" className=" text-center px-1">Trạng thái</th>
                                            <th scope="col" className="px-1 rounded-top-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-body">
                                        {
                                            listSpecialtyLoading ?
                                                <SkeletonTable />
                                                :
                                                +listSpecialty.length > 0 && +totalPages != 0 ?
                                                    <>
                                                        {
                                                            listSpecialty.map((item, index) => {
                                                                return (
                                                                    <tr key={item.id}>
                                                                        <td className="p-2 d-flex align-items-center">
                                                                            <div className="">
                                                                                <Checkbox
                                                                                    checked={item.checked}
                                                                                    onChange={() => { handleChange(item, index) }}
                                                                                    size="small"
                                                                                /></div>
                                                                        </td>
                                                                        <td title={item.name} className="text-start px-1 py-3">
                                                                            {item?.id || "Khác"}
                                                                        </td>
                                                                        <td className="text-start px-1 py-3">
                                                                            {item?.name || "_"}
                                                                        </td>
                                                                        <td className="text-center px-1 py-3">
                                                                            <Status data={item?.status} />
                                                                        </td>
                                                                        <td className="px-1 py-3 d-flex justify-content-end">
                                                                            <div className='iconDetail'>
                                                                                <DropdownAction
                                                                                    data={item}
                                                                                    action={handleUpdate}
                                                                                    refresh={refresh}
                                                                                    table={TABLE.SPECIALTY}
                                                                                />
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </> :
                                                    <tr>
                                                        <td colSpan="7" className="text-center">
                                                            <span className="text-gray-500">Không có dữ liệu</span>
                                                        </td>
                                                    </tr>
                                        }
                                    </tbody>
                                </table>

                                <div className='footer-table d-flex justify-content-end mx-2'>
                                    <div className='select-page'>
                                        <DropdownPaginate page={rowsPerPage}
                                            setPage={handleChangePaginate} />
                                    </div>
                                    <PaginateCustom
                                        totalPageCount={totalPages}
                                        setPage={setCurrentPage} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
export default Specialty;