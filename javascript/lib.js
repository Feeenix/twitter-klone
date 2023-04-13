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
    // jsonDataString = '{\"users\":\"{\\"undefined\\":{\\"admin\\":{\\"password\\":\\"passord123\\",\\"joined\\":\\"2023-04-13\\",\\"bannerImage\\":null,\\"profileImage\\":null,\\"followers\\":[],\\"following\\":[],\\"posts\\":[],\\"displayName\\":\\"admin\\",\\"pinnedPost\\":null,\\"location\\":null,\\"bio\\":null,\\"status\\":null,\\"settings\\":{\\"darkMode\\":false,\\"background-color\\":\\"#ffffff\\",\\"text-color\\":\\"#000000\\",\\"font\\":\\"Inter\\",\\"font-size\\":\\"1em\\"}}}}\",\"tweets\":\"{\\"uucg96qh\\":{\\"author\\":\\"admin\\",\\"path\\":[],\\"bilder\\":[],\\"text\\":\\"hallo dette er den første tweeten!\\",\\"likes\\":[],\\"retweets\\":[],\\"comments\\":[],\\"views\\":0,\\"posted\\":1681420842384}}\"}'
    localStorage.clear();
    let jsonData = JSON.parse(jsonDataString);
    for (let key in jsonData) {
        localStorage.setItem(key, jsonData[key]);
    }
}


function hentFraLocalStorage(key) { // returnerer et objekt fra localStorage
    if (localStorage.getItem(key) === null) { // hvis det ikke finnes noe objekt med key i localStorage, returner et tomt objekt
        return {};
    }
    let data = localStorage.getItem(key);
    return JSON.parse(data);
}


// denne funksjonen brukes blant annet når vi lager en ny tweet, slik at den vet konteksten, fordi det må være på en ny side i følge oppgaven.
function hentURLSearchParams() { // returnerer en json-objekt med alle url parametrene
    let urlSearchParams = new URLSearchParams(window.location.search) // https://stackoverflow.com/a/901144, det ser ut som å bruke Proxy er 25% raskere, men dette er mer lesbart og forståelig
    return Object.fromEntries(urlSearchParams.entries());
}
// gjør det motsatte av hentURLSearchParams. for eksempel paramifyLink("index.html", {"brukernavn": "admin"}) returnerer "index.html?brukernavn=admin"
function paramifyLink(url,json){
    let urlSearchParams = new URLSearchParams(json);
    return url + "?" + urlSearchParams.toString();
}



function brukernavnFinnes(brukernavn) { // sjekker om et brukernavn finnes ved å lete gjennom eksisterende brukere i localStorage
    let usernames = Object.keys(hentFraLocalStorage("users")); // lager en array med alle brukernavnene
    if (usernames.includes(brukernavn)) {
        return true;
    }
    return false;
}
function testBrukernavnOgPassord(brukernavn, passord) {
    if (!brukernavnFinnes(brukernavn)) {
        return false;
    }
    let bruker = hentBruker(brukernavn); // bruker er json objekt
    if (bruker["password"] === passord) {
        return true;
    }
}


function hentBruker(brukernavn) { // returnerer et bruker-objekt fra localStorage
    let users = hentFraLocalStorage("users");
    if (users[brukernavn] === undefined) { // hvis brukeren ikke finnes, returner et tomt objekt
        return {};
    }
    return users[brukernavn];
}



function settInnloggetBruker(brukernavn) { // setter innlogget bruker i localStorage
    localStorage.setItem("loggedInUser", JSON.stringify({ "brukernavn": brukernavn, "utløpsdato": Date.now() + 1000 * 60 * 60 * 24 })); // utløpsdato er 24 timer fra nå
}
function hentInnloggetBrukerId() { // returnerer brukernavnet til den innlogget brukeren
    return JSON.parse(localStorage.getItem("loggedInUser"))["brukernavn"];
}
function loggUtBruker() { // logger ut brukeren og redirecter til index.html
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}


