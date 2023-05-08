(async function(){
let whoToFollowUsers = []
if (htmlfilnavn == "sok.html") {
    whoToFollowUsers = listeBrukereQuery(hentURLSearchParams()["query"]);

} else {
    whoToFollowUsers = listeBrukereSomIkkeErFolgt(hentInnloggetBrukerId(), 4);
}
let whotofollowbody = document.querySelector(".whotofollowbody")
console.log(whoToFollowUsers)
for (let i = 0; i < whoToFollowUsers.length; i++) {
    if (i%10 == 0 && i != 0){
        await sleep(500);
    }
    let whotofollowperson = document.createElement("div"); // lager en div som skal inneholde en bruker
    whotofollowperson.classList.add("whotofollowperson");

    let a = document.createElement("a"); // lager en a tag som skal være en link til profilen til brukeren
    a.href = "viewprofile.html?brukernavn=" + whoToFollowUsers[i][0];
    a.title = "click to see profile";
    a.classList.add("folgePerson");
    a.classList.add("hiddenButton");

    let div = document.createElement("div"); // lager en div som skal inneholde profilbilde og navn

    let img = document.createElement("img"); // lager et img tag som skal være profilbildet
    img.src = whoToFollowUsers[i][2];
    img.height = 50;
    img.width = 50;
    img.alt = "profilbilde";
    img.classList.add("profilbilde");

    let div1 = document.createElement("div"); // lager en div som skal inneholde navn og brukernavn
    div1.classList.add("profilnavn");

    let div2 = document.createElement("div"); // lager en div som skal inneholde displayname
    div2.classList.add("profilNavnNavn");
    div2.innerHTML = whoToFollowUsers[i][1];

    let div3 = document.createElement("div"); // lager en div som skal inneholde brukernavn
    div3.classList.add("profilNavnId");
    div3.innerHTML = "@" + whoToFollowUsers[i][0];

    let button = document.createElement("button"); // lager en button som gjør at man kan følge brukeren eller unfollowe brukeren
    if (folgerBruker(hentInnloggetBrukerId(), whoToFollowUsers[i][0])) { // setter innerHTML til button basert på om man har fulgt brukeren eller ikke
        button.innerHTML = "Unfollow";
    } else {
        button.innerHTML = "Follow";
    }
    button.classList.add("follow");
    button.classList.add("vanligKnapp");

    button.addEventListener("click", whoToFollowOrUnfollow); // legger til eventlistener på button


    // putter elementer inni elementer
    div1.appendChild(div2);
    div1.appendChild(div3);

    div.appendChild(img);
    div.appendChild(div1);
    a.appendChild(div);

    // hvis brukeren ikke er seg selv, så skal button legges til, man kan ikke følge seg selv
    if (whoToFollowUsers[i][0] != hentInnloggetBrukerId()) {
        a.appendChild(button);
    }
    
    whotofollowperson.appendChild(a);
    whotofollowbody.appendChild(whotofollowperson);

}})();


function whoToFollowOrUnfollow(a) {
    a.preventDefault(); // stopper at man navigerer til en annen side, fungerer bare på events
    let button = a.target;
    
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

