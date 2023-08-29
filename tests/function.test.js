const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe("Total likes", () => {
    test("of emty list is zero", () => {
        const blogs = []

    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(0)
    });
  
    test("when list has only one blog, equals likes of that", () => {
        const blogs = [{
            title: "Sample Blog Post",
            author: "John Doe",
            url: "https://example.com/sample-blog-post",
            likes: 10,
          }]

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(10)
    });
  
    test("list has multiple blogs", () => {
        const blogs = [{
            title: "Sample Blog Post",
            author: "John Doe",
            url: "https://example.com/sample-blog-post",
            likes: 10,
          },{
            title: "Sample Blog Post",
            author: "John Doe",
            url: "https://example.com/sample-blog-post",
            likes: 1,
          },{
            title: "Sample Blog Post",
            author: "John Doe",
            url: "https://example.com/sample-blog-post",
            likes: 7,
          }
        ]

        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(18)
      });
  });

  describe("Most liked one", () => {
    test("of emty list is zero", () => {
        const blogs = []

    const result = listHelper.favouriteBlog(blogs)
    expect(result).toBe(null)
    });
  
    test("when list has clear favourite", () => {
        const blogs = [{
          title: "Sample Blog Post",
          author: "John Doe",
          url: "https://example.com/sample-blog-post",
          likes: 10,
        },{
          title: "Sample Blog Post",
          author: "John Doe",
          url: "https://example.com/sample-blog-post",
          likes: 1,
        },{
          title: "Sample Blog Post",
          author: "John Doe",
          url: "https://example.com/sample-blog-post",
          likes: 7,
        }
      ]

        const result = listHelper.favouriteBlog(blogs)
        expect(result).toEqual(blogs[0])
    });
  
  });

  describe("Author who has made most blogs", () => {
    test("of emty list is zero", () => {
        const blogs = []

    const result = listHelper.mostBlogs(blogs)
    expect(result).toBe(null)
    });
  
    test("when list has clear favourite", () => {
      const blogs = [{
        title: "Sample Blog Post",
        author: "catlin ederwese",
        url: "https://example.com/sample-blog-post",
        likes: 10,
      },{
        title: "Sample Blog Post",
        author: "John Doe",
        url: "https://example.com/sample-blog-post",
        likes: 6,
      },{
        title: "Sample Blog Post",
        author: "John Doe",
        url: "https://example.com/sample-blog-post",
        likes: 7,
      },{
        title: "Sample Blog Post",
        author: "catlin ederwese",
        url: "https://example.com/sample-blog-post",
        likes: 10,
      },{
        title: "Sample Blog Post",
        author: "catlin ederwese",
        url: "https://example.com/sample-blog-post",
        likes: 10,
      }
    ]

        const result = listHelper.mostBlogs(blogs)
        expect(result).toEqual({
          author: "catlin ederwese",
          blogs: 3
        })
    });
  
  });

  describe("Author whose blogs have most likes combined", () => {
    test("of emty list is zero", () => {
        const blogs = []

    const result = listHelper.mostLikes(blogs)
    expect(result).toBe(null)
    });
  
    test("when list has clear favourite", () => {
        const blogs = [{
          title: "Sample Blog Post",
          author: "catlin ederwese",
          url: "https://example.com/sample-blog-post",
          likes: 10,
        },{
          title: "Sample Blog Post",
          author: "John Doe",
          url: "https://example.com/sample-blog-post",
          likes: 6,
        },{
          title: "Sample Blog Post",
          author: "John Doe",
          url: "https://example.com/sample-blog-post",
          likes: 7,
        }
      ]

        const result = listHelper.mostLikes(blogs)
        expect(result).toEqual({
          author: "John Doe",
          likes: 13,
        })
    });
  
  });