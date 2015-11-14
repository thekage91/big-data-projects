/**
 * Created by ugo on 13/11/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = {
    all_films_one_actor : function (version,actor) {
        switch(version) {
            case 3:
            case 4:
            case 5:
            case 0:
                return mongoose.model('Movie' + version).find({ratings : { $elemMatch : actor}});
                break;
            case 1:
            case 2:
            case 6:
                return mongoose.model('Actor' + version).find(actor,'movies');
                break;
        }
    }
};
