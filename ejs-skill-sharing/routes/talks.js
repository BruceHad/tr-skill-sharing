var express = require('express');
var router = express.Router();
var model = require('../models/model');

/* GET home page. */
router.get('/', function(req, res, next) {
    var date = new Date();
    var data = { title: 'Skill Sharing Talks', lastUpdated: date.toDateString() };
    data.proposals = model.getProposals();
    res.render('index', data);
});

router.get('/add', function(req, res, next) {
    console.log('Display add screen');
    res.render('add', { title: 'Skill Sharing - Add a proposal' });
});

router.post('/add', function(req, res, next) {
    model.addProposal(req.body);
    res.redirect('/');
});

module.exports = router;




