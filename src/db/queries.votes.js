const Comment = require("./models").Comment;
const Post = require("./models").Post;
const User = require("./models").User;
const Vote = require("./models").Vote;

module.exports = {
  createVote(req, val, callback){

 // call findOne on Vote to look for Vote object with id of the current user and the postId
    return Vote.findOne({
      where: {
        postId: req.params.postId,
        userId: req.user.id
      }
    })
    .then((vote) => {

 // If the vote exists already, we update the value to the new up or downvote value and save
      if(vote){
        vote.value = val;
        vote.save()
        .then((vote) => {
          callback(null, vote);
        })
        .catch((err) => {
          callback(err);
        });
      } else {

 // If the vote doesn't yet exist, we create a new vote with corresponding value
        Vote.create({
          value: val,
          postId: req.params.postId,
          userId: req.user.id
        }).then((vote) => {
          callback(null, vote);
        })
        .catch((err) => {
          callback(err);
        });
      }
    });
  }
}
