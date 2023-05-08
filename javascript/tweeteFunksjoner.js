// denne filen inneholder alle funksjonene som har med å lage tweets å gjøre
// den brukes for å lage nye tweets og kommentarer


let tweetUploadButton = document.querySelector("#tweetUploadButton");
let tweetUploadInput = document.querySelector("#tweetUploadInput");

tweetUploadButton.addEventListener("click", function () {
    tweetUploadInput.click();
});


let tweetImagePreview = document.querySelector(".tweetImagePreview");



function removeImage() {
    let tweetImagePreview = document.querySelector(".tweetImagePreview")
    tweetImagePreview.innerHTML = "";
    tweetImagePreview.style.display = "none";
}


tweetUploadInput.addEventListener("change", async function (e) { 
    // legger til en eventlistener på inputten (type=file) som gjør at når det blir lastet opp et bilde, 
    // så vil den lese dataURLen til bildet og sette sourcen til tweetImagePreview (img)
    
    
    removeImage(); // starter med å fjerne eventuelle bilder som allerede er der
    let file = this.files[0];
    console.log(file)
    let dataURL = await readfile(file);
    let img = document.createElement("img");
    img.src = dataURL;

    let tweetImagePreview = document.querySelector(".tweetImagePreview")
    tweetImagePreview.appendChild(img);
    tweetImagePreview.style.display = "block";
});

if (htmlfilnavn == "lagtweet.html" || htmlfilnavn == "viewtweet.html") { // en liten sjekk for om den er på riktig side
    let tweetKnapp = document.querySelector(".aatweetknapp");

    tweetKnapp.addEventListener("click", function () { // legger til en eventlistener på tweet knappen som poster tweeten
        let tweetTextArea = document.querySelector("#tweetTextArea");
        let tweetTextAreaValue = tweetTextArea.value; // henter tweet teksten

        let tweetImagePreview = document.querySelector(".tweetImagePreview");
        let tweetImageURL = "";
        if (tweetImagePreview.style.display == "block" && tweetImagePreview.children.length > 0) { // henter bildet hvis det finnes
            tweetImageURL = document.querySelector(".tweetImagePreview>img").src;
        }

        let tweetAuthor = hentInnloggetBrukerId();
        let path = []
        if (htmlfilnavn == "viewtweet.html") {
            // hvis det er en reply, så henter den pathen til som vi kommenterer på og legger til id-en til tweeten vi kommenterer på i pathen 
            // path inneholder alle id-ene som kommer *før* en tweet 
            let tweetIdParent = hentURLSearchParams()["tweetId"];
            let parentPath = hentTweet(tweetIdParent)["path"];
            parentPath.push(tweetIdParent);
            path = parentPath;
        }


        // lager tweeten
        lagNyTweet(tweetAuthor, path, tweetImageURL, tweetTextAreaValue);

        // resetter tweeten
        tweetTextArea.value = ""; 
        removeImage();


        // bytter side
        if (htmlfilnavn == "lagtweet.html") {
            window.location.href = "viewprofile.html?brukernavn=" + hentInnloggetBrukerId();
        } else {
            window.location.reload();
        }


    });

    let tweetTextArea = document.querySelector("#tweetTextArea");
    tweetTextArea.addEventListener("input", function () {
        let tweetTextAreaValue = tweetTextArea.value;
        let tweetKnapp = document.querySelector(".aatweetknapp");
        if (tweetTextAreaValue.length > 0) {
            tweetKnapp.disabled = false;
        } else {
            if (tweetImagePreview.style.display == "block") {
                tweetKnapp.disabled = false;
            } else {
                tweetKnapp.disabled = true;
            }
        }
    });
}

