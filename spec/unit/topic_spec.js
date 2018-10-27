const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;

describe("Topic", () => {
  beforeEach((done) => {
    this.topic;
    this.post;
    sequelize.sync({force: true}).then((res) => {
      Topic.create({
        title: "Early Jazz Music",
        description: "The shoe-shakin' stuff."
      })
      .then((topic) => {
        this.topic = topic;
        Post.create({
          title: "Louis Armstrong was lit",
          body: "You ever hear him on the trumpet? Whooo boy.",
          topicId: this.topic.id
        })
        .then((post) => {
          this.post = post;
          done();
        });
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  describe("#create()", () => {
    it("should create a topic object with valid arguments.", (done) => {
      Topic.create({
        title: "Jazz",
        description: "American music",
      })
      .then((topic) => {
        expect(topic.title).toBe("Jazz");
        expect(topic.description).toBe("American music");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });
    it("should not create a topic with missing title or description", (done) => {
      Topic.create({
        title: null
      })
      .then((post) => {
        done();
      })
      .catch((err) => {
        expect(err.message).toContain("Topic.title cannot be null")
        expect(err.message).toContain("Topic.description cannot be null")
        done();
      })
    });
  });

  describe("#getPosts()", () => {
    it("should return an array of post objects that are associated with the topic", (done) => {
      this.topic.getPosts()
      .then((associatedPosts) => {
        expect(associatedPosts[0].title).toBe("Louis Armstrong was lit")
        done();
      });
    });
  });
});
