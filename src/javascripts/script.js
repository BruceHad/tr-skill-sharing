/* Index: Delete Proposals */
const delButtons = document.querySelectorAll('.delete-proposal');
if (delButtons != null) {
    for (var i = 0; i < delButtons.length; i++) {
        delButtons[i].addEventListener('click', function(event) {
            event.preventDefault();
            let slug = event.target.dataset.slug;
            let req = new XMLHttpRequest();
            req.open('DELETE', 'talks/' + slug, false);
            req.send(null);
            let response = JSON.parse(req.responseText);
            if (response.deleted) delNode(`proposal-${slug}`);

        });
    }
}

function delNode(id) {
    let node = document.getElementById(id);
    node.parentNode.removeChild(node);
}

/* Index: Long Polling */
function request(options, callback) {
    var req = new XMLHttpRequest();
    req.open(options.method || "GET", options.pathname, true);
    req.addEventListener("load", function() {
        if (req.status < 400)
            callback(null, req.responseText);
        else
            callback(new Error("Request failed: " + req.statusText));
    });
    req.addEventListener("error", function() {
        callback(new Error("Network error"));
    });
    req.send(options.body || null);
}

let lastServerTime = Date.now();

function requestTalks() {
    request({ pathname: "talks/json/" + lastServerTime }, function(error, response) {
        if (error) {
            console.error(error);
        }
        else {
            response = JSON.parse(response);
            if (response.changes.length > 0) {
                lastServerTime = response.serverTime;
                displayNewProposal(response.changes);
            }


            window.setTimeout(function() {
                requestTalks();
            }, 10000);
        }
    });
}

function requestComments() {
    console.log(window.location.pathname + "comments/" + lastServerTime);
    request({ pathname: window.location.pathname + "comments/" + lastServerTime }, function(error, response) {
        if (error) {
            console.error(error);
        }
        else {
            response = JSON.parse(response);
            if (response.changes.length > 0) {
                lastServerTime = response.serverTime;
                displayNewComments(response.changes);
            }
            window.setTimeout(function() {
                requestComments();
            }, 10000);
        }
    });
}

function displayNewProposal(changes) {
    console.log(`Display ${changes.length} new proposals.`);
    for (var i = 0; i < changes.length; i++) {
        let html = getProposalHtml(changes[i]);
        proposalsContainer.innerHTML += html;
    }
}

function getProposalHtml(proposal) {
    return `<div class="panel panel-info" id="proposal-${proposal.slug}">
                    <div class="panel-heading">
                        <h3 class="panel-title">${proposal.title} <small><a href="talk/${proposal.slug}">link</a></small></h3>
                    </div>
                    <div class="panel-body">
                        ${proposal.summary}
                    </div>
                    <div class="panel-footer">
                        <a class="btn btn-default" href="#" role="button">Edit</a>
                        <a class="btn btn-default comment-proposal" href="talk/${proposal.slug}/#comment" role="button">Comment</a>
                        <a class="btn btn-default delete-proposal" href="talk/${proposal.slug}/delete" role="button" data-slug="${proposal.slug}">Delete</a>
                    </div>
                </div>`;
}


function displayNewComments(comments) {
    console.log(`Display ${comments.length} new comment.`);
    let commentContainer = singleProposalContainer.querySelector('#comments-container');
    for (var i = 0; i < comments.length; i++) {
        let html = getCommentHtml(comments[i]);
        commentContainer.innerHTML += html;
    }
}

function getCommentHtml(comment) {
    return `<div class="row new">
                <div class="col col-sm-2">
                    <p>${comment.name}</p>
                </div>
                <div class="col col-sm-10">
                    <div>${comment.comment}</div>
                </div>
            </div>`;
}


const proposalsContainer = document.querySelector('#proposals');
if (proposalsContainer != null) {
    requestTalks();
}

const singleProposalContainer = document.querySelector('#single-proposal');
if (singleProposalContainer != null) {
    requestComments();
}
