import axios from "axios";

const catPhotosInput = document.getElementById("catPhotosInput");
const catFactsInput = document.getElementById("catFactsInput");
const factBtn = document.getElementById("factSubmitBtn");
const photoBtn = document.getElementById("photoSubmitBtn");
const resultsContainer = document.querySelector(".photo-facts-container");
const loadingSpinner = document.querySelector(".spinner");

const factsApiLink = "https://meowfacts.herokuapp.com/?count=";
const photosApiLink = "https://api.thecatapi.com/v1/images/search?limit=";

const getFacts = async (factsCount) => {
  const results = await axios.get(`${factsApiLink}${factsCount}`);
  return results.data;
};

const getCatPhotos = async (photosCount) => {
  const results = await axios.get(`${photosApiLink}${photosCount}`);
  return results.data;
};

const verifyUserInput = (userInput, maxValue) => {
  let cleanInput = parseInt(userInput.trim());
  return cleanInput > maxValue ? maxValue : cleanInput;
};

const addLoadingState = (loadingStateCode) => {
  if (loadingStateCode === 1) {
    resultsContainer.classList.add("none");
    loadingSpinner.classList.remove("none");
    loadingSpinner.style.minHeight = "8rem";
  } else {
    loadingSpinner.classList.add("none");
    resultsContainer.classList.remove("none");
  }
};

function getRequest(btnClicked, userInput, APICall) {
  btnClicked.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      addLoadingState(1);
      let cleanInput = verifyUserInput(userInput.value, 50) || 1;
      const data = await APICall(cleanInput);
      let listHTML = `<ol class="result-items cat-image-holder">`;

      if (btnClicked === factBtn) {
        addLoadingState(0);
        data.data.forEach((fact) => {
          listHTML += `<li class="item">${fact}</li>`;
        });
        listHTML += `</ol>`;
        resultsContainer.innerHTML = listHTML;
      } else if (btnClicked === photoBtn) {
        addLoadingState(0);
        data.forEach((image) => {
          listHTML += `<img src="${image.url}" alt="image"  class="cat-image"/>`;
        });
        listHTML += `</ol>`;
        resultsContainer.innerHTML = listHTML;
      }
    } catch (e) {
      console.log(e);
      addLoadingState(0);
      resultsContainer.innerHTML = `<p class='error'>Error: Something went Wrong. Please try again Later!! :(</p>`;
    }
  });
}
getRequest(factBtn, catFactsInput, getFacts);
getRequest(photoBtn, catPhotosInput, getCatPhotos);
