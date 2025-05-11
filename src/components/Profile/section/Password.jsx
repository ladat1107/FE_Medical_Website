import { updateProfilePassword } from "@/services/adminService";
import { Button,  Form, Input, message } from "antd";
const Password = (props) => {
    let [form] = Form.useForm();
    let handleChangePass = () => {
        form.validateFields().then(async (values) => {
            let response = await updateProfilePassword({ ...values, id: props.data });
            if (response?.EC === 0) {
                message.success(response?.EM || "Cập nhật thành công!");
                form.resetFields();
            } else {
                message.error(response?.EM || "Cập nhật thất bại!");
            }
        }).catch((error) => {
            console.log(error);
        })
    }
    let handleCancel = () => {
        form.resetFields();
    }
    return (
        <div className='w-full bg-white rounded-lg shadow-md p-6 mb-6'>
            <div className="text-xl font-semibold mb-4 text-gray-800">Đổi mật khẩu</div>
            <Form
                layout={'horizontal'}
                form={form}
                labelCol={{
                    span: 24,
                }}
                wrapperCol={{
                    span: 24,
                }}
                initialValues={{
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                }}
                validateTrigger="onBlur"
                style={{
                    maxWidth: "100%",
                }}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-1">
                        <Form.Item
                            name={"oldPassword"}
                            rules={[
                                {
                                    required: true,
                                    message: 'Không được để trống!',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu cũ" />
                        </Form.Item>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Form.Item
                            name={"newPassword"}
                            rules={[
                                {
                                    required: true,
                                    message: 'Không được để trống!',
                                },
                            ]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới" />
                        </Form.Item>
                    </div>
                    <div>
                        <Form.Item
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng xác nhận mật khẩu!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Xác nhận mật khẩu mới" />
                        </Form.Item>
                    </div>
                </div>
                <div className="flex justify-start mt-4 space-x-2">
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ background: "#04a9f3" }}
                            onClick={() => { handleChangePass() }}
                        >
                            Cập nhật
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            key="cancel"
                            onClick={() => { handleCancel() }}
                        >
                            Hủy
                        </Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    )
}
export default Password;