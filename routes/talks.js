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

router.get('/json/:changedSince', function(req, res, next) {
    var changes = model.getProposals(req.params.changedSince);
    var json = {
        "serverTime": Date.now(),
        "changes": changes
    };
    res.send(json);
});

/* Single page view of proposal */
router.get('/talk/:title', function(req, res, next) {
    var date = new Date();
    var data = { title: 'Skill Sharing Talks', lastUpdated: date.toDateString() };
    data.proposal = model.getSingleProposal(req.params.title);
    res.render('single', data);
});

router.get('/talk/:slug/comments/:changedSince', function(req, res, next) {
    var comments = model.getComments(req.params.slug, req.params.changedSince);
    // console.log(req.params);
    var json = {
        "serverTime": Date.now(),
        "changes": comments
    };
    res.send(json);
});

/* Add page adds a new proposal. */
router.get('/add', function(req, res, next) {
    res.render('add', { title: 'Skill Sharing Talks' });
});

/* POST */
router.post('/add', function(req, res, next) {
    model.addProposal(req.body);
    res.redirect('/');

});

router.post('/talk/:title', function(req, res, next) {
    var result = model.addComment(req.body);
    res.redirect('back');
});


/* DELETE */
router.get('/talk/:slug/delete', function(req, res, next) {
    console.log(req.params.slug);
    var deleted = model.deleteProposal(req.params.slug);
    if (deleted) {
        res.redirect('/');
    }
    else {
        res.render('error', { "message": req.params.title + ' NOT deleted' });
    }
});

router.delete('/:slug', function(req, res, next) {
    var deleted = model.deleteProposal(req.params.slug);
    var message = req.params.slug + ' NOT deleted';
    if (deleted) {
        message = req.params.slug + ' deleted';
        res.send(JSON.stringify({ "deleted": deleted, "message": message }));
    }
    else {
        res.render('error', { "message": req.params.title + ' NOT deleted' });
    }
});

module.exports = router;
