let tweetUploadButton = document.querySelector("#tweetUploadButton");
let tweetUploadInput = document.querySelector("#tweetUploadInput");

tweetUploadButton.addEventListener("click", function () {
    tweetUploadInput.click();
});


let tweetImagePreview = document.querySelector(".tweetImagePreview");



function removeImage(){
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


