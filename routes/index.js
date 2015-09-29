var express = require('express');
var router = express.Router();



var Datastore = require('nedb');
var db = new Datastore({ filename: '../datafile2', autoload: true });


/* GET home page. */
router.get('/', function(req, res, next) {


  db.find({}, function (err, docs) {
    if (docs.length == 0) {
      console.log('No existing documents in the database...');
      var coffee = {who:'Si', when:new Date(2015,8,24)};
      db.insert(coffee);
    }

    db.find({}).sort({ when: -1 }).limit(1).exec(function(err,docs) {
      console.log('Hey, found a doc', docs[0], err, docs.length);
      res.render('index',{last: docs[0], title:'Poop'});
    });

  });



});

module.exports = router;
