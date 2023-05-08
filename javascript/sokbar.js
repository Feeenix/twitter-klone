// lager eventlisteners på søkefeltet og søkeknappen
let sokknapp = document.querySelector("#sokknapp");
let sokfelt = document.querySelector("#sokfelt");

sokfelt.addEventListener("keyup", function (e) {
    if (e.key === 'Enter') {// når man er på søkefeltet og trykker enter så trykker den på søkeknappen
        sokknapp.click();
    }
});

sokknapp.addEventListener("click", function () { // når man trykker på søkeknappen, går den til en ny side med søkefeltet i urlen
    let sok = sokfelt.value;
    window.location.href = "sok.html?query=" + encodeURIComponent(sok);
});

let htmlfilnavn1 = window.location.pathname.split("/").pop();
if (htmlfilnavn1 == "sok.html") {
    sokfelt.value = hentURLSearchParams()["query"];
}