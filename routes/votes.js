var express = require('express');
var router = express.Router();
var Countries = require('../utils/db/modules/countries');
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

router.get('/top', function (req, res, next) {
  Countries.findAll().then(countries => {
    countries.sort((a, b) => {
      return b.votes - a.votes;
    });

    countries = countries.slice(0, 8);
    Votes.findAll().then(votes => {
      res.send({
        countries: countries,
        voteCount: votes.length
      });
    })
  });

});

router.route('/vote').post(function (req, res, next) {
  Votes.findByOwner(req.body.owner).then(vote => {
    if (!vote) {
      const vote = new Votes(req.body);
      Countries.findAll().then(countries => {
        countries.forEach(country => {
          for (const item in req.body.vote) {
            if (req.body.vote[item]) {
              if (req.body.vote[item].split(',').indexOf(country._id.toString()) !== -1) {
                country.votes = country.votes + 1;
                country.save();
              }
            }
          }
        })
      });
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
