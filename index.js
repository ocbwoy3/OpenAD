const app = require('express')();
const PORT = 8080;

var ranks = [
    'User','Operator'
]

var dbSplitKey = '~';

var develMode = true;
var develUser = "OpenAD";
var develToken = "OpenAD"

app.listen(
    PORT,
    () => console.log(`OpenAD API running on https://localhost:${PORT}`)
);

// read database users and ads
const fs = require('fs');
var users = fs.readFileSync('users').toString();
users = users.split('\n');

var ads = fs.readFileSync('ads').toString();
ads = ads.split('\n');



if (develMode) {
    users.push("Operator" + dbSplitKey + develUser + dbSplitKey + develToken);
    console.log("*** WARNING ***")
    console.log(`OpenAD API is running in DEVELOPMENT MODE! If you want to use the API in production, please change develMode to false.`);
    console.log("");
    console.log("Developer account details")
    console.log(`Username: ${develUser}`);
    console.log(`API Token: ${develToken}`);
}

function isAuthorized(username, token) {
    // check if username + dbSplitKey + token is in users and returns rank and authorized
    // loop in ranks

    user_rank = "NON"
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

app.get("/logo_title_technoblade", (req, res) => {
    res.send(fs.readFileSync('logo_title_technoblade.png').toString());
});

app.get("/style.css", (req, res) => {
    res.send(fs.readFileSync('style.css').toString());
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
        res.send("0;Invalid Username and/or token, please try again");	// return 400
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
        res.send("0;Invalid Username and/or token, please try again");	// return 400
    }
});