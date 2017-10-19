var express = require('express');
var router = express.Router();
var model = require('../models/model');

/* GET */

/* Home page lists all talks */
router.get('/', function(req, res, next) {
    var date = new Date();
    var data = { title: 'Skill Sharing Talks', lastUpdated: date.toDateString() };
    data.proposals = model.getProposals();
    res.render('index', data);
});

/* Single page view of proposal */
router.get('/talk/:title', function(req, res, next){
    var date = new Date();
    var data = { title: 'Skill Sharing Talks', lastUpdated: date.toDateString() };
    data.proposal = model.getSingleProposal(req.params.title);
    res.render('single', data);
});

/* Add page adds a new proposal. */
router.get('/add', function(req, res, next) {
    res.render('add', { title: 'Skill Sharing - Add a proposal' });
});

/* POST */

router.post('/add', function(req, res, next) {
    model.addProposal(req.body);
    res.redirect('/');
});


/* DELETE */
router.delete('/:slug', function(req, res, next){
    console.log(req.params.slug);
    var deleted = model.deleteProposal(req.params.slug);
    var message = req.params.title + ' NOT deleted';
    if(deleted) message = req.params.title + ' deleted';
    res.send(JSON.stringify({"deleted": deleted, "message": message}));
});

module.exports = router;




