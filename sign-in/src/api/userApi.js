import axiosClient from "./axiosUser";

// api/productApi.js
const UserApi = {
    getAll: (params) => {
        const url = '/harsh';
        return axiosClient.get(url, { params });
    },

    get: (id) => {
        const url = `/harsh/${id}`;
        return axiosClient.get(url);
    },

    checkPass: (name, password) => {
        const url = `/harsh?name=${name}&&password=${password}`;
        return axiosClient.get(url);
    }
}

export default UserApi;