const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const sum = blogs.reduce((accumulator, currentvalue) =>{
    return accumulator + currentvalue.likes
  },0)
  return sum
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const favourite = blogs.reduce((currentFavorite, blog) =>
    blog.likes > currentFavorite.likes ? blog : currentFavorite
  );
  return favourite
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null;
  }

  const blogCount = {};

  blogs.forEach((blog) => {
    const { author } = blog;
    blogCount[author] = (blogCount[author] || 0) + 1;
  });

  let maxBlogs = 0;
  let topAuthor = '';

  Object.entries(blogCount).forEach(([author, count]) => {
    if (count > maxBlogs) {
      maxBlogs = count;
      topAuthor = author;
    }
  });

  return {
    author: topAuthor,
    blogs: maxBlogs,
  };
};


const mostLikes = (blogs) => {

  if(blogs.length === 0) {
    return null;
  }
  console.log(blogs.lenght)

  const authorLikes = {};


  blogs.forEach((blog) => {
    const { author, likes } = blog;
    authorLikes[author] = (authorLikes[author] || 0) + likes;
  });

 
  let mostLikedAuthor = '';
  let maxLikes = 0;
  for (const author in authorLikes) {
    if (authorLikes[author] > maxLikes) {
      mostLikedAuthor = author;
      maxLikes = authorLikes[author];
    }
  }

  return {
    author: mostLikedAuthor,
    likes: maxLikes,
  };
};


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}