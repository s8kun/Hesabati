import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserProfile = {
  fullName: string;
  email: string;
  country: string;
  whatsapp: string;
  description?: string;
};

interface UserStoreState {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  patchUser: (user: Partial<UserProfile>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      patchUser: (userPatch) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...userPatch }
            : {
                fullName: userPatch.fullName || "",
                email: userPatch.email || "",
                country: userPatch.country || "",
                whatsapp: userPatch.whatsapp || "",
                description: userPatch.description || "",
              },
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "hissaati-user-profile",
    },
  ),
);
