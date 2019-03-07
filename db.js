// 1ST DRAFT DATA MODEL
const mongoose = require('mongoose');
//const URLSlugs = require('mongoose-url-slugs');
const passportLocalMongoose = require('passport-local-mongoose');

// a Game
// * each game has information about the game that was played, including the user
//   that played it, the actual board, the size of the board, the time allowed,
//   the users score, all possible words, words found by the user, incorrect
//   words from the user
const Game = new mongoose.Schema({
  //user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  username: String,
  board: String,
  size: Number,
  time: Number,
  score: Number,
  allWords: [String],
  maxScore: Number,
  wordsFound: [String],
  wrongWords: [String],
  //createdAt: Date,
});

// users
// * site requires authentication...
// * so users have a username and password
// * they also can have 0 or more games 
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  //games:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }]
  games: [Game]
});



//Game.plugin(URLSlugs('username board'));
User.plugin(passportLocalMongoose);
mongoose.model("User", User);
mongoose.model("Game", Game);

let dbconf ="";
// is the environment variable, NODE_ENV, set to PRODUCTION? 
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://'+ (process.env.IP || 'localhost') + '/final';
}

//mongoose.connect('mongodb://' + (process.env.IP || "localhost") + '/final', {useMongoClient:true});
mongoose.connect(dbconf,{useMongoClient:true});