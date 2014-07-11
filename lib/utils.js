function each(obj,cb){
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            cb.call(obj, obj[key], key)
        }
    }
}

function normalize(s){
    return s.split('_').map(function(val,ind){
        return capitalize(val)
    }).join('')
}

function capitalize(s){
    return s[0].toUpperCase() + s.substr(1).toLowerCase()
}

function without(val,array){
    return array.filter(function(v){return v != val})
}


module.exports = {
    normalize : normalize,
    capitalize : capitalize,
    without : without,
    each : each
}
