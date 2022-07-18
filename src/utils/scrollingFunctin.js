export let scrollingToElement = (uniqueId) => {
    const currentElement = document.getElementById(uniqueId);
    // verify currentElement exist before any action
    if (currentElement) {
        const currentDisplay = document.getElementById("display-preview");
        const scrolling = currentElement.getBoundingClientRect().y - currentDisplay.getBoundingClientRect().y - 60;
        currentDisplay.scrollBy({top: scrolling, left: 0, behavior: "smooth"});
    }
};