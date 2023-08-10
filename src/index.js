// write your code here
//#Constants
const url = "http://localhost:3000/ramens";

const ramenMenu = document.querySelector("#ramen-menu");
const ramenImage = document.querySelector(".detail-image");
const ramenName = document.querySelector(".name");
const resturantName = document.querySelector(".restaurant");
const newRamenForm = document.querySelector("#new-ramen");
const rating = document.querySelector("#rating-display")
const comment = document.querySelector("#comment-display")
const editRamenForm = document.querySelector("#edit-ramen")

let curRamen = {}

//#Functions
//##Creates new ramens and appends them to page
function createRamen(ramenObj) {
  const image = document.createElement("img");
  const deleteBtn = document.createElement("button")

  image.src = ramenObj.image;
  deleteBtn.textContent = "Delete"
  deleteBtn.style.height = "25px"
  deleteBtn.style.marginRight = "5px"
  deleteBtn.style.marginLeft = "-8px"

  ramenMenu.append(image);
  ramenMenu.append(deleteBtn)

  image.addEventListener("click", (e) => changeDisplay(ramenObj));

  //Deletes ramen 
  deleteBtn.addEventListener("click", (e) => {
    //clears ramen from display-div if it is there on delete is clicked
    if(ramenName.textContent === ramenObj.name){
        ramenImage.src = ""
        ramenName.textContent = ""
        resturantName.textContent = ""
        rating.textContent = ""
        comment.textContent = ""
    }

    //Deletes ramen from data base
    fetch(`${url}/${ramenObj.id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        //pessimistic rendering: removes image and deletebtn from DOM
        image.remove()
        deleteBtn.remove()
    })
    .catch(err => alert("Something went wrong! The ramen was not deleted. Please try again later."))
  })
}

//##Changes the display-div
function changeDisplay(ramenObj){
    ramenImage.src = ramenObj.image;
    ramenName.textContent = ramenObj.name;
    resturantName.textContent = ramenObj.restaurant;
    rating.textContent = ramenObj.rating
    comment.textContent = ramenObj.comment
    curRamen = ramenObj
}

//Initial data fetch GET
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    changeDisplay(data[0])

    data.forEach(ramenObj => createRamen(ramenObj));
  });

//Adds new ramen to nav bar on sumbit
newRamenForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newRamen = {
    name: e.target.name.value,
    restaurant: e.target.restaurant.value,
    image: e.target.image.value,
    rating: e.target.rating.value,
    comment: e.target["new-comment"].value
  }

  //Adds new ramen to data base
  fetch(url, {
    method: "POST",
    headers: {
        "content-type" : "application/json",
        "accept" : "application/json"
    },
    body: JSON.stringify(newRamen)
  })
  .then(res => res.json())
  .then(data => {
    createRamen(data)

    //Clears out form after submit
    e.target.name.value = ""
    e.target.restaurant.value = ""
    e.target.image.value = ""
    e.target.rating.value = ""
    e.target["new-comment"].value = ""

  })
  .catch(err => alert("Your ramen did not save! Please try again later."))

});

//Edits currently displayed ramen on form submit
editRamenForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let ratingValue
    let commentValue

    if(e.target.rating.value === ""){
        ratingValue = rating.textContent
    } else{
        ratingValue = e.target.rating.value
    }

    if(e.target["new-comment"].value === ""){
        commentValue = comment.textContent
    } else{
        commentValue = e.target["new-comment"].value
    }

    //updates ramen in data base
    fetch(`${url}/${curRamen.id}`, {
        method: "PATCH",
        headers: {
            "content-type" : "application/json",
            "accept" : "application/json"
        },
        body: JSON.stringify({rating: ratingValue, comment: commentValue})
    })
    .then(res => res.json())
    .then(data => {
        //updates display-div
        rating.textContent = data.rating
        comment.textContent = data.comment
        //updates curRamen to avoid stale closure
        curRamen.rating = data.rating
        curRamen.comment = data.comment
        //clears out edit form after submit
        e.target.rating.value = ""
        e.target["new-comment"].value = ""
    })
    .catch(err => alert("Something went wrong! The ramen was not updated. Please try again later."))
})