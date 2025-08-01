import { create } from "zustand";

type User = {
  id: string;
  username: string;
  email: string;
  role: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => {
    console.log("Zustand setUser called with:", user);
    set({ user });
  },
  logout: () => set({ user: null }),
}));
