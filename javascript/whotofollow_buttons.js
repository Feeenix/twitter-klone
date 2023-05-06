
let whoToFollowUsers = []
if (htmlfilnavn == "sok.html") {
    whoToFollowUsers = listeBrukereQuery(hentURLSearchParams()["query"]);

} else {
    whoToFollowUsers = listeBrukereSomIkkeErFolgt(hentInnloggetBrukerId(), 4);
}
let whotofollowbody = document.querySelector(".whotofollowbody")
console.log(whoToFollowUsers)
for (let i = 0; i < whoToFollowUsers.length; i++) {
    let whotofollowperson = document.createElement("div");
    whotofollowperson.classList.add("whotofollowperson");

    let a = document.createElement("a");
    a.href = "viewprofile.html?brukernavn=" + whoToFollowUsers[i][0];
    a.title = "trykk for å se profil";
    a.classList.add("folgePerson");
    a.classList.add("hiddenButton");

    let div = document.createElement("div");

    let img = document.createElement("img");
    img.src = whoToFollowUsers[i][2];
    img.height = 50;
    img.width = 50;
    img.alt = "profilbilde";
    img.classList.add("profilbilde");

    let div1 = document.createElement("div");
    div1.classList.add("profilnavn");

    let div2 = document.createElement("div");
    div2.classList.add("profilNavnNavn");
    div2.innerHTML = whoToFollowUsers[i][1];

    let div3 = document.createElement("div");
    div3.classList.add("profilNavnId");
    div3.innerHTML = "@" + whoToFollowUsers[i][0];

    let button = document.createElement("button");
    if (folgerBruker(hentInnloggetBrukerId(), whoToFollowUsers[i][0])) {
        button.innerHTML = "Unfollow";
    } else {

        button.innerHTML = "Follow";
    }
    button.classList.add("follow");
    button.classList.add("vanligKnapp");
    button.title = "trykk for å følge"


    div1.appendChild(div2);
    div1.appendChild(div3);

    div.appendChild(img);
    div.appendChild(div1);
    a.appendChild(div);

    if (whoToFollowUsers[i][0] != hentInnloggetBrukerId()) {
        a.appendChild(button);
    }
    
    whotofollowperson.appendChild(a);
    whotofollowbody.appendChild(whotofollowperson);

}






let whoToFollowButtons = document.querySelectorAll(".whotofollowbody button");
for (let i = 0; i < whoToFollowButtons.length; i++) {
    let button = whoToFollowButtons[i];
    button.addEventListener("click", whoToFollowOrUnfollow);
}



function whoToFollowOrUnfollow(a) {
    a.preventDefault();
    let button = a.target;
    // sibling tag above
    let brukernavn = button.previousElementSibling.children[1].children[1].innerHTML.replace("@", "");
    let loggedInbrukernavn = hentInnloggetBrukerId();
    if (folgerBruker(loggedInbrukernavn, brukernavn)) {
        unfollowBruker(loggedInbrukernavn, brukernavn);
        button.innerHTML = "Follow";
    } else {
        followBruker(loggedInbrukernavn, brukernavn);
        button.innerHTML = "Unfollow";
    }
}

