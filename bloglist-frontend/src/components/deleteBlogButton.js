import { remove } from '../services/blogs'


const RemoveButton = ({ blog }) => {



  const deleteBlog= (blog) => {
    const confirmdeletingBlog = window.confirm(`are you sure you want to delete ${blog.title} by ${blog.user.name}`)
    if(confirmdeletingBlog){
      remove(blog.id)
    }
  }

  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'))
  const userId = loggedInUser.id
  console.log(blog.user)
  console.log(blog.user.id)
  console.log(userId)
  console.log((blog.user.id === userId) ||  (blog.user === userId))

  if(blog.user === userId || blog.user.id === userId) {
    return(
      <button onClick={() => deleteBlog(blog)} >remove</button>
    )
  } else {
    return(
      <></>
    )
  }
}
export default RemoveButton