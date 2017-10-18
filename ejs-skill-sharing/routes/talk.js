var express = require('express');
var router = express.Router();
var model = require('../models/model');

/* GET home page. */
router.get('/', function(req, res, next) {
    var date = new Date();
    var data = { title: 'Skill Sharing Talks', lastUpdated: date.toDateString() };
    res.render('index', data);
});

router.delete('/:title', function(req, res, next){
    model.deleteProposal(req.params.title);
    res.send(req.params.title + ' deleted!');
});

module.exports = router;

