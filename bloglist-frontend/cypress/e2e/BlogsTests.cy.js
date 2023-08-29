describe('Blog app', function() {
  const user = {
    name: 'Matti Luukkainen',
    username: 'mluukkai',
    password: 'salainen'
  }
  
    describe('When logged in', function() {
      beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
       
        cy.request('POST', 'http://localhost:3003/api/users',user)
        cy.request('POST', 'http://localhost:3003/api/login',{ 
          username: 'mluukkai',password: 'salainen'
          }).then(response => {
          localStorage.setItem('loggedInUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })


      })
  
      it('A blog can be created', function() {
        cy.get('#createblogviewbutton').click()
        cy.get('#blogtitle').type('paskablogi22')
        cy.get('#blogauthor').type('mluukkai')
        cy.get('#blogurl').click().type('http://blogs/paskablogi22')
        cy.get('#createblogbutton').click()

        cy.wait(3000)

        cy.contains('paskablogi22 by mluukkai')
      })

      it('Users can like a blog', function() {
        cy.get('#createblogviewbutton').click()
        cy.get('#blogtitle').type('paskablogi22')
        cy.get('#blogauthor').type('mluukkai')
        cy.get('#blogurl').click().type('http://blogs/paskablogi22')
        cy.get('#createblogbutton').click()

        cy.wait(5000)

        cy.get('button').contains('Show Details').click()
        cy.get('button').contains('likes').click()
        
        cy.wait(10000)

        cy.contains('Likes: 1')
      })
      
      it('Creator of blog can delete it', function() {
        cy.get('#logout').click()
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()


        cy.get('#createblogviewbutton').click()
        cy.get('#blogtitle').type('paskablogi22')
        cy.get('#blogauthor').type('mluukkai')
        cy.get('#blogurl').click().type('http://blogs/paskablogi22')
        cy.get('#createblogbutton').click()

        cy.wait(3000)

        cy.get('button').contains('Show Details').click()
        cy.get('button').contains('remove').click()
      })

      it('remove blog buttonis only visible for its creator', function() {
        const randomuser = {
          name: 'random dude',
          username: 'rdude',
          password: 'secret'
        }
        cy.request('POST', 'http://localhost:3003/api/users',randomuser)
        cy.get('#logout').click()
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('salainen')
        cy.get('#login-button').click()

        cy.get('#createblogviewbutton').click()
        cy.get('#blogtitle').type('paskablogi22')
        cy.get('#blogauthor').type('mluukkai')
        cy.get('#blogurl').click().type('http://blogs/paskablogi22')
        cy.get('#createblogbutton').click()

        cy.wait(3000)

        cy.get('button').contains('Show Details').click()
        cy.contains('remove')
        cy.get('button').contains('log out').click()

        cy.get('#username').type('rdude')
        cy.get('#password').type('secret')
        cy.get('#login-button').click()

        cy.get('button').contains('Show Details').click()
        cy.contains('remove').should('not.exist')
      })

      it('check that the blogs are in correct order', function() {
          const blog1 = {
          title: "The Majestic Oak Tree",
          url: "http://blog1/site.com",
          author: "username1",
          likes: 500
          }

          const blog2 = {
          title: "The Enchanting Willow Tree",
          url: "http://blog2/site.com",
          author: "username2",
          likes: 300
          }

          const blog3 = {
          title: "The Resilient Pine Tree",
          url: "http://blog3/site.com",
          author: "username3",
          likes: 250
          }

          cy.request({
            method: 'POST',
            url: 'http://localhost:3003/api/blogs',
            body: blog1,
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
            }
          });
          
          cy.request({
            method: 'POST',
            url: 'http://localhost:3003/api/blogs',
            body: blog2,
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
            }
          });
          
          cy.request({
            method: 'POST',
            url: 'http://localhost:3003/api/blogs',
            body: blog3,
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser')).token}`
            }
          });
          
          cy.visit('http://localhost:3000')
          cy.wait(1000);

          cy.get('.blog').eq(0).should('contain', 'The Majestic Oak Tree')
          cy.get('.blog').eq(1).should('contain', 'The Enchanting Willow Tree')
          cy.get('.blog').eq(2).should('contain', 'The Resilient Pine Tree')

      })

    })
  
  })