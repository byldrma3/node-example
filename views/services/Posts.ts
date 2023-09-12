import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { PostResponse, PostRequest } from '../types'
import { Environment } from '../constants'

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: Environment.BASE_URL }),
  endpoints: (builder) => ({
    getPostsList: builder.query<PostResponse, number>({
      query: (page) => `posts?page=${page}&limit=2`
    }),
    postPost: builder.mutation<PostResponse, PostRequest>({
      query: (post) => ({
        url: 'posts',
        method: 'POST',
        body: post
      })
    }),
    deletePost: builder.mutation<PostResponse, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE'
      })
    })
  })
})

export const { useGetPostsListQuery, usePostPostMutation, useDeletePostMutation } = postsApi
