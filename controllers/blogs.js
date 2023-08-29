const notesRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware');


notesRouter.get('', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', 'username name');
    response.json(blogs);
  });
  
  notesRouter.get('/:id', (request, response) => {
    const { id } = request.params;
  
    Blog.findById(id)
      .then(blog => {
        if (blog) {
          response.json(blog);
        } else {
          response.status(404).json({ error: 'Blog not found' });
        }
      })
      .catch(error => {
        response.status(500).json({ error: 'Server error' });
      });
  });


  notesRouter.post('',userExtractor ,async (request, response) => {
    try {
      const { title, author, url, likes } = request.body;
  
      if (!title || !url) {
        return response.status(400).json({ error: 'Title and URL are required fields' });
      }
  
      console.log(request.user)
  
      const blog = new Blog({
        title,
        author,
        url,
        likes: likes || 0,
        user: request.user._id
      });
  
      request.user.blogs.push(blog)
      await request.user.save()

      const result = await blog.save();
      response.status(201).json(result);
    } catch (error) {
      console.error('Error saving blog:', error);
      response.status(500).json({ error: 'Internal server error' });
    }
  });
  

  notesRouter.delete('/:id', userExtractor , async (request, response) => {
    try {
      const { id } = request.params;
 
      const user = request.user
      const blog = await Blog.findById(id);


  
      if (user.id.toString() === blog.user.toString()) {
        await Blog.findByIdAndDelete(id);
        response.status(204).end();
      } else {
        response.status(403).json({ error: 'only user who added the blog can delete it' });
      }
    } catch (error) {
      response.status(500).json({ error: 'Server error' });
    }
  });

  notesRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body;
  
    if (!title || !url || !author) {
      return response.status(400).json({ error: 'Title, URL and author are required fields' });
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { new: true }
    );
  
    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }
  
    response.json(updatedBlog);
  });

  module.exports = notesRouter