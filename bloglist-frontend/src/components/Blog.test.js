import React from 'react'
//import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'New Blog Post',
    author: 'John Doe',
    url: 'https://example.com/new-blog-post',
    likes: 8,
    user: {
      username: 'john_doe',
      name: 'John Doe',
      id: '6495b6c2686e0ead5bcbc2fe'
    },
    id: '6495ffaac2c3761b57c5f8f5'
  }

  const user = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ…jIzfQ.oBvu4G99yUH_-RNP0GTk4fawWv-XfJsxexSbL1dIzvI',
    username: 'tirkkis',
    name: 'Otso Tikkanen' }

  render(<Blog blog={blog} user={user} />)

  const titleElement = screen.getByText(blog.title)
  const authorElement = screen.getByText(`by ${blog.author}`)
  const urlElement = screen.queryByText(blog.url)
  const likesElement = screen.queryByText(`${blog.likes} likes`)

  expect(titleElement).toBeInTheDocument()
  expect(authorElement).toBeInTheDocument()
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()

})