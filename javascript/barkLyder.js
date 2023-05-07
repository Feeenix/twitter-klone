(function(){
    let arrayAvLyder = []
    for (let i = 0; i < 30; i++) {

        arrayAvLyder.push(new Audio("sound/bark"+ (i+1) +".mp3"));
    }
    let body = document.querySelector("body");
    body.addEventListener("click", function(){
        let innloggetBruker = hentInnloggetBrukerId();
        let bruker = hentBruker(innloggetBruker);
        if (bruker["settings"]["barkLyder"] == "false") {
            return;
        }
        let lyd = arrayAvLyder[Math.floor(Math.random() * arrayAvLyder.length)];
        lyd.play();
    });



})();