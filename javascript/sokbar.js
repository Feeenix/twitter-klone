let sokknapp = document.querySelector("#sokknapp");
let sokfelt = document.querySelector("#sokfelt");

sokknapp.addEventListener("click", function () {
    let sok = sokfelt.value;
    window.location.href = "sok.html?query=" + sok;
});