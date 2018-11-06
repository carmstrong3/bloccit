const ApplicationPolicy = require("./application");

module.exports = class FavoritePolicy extends ApplicationPolicy {
  // make sure someone is the owner of a favorite before deleting
  destroy(){
    return this._isOwner();
  }
}
