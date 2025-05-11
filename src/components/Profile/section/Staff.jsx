import { Button, Form, Input, message, Row, Select } from "antd";
import { useState } from "react";
import { LINK, POSITION } from "@/constant/value";
import { profileUpdateStaff } from "@/services/adminService";
import { formatCurrency } from "@/utils/formatCurrency";
import ParseHtml from "@/components/ParseHtml";
import TextEditor from "@/components/TextEditor/TextEditor";
const { TextArea } = Input;

const StaffInfo = (props) => {
    let [form] = Form.useForm();
    let [isUpdate, setIsUpdate] = useState(false);
    let info = props.data;
    let price = formatCurrency(info?.staffUserData?.price) || "Miễn phí";

    let handleSaveInfor = () => {
        form.validateFields().then(async (values) => {
            let respone = await profileUpdateStaff({
                ...values,
                id: info?.staffUserData?.id,
            });
            if (respone?.EC === 0) {
                message.success(respone?.EM || "Cập nhật thông tin thành công!")
                props.refresh(props.page);
            } else {
                message.error(respone?.EM || "Cập nhật thông tin thất bại!")
            }
        }).catch((error) => {
            console.log(error);
        })
    }
    let handleCancel = () => {
        setIsUpdate(false);
        form.resetFields();
    }
    return (
        <>
            {isUpdate ?
                <div className="w-full bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="text-xl font-semibold mb-4 text-gray-800">Hồ sơ nghề nghiệp</div>
                    <Form
                        form={form}
                        validateTrigger="onBlur"
                        initialValues={{
                            shortDescription: info?.staffUserData?.shortDescription || "",
                            htmlDescription: info?.staffUserData?.htmlDescription || "",
                            specialtyId: info?.staffUserData?.specialtyId || null,
                            position: info?.staffUserData?.position?.split(',') || [],
                        }}
                        labelCol={{
                            span: 24,
                        }}
                        wrapperCol={{
                            span: 24,
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Form.Item
                                    name="specialtyId"
                                    label="Chuyên khoa"
                                >
                                    <Select
                                        placeholder="Chọn chuyên khoa"
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        options={props.specialty}
                                    >
                                    </Select>
                                </Form.Item>
                            </div>
                            <div>
                                <Form.Item
                                    name="position"
                                    label="Trình độ"
                                >
                                    <Select
                                        mode="multiple"
                                        placeholder="Vui lòng chọn chức vụ"
                                        options={POSITION}
                                    />
                                </Form.Item>
                            </div>
                        </div>
                        <div className="mb-4">
                            <Form.Item
                                name="shortDescription"
                                label="Giới thiệu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả!',
                                    },
                                ]}
                            >
                                <TextArea rows={8} placeholder="Mô tả ngắn" />
                            </Form.Item>
                        </div>
                        <div>
                            <Form.Item
                                name={"htmlDescription"}
                                label="Mô tả chi tiết quá trình làm việc"
                                rules={[{ required: true, message: 'Vui lòng nhập mô tả!', },
                                ]}
                            >
                                <TextEditor
                                    value={form.getFieldValue("htmlDescription")}
                                    onChange={(value) => { form.setFieldsValue({ htmlDescription: value }) }}
                                    placeholder="Nhập nội dung..."
                                />
                            </Form.Item>
                        </div>
                    </Form>
                    <div className="flex justify-end mt-4 space-x-2">
                        <Button key="cancel"
                            onClick={() => { handleCancel() }}>Hủy</Button>
                        <Button type="primary"
                            style={{ background: "#04a9f3" }}
                            onClick={() => { handleSaveInfor() }}>Lưu thông tin</Button>
                    </div>
                </div>
                :
                <div className="w-full">
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/4 mb-4 md:mb-0">
                                <img
                                    src={info?.avatar || LINK.AVATAR_NULL}
                                    alt="avatar"
                                    className="w-40 h-40 object-cover rounded-lg"
                                />
                            </div>
                            <div className="md:w-3/4 md:pl-6 flex flex-col">
                                <div className="text-xl font-semibold mb-2">
                                    <span className="uppercase mr-2">{info?.staffUserData?.position}</span>
                                    {info?.lastName + " " + info?.firstName}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                    <div>
                                        <span className="font-medium">Chuyên khoa:</span>
                                        <span className="ml-2">{info?.staffUserData?.staffSpecialtyData?.name || "Không chuyên khoa"}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Khoa:</span>
                                        <span className="ml-2">{info?.staffUserData?.staffDepartmentData?.name}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Giá khám:</span>
                                        <span className="ml-2">{price}</span>
                                    </div>
                                </div>
                                <div className="mt-auto flex justify-end">
                                    <Button
                                        type="primary"
                                        style={{ background: "#04a9f3" }}
                                        onClick={() => { setIsUpdate(true) }}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="text-xl font-semibold mb-3">Giới thiệu</div>
                        <div className="mt-3">{info?.staffUserData?.shortDescription}</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <ParseHtml htmlString={info?.staffUserData?.htmlDescription || ""} />
                    </div>
                </div>
            }
        </>
    )
}
export default StaffInfo;