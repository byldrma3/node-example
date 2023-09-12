type Category = {
  _id: string
  name: string
  __v: number
}

type Post = {
  _id: string
  title: string
  content: string
  category: Category
  createdAt: string
  updatedAt: string
  __v: number
}

export type PostRequest = {
  title: string
  content: string
  category: string
}

export type PostResponse = {
  totalPages: number
  currentPage: number
  posts: Post[]
}
