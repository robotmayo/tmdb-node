module.exports = {
    ERRORS : {
        KEY_MISSING: "You must supply a valid api key!"
    },
    baseUrl : 'http://api.themoviedb.org/3',
    endpoints : {
        genres : {
            genreList : '/genre/movie/list',
            movies : '/genre/%d/movies'
        },
        changes : '/%s/changes',
        collection : {
            collection : '/collection/%d'
        },
        movie : {
            movie : '/movie/%d',
            credits : '/movie/%d/credits',
            images : '/movie/%d/images'
        }
    },
    defaultOpts : {
        genres : {
            movies : {
                page : 1,
                include_all_movies : true,
                include_adult : false
            }
        },
        changes : {
            start_date : 'YYYY-MM-DD',
            end_date : 'YYYY-MM-DD',
            page : 1
        }
    }
}