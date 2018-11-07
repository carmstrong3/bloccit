const User = require("./models").User;
const bcrypt = require("bcryptjs");
const Post = require("./models").Post;
const Comment = require("./models").Comment;

module.exports = {
  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUser(id, callback){
 // Define a result object to hold the user, posts, and comments that will be returned and requested the User object from the database.
    let result = {};
    User.findById(id)
    .then((user) => {
 // If no user returns, we return an error.
      if(!user) {
        callback(404);
      } else {
 // If the user is there, we return the user
        result["user"] = user;
 // Execute the scope on Post to get hte last five posts made by the user
        Post.scope({method: ["lastFiveFor", id]}).all()
        .then((posts) => {
 // Store the result in the result object
          result["posts"] = posts;
 // Execute the scope on Comment to get the last five comments made by the user
          Comment.scope({method: ["lastFiveFor", id]}).all()
          .then((comments) => {
 // Store the result in the object and pass the object to the callback.
            result["comments"] = comments;
            callback(null, result);
          })
          .catch((err) => {
            callback(err);
          })
        })
      }
    })
  }
}
