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
    removeImage();


    let file = this.files[0];
    console.log(file)
    let datauRL = await readfile(file);
    let img = document.createElement("img");
    img.src = datauRL;

    let tweetImagePreview = document.querySelector(".tweetImagePreview")
    tweetImagePreview.appendChild(img);
    tweetImagePreview.style.display = "block";
});

if (htmlfilnavn == "lagtweet.html" || htmlfilnavn == "viewtweet.html") {
    let tweetKnapp = document.querySelector(".aatweetknapp");
    tweetKnapp.addEventListener("click", function () {
        let tweetTextArea = document.querySelector("#tweetTextArea");
        let tweetTextAreaValue = tweetTextArea.value;

        let tweetImagePreview = document.querySelector(".tweetImagePreview");
        let tweetImageURL = "";
        if (tweetImagePreview.style.display == "block" && tweetImagePreview.children.length > 0) {
            tweetImageURL = document.querySelector(".tweetImagePreview>img").src;
        }

        let tweetAuthor = hentInnloggetBrukerId();
        let path = []
        if (htmlfilnavn == "viewtweet.html") {
            let tweetIdParent = hentURLSearchParams()["tweetId"];
            let parentPath = hentTweet(tweetIdParent)["path"];
            parentPath.push(tweetIdParent);
            path = parentPath;
        }

        lagNyTweet(tweetAuthor, path, tweetImageURL, tweetTextAreaValue);

        tweetTextArea.value = "";
        removeImage();

        if (htmlfilnavn == "lagtweet.html") {
            window.location.href = "viewprofile.html?brukernavn=" + hentInnloggetBrukerId();
        } else {
            window.location.reload();
        }


    });
}