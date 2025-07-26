import { apiAxios } from "../axios/axiosConfig";
import { formatFieldErrors } from "../utils/errorUtils";

export class TraceTableService {
    getToken() {
        return localStorage.getItem("token");
    }

    getUserId() {
        return localStorage.getItem("userId");
    }

    async handleRequest(method, url, data = null, isMultipart = false) {
        const token = this.getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        if (!isMultipart) {
            headers["Content-Type"] = "application/json";
        }

        const response = {
            data: {},
            message: "",
            success: false,
        };

        try {
            const res = await apiAxios({
                method,
                url,
                data,
                headers,
            });

            response.data = res.data;
            response.success = true;
        } catch (error) {
            const responseData = error.response?.data;

            response.message = formatFieldErrors(responseData);
        }

        return response;
    }

    async getAllByUser(userId, page = 0, size = 6) {
        return this.handleRequest("get", `/trace/user/${userId}?page=${page}&size=${size}`);
    }

    async getAllByTheme(themeId, page = 0, size = 6) {
        return this.handleRequest("get", `/trace/theme/${themeId}?page=${page}&size=${size}`);
    }

    async addTraceTable(traceTable, imageFile, themesIds = []) {
        const userId = this.getUserId();
        const token = this.getToken();

        const formData = new FormData();
        const blob = new Blob([JSON.stringify(traceTable)], { type: "application/json" });
        formData.append("traceTableRequest", blob);
        formData.append("image", imageFile);

        const queryParams = themesIds.map(id => `themesIds=${id}`).join("&");
        const url = `/trace/${userId}?${queryParams}`;

        const response = {
            data: {},
            message: "",
            success: false,
        };

        try {
            const res = await apiAxios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            response.data = res.data;
            response.success = true;
        } catch (error) {
            const responseData = error.response?.data;

            response.message = formatFieldErrors(responseData);
        }

        return response;
    }

    async editTraceTable(traceTableId, updatedData) {
        const userId = this.getUserId();
        return this.handleRequest("put", `/trace/${traceTableId}/${userId}`, updatedData);
    }


    async deleteTraceTable(traceTableId) {
        const userId = this.getUserId();
        return this.handleRequest("delete", `/trace/${traceTableId}/${userId}`);
    }
}