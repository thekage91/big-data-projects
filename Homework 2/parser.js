/*
 Movie structure:

 movie id | movie title | release date | video release date |
 IMDb URL | unknown | Action | Adventure | Animation |
 Children's | Comedy | Crime | Documentary | Drama | Fantasy |
 Film-Noir | Horror | Musical | Mystery | Romance | Sci-Fi |
 Thriller | War | Western |
 */

var fs = require('fs'),
    parse = require('csv-parse'),
    moviesPath = './dataset/movies.list',
    directorsPath = './dataset/directors.list.tsv',
    genresPath = './dataset/genres.list.tsv',
    actorsPath = './dataset/actors.list.tsv',
    moviesMatrix = './dataset/movies.matrix.list',
    directorsMatrix = './dataset/registi.matrix.list.solonontrova',
    genresMatrix = './dataset/generi.matrix.list',
    actorsMatrix = './dataset/attori.matrix.list',
    actressesMatrix = './dataset/attrici.matrix.list',
    provaPath = './dataset/prova.list.tsv',
    app = require('./app.js'),
    Q = require('q'),
    mongoose = app.mongoose,
    Actor = mongoose.model('Actor'),
    Director = mongoose.model('Director'),
    Movie = mongoose.model('Movie'),
    Genre = mongoose.model('Genre');


var moviePostApi = "/api/film"
var genrePostApi = "/api/genre"
var directorPostApi = "/api/director"
var actorPostApi = "/api/actor"


var directorsFields = ['first_name', 'last_name', 'film'];
var genreFields = ['film', 'genre'];
var actorFields = ['first_name', 'last_name', 'film', '', '', 'role'];


var callbackSave = function (err) {
    if (err) throw new Error(err);
    console.log('Succesfully saved')
}

var parserDirectors = parse({
    delimiter: '\t',
    relax: true,
    columns: ['first_name', 'last_name', 'film']
}, function (err, data) {


    var film;

    if (err) {
        console.error(err);
        return;
    }

    //console.info('INFOFOSDIF ' + JSON.stringify(data));
    data.forEach(function (elem) {
        //Per ogni riga, filtra via gli elementi vuoti
        Movie.find({title: elem.film.trim()}, function (err, movies) {
            if (err) throw new Error(err);
            if (movies.length === 0) {
                console.log('No movie with title: ' + elem.film);
                return;
            }
            movies.forEach(function (movie) {
                console.log('adding director to film: ' + elem.film);
                var director = new Director({first_name: elem.first_name, last_name: elem.last_name});
                director.movies.push(movie.id);
                movie.directors.push(director.id);
                director.save(callbackSave);
                movie.save(callbackSave);

            });

        })

    });

});


var parserMovies = parse({delimiter: '\t', relax: true, columns: ['title', '', 'release_date']}, function (err, data) {

    var film;

    if (err) {
        console.error(err);
        return;
    }

    //Per ogni riga, filtra via gli elementi vuoti
    data.forEach(function (elem) {
        if (elem.undefined !== '' && elem.undefined !== undefined) {
            elem.release_date = elem.undefined;
            delete elem.undefined;
        }
        else if (elem[''] !== '') {
            elem.release_date = elem[''];
            if (elem.release_date === '????')
                delete elem.release_date;
            delete elem[''];
        }

        Movie.create(elem, function (err, movie) {
            if (err) throw new Error(err);
            /*console.log('Saved in database: ' + JSON.stringify(movie))*/
        });

    });

});


var parserGenres = parse({delimiter: '\t', relax: true, columns: ['film', 'genre']}, function (err, lines) {


    var film;

    if (err) {
        console.error(err);
        return;
    }

    lines.forEach(function (line) {
        line.genre = line.genre.trim();


        Movie.find({title: line.film.trim()}, function (err, movies) {
            if (err) throw new Error(err);
            if (movies.length === 0) {
                console.log('No movie with title: ' + line.film);
                return;
            }
            Genre.findOne({name: line.genre}, function (err, genre) {

                if (err) throw new Error(err);
                if (!genre) console.log('GENRE NOT FOUND: ' + line.genre.trim());
                else console.log('GENRE FOUND: ' + line.genre.trim());
                genre = genre || new Genre({name: line.genre});

                for (var i = 0; i < movies.length; i++) {
                    var movie = movies[i];

                    genre.movies.push(movie.id);
                    movie.genres.push(genre.id);
                    var p1 = genre.save();
                    var p2 = movie.save();
                    p1.then((data) => {
                            console.log('e be salvato' + data)
                        },
                        (err) => {
                            Genre.findOneAndUpdate({name: line.genre})
                        });
                    p2.then(() => {
                        console.log(' e be salvato2')
                    })

                }
            });

        })

    });


});


