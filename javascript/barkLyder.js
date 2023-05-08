// gjør at når du klikker på bodyen så spiller den en bjeffelyd
(function () {
    let arrayAvLyder = []
    for (let i = 0; i < 30; i++) {

        arrayAvLyder.push(new Audio("sound/bark" + (i + 1) + ".mp3"));
        // her blir det laget Audio objekter som blir puttet inn i arrayen
    }
    let body = document.querySelector("body");
    body.addEventListener("click", function () {
        let innloggetBruker = hentInnloggetBrukerId();
        let bruker = hentBruker(innloggetBruker); // henter den innloggede brukeren


        if (htmlfilnavn == "settings.html") {
            // hvis den er i settings.html går den utifra hva som står på radio knappene
            let barkSoundRadio = document.querySelectorAll(".settingsEditOtherSoundType");

            if (barkSoundRadio[0].checked != true) {
                return;
            }
            let lyd = arrayAvLyder[Math.floor(Math.random() * arrayAvLyder.length)];// henter en tilfeldig lyd fra arrayen
            lyd.play(); // audio.play() spiller av lyden


        } else {
            // alle andre steder enn i settings.html går den ut ifra hvilke settings brukeren har valgt
            if (bruker["settings"]["barkSound"] == "false") {
                return;
            }
            let lyd = arrayAvLyder[Math.floor(Math.random() * arrayAvLyder.length)];
            lyd.play();
        }
    });



})();