const app = require('express')();
const PORT = 8080;

var ranks = [
    'User','Operator'
]

var shutdownPassword = "🤡"

var dbSplitKey = '~';

var develMode = true; // DO NOT SET TO TRUE IF USING IN PRODUCTION ENVIORMENT
var develUser = "OpenAD"; // Default: OpenAD
var develToken = "OpenAD"; // Default: OpenAD


app.listen(
    PORT,
    () => console.log(`OpenAD API running on https://localhost:${PORT}`)
);

// read database users and ads
const fs = require('fs');
var users = fs.readFileSync('users').toString().split('\n');
var ads = fs.readFileSync('ads').toString().split('\n');
var opencomputers = fs.readFileSync('opencomputers').toString().split('\n');

if (develMode) {
    users.push("Operator" + dbSplitKey + develUser + dbSplitKey + develToken);
    console.log("*** WARNING ***")
    console.log("Running in DEVELOPMENT MODE! If you want to use the API in production, please change develMode to false.");
}

console.log("To change the ads please edit the ads file and follow this syntax: ImageID;Comment");
console.log("For OpenComputers (text ads) please edit the opencomputers file and follo this syntax: Text $$$ Comment"); // wth is this? opencomputers ads? is this the old days?
console.log("To add or remove users please edit the users file and follow this syntax on each line: Rank~Username~Token\n(Make sure ~ is replaced with wathever that is stored in the dbSplitKey variable)");

function isAuthorized(username, token) {
    // check if username + dbSplitKey + token is in users and returns rank and authorized
    // loop in ranks

    user_rank = "NON" // just like capyy on Hypixel
    user_authorized = false

    for (var i = 0; i < ranks.length; i++) {
        // check if ranks[i] + username + dbSplitKey + token is in users
        if (users.includes(ranks[i] + dbSplitKey + username + dbSplitKey + token)) {
            return {
                user_rank: ranks[i],
                user_authorized: true
            }
        }
    }

    return {
        rank: user_rank,
        authorized: user_authorized
    }
}

app.get('/', (req, res) => {
    // return 200
    res.status(200).send(fs.readFileSync('index.html').toString());
});

app.get("/user", (req, res) => {
    var username = req.query.username;
    var token = req.query.token;
    if (isAuthorized(username, token)) {
        res.send("{\"status\":\"success\",\"isAuthorized\":true,\"rank\":\"" + isAuthorized(username, token).user_rank + "\"}");	// return 200
    }
    else {
        res.send("{\"status\":\"fail\",\"isAuthorized\":false,\"rank\":\"NON\"}");	// return 400
    }
});

app.get("/logo_title_technoblade.png", (req, res) => {
    res.send(fs.readFileSync('logo_title_technoblade.png').toString());
});

app.get("/style.css", (req, res) => {
    res.send(fs.readFileSync('style.css').toString());
});


app.get("/shutdown.css", (req, res) => {
    res.send(fs.readFileSync('shutdown.css').toString());
});

app.get("/stats/registeredUsers", (req, res) => {
    res.send(users.length.toString());
});

app.get("/stats/ads", (req, res) => {
    res.send(ads.length.toString());
});

app.get("/stats/develMode", (req, res) => {
    res.send(develMode.toString());
});

app.get("/ad", (req, res) => {
    // check if user is authorized
    var username = req.query.username;
    var token = req.query.token;
    if (isAuthorized(username, token)) {
        // return random ad
        var random_ad = ads[Math.floor(Math.random() * ads.length)];
        res.send(random_ad);
    }
    else {
        res.send("0;/visit OCboy3 on Hypixel Housing");	// return 400
    }
});

// to prevent caching

app.post("/ad", (req, res) => {
    // check if user is authorized
    var username = req.query.username;
    var token = req.query.token;
    if (isAuthorized(username, token)) {
        // return random ad
        var random_ad = ads[Math.floor(Math.random() * ads.length)];
        res.send(random_ad);
    }
    else {
        res.send("0;/visit OCboy3 on Hypxiel Housing");	// return 400
    }
});

// same 4 opencomputers
app.get("/opencomputers", (req, res) => {
    //check if user is authorized
    var username = req.query.username;
    var token = req.query.token;
    if (isAuthorized(username, token)) {
        // return random ad
        var random_ad = opencomputers[Math.floor(Math.random() * opencomputers.length)];
        res.send(random_ad.split(" $$$ ")[0]);
    }
});

app.post("/opencomputers", (req, res) => {
    //check if user is authorized
    var username = req.query.username;
    var token = req.query.token;
    if (isAuthorized(username, token)) {
        // return random ad
        var random_ad = opencomputers[Math.floor(Math.random() * opencomputers.length)];
        res.send(random_ad.split(" $$$ ")[0]);
    }
});

app.get("/OpenAD/_API_Internals/shutdown", (req, res) => {
    //check if user is authorized
    var username = req.query.username;
    var token = req.query.token;
    if (isAuthorized(username, token)) {
        // check if req.query.password = shutdownPassword
        if (req.query.password == shutdownPassword) {
            res.send("Izslēdz OpenAD");
            console.log("[OpenAD] Shutting down..");
            process.exit(0);
        } else {
            res.send("atā");
        }
    } else {
        res.send("atā")
    }
});

app.get("/admin/shutdown", (req, res) => {
    res.send(fs.readFileSync('shutdown.html').toString());
});
