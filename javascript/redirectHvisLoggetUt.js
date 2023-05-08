// sjekker om bruker er logget inn, hvis ikke blir bruker sendt til logg inn siden
console.log(hentFraLocalStorage("loggedInUser"))
let loggedInUser = hentFraLocalStorage("loggedInUser");
if (JSON.stringify(loggedInUser) == "{}") { // logger ut hvis loggedInUser ikke finnes i localStorage
    window.location.href = "login.html";
}
let brukernavn = loggedInUser["brukernavn"]
let utlopstid = loggedInUser["utlopstid"]
if (!brukernavnFinnes(brukernavn)) { // logger ut hvis brukernavn ikke finnes
    loggUtBruker();
    console.log("brukernavn finnes ikke")
}
if (Date.now() > utlopstid) { // logger ut hvis utlopstid er passert
    loggUtBruker();
    console.log("utlopstid er passert")
}
