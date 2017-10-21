var fs = require('fs');
var shortId = require('shortid');

var getSlug = function(title) {
    let id = shortId.generate();
    return id + title.replace(/\W+/g, '-').toLowerCase();
};

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

module.exports.getProposals = function() {
    var proposals = fs.readFileSync('./models/proposals.json', 'utf8');
    try {
        return JSON.parse(proposals);
    }
    catch (e) {
        console.log('error reading document');
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
    for (var i = 0; i < proposals.length; i++) {
        var p = proposals[i];
        if (p.slug === slug) {
            return p;
        }
    }
    return { "title": "Not Found", "summary": "Proposal not found." };
};

module.exports.addProposal = function(proposal) {
    var proposals = module.exports.getProposals();
    proposal.slug = getSlug(proposal.title);
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
    console.log(comment);
    var slug = comment.slug;
    var added = false;
    for (var i = 0; i < proposals.length; i++) {
        var p = proposals[i];
        console.log(p.slug,slug);
        if (p.slug === slug) {
            if(typeof p.comments === 'undefined') p.comments = [];
            p.comments.push({"name": comment['comment-name'], "comment": comment['new-comment']});
            console.log(p.comment);
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
