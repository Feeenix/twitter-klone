// gjør at alle BARK knapper sender deg til lagtweet.html
let barkKnapper = document.querySelectorAll(".aatweetknapp");
for (let i = 0; i < barkKnapper.length; i++) {
    barkKnapper[i].addEventListener("click", function () {
        window.location.href = "lagtweet.html";

    });
}