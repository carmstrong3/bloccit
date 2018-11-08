'use strict';
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Favorite.associate = function(models) {
    // associations can be defined here
    Favorite.belongsTo(models.Post, {
      foreignKey: "postId",
      onDelete: "CASCADE"
    });
 
    Favorite.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

  };

  Favorite.addScope("favoritedPosts", (userId) => {
  //  Include the `Post` for each `Favorite` to build an anchor tag.
   const Post = require("../models").Post;
   return {
      include: [{
        model: Post
      }],
      where: { userId: userId},
      order: [["createdAt", "DESC"]]
    }
  });


  return Favorite;
};
