var express = require('express');
var handlebars = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');


//var app
var app = express();
var db;

//taken from mongo example
app.use(bodyParser.urlencoded({extended: true}));


//handlebars
app.engine('handlebars', handlebars({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



//connect to database
MongoClient.connect('mongodb://naztyBoi:testing123@ds131139.mlab.com:31139/dudes', function(err, database){
  if (err) return console.log(err);

  db = database;
  app.listen(process.env.PORT || 3000);
});


//homepage
app.get('/', function(req, res) {
  db.collection("songs").find({}).toArray(function(err, results){
    res.render('home', {songs: results});
  });
});


//add song to list
app.get('/add', function(req, res) {
  res.render('add_song');
});



app.post('/add', function(req, res) {
  var song = {
    title: req.body.title.trim(),
    artist: req.body.artist.trim(),
    submitter: req.body.submitter.trim(),
  };
  
  if (song.title != '' && song.artist != '') {
    db.collection('songs').insert(song, function(err, result){
      res.redirect('/');
    });
  } else {
    res.render('add_song', {message: 'Please enter a title and a artist', song: req.body});
  }
});


//delete song
app.get('/songs/:title/delete', function(req, res) {
  db.collection("songs").remove({title: req.params.title}, function(err, result) {
    res.redirect('/');
  });
});


//edit song
//no real purpose but it can be done
app.post('/songs/:title', function(req, res) {
  db.collection("songs").updateOne({title: req.params.title}, {$set: {artist: req.body.artist, submitter: req.body.submitter}}, function(err, result) {
    res.redirect('/');
  }); 
});

app.get('/songs/:title/edit', function(req, res) {
  db.collection("songs").findOne({title: req.params.title}, function(err, result) {
    if (err) console.log(err);
    res.render('edit_song', {song: result});
  });
});