// en funksjon som henter brukernavnet til den innloggede brukeren og viser den riktige dataen på profilsiden (og settings sin preview)
function oppdaterProfil(brukernavn) {
    console.log("oppdaterer profil for " + brukernavn)

    const bruker = hentBruker(brukernavn);


    // henter alle elementer
    let profilebannerimg = document.querySelector("#profilebannerimg"); // img
    let profilebanner = document.querySelector("#profilebanner"); // brukes for solid farge
    let knapp = document.querySelector("#profilePfpShare>button");
    let profilePfp = document.querySelector("#overskriftPfp"); //img
    let profileDisplayName = document.querySelector("#profileDisplayName");
    let profileBrukernavn = document.querySelector("#profileBrukernavn");
    let profileBio = document.querySelector("#profileBio");
    let profileLocationName = document.querySelector("#profileLocationName");
    let profileFollowing = document.querySelector("#profileFollowing>*:nth-child(1)");
    let profileFollowers = document.querySelector("#profileFollowers>*:nth-child(1)");

    // setter inn data

    // hvis det ikke er noen banner image så setter den inn en tom bilde slik at det ikke blir en hvit firkant på noen nettlesere
    profilebannerimg.src = bruker["bannerImage"];
    if (bruker.bannerImage == "") {
        profilebannerimg.src = "bilder/empty.png";
    }
    profilebanner.style.backgroundColor = bruker.bannerColor;

    function unfollow() { // funksjon for å unfollowe en bruker, brukes i eventlisteners, referer mest til funksjoner i lib.js 
        unfollowBruker(loggedInbrukernavn, brukernavn);
        knapp.innerHTML = "Follow";
        knapp.removeEventListener("click", unfollow);// bytter ut sin egen event listener
        knapp.addEventListener("click", follow);
    }
    function follow() { // funksjon for å følge en bruker, brukes i eventlisteners, referer mest til funksjoner i lib.js
        followBruker(loggedInbrukernavn, brukernavn);
        knapp.innerHTML = "Unfollow";
        knapp.removeEventListener("click", follow);
        knapp.addEventListener("click", unfollow);
    }

    let htmlfilnavn = window.location.pathname.split("/").pop();
    let loggedInbrukernavn = hentInnloggetBrukerId();
    if (brukernavn == loggedInbrukernavn) { // hvis det er den innloggede brukeren så setter den inn en knapp som tar deg til settings med mindre du er i settings
        if (htmlfilnavn != "settings.html") { 
            knapp.innerHTML = "Edit profile";
            knapp.onclick = function () {
                window.location.href = "settings.html";
            }
        }
    } else {
        if (folgerBruker(loggedInbrukernavn, brukernavn)) {
            knapp.innerHTML = "Unfollow";
            knapp.addEventListener("click" , unfollow);
        } else {
            knapp.innerHTML = "Follow";
            knapp.addEventListener("click" , follow);
        }

    }

    // setter inn data i html elementene
    profilePfp.src = bruker["profileImage"];
    profileDisplayName.innerHTML = bruker["displayName"];
    profileBrukernavn.innerHTML = "@"+brukernavn;
    profileBio.innerHTML = bruker["bio"];

    profileLocationName.innerHTML = bruker["location"];

    if (bruker["location"] == "") { // hvis det ikke er noen location så skjuler den location elementet
        document.querySelector("#profileLocation").style.display = "none";
    } else {
        document.querySelector("#profileLocation").style.display = "flex";
    }
    profileFollowing.innerHTML = bruker["following"].length;
    profileFollowers.innerHTML = bruker["followers"].length;



}