import { apiAxios } from "../axios/axiosConfig";
import { formatFieldErrors } from "../utils/errorUtils";

export class ProfessorService {
    getToken() {
        return localStorage.getItem("token");
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

    getAllPaginated(page = 0, size = 5) {
        return this.handleRequest("get", `/user/all?page=${page}&size=${size}`);
    }

    registerProfessor({ name, email, password, role }) {
        return this.handleRequest("post", `/user/register`, { name, email, password, role });
    }

    deleteProfessor(id) {
        return this.handleRequest("delete", `/user/${id}`);
    }

    updateProfessor(id, userUpdate) {
        return this.handleRequest("patch", `/user/${id}`, userUpdate);
    }
}