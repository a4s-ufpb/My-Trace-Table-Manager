import { apiAxios } from "./axios/axiosConfig";

export class AuthService {
    async login(email, password) {
        try {
            const response = await apiAxios.post("/user/login", {
                email,
                password,
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Erro ao autenticar",
            };
        }
    }

    async getUserData(token) {
        try {
            const response = await apiAxios.get("/user/find", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Erro ao buscar usuário",
            };
        }
    }
}
