window.addEventListener("load", (function () {
    console.log(hentFraLocalStorage("loggedInUser"))
    let loggedInUser = hentFraLocalStorage("loggedInUser");
    let brukernavn = loggedInUser["brukernavn"] 
    let utlopstid = loggedInUser["utlopstid"]
    if (!brukernavnFinnes(brukernavn)){
        loggUtBruker();
        console.log("brukernavn finnes ikke")
    }
    if (Date.now() > utlopstid) {
        loggUtBruker();
        console.log("utlopstid er passert")
    }
    
    
}));