var parseGenres = parse({delimiter: '\t', relax: true, columns: ['film', 'genre']},
    (err, lines) => {
        if (err) throw new Error("Error while parsing Genres: " + err);
        lines.forEach(
            (line) => {
                var updateMovie = Movie.findOne({title: line.film});
                var updateGenre = (movie_id) => Genre.findOneAndUpdate({name: line.genre},{$push : {movies: movie_id}},{upsert: true, new: true});

                updateMovie.exec().then(
                    (movie) => {
                        console.log('Movie id prima: ' + movie[0].id);
                        movie = movie[0] || new Movie({title: line.film});
                        console.log('Movie id dopo: ' + movie.id);
                        updateGenre(movie.id).exec().then(
                            (genre) => {
                                console.log('Genre updated');
                                movie.genres.push(genre.id);
                                movie.save().then(
                                    () => { console.log('Succesfully update movie: ' + JSON.stringify(movie))},
                                    (err) => { console.error('Error while updating movie: ' + err)})
                            },(err) => {console.error('Error while updating genre: ' + err)})

                    },
                    (err) => {  console.error('Error while findOne movie: ' + err)});
            })
    })



var parseActors = parse({delimiter: '\t', relax: true, columns: ['first_name', 'last_name', 'film', '', '', 'role']},
    (err, lines) => {
        if (err) throw new Error("Error while parsing Actors: " + err);
        lines.forEach(
            (line) => {
                var updateMovie = Movie.findOne({title: line.film});
                var updateGenre = (movie_id) => Genre.findOneAndUpdate({name: line.genre},{$push : {movies: movie_id}},{upsert: true, new: true});
                updateMovie.exec().then(
                    (movie) => {
                        //console.log('che problemi hai')
                        movie = movie[0] || new Movie({title: line.film});
                        updateGenre(movie.id).exec().then(
                            (genre) => {
                                console.log('Genre updated: ' + JSON.stringify(genre));
                                movie.genres.push(genre.id);
                                movie.save(callbackSave);
                                console.log('Dopo save');/*.then(
                                    () => { console.log('Succesfully updated movie')},
                                    (err) => { console.error('Error saving movie: ' + err)})*/
                            },(err) => {console.error('Error while updating genre: ' + err)})

                    });
            })
    })

var parserActors = parse({
    delimiter: '\t',
    relax: true,
    columns: ['first_name', 'last_name', 'film', '', '', 'role']
}, function (err, data) {
    if (err) {
        console.error(err);
        return;
    }

    //Per ogni riga, filtra via gli elementi vuoti
    data.forEach(function (elem) {
        console.log(elem);
    });
});


var moviesOutput = [];
var userOutput = [];
var genreOutput = [];
var dataOutput = [];

module.exports = {

    parsingDataAndSave: parseAndSave
}


var parseAndSave = function () {

    console.log("[+] Dropping Database ");

    console.log("[+] Create Stream and read | " + moviesPath + " | " +
    genresPath + " | " + directorsPath + " | " + actorsPath + " |");
    var moviesStream = fs.createReadStream(moviesMatrix).pipe(parserMovies);
    var genresStream = fs.createReadStream(genresMatrix).pipe(parseGenres);
    //var actorsStream = fs.createReadStream(actorsPath).pipe(parserActors);
    //var directorsStream = fs.createReadStream(directorsMatrix).pipe(parserDirectors);


    console.log("[DEBUG] Save | Actors | Films | Directors | Genres | on db")

}

parseAndSave();
