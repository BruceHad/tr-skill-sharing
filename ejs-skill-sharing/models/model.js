var fs = require('fs');
var shortId = require('shortid');

var getSlug = function(title) {
    let id = shortId.generate();
    return id + title.replace(/\W+/g, '-').toLowerCase();
};

var getProposal = function(slug, proposals){
    var proposal = null;
    for (var i = 0; i < proposals.length; i++) {
        var p = proposals[i];
        if (p.slug === slug) {
            proposal = p;
            break;
        }
    }
    return proposal;
}

module.exports.deleteProposal = function(slug) {
    var deleted = false;
    var proposals = module.exports.getProposals();
    for (var i = 0; i < proposals.length; i++) {
        var p = proposals[i];
        if (p.slug === slug) {
            proposals.splice(i, 1);
            deleted = true;
            break;
        }
    }
    if (deleted) {
        fs.writeFile('./models/proposals.json', JSON.stringify(proposals), 'utf8', function(err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
        });
    }
    console.log("Deleted: ", deleted);
    return deleted;
};

module.exports.getProposals = function(changedSince) {
    var json = fs.readFileSync('./models/proposals.json', 'utf8');
    var proposals;
    try {
        proposals = JSON.parse(json);
    }
    catch (e) {
        console.log('error reading document');
    }
    if(changedSince > 0) {
        proposals = proposals.filter(function(elem){
            return elem.changed > changedSince;
        });
    }
    return proposals;
};

module.exports.getComments = function(slug, changedSince){
    var proposals = fs.readFileSync('./models/proposals.json', 'utf8');
    try {
        proposals = JSON.parse(proposals);
    }
    catch (e) {
        console.log('error reading document');
    }
   
    var proposal = getProposal(slug, proposals);
    if("comments" in proposal){
        var  newComments = [];
        for(var i in proposal.comments){
            var c = proposal.comments[i];
            if(c.changed > changedSince) newComments.push(c);
        }
        return newComments;
    }
};

module.exports.getSingleProposal = function(slug) {
    var proposals = fs.readFileSync('./models/proposals.json', 'utf8');
    try {
        proposals = JSON.parse(proposals);
    }
    catch (e) {
        console.log('error reading document');
    }
    var proposal = getProposal(slug, proposals);
    if(proposal) return proposal;
    else return { "title": "Not Found", "summary": "Proposal not found." };
};

module.exports.addProposal = function(proposal) {
    var proposals = module.exports.getProposals();
    proposal.slug = getSlug(proposal.title);
    proposal.changed = Date.now();
    proposals.push(proposal);

    fs.writeFile('./models/proposals.json', JSON.stringify(proposals), 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });

};

module.exports.addComment = function(comment) {
    var proposals = module.exports.getProposals();
    var slug = comment.slug;
    var added = false;
    for (var i = 0; i < proposals.length; i++) {
        var p = proposals[i];
        if (p.slug === slug) {
            if(typeof p.comments === 'undefined') p.comments = [];
            p.comments.push({"name": comment['comment-name'], "comment": comment['new-comment'], "changed": Date.now()});
            added=true;
            break;
        }
    }
    
    fs.writeFile('./models/proposals.json', JSON.stringify(proposals), 'utf8', function(err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
    });
    
    return added;
};
