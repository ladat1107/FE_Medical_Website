import { uploadAndDeleteToCloudinary } from "@/utils/uploadToCloudinary";
import { Button, DatePicker, Form, Input, message, Progress, Select } from "antd";
import { useEffect, useState } from "react";
import { AOB, CLOUDINARY_FOLDER, GENDER, LINK, MARITALSTATUS, RH } from "@/constant/value";
import { apiService } from "@/services/apiService";
import useQuery from "@/hooks/useQuery";
import { updateProfileInfo } from "@/services/adminService";
import dayjs from 'dayjs';

const Information = (props) => {
  let [form] = Form.useForm();
  let [isUpdate, setIsUpdate] = useState(false);
  let [uploadProgress, setUploadProgress] = useState(0);
  let [uploading, setUploading] = useState(false);
  let [profile, setProfile] = useState(props.data);
  let [imageUrl, setImageUrl] = useState(profile?.avatar);
  let currentResidentData = profile?.currentResident?.split("%") || [];
  let birthData = profile?.address?.split("%") || [];
  let [province, setProvince] = useState([]);
  let [currentProvinceId, setCurrentProvinceId] = useState(+currentResidentData[3] || null);
  let [birthProvinceId, setBirthProvinceId] = useState(+birthData[3] || null);
  let [currentDistrictId, setCurrentDistrictId] = useState(+currentResidentData[2] || null);
  let [birthDistrictId, setBirthDistrictId] = useState(+birthData[2] || null);
  let [currentListDistrict, setCurrentListDistrict] = useState([]);
  let [birthListDistrict, setBirthListDistrict] = useState([]);
  let [currentListWard, setCurrentListWard] = useState([]);
  let [birthListWard, setBirthListWard] = useState([]);
  let { data: provinceData } = useQuery(() => apiService.getAllProvince())

  useEffect(() => {
    if (provinceData) {
      let _province = provinceData?.data?.map((item) => {
        return {
          value: +item.id,
          label: item.full_name
        }
      })
      setProvince(_province);
      setCurrentProvinceId(+currentResidentData[3] || null);
      setBirthProvinceId(+birthData[3] || null);
    }
  }, [provinceData])

  // Lấy danh sách quận/huyện theo tỉnh/thành phố hiện tại
  useEffect(() => {
    if (currentProvinceId) {
      apiService.getDistrictByProvinceId(currentProvinceId).then((districtList) => {
        let _district = districtList.data?.map((item) => {
          return {
            value: +item.id,
            label: item.full_name
          }
        })
        setCurrentListDistrict(_district);
      }).catch(error => {
        console.error("Lỗi khi lấy danh sách quận/huyện:", error);
      });
    } else {
      setCurrentListDistrict([]);
    }
  }, [currentProvinceId])

  // Lấy danh sách quận/huyện theo tỉnh/thành phố quê quán
  useEffect(() => {
    if (birthProvinceId) {
      apiService.getDistrictByProvinceId(birthProvinceId).then((districtList) => {
        let _district = districtList.data?.map((item) => {
          return {
            value: +item.id,
            label: item.full_name
          }
        })
        setBirthListDistrict(_district);
      }).catch(error => {
        console.error("Lỗi khi lấy danh sách quận/huyện:", error);
      });
    } else {
      setBirthListDistrict([]);
    }
  }, [birthProvinceId])

  // Lấy danh sách phường/xã theo quận/huyện Hiện tại
  useEffect(() => {
    if (currentDistrictId) {
      apiService.getWardByDistrictId(currentDistrictId).then((wardList) => {
        let _ward = wardList.data?.map((item) => {
          return {
            value: +item.id,
            label: item.full_name
          }
        })
        setCurrentListWard(_ward);
      }).catch(error => {
        console.error("Lỗi khi lấy danh sách phường/xã:", error);
      });
    } else {
      setCurrentListWard([]);
    }
  }, [currentDistrictId])

  // Lấy danh sách phường/xã theo quận/huyện quê quán
  useEffect(() => {
    if (birthDistrictId) {
      apiService.getWardByDistrictId(birthDistrictId).then((wardList) => {
        let _ward = wardList.data?.map((item) => {
          return {
            value: +item.id,
            label: item.full_name
          }
        })
        setBirthListWard(_ward);
      }).catch(error => {
        console.error("Lỗi khi lấy danh sách phường/xã:", error);
      });
    } else {
      setBirthListWard([]);
    }
  }, [birthDistrictId])

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        dob: profile?.dob ? dayjs(dayjs(profile?.dob).format('DD/MM/YYYY'), "DD/MM/YYYY") : null,
        lastName: profile?.lastName || "",
        firstName: profile?.firstName || "",
        email: profile?.email || "",
        cid: profile?.cid || "",
        gender: +(profile?.gender || 0),
        phoneNumber: profile?.phoneNumber || "",
        folk: profile?.folk || null,
        ABOBloodGroup: profile?.ABOBloodGroup,
        RHBloodGroup: profile?.RHBloodGroup,
        maritalStatus: profile?.maritalStatus,
        birthProvince: +birthData[3] || null,
        birthDistrict: +birthData[2] || null,
        birthWard: +birthData[1] || null,
        birthAddress: birthData[0] || "",
        currentProvince: +currentResidentData[3] || null,
        currentDistrict: +currentResidentData[2] || null,
        currentWard: +currentResidentData[1] || null,
        currentAddress: currentResidentData[0] || "",
      })
    }
  }, [profile])

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true); // Bắt đầu upload
    setUploadProgress(0); // Đặt lại tiến trình về 0
    try {
      // Gọi hàm upload với callback để cập nhật tiến trình
      const url = await uploadAndDeleteToCloudinary(file, CLOUDINARY_FOLDER.AVATAR, imageUrl, (progress) => {
        setUploadProgress(progress);
      });
      setImageUrl(url); // Lưu URL ảnh sau khi upload
      message.success("Upload thành công!");
    } catch (error) {
      message.error("Upload thất bại. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setUploading(false); // Kết thúc upload
    }
  };

  const handleSaveInfor = () => {
    if (isUpdate) {
      form.validateFields().then(async (values) => {
        let respone = await updateProfileInfo({
          ...values,
          id: profile?.id,
          avatar: imageUrl,
          address: values.birthAddress + "%" + values.birthWard + "%" + values.birthDistrict + "%" + values.birthProvince,
          currentResident: values.currentAddress + "%" + values.currentWard + "%" + values.currentDistrict + "%" + values.currentProvince,
          dob: values?.dob ? dayjs(values.dob).format('YYYY-MM-DD') : null,
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
    } else {
      setIsUpdate(true);
    }
  }
  const handleCancel = () => {
    setIsUpdate(false);
    form.resetFields();
    setImageUrl(profile?.avatar);
  }
  return (
    <div className='w-full mx-auto'>
      <Form
        layout={'horizontal'}
        form={form}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={{}}
        style={{
          maxWidth: "100%",
        }}
        validateTrigger="submit"
      >
        <div className="bg-white rounded-lg shadow-md p-4 mb-5">
          <div className="w-full">
            <Form.Item
              name={"image"}
            >
              <div className='flex justify-center'>
                <div
                  className="relative w-24 h-24 rounded-full border border-gray-200 p-1 cursor-pointer overflow-hidden"
                  onClick={() => document.getElementById('input-upload-avatar').click()}
                >
                  <img className="w-full h-full rounded-full object-cover" src={imageUrl || LINK.AVATAR_NULL} alt="Uploaded" />
                  <input type="file" id='input-upload-avatar' hidden={true} onChange={handleImageChange} />
                </div>
              </div>
              {uploading && (
                <div className="mt-5 w-full">
                  <Progress percent={uploadProgress} status="active" />
                </div>
              )}
            </Form.Item>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Form.Item
                className="mb-0"
                name={"lastName"}
                label="Họ và tên đệm"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống!',
                  },
                ]}
              >
                <Input disabled={!isUpdate} placeholder="Họ" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"firstName"}
                label="Tên"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống!',
                  },
                ]}
              >
                <Input disabled={!isUpdate} placeholder="Tên" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"email"}
                label="Email"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống!',
                  },
                  {
                    type: 'email',
                    message: 'Email không hợp lệ!',
                  },
                ]}
              >
                <Input type="email" disabled placeholder="Email" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"cid"}
                label="Căn cước công dân"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống!',
                  },
                  {
                    pattern: /^\d{12}$/,
                    message: 'Căn cước phải đúng 12 só!',
                  }
                ]}
              >
                <Input disabled={!isUpdate} placeholder="Căn cước công dân" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"phoneNumber"}
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: 'Không được để trống!',
                  },
                  {
                    pattern: /^\d{10}$/,
                    message: 'Số điện thoại phải đúng 10 số!',
                  }
                ]}
              >
                <Input disabled={!isUpdate} placeholder="Số điện thoại" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"dob"}
                label="Ngày sinh"
              >
                <DatePicker
                  placeholder="Chọn ngày sinh"
                  disabled={!isUpdate}
                  format={'DD/MM/YYYY'} style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"gender"}
                label="Giới tính"
              >
                <Select disabled={!isUpdate} options={GENDER} placeholder={"Chọn giới tính"} />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"folk"}
                label="Dân tộc"
              >
                <Select
                  placeholder="Chọn dân tộc"
                  disabled={!isUpdate}
                  showSearch
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  options={props.folks}
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 mb-5">
          <div className="pb-2 text-lg font-medium">Địa chỉ hiện tại</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Form.Item
                className="mb-0"
                name={"currentProvince"}
                rules={[{
                  required: true,
                  message: 'Không được để trống!',
                }]}
              >
                <Select
                  placeholder="Tỉnh/Thành phố cư trú"
                  disabled={!isUpdate}
                  showSearch
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  onChange={(value) => {
                    setCurrentProvinceId(value); // Update the state
                    form.setFieldsValue({
                      currentDistrict: null, // Reset district field
                      currentWard: null,
                      currentAddress: "",
                    });
                    setCurrentDistrictId(null); // Reset district state
                  }}
                  options={province}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"currentDistrict"}
                rules={[{
                  required: true,
                  message: 'Không được để trống!',
                }]}
              >
                <Select
                  placeholder="Quận/Huyện cư trú"
                  disabled={!isUpdate}
                  showSearch
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  onChange={(value) => {
                    setCurrentDistrictId(value); // Update the state
                    form.setFieldsValue({// Reset district field
                      currentWard: null,
                      currentAddress: ""
                    });
                  }}
                  options={currentListDistrict}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"currentWard"}
                rules={[{
                  required: true,
                  message: 'Không được để trống!',
                }]}
              >
                <Select
                  placeholder="Phường/Xã cư trú"
                  disabled={!isUpdate}
                  showSearch
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  onChange={() => { form.setFieldsValue({ currentAddress: "" }) }}
                  options={currentListWard}
                />
              </Form.Item>
            </div>
          </div>
          <div className="w-full">
            <Form.Item
              className="mt-6"
              name={"currentAddress"}
              rules={[{
                required: true,
                message: 'Không được để trống!',
              }]}
            >
              <Input disabled={!isUpdate} placeholder="Số nhà/ Đường" />
            </Form.Item>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 mb-5">
          <div className="pb-2 text-lg font-medium">Quê quán</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Form.Item
                className="mb-0"
                name={"birthProvince"}
                rules={[{
                  required: true,
                  message: 'Không được để trống!',
                }]}
              >
                <Select
                  className="mb-0"
                  placeholder="Tỉnh/Thành phố quê quán"
                  disabled={!isUpdate}
                  showSearch
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  onChange={(value) => {
                    setBirthProvinceId(value); // Update the state
                    form.setFieldsValue({
                      birthDistrict: null, // Reset district field
                      birthWard: null,
                      birthAddress: ""
                    });
                    setBirthDistrictId(null); // Reset district state
                  }}
                  options={province}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"birthDistrict"}
                rules={[{
                  required: true,
                  message: 'Không được để trống!',
                }]}
              >
                <Select
                  placeholder="Quận/Huyện quê quán"
                  disabled={!isUpdate}
                  showSearch
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  onChange={(value) => {
                    setBirthDistrictId(value); // Update the state
                    form.setFieldsValue({// Reset district field
                      birthWard: null,
                      birthAddress: ""
                    });
                  }}
                  options={birthListDistrict}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"birthWard"}
                rules={[{
                  required: true,
                  message: 'Không được để trống!',
                }]}
              >
                <Select
                  placeholder="Phường/Xã quê quán"
                  disabled={!isUpdate}
                  showSearch
                  optionFilterProp="label"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  onChange={() => { form.setFieldsValue({ birthAddress: "" }) }}
                  options={birthListWard}
                />
              </Form.Item>
            </div>
          </div>
          <div className="w-full">
            <Form.Item
              className="mt-6"
              name={"birthAddress"}
              rules={[{
                required: true,
                message: 'Không được để trống!',
              }]}
            >
              <Input disabled={!isUpdate} placeholder="Số nhà/ Đường" />
            </Form.Item>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 mb-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Form.Item
                className="mb-0"
                name={"ABOBloodGroup"}
                label="Nhóm máu hệ ABO?"
              >
                <Select
                  disabled={!isUpdate}
                  placeholder="Nhóm máu hệ ABO?"
                  options={AOB}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"RHBloodGroup"}
                label="Nhóm máu hệ RH?"
              >
                <Select
                  disabled={!isUpdate}
                  placeholder="Nhóm máu hệ RH?"
                  options={RH}
                />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                className="mb-0"
                name={"maritalStatus"}
                label="Tình trạng hôn nhân"
              >
                <Select
                  disabled={!isUpdate}
                  placeholder="Tình trạng hôn nhân?"
                  options={MARITALSTATUS}
                />
              </Form.Item>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          {isUpdate &&
            <Form.Item className="mb-0">
              <Button key="cancel"
                onClick={() => { handleCancel() }}>Hủy</Button>
            </Form.Item>
          }
          <Form.Item>
            <Button type="primary"
              style={{ background: "#04a9f3" }}
              onClick={() => { handleSaveInfor() }}>{isUpdate ? "Lưu" : "Chỉnh sửa thông tin"}</Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )

}
export default Information;