// stores/useAppStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type User = {
  id: string
  email: string
  userType: string
  createdAt: string
  updatedAt: string
  walletAddress: string
}

type AppState = {
  token: string | null
  user: User | null
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  clearAuth: () => void
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'app-store-session',
      storage: createJSONStorage(() => sessionStorage), // ✅ Fix: wrap sessionStorage
    }
  )
)

export default useAppStore
