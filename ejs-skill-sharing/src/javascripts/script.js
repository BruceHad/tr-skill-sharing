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
            console.log(response);
            if(response.deleted){
                let node = document.getElementById(slug);
                node.parentNode.removeChild(node);
            }
            
        });
    }
}

/* Add: Create Slug from Title */
// const addForm = document.querySelector('#add-form');
// if (addForm != null) {
//     const title = addForm.querySelector('#title');
//     const slug = addForm.querySelector('#slug');
//     title.addEventListener('input', function(event) {
//         console.log(event.target.value);
//         slug.value = event.target.value.replace(/\W+/g, '-').toLowerCase();
//     });
// }
