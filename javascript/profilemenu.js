


// setter profilbilde og navn i profilknappen som er nederst til venstre

// henter elementer
let profilknapp = document.querySelector(".profilknapp");
let profilknappBilde = document.querySelector(".profilknapp>div>img");
let profilNavnNavn = document.querySelector(".profilknapp>div>.profilnavn>.profilNavnNavn");
let profilNavnId = document.querySelector(".profilknapp>div>.profilnavn>.profilNavnId");


// henter hvilken bruker som er logget inn
let loggedInUser = hentInnloggetBrukerId();
let bruker = hentBruker(loggedInUser);


// setter inn profilbilde og navn
profilknappBilde.src = bruker["profileImage"];
profilNavnNavn.innerHTML = bruker["displayName"];
profilNavnId.innerHTML = "@" + loggedInUser;

// setter riktig link til viewprofile i popup menyen
let popupViewProfile = document.querySelector("#popupViewProfile");
popupViewProfile.href = "viewprofile.html?brukernavn=" + loggedInUser;





