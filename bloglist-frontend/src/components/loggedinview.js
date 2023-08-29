import { useState } from 'react'
import { create } from '../services/blogs'

const Loggedindiv = ({ user ,blogs, setBlogs, setErrorMessage, setMessage }) => {

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [showAddBlogPage, setShowAddBlogPage] = useState(false)

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const handleNewBlogSubmit = async (event) => {
    console.log('function entered')
    event.preventDefault()
    if (title.trim() === '' || author.trim() === '' || url.trim() === '') {
      console.log('if statement entered')
      setErrorMessage('blog must have title author and url')
      return
    }

    const blog = { title: title, author: author, url: url }

    try {
      const response = await create(blog)
      console.log(response)
      const updatedBlogs = [...blogs, response]
      setBlogs(updatedBlogs)
      setTitle('')
      setUrl('')
      setAuthor('')
      setMessage(`${user.name} added blog ${title}`)
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.log(error.response.data.error)
        const errmessage = String(error.response.data.error)
        setErrorMessage(errmessage)
      } else {
        console.error('Error saving person:', error)
      }
    }
  }



  if(showAddBlogPage){
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={handleNewBlogSubmit}>
          <div>
                title:{' '}
            <input id="blogtitle" type="text" value={title} onChange={handleTitleChange} />
          </div>
          <div>
                author: <input id="blogauthor" value={author} onChange={handleAuthorChange} />
          </div>
          <div>
                url: <input id="blogurl" value={url} onChange={handleUrlChange} />
          </div>
          <div>
            <button id="createblogbutton" type="submit">create</button>
          </div>
        </form>
        <button onClick={() => setShowAddBlogPage(false)}>cancell</button>
      </div>
    )
  } else return (
    <button id="createblogviewbutton" onClick={() => setShowAddBlogPage(true)}>create new blog</button>
  )
}


export default Loggedindiv