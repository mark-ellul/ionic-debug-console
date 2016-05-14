function isHeroku()
{
    // Rudimentary check to see if we are running on Heroku. Should provide a more flexible config.
    // return window.location.hostname.indexOf('herokuapp.com') > 0;
    return false;
}

export var SERVER_URL = isHeroku() ? "/" : "http://localhost:1337/",
           APP_ID = "1";
