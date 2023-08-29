import { useState, useEffect } from 'react'
import { getAll, setToken } from './services/blogs'
import { ErrorNotification, Notification } from './components/notifications'
import LoginForm from './components/loginForm'
import { login } from './services/login'
import Loggedindiv from './components/loggedinview'
import BlogList  from './components/BlogList'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  useEffect(() => {
    console.log('getting all effect')
    getAll().then(blogs => {
      setBlogs( blogs )
      console.log(blogs)
    },
    )
  }, [])

  useEffect(() => {
    console.log('message effect')
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }, [message])

  useEffect(() => {
    console.log('errorMessage effect')
    setTimeout(() => {
      setErrorMessage(null)
    }, 3000)
  }, [errorMessage])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
      console.log(user.token)
    } catch (exception) {
      setErrorMessage('either password or username is incorrect, check your typing')
    }
  }



  return (
    <div>
      <h2>blogs</h2>
      <ErrorNotification message={errorMessage}/>
      <Notification message={message}/>
      {user === null ?
        <LoginForm
          setUser={setUser}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}/> :
        <>
          <p>{user.name} logged in
            <button id="logout" onClick={() => {window.localStorage.clear(); setUser(null)}}>log out</button>
          </p>
          <Loggedindiv
            user={user}
            blogs={blogs}
            setBlogs={setBlogs}
            setErrorMessage={setErrorMessage}
            setMessgage={setMessage}
          />
          <BlogList blogs={blogs} user={user} setBlogs={setBlogs} />
        </>}
    </div>
  )
}

export default App