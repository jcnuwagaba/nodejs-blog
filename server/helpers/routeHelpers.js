function isActiveRoute (route,currentRoute){ //used to turn on css active style on links
    return route===currentRoute ? 'active' : '';
}

module.exports={isActiveRoute};