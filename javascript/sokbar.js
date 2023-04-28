let sokknapp = document.querySelector("#sokknapp");
let sokfelt = document.querySelector("#sokfelt");

sokfelt.addEventListener("keyup", function (e) {
    if (e.key === 'Enter') {
        sokknapp.click();
    }
});

sokknapp.addEventListener("click", function () {
    let sok = sokfelt.value;
    window.location.href = "sok.html?query=" + encodeURIComponent(sok);
});

let htmlfilnavn1 = window.location.pathname.split("/").pop();
if (htmlfilnavn1 == "sok.html") {
    sokfelt.value = hentURLSearchParams()["query"];
}