var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var moment = require('moment');
var Datastore = require('nedb');


// Set up the database.
var db ={};
db.players = new Datastore({ filename: 'players.dat', autoload: true });
db.history = new Datastore({ filename: 'history.dat', autoload: true });


// Check for some users...
db.players.find({}).exec(function(err,docs) {
  if (!docs.length) {
    console.log('No players, time to init the database');
    db.players.insert({name:'Si', email:'simon.phillipson@gmail.com'});
    db.players.insert({name:'Matt', email:'roberts.mattroberts@gmail.com'});
    db.history.insert({who:'Si',when: new Date()});
  } else {
    console.log('Players found');
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {

  // Find the last coffee buyer.
  db.history.find({}).sort({ when: -1 }).limit(1).exec(function(err,docs) {

    var last = docs[0];

    db.players.find({name: {$ne:last.who}}).exec(function(err,docs) {
      var next = docs[0];

      console.log('found a player..',next);

      var emailHash = crypto.createHash('md5').update(next.email).digest('hex');
      var gravatar = 'http://www.gravatar.com/avatar/' + emailHash;

      res.render('index',
        {
          last: last,
          last_date: moment(last.when).fromNow(),
          next: next, 
          title:'Coffee',
          gravatar:gravatar
        });
    });
  });
});


router.post('/', function(req,res, next) {

  var record = {who:req.param('turn'),when:new Date()};
  db.history.insert(record, function (err, newDoc) {   // Callback is optional
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined
    res.redirect('/');
  });


});

module.exports = router;
