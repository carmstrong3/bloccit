'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Favorites', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // Set userId to associate the favorite to a user.
      userId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE", // If user is deleted, favorite deletes too
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
          as: "userId"
        }
      },
      // set postId to associate the favorite to a post.
      postId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE", // Also delete the favorite if the post is deleted
        allowNull: false,
        references: {
          model: "Posts",
          key: "id",
          as: "postId"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Favorites');
  }
};
