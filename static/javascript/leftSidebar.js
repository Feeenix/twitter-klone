

let profil = document.querySelector(".profil > button");
let popupElement = document.querySelector("#popupLogout");

document.querySelector("#overskriftfollowing").addEventListener("focus", gjemPopup)
popupElement.addEventListener("blur", gjemPopup);

profil.addEventListener("focus", visPopup);

profil.addEventListener("blur", gjemPopup);
//gjemPopup();
async function gjemPopup() {
    await sleep(10);

    let elementer = document.querySelectorAll("#popupLogout > *, #popupLogout");
    let harFokus = false;
    for (let i = 0; i < elementer.length; i++) {
        if (elementer[i] == document.activeElement) {
            harFokus = true;
        }
    }
    if (harFokus) {
        return
    }

    console.log("gjemPopup");
    let popupLogout = document.querySelector("#popupLogout");
    popupLogout.style.display = "none";

}
function visPopup() {
    console.log("visPopup");
    let popupLogout = document.querySelector("#popupLogout");
    popupLogout.style.display = "block";
}


