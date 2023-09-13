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

  const handleDeletePost = async (id: string) => {
    await deletePost(id)
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, marginTop: 60 }}>
        {data?.posts.map((item) => (
          <div key={item._id}>
            <img src={item.image_full_url} alt={item.title} width={250} height={250} style={{ objectFit: 'cover' }} />
            <h1>{item.title}</h1>
            <p>{item.content}</p>
            <p>{item?.category?.name ?? 'Kategori Yok'}</p>
            <p>{item.user.name.toUpperCase()}</p>
            <button type="button" onClick={() => handleDeletePost(item._id)}>
              Sil
            </button>
          </div>
        ))}
      </div>
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
