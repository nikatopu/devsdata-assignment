// ----------- Toggle the Navbar Dropdown ----------- //
function toggleDropdown(button, items) {
    button.addEventListener('click', () => {
        items.classList.toggle('closed');
        button.classList.toggle('toggled');
    });
}

const dropdownButton = document.getElementById("dropdown-button");
const dropdownItems = document.getElementById("header-dropdown-items");
toggleDropdown(dropdownButton, dropdownItems);

// ----------- API Data Handling ----------- //
const defaultAPILink = "https://swapi.dev/api/people/";
const callCooldown = 500;
let callTimeout;

function fetchData(link) {
    return fetch(link).then(response => response.json());
}

// Utility function to add elements to the DOM
function createElement(tag, classNames = '', innerHTML = '') {
    const element = document.createElement(tag);
    if (classNames) element.className = classNames;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

// Creating the character element based on the character data
function createCharacterElement(characterData) {
    const characterWrapper = createElement('div');
    const character = createElement('div', 'character');
    const characterName = createElement('h1', '', characterData.name);

    character.append(characterName);
    character.onclick = () => enlargeCharacter(character);

    const closeButton = createCloseButton();
    character.append(closeButton);

    characterWrapper.append(character);
    return characterWrapper;
}

// Creating the close button for the enlarged character
function createCloseButton() {
    const closeButton = createElement('div', 'character-enlarge-close');
    closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1.5lvw" viewBox="0 0 30 30"><path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path></svg>`;
    closeButton.onclick = (ev) => closeCharacter(ev);
    return closeButton;
}

// Function for enlarging a character and getting more information
function enlargeCharacter(character) {
    if (document.getElementsByClassName('character-enlarged').length === 0) {
        character.classList.add('character-enlarged');
        character.parentNode.classList.add('character-blur-effect');
    }
}

// Function for closing the enlarged character
function closeCharacter(ev) {
    ev.stopPropagation();
    const character = ev.currentTarget.parentNode;
    character.classList.remove('character-enlarged');
    character.parentNode.classList.remove('character-blur-effect');
}

// Async function to handle updating the current character list
async function updateCharactersByLink(link = defaultAPILink) {
    const characterList = document.getElementById('character-list');
    const data = await fetchData(link);

    // Clear character list and update new results
    characterList.innerHTML = '';
    data.results.forEach(characterData => {
        const characterElement = createCharacterElement(characterData);
        characterList.append(characterElement);
    });

    // Update pagination
    updatePagination(data);
}

// ----------- Pagination Handling ----------- //
// Timed update of the character list
// This ensure that we don't spam API calls
function timedUpdate(link) {
    clearTimeout(callTimeout);
    callTimeout = setTimeout(() => updateCharactersByLink(link), callCooldown);
}

// Creating the pagination button
function createPaginationButton(label, link, disabled = false) {
    const button = createElement('div', 'page-element', `<p>${label}</p>`);
    if (disabled) button.classList.add('page-disabled');
    button.onclick = () => link && timedUpdate(link);
    return button;
}

// Updating pagination based on the given data (page)
function updatePagination(data) {
    const currentPage = data.previous === null ? 1 : parseInt(data.previous.split("=")[1]) + 1;
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // Add previous button
    const prevButton = createPaginationButton('previous', data.previous, !data.previous);
    pagination.append(prevButton);

    // Add page buttons
    for (let i = 1; i <= 9; i++) {
        const pageButton = createPaginationButton(i, `${defaultAPILink}?page=${i}`, currentPage === i);
        if (currentPage === i) pageButton.classList.add('page-current');
        pagination.append(pageButton);
    }

    // Add next button
    const nextButton = createPaginationButton('next', data.next, !data.next);
    pagination.append(nextButton);
}

updateCharactersByLink(); // Initial data fetch

// ----------- Search Functionality ----------- //
const searchbar = document.getElementById('searchbar');
const searchLink = `${defaultAPILink}?search=`;

searchbar.addEventListener('input', (ev) => {
    clearTimeout(callTimeout);
    const searchQuery = ev.target.value;
    const searchAPI = searchQuery.length >= 2 ? `${searchLink}${searchQuery}` : defaultAPILink;

    callTimeout = setTimeout(() => updateCharactersByLink(searchAPI), callCooldown);    // So we don't spam API calls
});
