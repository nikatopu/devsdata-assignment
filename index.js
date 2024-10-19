// ----------- Toggle the navbar dropdown ----------- //

const dropdownButton = document.getElementById("dropdown-button");
const dropdownItems = document.getElementById("header-dropdown-items");
dropdownButton.addEventListener('click', () => {
    dropdownItems.classList.toggle('closed');
    dropdownButton.classList.toggle('toggled');
})

// ----------- Getting the API data ----------- //
const defaultAPILink = "https://swapi.dev/api/people/";

// Cooldown for calling the API
var callTime = 500;
var callTimeout;

async function updateCharactersByLink(link=defaultAPILink) {
    const characterList = document.getElementById('character-list');

    // Fetch the API data
    const result = await fetch(link);
    const data = await result.json();

    // Empty the character list
    characterList.innerHTML = "";

    // For each resulted character, create a new div and append it
    data.results.forEach(element => {
        // Create a character wrapper for the background blur
        var characterWrapper = document.createElement('div');

        // Create the character div
        var character = document.createElement('div');
        character.className = 'character';

        // Create h1 for the character and append it
        var characterName = document.createElement('h1');
        characterName.innerHTML = element.name;
        character.append(characterName);

        // Onclick on this character, enlarge it if no other object is enlarged
        character.onclick = (ev) => {
            if (document.getElementsByClassName('character-enlarged').length === 0) {
                // Enlarge the div and the wrapper
                ev.currentTarget.classList.add('character-enlarged')
                ev.currentTarget.parentNode.classList.add('character-blur-effect')
            }
        };

        // Create a close button
        var closeButton = document.createElement('div');
        closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1.5lvw" viewBox="0 0 30 30"><path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path></svg>`;
        closeButton.className = "character-enlarge-close";
        closeButton.onclick = (ev) => {
            ev.stopPropagation(); // Prevents the click event from bubbling up to the character div
            // Remove the enlarged effects on the character and the character wrapper
            ev.currentTarget.parentNode.classList.remove('character-enlarged');
            ev.currentTarget.parentNode.parentNode.classList.remove('character-blur-effect')
        };
        character.append(closeButton);

        // Append the entire character div to the character list
        characterWrapper.append(character);
        characterList.append(characterWrapper);
    });

    // Create a corresponding pagination for the current page
    const currentPage = data.previous === null ? 1 : parseInt(data.previous.split("=")[1]) + 1;
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = "";

    // Custom function for calling on click with the timeout so we don't spam API calls
    function timedUpdate(timedLink=link) {
        clearTimeout(callTimeout);
        callTimeout = setTimeout(() => updateCharactersByLink(timedLink), 500);
    }

    // Add the previous button
    var previousPage = document.createElement('div');
    previousPage.innerHTML = "<p>previous</p>";
    previousPage.classList.add("page-element");
    if (data.previous === null) {previousPage.classList.add("page-disabled")}
    previousPage.onclick = () => (timedUpdate(data.previous));
    pagination.append(previousPage);

    // Add buttons for pagination
    for(var i = 1; i <= 9; i++) {
        var pageElement = document.createElement("div");

        pageElement.innerHTML = `<p>${i}</p>`;
        pageElement.setAttribute('data-page', i);

        pageElement.classList.add("page-element");
        if (currentPage === i) {pageElement.classList.add("page-current")}

        pageElement.onclick = (ev) => {
            var page = ev.currentTarget.getAttribute('data-page');
            var customLink = `${defaultAPILink}?page=${page}`;
            timedUpdate(customLink);
        };

        pagination.append(pageElement);
    }

    // Add the next button
    var nextPage = document.createElement('div');
    nextPage.innerHTML = "<p>next</p>";
    nextPage.classList.add("page-element");
    if (data.next === null) {nextPage.classList.add("page-disabled")}
    nextPage.onclick = () => (timedUpdate(data.next))
    pagination.append(nextPage);
}

updateCharactersByLink(); // Call this to update the data at the start of the website

// ----------- Search Function ----------- //
const searchbar = document.getElementById('searchbar');
const searchLink = defaultAPILink + "?search=";

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