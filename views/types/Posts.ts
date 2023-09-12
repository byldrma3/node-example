type Category = {
  _id: string
  name: string
  __v: number
}

type User = {
  _id: string
  name: string
  email: string
}

type Post = {
  _id: string
  title: string
  content: string
  image_full_url: string
  image: string
  category: Category
  user: User
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
