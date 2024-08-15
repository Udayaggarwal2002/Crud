// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

import authConfig from 'src/configs/auth'

// ** Types
import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'
import { http } from 'src/configs/http'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      if (storedToken) {
        setLoading(true)
        try {
          const response = await http({
            url: 'me',
            method: 'get'
          })
          const { success, userData } = response
          if (success) {
            setLoading(false)
            setUser({ ...userData })
          } else {
            localStorage.removeItem('userData')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            router.push('/login')
          }
        } catch (error) {
          setLoading(false)
        }
      } else {
        setLoading(false)
        router.push('/login')
        localStorage.removeItem('userData')
      }
    }
    initAuth()
  }, [])

  const handleLogin = async (params: LoginParams) => {
    try {
      const response = await http({
        url: 'login',
        method: 'post',
        data: params
      })
      const { user, success, accessToken } = response
      if (success) {
        window.localStorage.setItem(authConfig.storageTokenKeyName, accessToken)
        window.localStorage.setItem('userData', user)
        setUser(user)
        console.log('user in handlelogin', user)
        router.push('/home')
      }
      toast.success('Login success')
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
