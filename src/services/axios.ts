/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
// import { getSession } from 'next-auth/react'

interface PostDataProps<T> {
  data: T
  url: string
  headers?: Record<string, string>
  onSuccess: (response: any) => void
  onError: (error: any) => void
}

export const PostData = <T>({
  data,
  url,
  headers,
  onSuccess,
  onError,
}: PostDataProps<T>) => {
  const postData = async () => {
    // const session = await getSession()
    // const token = session?.user?.access
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
        data,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            ...headers,
          },
        },
      )

      onSuccess(res.data)
    } catch (err) {
      onError(err)
    }
  }

  postData()

  return null
}

interface PatchDataProps<T> {
  data: T
  url: string
  headers?: Record<string, string>
  onSuccess: (response: any) => void
  onError: (error: any) => void
}

export const PatchData = <T>({
  data,
  url,
  headers,
  onSuccess,
  onError,
}: PatchDataProps<T>) => {
  const patchData = async () => {
    // const session = await getSession()
    // const token = session?.user?.access
    try {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
        data,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            ...headers,
          },
        },
      )
      onSuccess(res.data)
    } catch (err) {
      onError(err)
    }
  }

  patchData()

  return null
}

export const PutData = <T>({
  data,
  url,
  headers,
  onSuccess,
  onError,
}: PatchDataProps<T>) => {
  const patchData = async () => {
    // const session = await getSession()
    // const token = session?.user?.access
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
        data,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
            ...headers,
          },
        },
      )

      onSuccess(res.data)
    } catch (err) {
      onError(err)
    }
  }

  patchData()

  return null
}

export const DeleteData = ({
  url,
  onSuccess,
  onError,
}: {
  url: string
  onSuccess: (response: any) => void
  onError: (error: any) => void
}) => {
  const deleteData = async () => {
    // const session = await getSession()
    // const token = session?.user?.access
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`,
        {
          headers: {
            // Authorization: `Bearer ${token}`,
          },
        },
      )

      onSuccess(res.data)
    } catch (err) {
      onError(err)
    }
  }

  deleteData()

  return null
}
