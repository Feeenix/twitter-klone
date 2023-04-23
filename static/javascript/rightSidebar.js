

let fjernQueryKnapp = document.querySelector("#fjernQueryKnapp");
fjernQueryKnapp.addEventListener("click", clearSearch);

function clearSearch() {
    let sokfeltEl = document.querySelector("#sokfelt");
    sokfeltEl.value = "";
    sokfeltEl.focus();
}

function followUser(formEl) {
    console.log(formEl);
    formEl.parentElement.parentElement.remove();
}

