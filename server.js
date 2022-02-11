const express=require('express');
const mysql=require('mysql');
const bodyParser=require('body-parser');
const passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
const ejs=require('ejs');

const app=express();
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
var customerId=1;
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mpjain9687",
  database: "inamart"
});
var loginTable=mysql.createConnection({
  host:"localhost",
  user: "root",
  password: "mpjain9687",
  database: "inamart"
})
var listOfShops;
con.connect(function(err) {
  if (err) throw err;
  con.query("SELECT * FROM listOfShop", function (err, result, fields) {
    if (err) throw err;
    listOfShops=result;
  });
});
app.set('view engine', 'ejs');
app.get('/home', function(req,res){
  var list=[1,2,3,4,5]
    res.render('home', {list:listOfShops});
});
app.get('/register', function(req,res){

  res.render('register');
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post('/register', function(req,res){
    var values=[[customerId,req.body.fname,req.body.lname,req.body.emailId,req.body.pswd]];
    loginTable.query("INSERT INTO loginTable (customerId,fname,lname,emailId,pswd) VALUES ?",[values], function (err, result) {
      if (err) throw err;
      else
      {
        console.log("record inserted");
        customerId+=1;
        res.render('success');}
    });
});
passport.use(new LocalStrategy(
  function(username, password, done) {
    loginTable.query("SELECT emailId, pswd FROM loginTable where emailId=? AND pswd=?", [username, password], function(err, result){
      if (err) { return done(err); }
      if (result.length==0) { return done(null, false); }
      return done(null, result);
    });
  }
));
app.get('/login', function(req,res){
  res.render('login');
});
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});
app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    session: false
  })
);


app.listen(8080);
