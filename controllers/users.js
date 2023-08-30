const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('', async (request, response) => {
    try {
      const users = await User.find({});
      response.json(users);
    } catch (error) {
      // Handle the error
      response.status(500).json({ error: 'Something went wrong' });
    }
  });

  usersRouter.post('', async (request, response) => {
    const { username, name, password, blogs } = request.body;

    if (username.length < 3 || password.length < 3) {
      return response.status(400).json({ error: 'Username and password must be at least 3 characters long' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return response.status(409).json({ error: 'Username must be unique' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      blogs: blogs || [],
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  });

  usersRouter.put('', async (request, response) => {
    const { username, name, password, blogs } = request.body;

    if (username.length < 3 || password.length < 3) {
      return response.status(400).json({ error: 'Username and password must be at least 3 characters long' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return response.status(409).json({ error: 'Username must be unique' });
    }

    const user = {
        blogs,
        username,
        name,
        password
    }

    await User.findOneAndUpdate({ username: username },user , { new: true })

  })


  module.exports = usersRouter