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
            collection : '/collection/%d',
            images : '/collection/%d/images'
        },
        movie : {
            movie : '/movie/%d',
            credits : '/movie/%d/credits',
            images : '/movie/%d/images',
            keywords : '/movie/%d/keywords',
            releases : '/movie/%d/releases',
            videos : '/movie/%d/videos',
            translations : '/movie/%d/translations',
            similar : '/movie/%d/similar',
            reviews : '/movie/%d/reviews',
            lists : '/movie/%d/lists',
            changes : '/movie/%d/changes',
            latest : '/movie/latest',
            upcoming : '/movie/upcoming',
            now_playing : '/movie/now_playing',
            popular : '/movie/popular',
            top_rated : '/movie/top_rated'
        },
        certification : {
            certification : '/certification/%s/list'
        },
        company : {
            company : '/company/%d',
            movies : '/company/%d/movies'
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