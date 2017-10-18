
/* Delete Proposals */
const delButtons = document.querySelectorAll('.delete-proposal');
for(var i=0; i<delButtons.length; i++){
    delButtons[i].addEventListener("mousedown", function(event) {
        let title = encodeURIComponent(event.target.dataset.title);
        console.log(title);
        let req = new XMLHttpRequest();
        req.open('DELETE', 'talk/'+title, false);
        req.send(null);
        console.log(req.responseText);
    });
}