function lagreData(locationPath, data) {// for eksempel lagreData(["users", "elonmusk"] , bruker-objekt). 
    // Funksjonen lagrer data til en lokasjon i localStorage, locationPath er en array med keys til lokasjonen
    let mainPath = locationPath.shift(); // henter ut første key i locationPath, for å hente ut dataen fra localStorage
    let locationData = hentFraLocalStorage(mainPath);
    let keys = locationPath; // locationPath inneholder nå bare keys til lokasjonen, uten den første keyen

    // hentet fra https://stackoverflow.com/a/71720800
    let pointer = locationData // kopierer minne adressen til locationData til pointer, slik at endringer gjort på pointer også endrer locationData
    while (keys.length > 1)
        pointer = pointer[keys.shift()] // endrer pointer til å peke på neste key i locationPath, fjerner den første keyen fra locationPath. og beholder minne adressen til locationData
    pointer[keys.shift()] = data

    // console.log(locationData)

    // lagrer dataen til localStorage
    localStorage.setItem(mainPath, JSON.stringify(locationData));
}

function genererId() { // genererer en tilfeldig id
    return Math.random().toString(36).slice(2, 10);
}

function lagNyBruker(brukernavn, passord) { //initialiserer en ny bruker med bare de nødvendige feltene
    let users = hentFraLocalStorage("users");
    users[brukernavn] = {
        password: passord,
        joined: new Date().toISOString().split("T")[0], // https://stackoverflow.com/a/29774197 

        bannerImage: null,
        profileImage: null,
        followers: [],
        following: [],
        posts: [],
        displayName: brukernavn,
        pinnedPost: null,
        location: null,
        bio: null,
        status: null,
        settings: {
            darkMode: false,
            "background-color": "#ffffff",
            "text-color": "#000000",
            "font": "Inter",
            "font-size": "1em"
        }
    }
    lagreData(["users"], users);
}

function lagNyTweet(brukernavn, path, bilder, text) {
    let id = genererId();
    let tweet = {
        "author": brukernavn,
        "path": path,
        "bilder": bilder,
        "text": text,
        "likes": [],
        "retweets": [],
        "comments": [],
        "views": 0,
        "posted": Date.now()
    }
    lagreData(["tweets", id], tweet);
    // legg til tweet i bruker sin liste over tweets
    let bruker = hentBruker(brukernavn);
    bruker["posts"].push(id);
    lagreData(["users", brukernavn], bruker);
}

function lagNyRetweet(postId, brukernavn) {
    let id = genererId();
    let retweet = {
        "author": brukernavn,
        "tweetId": postId,
        "posted": Date.now()
    }
    lagreData(["tweets", id], retweet);
    // legg til retweet i postId sine retweets
    let tweet = hentFraLocalStorage("tweets", postId);
    tweet["retweets"].push(id);
    lagreData(["tweets", postId], tweet);

}

/*
eksempel på bruker-objekt:
"elonmusk": {
    password: "passord123",
    joined: "2020-12-12",

    bannerImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYA...", // default er null
    profileImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYA...", // default er null
    followers: ["billgates", "jeffbezos"],
    following: ["billgates", "jeffbezos"],
    posts: ["postId1", "postId2", "postId3"],
    displayName: "Elon Musk", // default er brukerId
    pinnedPost: "postId1", // default er null
    location: "", // default er null
    bio: "I am the CEO of SpaceX and Tesla, and founder of Neuralink and OpenAI. I also advise on AI policy and invest in AI startups.", // default er null
    status: "currently doing nothing", // default er null
    settings: {
        darkMode: false,
        background-color: "#ffffff", // default er #ffffff, 
        text-color: "#000000", // default er #000000
        font: "Inter",
        font-size: "1em", // 1em = 16px
            
    }
}
*/

/*
eksempel på tweet-objekt:
"postId1": {
    path: ["postId1", "postId2", "postId3"], // path er en array med id-er til alle tweets som er i samme tråd, brukes for kommentarer på en strukturert måte
    text: "Hello world!",
    images: ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYA...", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYA..."],
    author: "elonmusk", // brukerid
    posted: "1618123456789", // timestamp
    likes: ["billgates", "jeffbezos"],
    retweets: ["billgates", "jeffbezos"],
    comments: ["postId2", "postId3"] // id-er til kommentarer
    views: 1000,
}
*/

/*
eksempel på retweet-objekt:
"postId4": {
    "tweetId": "postId1", // id til tweeten som er retweetet
    author: "billgates", // brukerid
    posted: "1618123456789", // timestamp
}
*/

