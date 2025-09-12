export const setToken = (token: string, refreshToken?: string, user?: any) => {
    localStorage.setItem("token", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    if (user) localStorage.setItem("user", JSON.stringify(user));
};


export const getToken = (): string | null => {
    return localStorage.getItem("token");
};

export const removeToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};
