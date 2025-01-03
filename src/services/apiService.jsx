import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'https://api.nosomovo.xyz/',
    withCredentials: false,
});
export const apiService = {
    // getAllFolk() {
    //     return axiosInstance.get(`https://api.nosomovo.xyz/ethnic/getalllist/`)
    // },
    // getAllProvince() {
    //     return axiosInstance.get(`/province/getalllist/193`)
    // },
    // getDistrictByProvinceId(id) {
    //     return axiosInstance.get(`/district/getalllist/${id}`)
    // },
    // getWardByDistrictId(id) {
    //     return axiosInstance.get(`/commune/getalllist/${id}`)
    // },
    getAllProvince() {
        return axiosInstance.get(`https://esgoo.net/api-tinhthanh/1/0.htm`)
    },
    getDistrictByProvinceId(id) {
        return axiosInstance.get(`https://esgoo.net/api-tinhthanh/2/${id}.htm`)
    },
    getWardByDistrictId(id) {
        return axiosInstance.get(`https://esgoo.net/api-tinhthanh/3/${id}.htm`)
    },
}