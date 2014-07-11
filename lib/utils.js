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
    if(!val.filter) val = [val]
    return array.filter(function(v){return array.indexOf(val) > -1})
}

function countTokens(string){
    var res = string.match(/%[jsd]/g)
    return res ? res.length : 0
}


module.exports = {
    normalize : normalize,
    capitalize : capitalize,
    without : without,
    each : each,
    countTokens : countTokens
}
