// denne filen kjører på hver side hvor brukeren er logget inn, og endrer på stilarket utifra hva som står i brukerens settings
(function () {
    let bruker = hentBruker(hentInnloggetBrukerId());

    let body = document.querySelector("body");

    if (bruker["settings"]["theme"] == "light") { // hvis brukeren har valgt light theme
        body.style.setProperty("--globalfg", "#404040")
        body.style.setProperty("--globalbg", "#ffffff")
        body.style.setProperty("--globalbg2", "#ffffffcd")
    }
    if (bruker["settings"]["theme"] == "dark") { // hvis brukeren har valgt dark theme
        body.style.setProperty("--globalfg", "#ffffff")
        body.style.setProperty("--globalbg", "#282c34")
        body.style.setProperty("--globalbg2", "#282c34cd")
    }
    if (bruker["settings"]["theme"] == "custom") { // hvis brukeren har valgt custom theme

        body.style.setProperty("--globalfg", bruker["settings"]["text-color"])
        body.style.setProperty("--globalbg", bruker["settings"]["background-color"])
        body.style.setProperty("--globalbg2", bruker["settings"]["background-color"] + "cd")
    }


    // endrer på fonten
    body.style.fontSize = bruker["settings"]["font-size"] + "px";
})();