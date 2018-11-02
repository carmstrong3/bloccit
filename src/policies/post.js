const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {
 new() {
    return this.newPost();
  }

  create() {
    return this.newPost();
  }

  edit() {
    return this._isAdmin();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
  
  show() {
    return this.show();
  }
}
