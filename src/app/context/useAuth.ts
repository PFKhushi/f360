import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

type AuthProps = {
  access: string,
  refresh: string
}

type UseAuthProps = {
  auth: AuthProps | null,
  setToken: (auth: AuthProps | null) => void,
  clearAuth: () => void,
}

const COOKIE_NAME = 'userLoged';

export const cookieStorage = {
  getItem: (name: string) => {
    const value = Cookies.get(name);
    return value ? value : null;
  },
  setItem: (name: string, value: string) => {
    Cookies.set(name, value, { expires: 7, path: '/' }); // Expira em 7 dias
  },
  removeItem: (name: string) => {
    Cookies.remove(name);
  }
};

export const useAuth = create<UseAuthProps>()(
  persist(
    (set) => ({
      auth: null,
      setToken: (auth) => set(() => ({auth})),
      clearAuth: () => {
        cookieStorage.removeItem(COOKIE_NAME);
      }
    }),
    {
      name: COOKIE_NAME,
      storage: createJSONStorage(() => cookieStorage)
    }
  )
)