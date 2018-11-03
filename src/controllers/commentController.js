const commentQueries = require("../db/queries.comments.js");
const Authorizer = require("../policies/comment.js");

module.exports = {
  create(req, res, next){
    // Check the policy to confirm the user can create comments
    const authorized = new Authorizer(req.user).create();

    if(authorized){
      // create buils a newComment object with the info from the request
      let newComment = {
        body: req.body.body,
        userId: req.user.id,
        postId: req.params.postId
      };
      // Call createComment and pass newComment
      commentQueries.createComment(newComment, (err, comment) => {
        // Redirect the user to the same place regardless of outcome and pass err if err
        if(err){
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to do that.")
      req.redirect("/users/sign_in");
    }
  },

  // The destroy action passes the request to the deleteComment method
  destroy(req, res, next){
    commentQueries.deleteComment(req, (err, comment) => {
      if(err){
        res.redirect(err, req.headers.referer);
      } else {
        res.redirect(req.headers.referer);
      }
    });
  }
}
