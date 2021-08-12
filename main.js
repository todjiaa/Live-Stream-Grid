const startingScreenWrapper = document.querySelector(".starting-screen-wrapper");
const newSessionButton = document.querySelector(".new-session");
const recentSessionButton = document.querySelector(".recent-session");

const sessionWrapper = document.querySelector(".session-wrapper");

const playersLengthInput = document.querySelector(".players-length-input");

const addPlayersButton = document.querySelector(".add-players");
const resetButton = document.querySelector(".reset-session");

let scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
);

const footer = document.querySelector(".footer");

const localStorage = window.localStorage;

const storedPlayersLength = "players-length";
let storedUrlInputValue = "stored-url-input-value";
const storedArray = [];

let playersInUse = 0;
let activePlayers = 0;

const playerWidth = 600;
const playerHeight = 339;

// Set the widht and height of the video player placeholder
const setWidthHeight = (element, width, height) => {
    element.style.width = width + "px";
    element.style.height = height + "px";
}


// Get and set the width and height for the player and the player placeholder dynamically depending on the size of the screen
const playerSize = (playerPlaceholder) => {
    let width = playerWidth;
    let height = playerHeight;

    const ratio = playerWidth/playerHeight;

    if (window.innerWidth < playerWidth) {
        width = document.documentElement.clientWidth;
        height = width / ratio;

        setWidthHeight(playerPlaceholder, width, height);
    }
    else {
        width = playerWidth;
        height = playerHeight;

        setWidthHeight(playerPlaceholder, width, height);
    }

    return {
        width: width,
        height: height
    }
}

// Hide element
const hideElement = (element) => {
    element.style.display = "none";
}

// Position a given element at the bottom of the screen
const positionToBottom = (element, scroll) => {
    element.style.top = scroll - element.clientHeight - 10 + "px";
}
positionToBottom(footer, scrollHeight);

// Clear a given input value
const clearInput = (input) => {
    input.value = "";
}

// Check if there is Recent session available and if not remove the recent session button
const checkIfRecentSession = () => {
    const playersLength = localStorage.getItem(storedPlayersLength);
    
    if (Number(playersLength) === 0) {
        hideElement(recentSessionButton);
    }
}
checkIfRecentSession();

// Store the value for the players length at the local storage
const storePlayersLengthInLocalStorage = (length) => {
    const playersLengthString = JSON.stringify(length);

    localStorage.setItem(storedPlayersLength, playersLengthString);
}

// Store the URL's in the local storage
const storeUrlsInLocalStorage = (urlInputValue, playersInUse) => {
    const urlKeys = storedUrlInputValue + "-" + playersInUse;

    localStorage.setItem(urlKeys, urlInputValue);
}

// Open new session
const openNewSession = () => {
    hideElement(startingScreenWrapper);

    storePlayersLengthInLocalStorage(playersInUse);
}
newSessionButton.addEventListener("click", openNewSession);

// Open recent session
const openRecentSession = () => {
    const playersLengthFromStorage = localStorage.getItem(storedPlayersLength);
    
    hideElement(startingScreenWrapper);
    
    addPlayersPlaceholders(playersLengthFromStorage);
    
    for (let i = 0; i < playersInUse; i++) {
        const actualIndex = i+1;

        const urlKeys = storedUrlInputValue + "-" + actualIndex;

        const urlFromStorage = localStorage.getItem(urlKeys);

        if (urlFromStorage) {
            playerInit(urlFromStorage, actualIndex);
        }
    }
}
recentSessionButton.addEventListener("click", openRecentSession);

// Create each player wrapper
const playerWrapperInit = (sessionWrapper, playersInUse) => {
    const playerWrapper = document.createElement("div");
    playerWrapper.className = "player-wrapper";
    sessionWrapper.append(playerWrapper);

    playerPlaceholderInit(playerWrapper, playersInUse);
    urlNavigationWrapperInit(playerWrapper, playersInUse);
}

