var express = require('express');
var router = express.Router();
var Votes = require('../utils/db/modules/votes');

router.get('/find', function (req, res, next) {
  if (req.query.owner) {
    Votes.findByOwner(req.query.owner).then((vote) => {
      res.send(vote);
    });
  } else {
    Votes.findAll().then((votes) => {
      res.send(votes);
    });
  }

});

router.route('/vote').post(function (req, res, next) {
  Votes.findByOwner(req.body.owner).then(vote => {
    if (!vote) {
      const vote = new Votes(req.body);
      vote.save((err, vote) => {
        if (err) return err;
        res.send(vote);
      });
    } else {
      res.send('');
    }

  });

});


module.exports = router;
