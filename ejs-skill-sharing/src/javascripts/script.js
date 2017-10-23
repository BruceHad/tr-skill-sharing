/* Index: Delete Proposals */
const delButtons = document.querySelectorAll('.delete-proposal');
if (delButtons != null) {
    for (var i = 0; i < delButtons.length; i++) {
        delButtons[i].addEventListener('click', function(event) {
            event.preventDefault();
            let slug = encodeURIComponent(event.target.dataset.slug);
            let req = new XMLHttpRequest();
            req.open('DELETE', 'talks/' + slug, false);
            req.send(null);
            let response = JSON.parse(req.responseText);
            if (response.deleted) {
                let node = document.getElementById(slug);
                node.parentNode.removeChild(node);
            }

        });
    }
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

function displayNewProposal(changes) {
    console.log(`Display ${changes.length} new proposals.`);
    for (var i = 0; i < changes.length; i++) {
        let html = getProposalHtml(changes[i]);
        proposalsContainer.innerHTML += html;
    }
}

function getProposalHtml(proposal) {
    return `<div class="panel panel-info new" id="proposal-${proposal.slug}">
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

const proposalsContainer = document.querySelector('#proposals');
if (proposalsContainer != null) {
    requestTalks();
}


