const Topic = require("./models").Topic;
const Post = require("./models").Post;
const Flair = require("./models").Flair; 

module.exports = {

  getAllTopics(callback){
    return Topic.all()
    .then((topics) => {
      callback(null, topics);
    })
    .catch((err) => {
      callback(err);
    })
  },
  addTopic(newTopic, callback){
    return Topic.create({
      title: newTopic.title,
      description: newTopic.description
    })
    .then((topic) => {
      callback(null, topic);
    })
    .catch((err) => {
      callback(err);
    })
  },
  getTopic(id, callback){
    return Topic.findByID(id, {
      include: [{
        model: Post,
        as: "posts"
      },
      {
        model: Flair,
        as: "flairs"
      }]
    })
    .then((topic) => {
      callback(null, topic);
    })
    .catch((err) => {
      callback(err);
    })
  },
}
