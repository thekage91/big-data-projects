/**
 * Created by ugo on 13/11/15.
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

module.exports = {

    // Tutti i film di un attore
    all_films_one_actor : function (version,actor) {
        if(isNaN(version) || actor == undefined)
            throw new Error('version and actor needed')

        switch(version) {
            case 3:
            case 4:
            case 5:
            case 0:
                console.log(`query: find({actors : {$elemMatch : ${JSON.stringify(actor)} } } )`)
                return mongoose.model('Movie' + version)
                    .find({actors : { $elemMatch : actor}});
                break;
            case 1:
            case 2:
            case 6:
                return mongoose.model('Actor' + version).find(actor,'movies');
                break;
        }
        return result;
    }
};
