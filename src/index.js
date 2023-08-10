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

  //Deletes ramen from the page
  deleteBtn.addEventListener("click", (e) => {
    if(ramenName.textContent === ramenObj.name){
        ramenImage.src = ""
        ramenName.textContent = ""
        resturantName.textContent = ""
        rating.textContent = ""
        comment.textContent = ""
    }

    fetch(`${url}/${ramenObj.id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        image.remove()
        deleteBtn.remove()
    })
    .catch(err => alert("Something went wrong! The ramen wasnot deleted. Please try again later."))
  })
}

//##Changes the display-div
function changeDisplay(ramenObj){
    ramenImage.src = ramenObj.image;
    ramenName.textContent = ramenObj.name;
    resturantName.textContent = ramenObj.restaurant;
    rating.textContent = ramenObj.rating
    comment.textContent = ramenObj.comment
}

//# Initial data fetch GET
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

  fetch(url, {
    method: "POST",
    headers: {
        "content-type" : "application/json",
        "accept" : "application/json"
    },
    body: JSON.stringify(newRamen)
  })
  .then(res => res.json())
  .then(data => createRamen(data))
  .catch(err => alert("Your ramen did not save! Please try again later."))

});

//Edits currently displayed ramen on form submit
editRamenForm.addEventListener("submit", (e) => {
    e.preventDefault()
    
    rating.textContent = e.target.rating.value
    comment.textContent = e.target["new-comment"].value
})