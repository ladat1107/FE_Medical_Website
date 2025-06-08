import axios from "@/utils/axiosInstance";

export const handleRegisterUser = (data) => {
    return axios.post(`/api/registerUser`, data)
}
export const handleConfirmUser = (data) => {
    return axios.post(`/api/confirmUser`, data)
}
export const handleLogin = (data) => {
    return axios.post(`/api/handleLogin`, data)
}
export const handleLogoutService = () => {
    return axios.post(`/api/handleLogout`)
}
export const handleForgotPassword = (data) => {
    return axios.post(`/api/forgotPassword`, data)
}
export const logoutUser = () => {
    return axios.post(`/api/handleLogout`)
}
// USER MANAGEMENT
export const createUser = (data) => {
    return axios.post(`/api/createUser`, data)
}
export const getUser = (page, limit, search, position) => {
    return axios.get(`/api/admin/getAllUser?page=${+page}&limit=${+limit}&position=[${position}]&search=${search}`)
}
export const updateProfileInfo = (data) => {
    return axios.put(`/api/profileUpdateInfo`, data)
}
export const updateProfilePassword = (data) => {
    return axios.put(`/api/profileUpdatePassword`, data)
}
export const getUserById = (id) => {
    return axios.get(`/api/getUserById?id=${id}`)
}
export const deleteUser = (data) => {
    return axios.delete(`/api/admin/deleteUser`, { data: { id: data.id } })
}
export const updateUser = (data) => {
    return axios.put(`/api/admin/updateUser`, data)
}
export const blockUser = (data) => {
    return axios.put(`/api/admin/blockUser`, data)
}
export const getStaffByRole = (role) => {
    return axios.get(`/api/getStaffByRole?roleId=${role}`)
}
export const profileUpdateStaff = (data) => {
    return axios.put(`/api/profileUpdateStaff`, data)
}

// DEPARTMENT MANAGEMENT
export const createDepartment = (data) => {
    return axios.post(`/api/admin/createDepartment`, data)
}
export const getNameDepartment = () => {
    return axios.get(`/api/getAllNameDepartment`)
}
export const getDepartmentDuty = () => {
    return axios.get(`/api/admin/getDepartmentDuty`)
}
export const getDepartment = (page, limit, search) => {
    return axios.get(`/api/getAllDepartment?page=${+page}&limit=${+limit}&search=${search}`)
}
export const getDepartmentById = (id) => {
    return axios.get(`/api/getDepartmentById?id=${id}`)
}
export const deleteDepartment = (data) => {
    return axios.delete(`/api/admin/deleteDepartment `, { data: { id: data.id } })
}
export const updateDepartment = (data) => {
    return axios.put(`/api/admin/updateDepartment`, data)
}
export const blockDepartment = (data) => {
    return axios.put(`/api/admin/blockDepartment`, data)
}

// SERVICE OF ROOM MANAGEMENT
export const getServiceOfRoom = (page, limit, search) => {
    return axios.get(`/api/admin/getAllServiceTypes?page=${+page}&limit=${+limit}&search=${search}`)
}
export const getServiceSearch = () => {
    return axios.get(`/api/admin/getServiceSearch`)
}
export const getServiceById = (id) => {
    return axios.get(`/api/getServiceTypeById?id=${id}`)
}
export const deleteServiceOfRoom = (data) => {
    return axios.delete(`/api/admin/deleteServiceType`, { data: { id: data.id } })
}
export const updateServiceOfRoom = (data) => {
    return axios.put(`/api/admin/updateServiceType`, data)
}
export const blockServiceOfRoom = (data) => {
    return axios.put(`/api/admin/blockServiceType`, data)
}
export const createServiceOfRoom = (data) => {
    return axios.post(`/api/admin/createServiceType`, data)
}

// ROOM MANAGEMENT
export const createRoom = (data) => {
    return axios.post(`/api/admin/createRoom`, data)
}
export const getAllRoom = (query) => {
    return axios.get(`/api/admin/getAllRoomAdmin`, { params: query })
}
export const getRoomById = (id) => {
    return axios.get(`/api/getRoomById?id=${id}`)
}
export const updateRoom = (data) => {
    return axios.put(`/api/admin/updateRoom`, data)
}
export const deleteRoom = (data) => {
    return axios.delete(`/api/admin/deleteRoom`, { data: { id: data.id } })
}
export const blockRoom = (data) => {
    return axios.put(`/api/admin/blockRoom`, data)
}

// SPECIALTY MANAGEMENT
export const getSpecialtySelect = () => {
    return axios.get(`/api/getSpecialtySelect`)
}
export const getAllSpecialtyAdmin = (page, limit, search) => {
    return axios.get(`/api/admin/getAllSpecialtyAdmin?page=${+page}&limit=${+limit}&search=${search}`)
}
export const updateSpecialty = (data) => {
    return axios.put(`/api/admin/updateSpecialty`, data)
}
export const createSpecialty = (data) => {
    return axios.post(`/api/admin/createSpecialty`, data)
}
export const deleteSpecialty = (data) => {
    return axios.delete(`/api/admin/deleteSpecialty`, { data: { id: data.id } })
}
export const blockSpecialty = (data) => {
    return axios.put(`/api/admin/blockSpecialty`, data)
}
export const getSpecialtyById = (id) => {
    return axios.get(`/api/getSpecialtyById?id=${id}`)
}

//HANDBOOK
export const updateHandbook = (data) => {
    return axios.put(`/api/admin/updateHandbookStatus`, data)
}
export const getHandbookAdmin = (page, limit, search, status, filter) => {
    return axios.get(`/api/admin/getHandbookAdmin?page=${+page}&limit=${+limit}&search=${search}&status=${status}&filter=${filter}`)
}

// SCHEDULE MANAGEMENT
export const getSchedule = (query) => {
    return axios.get(`/api/admin/getAllSchedules`, { params: query })
}
export const createSchedule = (data) => {
    return axios.post(`/api/admin/createSchedule`, data)
}
export const arrangeSchedule = (data) => {
    return axios.post(`/api/admin/arrangSchedule`, data)
}


// STATISTIC
export const getStatisticalAppoinment = (query) => {
    return axios.get(`/api/admin/getStatisticalAppoinment`, { params: query })
}

// MEDICINE MANAGEMENT
export const getAllMedicinesAdmin = () => {
    return axios.get(`/api/admin/getAllMedicinesAdmin`)
}
export const getPrescriptionUsed = (query) => {
    return axios.get(`/api/admin/getPrescriptionUsed`, { params: query })
}
export const createMedicine = (data) => {
    return axios.post(`/api/admin/createMedicine`, data)
}
export const updateMedicine = (data) => {
    return axios.put(`/api/admin/updateMedicineAdmin`, data)
}
export const deleteMedicine = (data) => {
    return axios.delete(`/api/admin/deleteMedicine`, { data: { id: data.id } })
}
export const blockMedicine = (data) => {
    return axios.put(`/api/admin/blockMedicine`, data)
}

// EXAMINATION MANAGEMENT
export const getAllExaminationsAdmin = (query = null) => {
    return axios.get(`/api/admin/getAllExaminationsAdmin`, { params: query })
}

export const getExaminationByIdAdmin = (id) => {
    return axios.get(`/api/admin/getExaminationByIdAdmin?id=${id}`)
}

// PAYMENT MANAGEMENT
export const getPaymentAdmin = (query = null) => {
    return axios.get(`/api/admin/getPaymentAdmin`, { params: query })
}

