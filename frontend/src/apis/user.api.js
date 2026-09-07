import api from "../utils/axios";

export const getCurrentUser = async () => {
    try {
        const response = await api.get("/api/me");
        return response.data;
    } catch {
        return null;
    }
};

export const deductCoins = async (data) => {
    try {
        const response = await api.post("/api/auth/use-coins", data);
        return response.data;
    } catch (error) {
        console.error("Coin deduction error:", error);
        throw error;
    }
};

export const useCoins = deductCoins;