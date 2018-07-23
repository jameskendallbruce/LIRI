// REQUIRE STYLE VARIABLES
require("dotenv").config()

// VVV npm install all these before running VVV
var request = require("request");
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var fs = require("fs");

// var for refercning my "keys.js" file
var keys = require("./keys.js")
// from the keys files-- pulling in twitter and spotify
var twitteracct = new twitter(keys.twitter);
var spotifyacct = new spotify(keys.spotify);

// vars to hold terminal inputs
var arg = process.argv;
var action = arg[2];

//an array to hold the searchterms
var searchArr = [];

// adding everything entered in the terminal past the action command into the array
function makeArr(){
    for (i = 3; i < arg.length; i++){
        searchArr.push(arg[i])
    };
}

makeArr();

// Making a string for the searchterm (This lets us search for full movie and song titles)
searchTerm = searchArr.join(" ");


// Using a switch command to allow us to call different functions through terminal inputs
switch (action) {
    case "my-tweets":
        return runTweets();
        break;

    case "spotify-this-song":
        return runSpotify();
        break;

    case "movie-this":
        runMovies();
        break;
        
    case "do-what-it-says":
        return runDefault();
        break;

}

    // All the Commands functions follow:

    // SPOTIFY-THIS-SONG RESULTS
    // ============================
    // function to call the node spotify api
    function runSpotify() {
        
        // Setting the default search for if it's undefined
        if (searchTerm === ""){
            searchTerm = "The Sign (Ace of Base)"
        };      
        
        // search in the spotify api
        spotifyacct.search({
            type: 'track', 
            query: "'" + searchTerm + "'",
            limit: 1,
        }, function(err, data){
            var capsTerm = searchTerm.toUpperCase();
            console.log("===============");
            console.log("--Returning results from the Node Spotify API--");
            console.log("===============")
            console.log("--" + capsTerm + "--");
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Preview Url: " + data.tracks.items[0].preview_url);
        
        });

    };


    // MY-TWEETS RESULTS
    // ============================
    // function to call the twitter
    function runTweets() {
        var params = {
            screen_name:'JamesKendallBr1',
            count: 20
        };

        twitteracct.get("statuses/user_timeline", params, function(err, tweets, response) {
            
            // console log an error
            if (err) {
                console.log("Whoops! Error: " + err)              
            }
            
            // otherwise, display the last 20 tweets from the pre-set account
            else{
                console.log("===============");
                console.log(" -- I guess this is Twitter... -- ");
                console.log("===============");
                for (var i = 0; i < 20; i++) {
                    console.log("Tweet: " + tweets[i].text);
                    // console.log("Created at: " + tweets[i].created_at);
                }
            }
        })
    };

    // MOVIE-THIS RESULTS
    // ============================
    // function to call the omdb api
    function runMovies() {

        // using a queryUrl similar to good practice in ajax get requests.
        var queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t='" + searchTerm + "'&type=movie";
        
        // setting up a default movie search if searchTerm is undefined
        if(searchTerm === ""){
                queryUrl = "http://www.omdbapi.com/?apikey=trilogy&t=Mr+Nobody&type=movie";
            }

        // making our call to omdb
        request(queryUrl, function(err, resp, body){
            var movie = JSON.parse(body);
            // Just a test to look at the full returned api call
            // console.log(movie)
            console.log("");
            console.log("");
            console.log("");
            console.log("");
            console.log("");
            console.log("===============")
            console.log("--Returning results from OMDB's API--");
            console.log("===============")
            console.log("Title: " + movie.Title);
            console.log("Year: " + movie.Year);
            console.log("IMDB User Rating: " + movie.imdbRating);
            // console.log("Rotten Tomatoes Tomatometer(tm) Score: " + movie.Ratings[1].Value)
            console.log("Country of Origin: " + movie.Country);
            console.log("Language: " + movie.Language);
            console.log("Plot: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
            console.log("===============")

        })
    }

    function runDefault(){
        fs.readFile("random.txt", "utf8", function(error, data) {

            // seperating the 2 text files and inserting them into variables
            var dataArr = data.split(",");

            action = dataArr[0];

            searchTerm = dataArr[1];

            // calling runSpotify but with "I want it that way" as the searchTerm
            runSpotify();
          
          });
    }

if (action != ("spotify-this-song" || "movie-this" || "do-what-it-says" || "movie-this") ){
    console.log("")
    console.log("")
    console.log("")
    console.log("Whoops. Try entering a command.")
    console.log("===============")
    console.log("Use the command 'my-tweets' to get the last 20 tweets posted from my very real twitter account.")
    console.log("===============")
    console.log("Use the command 'spotify-this-song' followed by a song title as your searchTerm to get some songs stats and a url.")
    console.log("===============")
    console.log("Use the command 'movie-this' followed by a movie title as a searchTerm to return the top search for that title with other info.")
    console.log("===============")
    console.log("WARNING: If you try using a searchTerm with any punctuation, it will not work as intended. \nTry skipping punctuation just this once.")
    console.log("===============")
    console.log("Have fun!!")

}