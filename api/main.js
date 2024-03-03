const postsLists = document.querySelector(".post-lists");
const addPost = document.querySelector(".add-post-form");
const titleValue = document.getElementById("title-value");
const bodyValue = document.getElementById("body-value");
let output = "";
const btnSubmit = document.querySelector('.btn-primary')
const url = "http://localhost:3000/posts";

// Function to render a single post
const renderPost = (post) => {
  output += `
    <div class="col-md-6">
        <div class="card mt-5 bg-light ps-5">
            <div class="card-body" data-id="${post.id}">
                <h3 class="card-title">${post.title}</h3>
                <p class="card-text">${post.body}</p>
                <p class="card-text text-muted">Date: ${new Date()}</p>
                <button class="btn btn-success px-3 py-2" id="edit-post"><i class="fa fa-edit" aria-hidden="true"></i></button>
                <button class="btn btn-danger px-3 py-2" id="delete-post"><i class="fa fa-remove" aria-hidden="true"></i></button>


            </div>
            
        </div>
        </div>
        `;
};

// Fetch data from JSON Server API

fetch(url)
  .then((response) => response.json())
  .then((posts) => {
    posts.forEach((post) => {
      renderPost(post); // Render each post
    });
    postsLists.innerHTML = output; // Set the HTML content of the postsLists element after rendering all posts
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });


// POST DATA on server 
addPost.addEventListener("submit", (e) => {
  e.preventDefault();

  fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      title: titleValue.value,
      body: bodyValue.value,
    }),
  })
  .then(res => res.json())
  .then(post =>{
    const dataArr = [];
    dataArr.push(post);
    renderPost(dataArr)})
});

// Delete Data from API

postsLists.addEventListener('click', (e)=>{
    e.preventDefault();
    let delButtonIsPressed = e.target.id == 'delete-post';
    let editButtonIsPressed = e.target.id == 'edit-post';
    let id = e.target.parentElement.dataset.id;
    // console.log(delButtonParent)
    // Delete Post

    if(delButtonIsPressed){
        fetch(`${url}/${id}`,{
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(() => location.reload())
    }


    // Edit Post 

    if(editButtonIsPressed){
        const parent = e.target.parentElement;
        let titleContent = parent.querySelector(".card-title").textContent;
        let bodyContent = parent.querySelector(".card-text").textContent;

        titleValue.value = titleContent;
        bodyValue.value = bodyContent;
    }

    // Update the Existing Post 
    // Method patch 

    btnSubmit.addEventListener("click", (e)=>{
        e.preventDefault();
        fetch(`${url}/${id}`,
        {
            method : 'PATCH',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                title : titleValue.value,
                body : bodyValue.value,
            })
        }
        )
        .then(res => res.json())
        .then(() => location.reload())
    })
})