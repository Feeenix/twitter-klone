async function readfile(File) {
    const reader = new FileReader();
    reader.readAsDataURL(File); // gjør om et fil-objekt til en base64 url string (data:image/png;base64,....)
    let loaded = await new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result);
        }
        reader.onerror = () => {
            reject(reader.error);
        }
    });
    return loaded;
}
async function readFiles(filesArray) { // tar inn et array med fil-objekter og returnerer et array med base64 url strings
    let imageDataUrls = [];
    for (let i = 0; i < filesArray.length; i++) {
        let file = filesArray[i];
        let imageDataUrl = await readfile(file);
        imageDataUrls.push(imageDataUrl)
    }
    return imageDataUrls;
}


// disse to funksjonene brukes for å omgjøre localStorage til en string, som vi kan dele med andre folk som så kan importere den til sin egen localStorage
function exportLocalStorage() { // exporterer localStorage til en string
    let data = JSON.stringify((localStorage));
    console.log(data.replace(/"/g, "\\\"")); // bruker regex til å erstatte alle " med \"
}
function importLocalStorage(jsonDataString) { // importerer localStorage fra en string
    // jsonDataString = ""
    localStorage.clear();
    let jsonData = JSON.parse(jsonDataString);
    for (let key in jsonData) {
        localStorage.setItem(key, jsonData[key]);
    }
}




function hentFraLocalStorage(key) { // returnerer et objekt fra localStorage
    if (localStorage.getItem(key) === null) {
        return {};
    }
    let data = localStorage.getItem(key);
    return JSON.parse(data);
}


function brukernavnErLedig(brukernavn) {
    let usernames = Object.keys(hentFraLocalStorage("users"));
    if (usernames.includes(brukernavn)) {
        return false;
    }
    return true;
}