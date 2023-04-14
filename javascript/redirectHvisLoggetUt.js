window.addEventListener("load", (function () {
    let [brukernavn, utlopstid] = JSON.parse(hentFraLocalStorage("loggedInUser"));
    if (!brukernavnFinnes(brukernavn)){
        loggUtBruker();
    }
    if (Date.now() > utlopstid) {
        loggUtBruker();
    }
    
    
}));