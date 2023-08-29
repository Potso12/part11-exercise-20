const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const generateToken = (payload, secret) => {
  return jwt.sign(payload, secret);
};


const api = supertest(app)

const initialBlogs = [
  { 
    title: "Third Blog Post",
    author: "Emily Brown",
    url: "https://example.com/third-blog-post",
    likes: 12, 
  },
  {
    title: "Sample Blog Post",
    author: "John Doe",
    url: "https://example.com/sample-blog-post",
    likes: 10
  },
]

const initialUsers = [
  {
    username: "emilybrown",
    name: "Emily Brown",
    password: "password1"
  },
  {
    username: "johndoe",
    name: "John Doe",
    password: "password2"
  }
];

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await Blog.insertMany(initialBlogs)

    const userPromises = initialUsers.map(async (user) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(user.password, saltRounds);
    
    const newUser = new User({
      username: user.username,
      name: user.name,
      passwordHash
    });
    
    return newUser.save();
  });

  await Promise.all(userPromises);

  console.log('ready')
},100000)

test('two blogs are returned as json', async () => {
  console.log('start')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(2)
},100000)

test('blogs have the id property', async () => {
  const response = await api.get('/api/blogs');
  const blogs = response.body;
  

  blogs.forEach(blog => {
    expect(blog.id).toBeDefined();
  });
});

test('creating a new blog post', async () => {
  const newBlog = {
    title: "New Blog Post",
    author: "Jane Smith",
    url: "https://example.com/new-blog-post",
    likes: 5
  };

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRpcmtraXMiLCJpZCI6IjY0OTYwODUwMjM1MmNjMTZjNzRjNGRhYiIsImlhdCI6MTY4NzYwODAyMiwiZXhwIjoxNjg3NjExNjIyfQ.xCtHdPK9Be4uAopoFC34gVEE8oraassaDUyNQ1JHcec')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const blogs = response.body;

  expect(blogs).toHaveLength(initialBlogs.length + 1);

  const titles = blogs.map(blog => blog.title);
  expect(titles).toContain(newBlog.title);
});

test('creating a new blog post with missing likes (defaults to 0)', async () => {
  const newBlog = {
    title: 'New Blog Post',
    author: 'Jane Smith',
    url: 'https://example.com/new-blog-post',
  };

  await api
    .post('/api/blogs')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRpcmtraXMiLCJpZCI6IjY0OTYwODUwMjM1MmNjMTZjNzRjNGRhYiIsImlhdCI6MTY4NzYwODAyMiwiZXhwIjoxNjg3NjExNjIyfQ.xCtHdPK9Be4uAopoFC34gVEE8oraassaDUyNQ1JHcec')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  const blogs = response.body;

  expect(blogs).toHaveLength(initialBlogs.length + 1);

  const createdBlog = blogs.find(blog => blog.title === newBlog.title);
  expect(createdBlog.likes).toBe(0);
});

test('creating a new blog post with missing title (responds with 400)', async () => {
  const newBlog = {
    author: 'Jane Smith',
    url: 'https://example.com/new-blog-post',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

test('creating a new blog post with missing url (responds with 400)', async () => {
  const newBlog = {
    title: 'New Blog Post',
    author: 'Jane Smith',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);
});

test('deleting a blog', async () => {
  const blogsBeforeDeletion = await api.get('/api/blogs');
  const initialBlogCount = blogsBeforeDeletion.body.length;
  const blogToDelete = blogsBeforeDeletion.body[0];

  const userPayload =   {
    username: "emilybrown",
    password: "password1"
  };
  const secretKey = process.env.SECRET;
  
  const token = generateToken(userPayload, secretKey);

  console.log(token)

  await api
  .delete(`/api/blogs/${blogToDelete.id}`)
  .set('Authorization', `Bearer ${token}`)
  .expect(204);

  const blogsAfterDeletion = await api.get('/api/blogs');
  const updatedBlogCount = blogsAfterDeletion.body.length;

  expect(updatedBlogCount).toBe(initialBlogCount - 1);

  const blogIds = blogsAfterDeletion.body.map(blog => blog.id);
  expect(blogIds).not.toContain(blogToDelete.id);

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRpcmtraXMiLCJpZCI6IjY0OTYwODUwMjM1MmNjMTZjNzRjNGRhYiIsImlhdCI6MTY4NzYwODAyMiwiZXhwIjoxNjg3NjExNjIyfQ.xCtHdPK9Be4uAopoFC34gVEE8oraassaDUyNQ1JHcec`)
    .expect(401);
});

test('updating a blog post', async () => {
  const updatedBlog = {
    title: 'Updated Blog Post',
    author: 'Jane Smith',
    url: 'https://example.com/updated-blog-post',
    likes: 15,
  };

  // Get the ID of an existing blog post
  const response = await api.get('/api/blogs');
  const blogToUpdate = response.body[0];
  const id = blogToUpdate.id;

  // Update the blog post
  await api
    .put(`/api/blogs/${id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  // Retrieve the updated blog post
  const updatedResponse = await api.get(`/api/blogs/${id}`);
  const updatedBlogPost = updatedResponse.body;

  // Verify that the blog post was updated
  expect(updatedBlogPost.title).toBe(updatedBlog.title);
  expect(updatedBlogPost.author).toBe(updatedBlog.author);
  expect(updatedBlogPost.url).toBe(updatedBlog.url);
  expect(updatedBlogPost.likes).toBe(updatedBlog.likes);
});


test('updating a blog post with erroneous data returns 400', async () => {
  const response = await api.get('/api/blogs');
  const blogToUpdate = response.body[0];
  const id = blogToUpdate.id;

  const erroneousBlog = {
    // Missing required fields title and url
    author: 'Jane Smith',
    likes: 15,
  };

  await api
    .put(`/api/blogs/${id}`)
    .send(erroneousBlog)
    .expect(400);
});

test('invalid user is not created', async () => {
  const newUser = {
    username: 'us',
    name: 'John Doe',
    password: 'pa',
  };

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  expect(response.body.error).toBe('Username and password must be at least 3 characters long');
});

test('unique username is enforced', async () => {
  const newUser = {
    username: 'johndoe',
    name: 'John Doe',
    password: 'password',
  };

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(409)
    .expect('Content-Type', /application\/json/);

  expect(response.body.error).toBe('Username must be unique');
});

afterAll(async () => {
  await mongoose.connection.close()
})