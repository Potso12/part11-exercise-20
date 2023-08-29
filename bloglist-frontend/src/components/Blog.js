import { useState } from 'react'
import { update, getAll } from '../services/blogs'
import RemoveButton from './deleteBlogButton'

const Blog = ({ blog, user ,setBlogs }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showDetails, setShowDetails] = useState(false)

  const handleToggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const addLike = (blog) => {
    const updatedBlog = {
      user: blog.user.id,
      likes: blog.likes +1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    update(blog.id,updatedBlog)

    getAll().then(blogs => {
      setBlogs( blogs )
      console.log(blogs)
    })
  }

  console.log(user)

  return (
    <div className="blog" style={blogStyle}>
      <div>
        <strong>{blog.title}</strong> by {blog.author}
        <button onClick={handleToggleDetails}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      {showDetails && (
        <div className="details">
          <p>{blog.author}</p>
          <p>{blog.url}</p>
          <p>Likes: {blog.likes}
            <button onClick={() => addLike(blog)}>likes</button></p>
          <RemoveButton blog={blog} user={user}/>
        </div>
      )}
    </div>
  )
}

export default Blog