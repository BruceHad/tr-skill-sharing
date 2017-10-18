var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    var date = new Date();
    var data = { title: 'Skill Sharing Talks', lastUpdated: date.toDateString() };
    data.proposals = getProposals();
    res.render('index', data);
});

router.get('/add', function(req, res, next) {
    console.log('Display add screen');
    res.render('add', { title: 'Skill Sharing - Add a proposal' });
});

router.post('/add', function(req, res, next) {
    addProposal(req.body);
    res.redirect('/');
});

module.exports = router;

function addProposal(proposal) {
    var proposals = getProposals();
    proposals.push(proposal);
    fs.writeFile('./models/proposals.json', JSON.stringify(proposals), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });
}

function getProposals() {
    var contents = fs.readFileSync('./models/proposals.json', 'utf8');
    try {
        return JSON.parse(contents);
    }
    catch (e) {
        console.log(e);
    }
}
