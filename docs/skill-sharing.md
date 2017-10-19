Skill-sharing Website
=====================

2017-10-03

http://eloquentjavascript.net/21_skillsharing.html

Set up a website for managing meetups. The site allows members to maintain a list of __proposals__ for meetup talks, and for people to comment on each proposal. The one weird bit is that any updates are applied to the page in realtime (no refresh required).

Design
------

* Need to consider 'progressive enhancement'. i.e. Build a core that works and add functionality with JS where possible.

Server:

* Stores a list of talk proposals: Presenter Name, Title, Summary.
* Stores a list of comments associated with talk proposal: author and message.
* Serves HTML, JS and CSS files that implement the client.

Client:

* Allows users to propose new talk.
* Delete talks.
* Comment on existing talks.
* Show a view of current proposed talks and comments.
* Whenever a new talk or comment is submitted, all people who have the page open see the change.

The HTTP interface will communicate with JSON. 

### Routing

The interface is centered around the /talks/ path. (Paths that do not start with talks will serve static files)

GET requests (returns a JSON doc):

* /talk - return all talks
* /talk/name - returns talk with matching name
* /talk/name/comment - returns comment matching talk name.

The json includes a "serverTime" element, like so, which is used by the long polling (see below).

{"serverTime": 1405438911833,
 "talks": [{"title": "Unituning",
            "presenter": "Carlos",
            "summary": "Modifying your cycle for extra style",
            "comment": []}]}

PUT requests (sends a JSON doc):

* /talk/name - creates talk with matching name
* /talk/name/comment - creates comment matching talk name.

DELETE requests:

* /talk/name - deletes talk with matching name
* /talk/name/comment - deletes comment matching talk name.

Names should all be URI encoded to help deal with spaces: encodeURIComponent("How to Idle")

### Long Polling

We could use [_web sockets_](https://en.wikipedia.org/wiki/WebSocket) to maintain a connection between client and server, but the tutorial uses a simple method known as [_long polling_](https://en.wikipedia.org/wiki/Push_technology#Long_polling).

Long Polling continuously/repeatedly asks the server for new info using regular HTTP requests. To prevent connections from timing out, long polling usually set a maximum time for each request, after which the server will respond with nothing and the client will start a new request.

A server using long polling can quickly have thousands of waiting requests (TCP connection) open. Node has been designed to be a good fit for such systems.

To support long polling, GET requests can also include a parameter called "changesSince". e.g.:

    /talks?changesSince=1405438911833
    
These return only the changes since that time. When there are no such changes, the response is delayed until something happens or until it times out (90 seconds).