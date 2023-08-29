import Blog from './Blog'

const BlogList = ({ blogs, user, setBlogs }) => {

  //console.log(typeof blogs)
  //console.log(blogs)

  return (
    <>
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} user={user} setBlogs={setBlogs} />
      )}
    </>
  )
}

export default BlogList