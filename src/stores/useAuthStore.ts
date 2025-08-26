// stores/useAppStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type User = {
  id: string
  email: string
  userType: string
  createdAt: string
  updatedAt: string
  walletAddress: string
}

type UserDetails = {
  me: {
    id: string
    email?: string
    firstName?: string
    lastName?: string
    username?: string
    createdAt?: string
    updatedAt?: string
    fiatWallet?: {
      id?: string
      balance?: number
      createdAt?: string
      updatedAt?: string
      Currency?: {
        createdAt?: string
        code?: string
        name?: string
        rateToUSD?: number
        symbol?: string
      }
    } | null
    cryptoWallet?: {
      id?: string
      createdAt?: string
      updatedAt?: string
      accounts?: {
        id?: string
        address?: string
        cryptoWalletId?: string
        createdAt?: string
        updatedAt?: string
      }[]
    } | null
  }
}

type AppState = {
  token: string | null
  user: User | null
  userDetails: UserDetails | null
  setToken: (token: string | null) => void
  setUser: (user: User | null) => void
  setUserDetails: (user: UserDetails ) => void
  clearAuth: () => void
}

const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      userDetails: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setUserDetails: (userDetails) => set({ userDetails }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    {
      name: 'app-store-session',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default useAppStore
