import { apiAxios } from "../axios/axiosConfig";
import { formatFieldErrors } from "../utils/errorUtils";

export class ThemeService {
    getToken() {
        return localStorage.getItem("token");
    }

    getUserId() {
        return localStorage.getItem("userId");
    }

    async handleRequest(method, url, data = null) {
        const token = this.getToken();
        const headers = {
            Authorization: `Bearer ${token}`,
        };

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

    findAllThemesByUser() {
        const userId = this.getUserId();
        return this.handleRequest("get", `/theme/user/${userId}`);
    }

    findThemesPaginatedByUser(page, size) {
        const userId = this.getUserId();
        return this.handleRequest("get", `/theme/user/${userId}?page=${page}&size=${size}`);
    }

    createTheme(name) {
        const userId = this.getUserId();
        const body = { name };
        return this.handleRequest("post", `/theme/${userId}`, body);
    }

    deleteTheme(themeId) {
        const userId = this.getUserId();
        return this.handleRequest("delete", `/theme/${themeId}/${userId}`);
    }

    updateTheme(themeId, data) {
        const userId = this.getUserId();
        return this.handleRequest("put", `/theme/${themeId}/${userId}`, data);
    }

    getThemesByExercise(traceId) {
        return this.handleRequest("get", `/theme/trace/${traceId}`);
    }
}