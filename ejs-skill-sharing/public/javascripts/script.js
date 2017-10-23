/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

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




/***/ })
/******/ ]);