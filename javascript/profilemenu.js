
let profilknapp = document.querySelector(".profilknapp");


let profilknappBilde = document.querySelector(".profilknapp>div>img");
let profilNavnNavn = document.querySelector(".profilknapp>div>.profilnavn>.profilNavnNavn");
let profilNavnId = document.querySelector(".profilknapp>div>.profilnavn>.profilNavnId");

let loggedInUser = hentInnloggetBrukerId();
let bruker = hentBruker(loggedInUser);
profilknappBilde.src = bruker["profileImage"];
profilNavnNavn.innerHTML = bruker["displayName"];
profilNavnId.innerHTML = "@" + loggedInUser;


let popupViewProfile = document.querySelector("#popupViewProfile");
popupViewProfile.href = "viewprofile.html?brukernavn=" + loggedInUser;





