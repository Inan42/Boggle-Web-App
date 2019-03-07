const HOST = 8080;


const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

require('./db.js');
require('./auth.js');

// passport
const passport = require('passport');



// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});

//mongoose 
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const User = mongoose.model('User');
const Game = mongoose.model('Game');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home',{});
});

app.get("/register", (req, res) => {
  res.render("register",{});
});

//authentication code and handling for login and registration based on slides 
//https://foureyes.github.io/csci-ua.0480-fall2017-007/slides/16/auth.html#/48
//and and possport tutorial https://scotch.io/tutorials/easy-node-authentication-setup-and-local
app.post('/register', function(req, res) {
  User.register(new User({username:req.body.username}), 
    req.body.password, function(err){
    if (err) {
      res.render('register',{message:'Your registration information is not valid'});
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, function() {
        res.redirect('/');
      });
    }
  });   
});

app.post('/', function(req,res,next) {
  passport.authenticate('local', function(err,user) {
    if(user) {
      req.logIn(user, function(err) {
        res.redirect('/');
        if (err){
          res.render('home', {message: 'Error logging in'});
        }
      });
    } else {
      res.render('home', {message:'Your login or password is incorrect. If you don\'t have an account, create one by clicking register above.'});
    }
  })(req, res, next);
});


app.get("/play", (req,res) =>{
  res.render("play", {});
});

/*
app.get("/play/board", (req,res) =>{
  //console.log(req.query);
  if (!req.query.size || !req.query.time){
    res.render("play",{error:"Must pick both board size and time"});
  }
  else{
    //console.log("test");
    const g = new Game({
      size: req.query.size,
      time: req.query.time,
    });
    //console.log(g);
    g.save( err => {
       if (err){
           console.log(err);
       }
       else{
           res.redirect("/");
       }
    });
  }
});*/

app.get("/scores", (req, res) =>{
  const size = Number(req.query.size);
  const time = Number(req.query.time);
  console.log(size);
  User.find({}, (err,data) => {
    if (err){
        console.log(err);
        res.redirect("/");
    }
    else{
      const users = data;
      if (size){
        users.forEach(user => {
          console.log(user.games);
          user.games = (user.games).filter(game => game.size === size && game.time === time);  
          console.log(user.games);
        });
      }
      //console.log(data);
      res.render("scores",{users:users});
    }
  });
  /*
  const size = req.query.size;
  let searchObj = {};
  if (size){
      searchObj = {size:size};
  }
  Game.find(searchObj, (err,data) => {
    if (err){
        console.log(err);
        res.redirect("/");
    }
    else{
        const gameList = data;
        res.render("scores",{ gameList:gameList});
    }
  });*/
});

app.get("/myscores", (req,res) => {
  //console.log(req);
  let userObj = {};
  if (req.user){
    userObj = {username: req.user.username};
  }
  User.find(userObj, (err,data) => {
    if (err){
        console.log(err);
        res.redirect("/");
    }
    else{
      const user = data;
      console.log(data);
      res.render("myscores",{users:user});
    }
  });
});

app.post("/scores/add", (req,res) => {
  console.log(req.body);
  
  //if (body.save === 'yes'){
  const g = new Game({
      username: req.user.username,
      size: req.body.size,
      time: req.body.time,
      score: req.body.score,
  });
  User.findOneAndUpdate({username:req.user.username}, {$push: {games:g}}, (err) =>{
       if (err){
           console.log(err);
           res.redirect('/');
       }
       else{
           res.redirect("/scores");
       }
  });
    
});

app.post("/myscores/del", (req,res) => {
  let gameToDel = [];
  if (!Array.isArray(req.body.delete)){
      gameToDel.push(req.body.delete);
  }
  else{
      gameToDel = req.body.delete;
  }
  User.findOneAndUpdate({username:req.user.username},{$pull: {games: {_id: {$in:gameToDel}}}}, (err) =>{
    if (err){
      console.log(err);
      res.redirect("/");
    }
    else{
       res.redirect("/myscores");
    }
  });
});
    
      



app.listen(process.env.PORT || HOST);