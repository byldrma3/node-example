import React from 'react'
import { useGetPostsListQuery, usePostPostMutation, useDeletePostMutation } from '../services/posts'
import './App.css'

function App() {
  const [page, setPage] = React.useState<number>(1)
  const { data, error, isLoading, refetch } = useGetPostsListQuery(page)
  const [postPost] = usePostPostMutation()
  const [deletePost] = useDeletePostMutation()
  const [form, setForm] = React.useState({
    title: '',
    content: '',
    category: '64fc98503923776f9d88a6d9'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await postPost(form)
    refetch()
  }

  if (error) return <div>Hata!!!</div>

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <form onSubmit={handleOnSubmit}>
        <input type="text" name="title" placeholder="title" value={form.title} onChange={handleChange} />
        <br />
        <input type="text" name="content" placeholder="content" value={form.content} onChange={handleChange} />
        <br />
        <input type="text" name="category" value={form.category} disabled />
        <br />
        <button type="submit">Submit</button>
      </form>
      {data?.posts.map((item) => (
        <div key={item._id}>
          <h1>{item.title}</h1>
          <p>{item.content}</p>
          <p>{item.category.name}</p>
          <button type="button" onClick={() => deletePost(item._id)}>
            Sil
          </button>
        </div>
      ))}
      <br />
      <br />
      {data?.currentPage !== 1 && (
        <button type="button" onClick={() => setPage((prev) => prev - 1)}>
          Prev
        </button>
      )}
      {data?.currentPage} / {data?.totalPages}
      {data?.currentPage !== data?.totalPages && (
        <button type="button" onClick={() => setPage((prev) => prev + 1)}>
          Next
        </button>
      )}
    </>
  )
}

export default App
