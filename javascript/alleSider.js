
// gjør at når man går inn på profilen sin via menyen så vil den i tillegg fjerne historyen
let menyprofil = document.querySelector("#menyprofil");
menyprofil.href = "viewprofile.html?brukernavn=" + hentInnloggetBrukerId();
menyprofil.addEventListener("click", function (event) {
    event.preventDefault();
    clearHistory();
    window.location.href = "viewprofile.html?brukernavn=" + hentInnloggetBrukerId();
});
