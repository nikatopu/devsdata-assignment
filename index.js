// ----------- Toggle the navbar dropdown ----------- //
const dropdownButton = document.getElementById("dropdown-button");
const dropdownItems = document.getElementById("header-dropdown-items");
dropdownButton.addEventListener('click', () => {
    dropdownItems.classList.toggle('closed');
    dropdownButton.classList.toggle('toggled');
})

// ----------- Getting the API data ----------- //
const defaultAPILink = "https://swapi.dev/api/people/";

async function updateCharactersByLink(link=defaultAPILink) {
    const characterList = document.getElementById('character-list');

    // Fetch the API data
    const result = await fetch(link);
    const data = await result.json();
    
    // Empty the character list
    characterList.innerHTML = "";

    // For each resulted character, create a new div and append it
    data.results.forEach(element => {
        // Create the character div
        var character = document.createElement('div');
        character.className = 'character';

        // Create h1 for the character and append it
        var characterName = document.createElement('h1');
        characterName.innerHTML = element.name;
        character.append(characterName);

        // Append the entire character div to the character list
        characterList.append(character);
    });

    // Create a corresponding pagination for the current page
    const currentPage = data.previous === null ? 1 : parseInt(data.previous.split("=")[1]) + 1;
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = "";

    // Add the previous button
    var previousPage = document.createElement('div');

    previousPage.innerHTML = "<p>previous</p>";

    previousPage.classList.add("page-element");
    if (data.previous === null) {previousPage.classList.add("page-disabled")}

    previousPage.onclick = () => (updateCharactersByLink(data.previous));

    pagination.append(previousPage);

    // Add buttons for pagination
    for(var i = 1; i <= 9; i++) {
        var pageElement = document.createElement("div");

        pageElement.innerHTML = `<p>${i}</p>`;
        pageElement.setAttribute('data-page', i);

        pageElement.classList.add("page-element");
        if (currentPage === i) {pageElement.classList.add("page-current")}

        pageElement.onclick = (ev) => updateCharactersByLink(defaultAPILink + "?page=" + ev.currentTarget.getAttribute('data-page'));

        pagination.append(pageElement);
    }

    // Add the next button
    var nextPage = document.createElement('div');

    nextPage.innerHTML = "<p>next</p>";

    nextPage.classList.add("page-element");
    if (data.next === null) {nextPage.classList.add("page-disabled")}

    nextPage.onclick = () => (updateCharactersByLink(data.next))

    pagination.append(nextPage);
}

updateCharactersByLink(); // Call this to update the data at the start of the website

// ----------- Search Function ----------- //
const searchbar = document.getElementById('searchbar');
const searchLink = defaultAPILink + "?search=";

var callTime = 500;
var callTimeout;

searchbar.addEventListener('input', (ev) => {
    // Use a timeout for 0.5s intervals between calls
    clearTimeout(callTimeout);
    callTimeout = setTimeout(() => {    
        // Everytime a new input value is given, update the list
        var searchBy = ev.target.value;
        if (searchBy.length >= 2) {
            updateCharactersByLink(searchLink + searchBy);
        }
        // Call this so that normal list is shown
        if (searchBy.length === 0) {
            updateCharactersByLink(); 
        }
    }, callTime)
})