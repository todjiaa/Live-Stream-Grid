const sessionWrapper = document.querySelector(".session-wrapper");

const playersAmountInput = document.querySelector(".players-amount-input");

const initButton = document.querySelector(".init-session");
const resetButton = document.querySelector(".reset-session");

let playersCount = 0;

const playerWidth = 600;
const playerHeight = 339;


const playerWrapperInit = (sessionWrapper, playersCount) => {
    const playerWrapper = document.createElement("div");
    playerWrapper.className = "player-wrapper";
    sessionWrapper.append(playerWrapper);

    playerPlaceholderInit(playerWrapper, playersCount);
    urlNavigationWrapperInit(playerWrapper, playersCount);
}

const playerPlaceholderInit = (playerWrapper, playersCount) => {
    const playerPlaceholder = document.createElement("div");

    playerPlaceholder.className = "player-placeholder";
    playerPlaceholder.id = `player-placeholder-${playersCount}`;
    playerPlaceholder.style.width = playerWidth + "px";
    playerPlaceholder.style.height = playerHeight + "px";

    playerWrapper.append(playerPlaceholder);
}

const urlNavigationWrapperInit = (playerWrapper, playersCount) => {
    const urlNavigationWrapper = document.createElement("div");
    urlNavigationWrapper.className = "url-navigation-wrapper"

    playerWrapper.append(urlNavigationWrapper);

    urlNavigationInit(urlNavigationWrapper, playersCount);
}

const urlNavigationInit = (urlNavigationWrapper, playersCount) => {
    const urlInput = document.createElement("input");
    urlInput.className = "url-input";
    urlInput.type = "text";
    
    const startStreamButton = document.createElement("button");
    startStreamButton.className = "start-stream-button";
    startStreamButton.type = "button";
    startStreamButton.innerHTML = "Start stream";

    urlNavigationWrapper.append(urlInput, startStreamButton);

    startStreamButton.addEventListener("click", (e) => {
        startStream(e, urlInput.value, playersCount)
    });
}

const clearInput = (input) => {
    input.value = "";
}

const sessionInit = () => {
    for (let i = 0; i < playersAmountInput.value; i++) {
        playerWrapperInit(sessionWrapper, playersCount);

        playersCount++;
    }

    clearInput(playersAmountInput);
}
initButton.addEventListener("click", sessionInit);

const startStream = (e, urlInputValue, playersCount) => {
    restartPlayer(e)

    playerInit(urlInputValue, playersCount)
}

const playerInit = (urlInputValue, playersCount) => {
    SLDP.init({
        container:          `player-placeholder-${playersCount}`,
        stream_url:         urlInputValue,
        initial_resolution: '240p',
        buffering:          500,
        autoplay:           true,
        muted:              true,
        width:              playerWidth,
        height:             playerHeight,
    })
}

const restartPlayer = (e) => {
    const player = e.target.parentNode.previousSibling.firstElementChild;

    if (player && player.classList.contains("sldp_player_wrp")) {
        player.remove();
    }
}

const resetSession = () => {
    const players = document.querySelectorAll(".player-wrapper");

    players.forEach(player => {
        player.remove();
    })
 
    clearInput(playersAmountInput);
}
resetButton.addEventListener("click", resetSession);