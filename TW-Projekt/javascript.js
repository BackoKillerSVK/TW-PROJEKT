window.myHistory = [];

//Ukladanie záznamov do historie 
var storedNames = JSON.parse(localStorage.getItem("searchHistory"));
if (storedNames !== null) {
    window.myHistory = storedNames.reverse();

    //Vypisovanie uložených premenných
    for (var i = 0; i < storedNames.length; i++) {
        document.querySelector("#results").innerHTML += `<h2 onClick="add('${storedNames[i]}')">${storedNames[i]}</h2>`
    }

}

function add(item) {
    document.getElementById('search-input').value = item;
}

const SearchButtonClick = document.getElementById('SearchButton');
const JedloList = document.getElementById('jedlo');
const JedloDetaily = document.querySelector('.meal-details-content');
const ReceptClose = document.getElementById('recipe-close-btn');

// eventy 
SearchButtonClick .addEventListener('click', getMealList);
JedloList.addEventListener('click', getMealRecipe);
ReceptClose.addEventListener('click', () => {
JedloDetaily.parentElement.classList.remove('showRecipe');
});



const elem = document.getElementById('search-input');

   elem.addEventListener("click", () => {
    document.querySelector("#results").style.display = "block";

    if (window.myHistory.length === 0){
        document.querySelector("#results").innerHTML = "História vyhľadávania je prázdna";
    }

   });
   
function getMealList() {

    // SKRYTIE POSLEDNÝCH HLADANÍ
    document.querySelector("#results").style.display = "none";
    let searchInputTxt = document.getElementById('search-input').value.trim();

    // 1 ---------------- ULOŽENIE DO LOCAL STORAGE
    window.myHistory.push(searchInputTxt);
    localStorage.setItem("searchHistory", JSON.stringify(window.myHistory));

    //2 ------------------ Načita uložene vysledky z historie a zapíše ich do results
    document.querySelector("#results").innerHTML = "NAPOSLEDY VYHLADÁVANE SUROVINY";
    var storedNames = JSON.parse(localStorage.getItem("searchHistory"));
    if (storedNames !== null) {
        window.myHistory = storedNames.reverse();

        for (var i = 0; i < storedNames.length; i++) {
            document.querySelector("#results").innerHTML += `<h2 onClick="add('${storedNames[i]}')">${storedNames[i]}</h2>`
        }
    }



    // APP JS

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputTxt}`)
        .then(response => response.json())
        .then(data => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `
                    <div class = "karta-jedla" data-id = "${meal.idMeal}">
                        <div class = "jedlo-obrazok">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "jedlo-nazov">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recept-button">Otvoriť recept</a>
                        </div>
                    </div>
                `;
                });
                JedloList.classList.remove('Nenajdene');
            } else {
                html = "Prepáčte, nenašli sme žiadne jedlo :( ";
                JedloList.classList.add('Nenajdene');
            }

            JedloList.innerHTML = html;
        });
}


function getMealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recept-button')) {
        let mealItem = e.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(response => response.json())
            .then(data => mealRecipeModal(data.meals));
    }
}

function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let html = `
        <h2 class = "recipe-title">${meal.strMeal}</h2>
        <p class = "recipe-category">${meal.strCategory}</p>
        <div class = "recipe-instruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class = "recipe-meal-img">
            <img src = "${meal.strMealThumb}" alt = "">
        </div>
        <div class = "recipe-link">
            <a href = "${meal.strYoutube}" target = "_blank">Pozrieť video</a>
        </div>
    `;
    JedloDetaily.innerHTML = html;
    JedloDetaily.parentElement.classList.add('showRecipe');
}