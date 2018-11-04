const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics/";

const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const User = require("../../src/db/models").User;
const Comment = require("../../src/db/models").Comment;

describe("routes : comments", () => {

  beforeEach((done) => {

// Define the variables. 
    this.user;
    this.topic;
    this.post;
    this.comment;

    sequelize.sync({force: true}).then((res) => {

// Create a user, topic, post, and comment and associate all.
      User.create({
        email: "starman@tesla.com",
        password: "Trekkie4lyfe"
      })
      .then((user) => {
        this.user = user;  // store user

        Topic.create({
          title: "Expeditions to Alpha Centauri",
          description: "A compilation of reports from recent visits to the star system.",
          posts: [{   
            title: "My first visit to Proxima Centauri b",
            body: "I saw some rocks.",
            userId: this.user.id   
          }]
        }, {
          include: {                        //nested creation of posts
            model: Post,
            as: "posts"
          }
        })
        .then((topic) => {
          this.topic = topic;                 // store topic
          this.post = this.topic.posts[0];  // store post

          Comment.create({  
            body: "ay caramba!!!!!",
            userId: this.user.id,          
            postId: this.post.id
          })
          .then((comment) => {
            this.comment = comment;             // store comment
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        })
        .catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

// Define a context for guest user.
  describe("guest attempting to perform CRUD actions for Comment", () => {

// Ensure there is no user signed in.
     beforeEach((done) => {    // before each suite in this context
       request.get({           // mock authentication
         url: "http://localhost:3000/auth/fake",
         form: {
           userId: 0 // flag to indicate mock auth to destroy any session
         }
       },
         (err, res, body) => {
           done();
         }
       );
     });

// Ensure a user who is not signed in is not able to create a comment.
     describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

       it("should not create a new comment", (done) => {
         const options = {
           url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
           form: {
             body: "This comment is amazing!"
           }
         };
         request.post(options,
           (err, res, body) => {
// Make sure the comment was not created by querying the database of it.
             Comment.findOne({where: {body: "This comment is amazing!"}})
             .then((comment) => {
               expect(comment).toBeNull();   // ensure no comment was created
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           }
         );
       });
     });


// Ensure a user who is not signed in is not able to destroy a comment.
     describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

       it("should not delete the comment with the associated ID", (done) => {
         Comment.all()
         .then((comments) => {
           const commentCountBeforeDelete = comments.length;

           expect(commentCountBeforeDelete).toBe(1);

           request.post(
             `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
             (err, res, body) => {
             Comment.all()
             .then((comments) => {
               expect(err).toBeNull();
               expect(comments.length).toBe(commentCountBeforeDelete);
               done();
             })

           });
         })
       });
     });
   });

// Define a context for a signed in user.
   describe("signed in user performing CRUD actions for Comment", () => {

     beforeEach((done) => {    // before each suite in this context
       request.get({           // mock authentication
         url: "http://localhost:3000/auth/fake",
         form: {
           role: "member",     // mock authenticate as member user
           userId: this.user.id
         }
       },
         (err, res, body) => {
           done();
         }
       );
     });

// Ensure a user who is signed in is able to create a comment.
     describe("POST /topics/:topicId/posts/:postId/comments/create", () => {

       it("should create a new comment and redirect", (done) => {
         const options = {
           url: `${base}${this.topic.id}/posts/${this.post.id}/comments/create`,
           form: {
             body: "This comment is amazing!"
           }
         };
         request.post(options,
           (err, res, body) => {
             Comment.findOne({where: {body: "This comment is amazing!"}})
             .then((comment) => {
               expect(comment).not.toBeNull();
               expect(comment.body).toBe("This comment is amazing!");
               expect(comment.id).not.toBeNull();
               done();
             })
             .catch((err) => {
               console.log(err);
               done();
             });
           }
         );
       });
     });

// Ensure a user who is signed in is able to destroy a comment.
     describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

       it("should delete the comment with the associated ID", (done) => {
         Comment.all()
         .then((comments) => {
           const commentCountBeforeDelete = comments.length;

           expect(commentCountBeforeDelete).toBe(1);

           request.post(
            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
             (err, res, body) => {
             expect(res.statusCode).toBe(302);
             Comment.all()
             .then((comments) => {
               expect(err).toBeNull();
               expect(comments.length).toBe(commentCountBeforeDelete - 1);
               done();
             })
           });
         })
       });

     });
// Ensure a user who is signed in is not able to destroy another users comment.
     describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {
       beforeEach((done) => {
         let newUser = 
           User.create({
            email: "muskrat@tesla.com",
            password: "spacexisfun",
            role: "member"
           });  //create new user
         this.comment.userId = newUser.id; // change owner of this.comment
         done();
       });
       
       it("should not delete the comment with the associated ID", (done) => {
         Comment.all()
         .then((comments) => {
           const commentCountBeforeDelete = comments.length;

           expect(commentCountBeforeDelete).toBe(1);

           request.post(
            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
             (err, res, body) => {
             expect(res.statusCode).toBe(302);
             Comment.all()
             .then((comments) => {
               expect(comments.length).toBe(commentCountBeforeDelete);
               done();
             })
           });
         })
       });

     });

   }); //end context for signed in user
 // Define a context for an admin user.
  describe("admin user performing delete actions for Comment", () => {

    beforeEach((done) => {    // before each suite in this context
      request.get({           // mock authentication
        url: "http://localhost:3000/auth/fake",
        form: {
          role: "admin",     // mock authenticate as admin user
          userId: this.user.id
        }
      },
      (err, res, body) => {
        done();
      }
      );
    });
    // Ensure an admin who is signed in is able to destroy a comment.
    describe("POST /topics/:topicId/posts/:postId/comments/:id/destroy", () => {

      it("should delete the comment with the associated ID", (done) => {
        Comment.all()
        .then((comments) => {
          const commentCountBeforeDelete = comments.length;
          expect(commentCountBeforeDelete).toBe(1);
          request.post(
            `${base}${this.topic.id}/posts/${this.post.id}/comments/${this.comment.id}/destroy`,
            (err, res, body) => {
            expect(res.statusCode).toBe(302);
            Comment.all()
            .then((comments) => {
              expect(err).toBeNull();
              expect(comments.length).toBe(commentCountBeforeDelete - 1);
              done();
            })
          });
        })
      });
    });
  });  // End of admin context 
});