// Create each player placeholder
const playerPlaceholderInit = (playerWrapper, playersInUse) => {
    const playerPlaceholder = document.createElement("div");

    playerPlaceholder.className = "player-placeholder";
    playerPlaceholder.id = `player-placeholder-${playersInUse}`;
    // playerPlaceholder.style.width = playerWidth + "px";
    // playerPlaceholder.style.height = playerHeight + "px";

    playerWrapper.append(playerPlaceholder);

    playerSize(playerPlaceholder);
}

// Create each player Navigation wrapper
const urlNavigationWrapperInit = (playerWrapper, playersInUse) => {
    const urlNavigationWrapper = document.createElement("div");
    urlNavigationWrapper.className = "url-navigation-wrapper"

    playerWrapper.append(urlNavigationWrapper);

    urlNavigationInit(urlNavigationWrapper, playersInUse);
}

// Create each player Navigation
const urlNavigationInit = (urlNavigationWrapper, playersInUse) => {
    const urlInput = document.createElement("input");
    urlInput.className = "url-input";
    urlInput.type = "text";
    urlInput.placeholder = "Enter URL"
    
    const startStreamButton = document.createElement("button");
    startStreamButton.className = "start-stream-button";
    // startStreamButton.type = "button";
    startStreamButton.innerHTML = "Start stream";

    urlNavigationWrapper.append(urlInput, startStreamButton);

    startStreamButton.addEventListener("click", (e) => {
        startStream(e, urlInput.value, playersInUse);

        clearInput(urlInput);
    });
}

// Create the session with the player's placeholders and navigation 
const addPlayersPlaceholders = (length) => {
    for (let i = 0; i < length; i++) {
        playersInUse++;

        activePlayers++;

        playerWrapperInit(sessionWrapper, playersInUse);

        storePlayersLengthInLocalStorage(playersInUse);
    }

    let scrollHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    );

    positionToBottom(footer, scrollHeight);

    clearInput(playersLengthInput);
}
addPlayersButton.addEventListener("click", () => {
    addPlayersPlaceholders(playersLengthInput.value);
});

// Start the players
const startStream = (e, urlInputValue, playersInUse) => {
    if (urlInputValue) {
        deletePlayer(e);

        playerInit(urlInputValue, playersInUse);

        storeUrlsInLocalStorage(urlInputValue, playersInUse);
    }
}

// Create the players
const playerInit = (urlInputValue, playersInUse) => {
    const playerPlaceholder = document.querySelectorAll(".player-placeholder");

    let activeWidth;
    let activeHeight;

    playerPlaceholder.forEach(placeholder => {
        activeWidth = playerSize(placeholder).width;
        activeHeight = playerSize(placeholder).height;
    })

    SLDP.init({
        container:          `player-placeholder-${playersInUse}`,
        stream_url:         urlInputValue,
        initial_resolution: '240p',
        buffering:          500,
        autoplay:           true,
        muted:              true,
        width:              activeWidth,
        height:             activeHeight,
        fullscreen:         activePlayers === 1 ? true : false
    })
}

// Delete players
const deletePlayer = (e) => {
    const player = e.target.parentNode.previousElementSibling.firstElementChild;

    if (player && player.classList.contains("sldp_player_wrp")) {
        player.remove();
    }
}

// Reset the current session 
const resetSession = () => {
    const players = document.querySelectorAll(".player-wrapper");

    players.forEach((player, i) => {
        const actualIndex = i+1;

        const urlKeys = storedUrlInputValue + "-" + actualIndex;
        
        player.remove();

        localStorage.setItem(urlKeys, "");
    })
 
    clearInput(playersLengthInput);

    positionToBottom(footer, scrollHeight);

    playersInUse = 0;
    activePlayers = 0;

    storePlayersLengthInLocalStorage(playersInUse);
}
resetButton.addEventListener("click", resetSession);