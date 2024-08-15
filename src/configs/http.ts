import axios, { AxiosError } from 'axios'
import { isWindowPresent } from './helpers'

type IHttpProps = {
  accessToken?: string | null
  url: string
  method: string
  data?: any
  formData?: boolean
  abortSignal?: AbortSignal
  headers?: { [key: string]: string }
}

const IS_LOCAL_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT === 'local'

let baseURL = process.env.NEXT_PUBLIC_API_URL

if (IS_LOCAL_ENV) baseURL = process.env.NEXT_PUBLIC_API_URL

const http = async (props: IHttpProps): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    const Authorization = props?.accessToken ?? (isWindowPresent() ? localStorage.getItem('accessToken') ?? null : null)
    const config = {
      baseURL: `${baseURL}${props?.url}`,
      method: props?.method,
      headers: {
        'Content-Type': props.formData ? 'multipart/form-data' : 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        Authorization: Authorization ? `Bearer ${Authorization}` : null
      },
      data: props?.data
    }

    try {
      const response = await axios({
        ...config,
        ...(props.abortSignal && { signal: props.abortSignal })
      })
      if (!response?.data?.success) {
        throw new Error(response?.data?.message ?? 'Something went wrong')
      }

      return resolve(response?.data)
    } catch (error: any) {
      if (error instanceof AxiosError) {
        // if (error.response?.data?.message === 'jwt expired') {
        if (isWindowPresent()) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('userData')
          window?.location.replace('/login')

          window.location.replace('/login')

          // }
        }

        return reject(error.response?.data)
      }

      return reject(error)
    }
  })
}

export { http }
