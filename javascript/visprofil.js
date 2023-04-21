function oppdaterProfil(brukernavn) {
    console.log("oppdaterer profil for " + brukernavn)

    const bruker = hentBruker(brukernavn);

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


    profilebannerimg.src = bruker["bannerImage"];
    profilebanner.style.backgroundColor = bruker.bannerColor;

    function unfollow() {
        unfollowBruker(loggedInbrukernavn, brukernavn);
        knapp.innerHTML = "Follow";
        knapp.removeEventListener("click", unfollow);
        knapp.addEventListener("click", follow);
    }
    function follow() {
        followBruker(loggedInbrukernavn, brukernavn);
        knapp.innerHTML = "Unfollow";
        knapp.removeEventListener("click", follow);
        knapp.addEventListener("click", unfollow);
    }

    let htmlfilnavn = window.location.pathname.split("/").pop();
    let loggedInbrukernavn = hentInnloggetBrukerId();
    if (brukernavn == loggedInbrukernavn) {
        if (htmlfilnavn != "settings.html") {
            knapp.innerHTML = "Rediger profil";
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

    profilePfp.src = bruker["profileImage"];
    profileDisplayName.innerHTML = bruker["displayName"];
    profileBrukernavn.innerHTML = bruker["brukernavn"];
    profileBio.innerHTML = bruker["bio"];
    profileLocationName.innerHTML = bruker["location"];

    profileFollowing.innerHTML = bruker["following"].length;
    profileFollowers.innerHTML = bruker["followers"].length;



}