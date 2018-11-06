 // Dependencies
const favoriteQueries = require("../db/queries.favorites.js");

module.exports = {

// create() checks if there is a user signed-in and if so, calls createFavorite method of queries.favorites.js with the request. If creatFavorite() returns an error, we load a flash message. Or, the user may not be signed-in and we load an error saying so. Then redirect to the view the request came from.
  create(req, res, next){
    if(req.user){
      favoriteQueries.createFavorite(req, (err, favorite) => {
        if(err){
          req.flash("error", err);
        }
      });
    } else {
      req.flash("notice", "You must be signed in to do that.")
    }
    res.redirect(req.headers.referer);
  },

// destroy() checks if there is a user signed-in and if so, calls the deleteFavorite
  destroy(req, res, next){

    if(req.user){
      favoriteQueries.deleteFavorite(req, (err, favorite) => {
        if(err){
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to do that.")
      res.redirect(req.headers.referer);
    }
  }
}
