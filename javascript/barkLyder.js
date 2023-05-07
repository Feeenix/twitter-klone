(function () {
    let arrayAvLyder = []
    for (let i = 0; i < 30; i++) {

        arrayAvLyder.push(new Audio("sound/bark" + (i + 1) + ".mp3"));
    }
    let body = document.querySelector("body");
    body.addEventListener("click", function () {
        let innloggetBruker = hentInnloggetBrukerId();
        let bruker = hentBruker(innloggetBruker);


        if (htmlfilnavn == "settings.html") {
            let barkSoundRadio = document.querySelectorAll(".settingsEditOtherSoundType");

            if (barkSoundRadio[0].checked != true) {
                return;
            }
            let lyd = arrayAvLyder[Math.floor(Math.random() * arrayAvLyder.length)];
            lyd.play();


        } else {
            if (bruker["settings"]["barkSound"] == "false") {
                return;
            }
            let lyd = arrayAvLyder[Math.floor(Math.random() * arrayAvLyder.length)];
            lyd.play();
        }
    });



})();