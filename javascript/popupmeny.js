function settOppPopupMeny() {
    // henter popup elementet
    let profil = document.querySelector(".profil > button");
    let popupElement = document.querySelector("#popupLogout");


    let nextElement = document.querySelector("#overskriftfollowing");
    if (nextElement == null) {
        nextElement = document.querySelector(".backButton");
    }
    
    nextElement.addEventListener("focus", gjemPopup)
    popupElement.addEventListener("blur", gjemPopup); // blur er det motsatte av focus

    profil.addEventListener("focus", visPopup);

    profil.addEventListener("blur", gjemPopup);
    gjemPopup();
    async function gjemPopup() {
        // denne funkjsonen venter 10ms før den gjemmer popupen for å gi tid til å trykke på knappen i popupen før den gjemmes 

        await sleep(10);

        let elementer = document.querySelectorAll("#popupLogout > *, #popupLogout");
        let harFokus = false;
        for (let i = 0; i < elementer.length; i++) {
            if (elementer[i] == document.activeElement) { // sjekker om et av elementene har fokus hvis det har fokus skal vi ikke gjemme popupen
                harFokus = true;
            }
        }
        if (harFokus) { // hvis har fokus er true skal vi gjemme popupen
            return
        }

        console.log("gjemPopup");
        let popupLogout = document.querySelector("#popupLogout");
        popupLogout.style.display = "none"; // gjemmer popupen

    }
    function visPopup() {
        // denne funksjonen viser popupen. den runner bare hvis popupen ikke er synlig fra før av 
        console.log("visPopup");
        let popupLogout = document.querySelector("#popupLogout");
        popupLogout.style.display = "block";
    }

}
let buttonLogout = document.querySelector("#popupLogoutButton");
    buttonLogout.addEventListener("click", loggUtBruker);
settOppPopupMeny();

