

let fjernQueryKnapp = document.querySelector("#fjernQueryKnapp");
fjernQueryKnapp.addEventListener("click", clearSearch);

function clearSearch() {
    let sokfeltEl = document.querySelector("#sokfelt");
    sokfeltEl.value = "";
    sokfeltEl.focus();
}

