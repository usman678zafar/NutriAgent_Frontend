import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add interceptor for JWT
api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add interceptor for handling 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                window.location.href = "/auth";
            }
        }
        return Promise.reject(error);
    }
);

export const authApi = {
    register: (data: any) => api.post("/auth/register", data),
    login: (data: any) => api.post("/auth/login", data),
    getMe: () => api.get("/auth/me"),
};

export const metricsApi = {
    update: (data: any) => api.post("/metrics", data),
    getCurrentTargets: () => api.get("/targets/current"),
    getCurrentMetrics: () => api.get("/metrics/current"),
    getHistory: () => api.get("/metrics/history"),
};

export const mealApi = {
    log: (data: any) => api.post("/meals", data),
    getToday: () => api.get("/meals/today"),
    getSuggestions: () => api.get("/meals/suggestions"),
    estimate: (data: any) => api.post("/meals/estimate", data),
};

export const insightApi = {
    reviewProgress: () => api.post("/progress/review"),
    getHabitInsights: () => api.get("/insights/habits"),
};

export default api;
