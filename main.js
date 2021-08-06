const sessionWrapper = document.querySelector(".session-wrapper");

const playersAmountInput = document.querySelector(".players-amount-input");

const initButton = document.querySelector(".init-session");
const resetButton = document.querySelector(".reset-session");

let sessionStarted = false;

const playerWidth = 600;
const playerHeight = 339;

const sessionInit = () => {
    if (isNaN(playersAmountInput.value)) {
        playersAmountInput.value = "";

        return
    }

    if (!sessionStarted) {
        for (let i = 0; i < playersAmountInput.value; i++) {
            playerWrapperInit(sessionWrapper, i);
        }
    }

    playersAmountInput.value = "";
    
    sessionStarted = true;
}
initButton.addEventListener("click", sessionInit);

const playerWrapperInit = (sessionWrapper, i) => {
    const playerWrapper = document.createElement("div");
    playerWrapper.className = "player-wrapper";
    sessionWrapper.append(playerWrapper);

    playerPlaceholderInit(playerWrapper, i);
    urlNavigationWrapperInit(playerWrapper, i);
}

const playerPlaceholderInit = (playerWrapper, i) => {
    const playerPlaceholder = document.createElement("div");

    playerPlaceholder.className = "player-placeholder";
    playerPlaceholder.id = `player-placeholder-${i}`;
    playerPlaceholder.style.width = playerWidth + "px";
    playerPlaceholder.style.height = playerHeight + "px";

    playerWrapper.append(playerPlaceholder);
}

const urlNavigationWrapperInit = (playerWrapper, i) => {
    const urlNavigationWrapper = document.createElement("div");
    urlNavigationWrapper.className = "url-navigation-wrapper"

    playerWrapper.append(urlNavigationWrapper);

    urlNavigationInit(urlNavigationWrapper, i);
}

const urlNavigationInit = (urlNavigationWrapper, i) => {
    const urlInput = document.createElement("input");
    urlInput.className = "url-input";
    urlInput.type = "text";
    
    const startStreamButton = document.createElement("button");
    startStreamButton.className = "start-stream-button";
    startStreamButton.type = "button";
    startStreamButton.innerHTML = "Start stream";

    urlNavigationWrapper.append(urlInput, startStreamButton);

    startStreamButton.addEventListener("click", (e) => {
        startStream(e, i, urlInput.value)
    });
}

const startStream = (e, i, urlInputValue) => {
    restartPlayer(e)

    playerInit(i, urlInputValue)
}

const playerInit = (i, urlInputValue) => {
    SLDP.init({
        container:          `player-placeholder-${i}`,
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
    if (e.target.parentNode.previousSibling.firstElementChild && e.target.parentNode.previousSibling.firstElementChild.classList.contains("sldp_player_wrp")) {
        e.target.parentNode.previousSibling.firstElementChild.remove();
    }
}

const resetSession = () => {
    const players = document.querySelectorAll(".player-wrapper");

    players.forEach(player => {
        player.remove();
    })
 
    sessionStarted = false;

    playersAmountInput.value = "";
}
resetButton.addEventListener("click", resetSession);