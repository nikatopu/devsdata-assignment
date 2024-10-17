// Toggle the navbar dropdown
const dropdownButton = document.getElementById("dropdown-button");
const dropdownItems = document.getElementById("header-dropdown-items");
dropdownButton.addEventListener('click', () => {
    dropdownItems.classList.toggle('closed');
    dropdownButton.classList.toggle('toggled');
})

// Getting the API data
const defaultAPILink = "https://swapi.dev/api/people";

async function getData(link=defaultAPILink) {
    const result = await fetch(link);
    console.log(await result.json())
}

async function updateCharactersByLink(link=defaultAPILink) {
    // Empty the character list
    const characterList = document.getElementById('character-list');
    characterList.innerHTML = "";

    // Fetch the API data
    const result = await fetch(link);
    const data = await result.json();

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
}

updateCharactersByLink();