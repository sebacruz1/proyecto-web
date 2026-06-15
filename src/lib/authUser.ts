export type AuthUser = {
  id: number;
  email: string;
  role: "admin" | "user" | "patrullero";
  roleId: number;
  roleDisplay: string;
  firstName: string;
  lastName: string;
  rut: string;
  address: string;
  phone?: string | null;
  token: string;
};

const KEY = "auth_user";

export const setAuthUser = (user: AuthUser, remember: boolean = false) => {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(KEY, JSON.stringify(user));
};

export const updateAuthUser = (user: AuthUser) => {
  if (sessionStorage.getItem(KEY)) {
    sessionStorage.setItem(KEY, JSON.stringify(user));
    return;
  }

  if (localStorage.getItem(KEY)) {
    localStorage.setItem(KEY, JSON.stringify(user));
    return;
  }

  sessionStorage.setItem(KEY, JSON.stringify(user));
};

export const getAuthUser = (): AuthUser | null => {
  const raw = sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    clearAuthUser();
    return null;
  }
};

export const clearAuthUser = () => {
  sessionStorage.removeItem(KEY);
  localStorage.removeItem(KEY);
};
