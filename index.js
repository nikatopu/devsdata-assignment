// Toggle the navbar dropdown
const dropdownButton = document.getElementById("dropdown-button");
const dropdownItems = document.getElementById("header-dropdown-items");
dropdownButton.addEventListener('click', () => {
    dropdownItems.classList.toggle('closed');
    dropdownButton.classList.toggle('toggled');
})