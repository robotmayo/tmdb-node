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
        },
        credit : {
            credit : '/credit/%s'
        },
        discover : {
            discover : '/discover/%s'
        },
        find : {
            find : '/find/%d'
        },
        job :{
            job : '/job/list'
        },
        keyword : {
            keyword : '/keyword/%d',
            movies : '/keyword/%d/movies'
        },
        list :{
            list : '/list/%d',
            item_status : '/list/%d/item_status'
        },
        network : {
            network : '/network/%d'
        },
        person : {
            person : '/person/%d',
            movie_credits : '/person/%d/movie_credits',
            tv_credits : '/person/%d/tv_credits',
            combined_credits : '/person/%d/combined_credits',
            external_ids : '/person/%d/external_ids',
            images : '/person/%d/images',
            tagged_images : '/person/%d/tagged_images',
            changes : '/person/%d/changes',
            popular : '/person/popular',
            latest : '/person/latest'
        },
        reviews : {
            reviews : '/review/%d'
        },
        search : {
            company : '/search/company',
            collection : '/search/collection',
            keyword : '/search/keyword',
            list : '/search/list',
            movies : '/search/movies',
            multi : '/search/multi',
            person : '/search/person',
            tv : '/search/tv'
        },
        timezones : {
            list : '/timezones/list'
        },
        tv : {
            tv : '/tv/%d',
            changes : '/tv/%d/changes',
            credits : '/tv/%d/credits',
            external_ids : '/tv/%d/external_ids',
            images : '/tv/%d/images',
            keywords : '/tv/%d/keywords',
            similar : '/tv/%d/similar',
            translations : '/tv/%d/translations',
            videos : '/tv/%d/videos',
            latest : '/tv/%d/latest',
            on_the_air : '/tv/on_the_air',
            airing_today : '/tv/airing_today',
            top_rated : '/tv/top_rated',
            popular : '/tv/popular'
        },
        seasons :{
            season : '/tv/%d/season/%d',
            changes : '/tv/season/%d/changes',
            credits : '/tv/%d/season/%d/credits',
            external_ids : '/tv/%d/season/%d/external_ids',
            images : '/tv/%d/season/%d/images',
            videos : '/tv/%d/season/%d/videos'
        },
        episodes : {
            episode : '/tv/%d/season/%d/episode/%d',
            changes : '/tv/episode/%d/changes',
            credits : '/tv/%d/season/%d/episode/%d/credits',
            external_ids : '/tv/%d/season/%d/episode/%d/external_ids',
            images : '/tv/%d/season/%d/episode/%d/images',
            videos : '/tv/%d/season/%d/episode/%d/videos'
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