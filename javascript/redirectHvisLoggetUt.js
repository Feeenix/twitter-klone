window.addEventListener("load", (function () {
    let [brukernavn, utlopstid] = JSON.parse(hentFraLocalStorage("loggedInUser"));
    if (!brukernavnFinnes()){
        window.location.href = "index.html";
    }
    if (Date.now() > utlopstid) {
        loggUtBruker();
        
    }
    
    
}));