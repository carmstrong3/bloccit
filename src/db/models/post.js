'use strict';
module.exports = (sequelize, DataTypes) => {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    topicId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    Post.belongsTo(models.Topic, {
      foreignKey: "topicId",
      onDelete: "CASCADE"
    });

    Post.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
   
    Post.hasMany(models.Comment, {
      foreignKey: "postId",
      as: "comments"
    });

    Post.hasMany(models.Vote, {
      foreignKey: "postId",
      as: "votes"
    });
  };

  Post.prototype.getPoints = function(){
    // Check for any posts, if none then return 0
    if(this.votes.length === 0) return 0
    // If there are votes, get a count of all values by adding them and returning the result. map function transforms the array and reduce goes over all values, reducing until one left, the total.
    return this.votes
      .map((v) => { return v.value })
      .reduce((prev, next) => { return prev + next });
  };

  Post.prototype.hasUpvoteFor = function(userIdentification){
    if(this.votes.length === 0) return false;
    for(let i = 0; i < this.votes.length; i++){
      if(this.votes[i].userId === userIdentification){
        return true
      }
    }
    return false
  };

  return Post;
};
