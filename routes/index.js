var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var moment = require('moment');



var Datastore = require('nedb');
var historydb = new Datastore({ filename: 'history.dat', autoload: true });
var playersdb = new Datastore({ filename: 'players.dat', autoload: true });

/* GET home page. */
router.get('/', function(req, res, next) {

  // Find the last coffee buyer.
  historydb.find({}).sort({ when: -1 }).limit(1).exec(function(err,docs) {
    console.log('Hey, found a doc', docs[0], err, docs.length);

    var last = docs[0];

    // Now find who's next up:

    console.log('looking for the player..');

    playersdb.find({name: {$ne:last.who}}).exec(function(err,docs) {
      var next = docs[0];

      console.log('found a player..',next);

      var emailHash = crypto.createHash('md5').update(next.email).digest('hex');
      var gravatar = 'http://www.gravatar.com/avatar/' + emailHash;

      console.log('rendering the view...');

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

  console.log(req.param('turn'));

  // Do some db things...

  var record = {who:req.param('turn'),when:new Date()};
  historydb.insert(record, function (err, newDoc) {   // Callback is optional
    // newDoc is the newly inserted document, including its _id
    // newDoc has no key called notToBeSaved since its value was undefined
    res.redirect('/');
  });


});

module.exports = router;
