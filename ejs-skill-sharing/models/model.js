var fs = require('fs');

module.exports.deleteProposal = function(title){
    var proposals = module.exports.getProposals();
    for (var i=0; i < proposals.length; i++){
        var p = proposals[i];
        if(encodeURIComponent(p.title) === title ){
            proposals.splice(i, 1);
            break;
        }
    }
    fs.writeFile('./models/proposals.json', JSON.stringify(proposals), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });
};

module.exports.getProposals = function() {
    var contents = fs.readFileSync('./models/proposals.json', 'utf8');
    try {
        return JSON.parse(contents);
    }
    catch (e) {
        console.log('error reading document');
    }
};

module.exports.addProposal = function(proposal) {
    var proposals = module.exports.getProposals();
    proposals.push(proposal);
    fs.writeFile('./models/proposals.json', JSON.stringify(proposals), 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });
};