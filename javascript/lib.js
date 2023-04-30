let ls = localStorage
let htmlfilnavn = window.location.pathname.split("/").pop();


async function readfile(File) {
    const reader = new FileReader();
    reader.readAsDataURL(File); // gjør om et fil-objekt til en base64 url string (data:image/png;base64,....)
    return await new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
    });
}

async function readFiles(filesArray) { // tar inn et array med fil-objekter og returnerer et array med base64 url strings. Brukes når man har mer enn en fil
    let imageDataUrls = [];
    for (let i = 0; i < filesArray.length; i++) {
        let file = filesArray[i];
        let imageDataUrl = await readfile(file);
        imageDataUrls.push(imageDataUrl)
    }
    return imageDataUrls;
}

// async function fileToDataURL(file) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => {
//             resolve(reader.result);
//         };
//         reader.onerror = reject;
//     });
// }


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// disse to funksjonene brukes for å omgjøre localStorage til en string, som vi kan dele med andre folk som så kan importere den til sin egen localStorage
function exportLocalStorage() { // exporterer localStorage til en string
    let data = JSON.stringify((localStorage));
    console.log(data.replace(/"/g, "\\\"")); // bruker regex til å erstatte alle " med \"
}
function importLocalStorage(jsonDataString = ' {\"loggedInUser\":\"{\\"brukernavn\\":\\"admin\\",\\"utlopstid\\":1682623180913}\",\"users\":\"{\\"admin\\":{\\"password\\":\\"admin\\",\\"joined\\":\\"2023-04-20\\",\\"bannerImage\\":\\"\\",\\"bannerColor\\":\\"#808080\\",\\"profileImage\\":\\"https://cdn.discordapp.com/attachments/1095708777027739668/1096797766228918313/IT_logo.png\\",\\"followers\\":[],\\"following\\":[\\"brukernavn\\"],\\"posts\\":[\\"jm71fzfo\\"],\\"displayName\\":\\"admin\\",\\"pinnedPost\\":null,\\"location\\":\\"\\",\\"bio\\":\\"\\",\\"status\\":\\"\\",\\"settings\\":{\\"darkMode\\":false,\\"background-color\\":\\"#ffffff\\",\\"text-color\\":\\"#000000\\",\\"font\\":\\"Inter\\",\\"font-size\\":\\"1em\\"}},\\"brukernavn\\":{\\"password\\":\\"passord\\",\\"joined\\":\\"2023-04-20\\",\\"bannerImage\\":\\"\\",\\"bannerColor\\":\\"#808080\\",\\"profileImage\\":\\"https://cdn.discordapp.com/attachments/1095708777027739668/1096797766228918313/IT_logo.png\\",\\"followers\\":[\\"admin\\"],\\"following\\":[],\\"posts\\":[],\\"displayName\\":\\"brukernavn\\",\\"pinnedPost\\":null,\\"location\\":\\"\\",\\"bio\\":\\"\\",\\"status\\":\\"\\",\\"settings\\":{\\"darkMode\\":false,\\"background-color\\":\\"#ffffff\\",\\"text-color\\":\\"#000000\\",\\"font\\":\\"Inter\\",\\"font-size\\":\\"1em\\"}}}\",\"tweets\":\"{\\"jm71fzfo\\":{\\"author\\":\\"admin\\",\\"path\\":[],\\"likes\\":[],\\"retweets\\":[],\\"comments\\":[],\\"views\\":0,\\"posted\\":1682018365824}}\"}') { // importerer localStorage fra en string
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
    // console.log(key,data);
    return JSON.parse(data);
}


// denne funksjonen brukes blant annet når vi lager en ny tweet, slik at den vet konteksten, fordi det må være på en ny side i følge oppgaven.
function hentURLSearchParams() { // returnerer en json-objekt med alle url parametrene
    let urlSearchParams = new URLSearchParams(window.location.search) // https://stackoverflow.com/a/901144, det ser ut som å bruke Proxy er 25% raskere, men dette er mer lesbart og forståelig
    return Object.fromEntries(urlSearchParams.entries());
}
// gjør det motsatte av hentURLSearchParams. for eksempel paramifyLink("index.html", {"brukernavn": "admin"}) returnerer "index.html?brukernavn=admin"
function paramifyLink(url, json) {
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

function hentTweet(tweetId) { // returnerer et tweet-objekt fra localStorage
    let tweets = hentFraLocalStorage("tweets");
    if (tweets[tweetId] === undefined) { // hvis tweeten ikke finnes, returner et tomt objekt
        return {};
    }
    return tweets[tweetId];
}


function settInnloggetBruker(brukernavn) { // setter innlogget bruker i localStorage
    localStorage.setItem("loggedInUser", JSON.stringify({ "brukernavn": brukernavn, "utlopstid": Date.now() + 1000 * 60 * 60 * 24 * 7 })); // utløpsdato er 7 dager fra nå
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
    let pointer = locationData // kopierer minneadressen til locationData til pointer, slik at endringer gjort på pointer også endrer locationData
    while (keys.length > 1) {
        pointer = pointer[keys.shift()] // endrer pointer til å peke på neste key i locationPath, fjerner den første keyen fra locationPath. og beholder minne adressen til locationData
    }
    pointer[keys.shift()] = data

    // console.log(locationData)

    // lagrer dataen til localStorage
    // console.log("mainPath: " + mainPath, "locationData: " + JSON.stringify(locationData))
    localStorage.setItem(mainPath, JSON.stringify(locationData));
}

function genererId() { // genererer en tilfeldig id
    return Math.random().toString(36).slice(2, 10);
}




function lagNyBruker(brukernavn, passord) { //initialiserer en ny bruker med bare de nødvendige feltene
    let bruker = {
        password: passord,
        joined: new Date().toISOString().split("T")[0], // https://stackoverflow.com/a/29774197 

        bannerImage: "",
        bannerColor: "#808080",
        profileImage: "https://cdn.discordapp.com/attachments/1095708777027739668/1099642253909172305/default_profilbilde.png",
        followers: [],
        following: [],
        posts: [],
        displayName: brukernavn,
        pinnedPost: null,
        location: "",
        bio: "",
        status: "",
        settings: {
            theme: "dark", // dark light custom
            "background-color": "#ffffff",
            "text-color": "#000000",
            "font": "Inter",
            "font-size": "16px",
        }
    }
    lagreData(["users", brukernavn], bruker);
}

function lagTilfeldigeBrukere(antall) {
    for (let i = 0; i < antall; i++) {
        let brukernavn = genererId();
        let passord = "passord";
        lagNyBruker(brukernavn, passord);

    }
}

function listeBrukereQuery(query) {
    let users = hentFraLocalStorage("users")
    let usernames = Object.keys(users);
    let output = [];
    
    for (let i = 0; i < usernames.length; i++) {

        const re = new RegExp(query, "i")
        if (usernames[i].match(re) || users[usernames[i]]["displayName"].match(re) || users[usernames[i]]["bio"].match(re) || users[usernames[i]]["location"].match(re)) {
            output.push([
                usernames[i],
                users[usernames[i]]["displayName"],
                users[usernames[i]]["profileImage"]
            ]);
        }
        // if (output.length >= 15) {
        //     break;
        // }
        
    }
    console.log(output)
    return output;
}

function listeBrukereSomIkkeErFolgt(brukernavn, antall = 4) { // returnerer en array med brukernavn som ikke er følgt av brukernavn
    let bruker = hentBruker(brukernavn);
    let following = bruker["following"];
    let users = hentFraLocalStorage("users")
    let usernames = Object.keys(users);
    let ikkeFolgt = [];
    for (let i = 0; i < usernames.length; i++) {
        if (!following.includes(usernames[i]) && usernames[i] !== brukernavn) {
            ikkeFolgt.push(usernames[i]);
        }
    }
    let output = [];
    let looplengde = Math.min(antall, ikkeFolgt.length)
    for (let i = 0; i < looplengde; i++) {
        let randomIndex = Math.floor(Math.random() * ikkeFolgt.length);
        let randomUsername = ikkeFolgt.splice(randomIndex, 1)[0]
        output.push([
            randomUsername,
            users[randomUsername]["displayName"],
            users[randomUsername]["profileImage"]
        ]);
    }
    return output;
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


function leggTilDataPaaBruker(brukernavn, data) { // data er en json.
    let bruker = hentBruker(brukernavn);
    for (let key in data) {
        bruker[key] = data[key];
    }
    lagreData(["users", brukernavn], bruker);
}


function leggTilDataPaaTweet(postId, data) { // data er en json.
    let tweet = hentFraLocalStorage("tweets", postId);
    for (let key in data) {
        tweet[key] = data[key];
    }
    lagreData(["tweets", postId], tweet);
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

function folgerBruker(brukerSomFolger, brukerSomBlirFolgt) {
    let bruker1 = hentBruker(brukerSomFolger);
    let bruker2 = hentBruker(brukerSomBlirFolgt);
    return bruker1["following"].includes(brukerSomBlirFolgt) && bruker2["followers"].includes(brukerSomFolger);
}

function followBruker(brukerSomFolger, brukerSomBlirFolgt) {
    let bruker1 = hentBruker(brukerSomFolger);
    let bruker2 = hentBruker(brukerSomBlirFolgt);
    bruker1["following"].push(brukerSomBlirFolgt);
    bruker2["followers"].push(brukerSomFolger);
    lagreData(["users", brukerSomFolger], bruker1);
    lagreData(["users", brukerSomBlirFolgt], bruker2);
}

function unfollowBruker(brukerSomFolger, brukerSomBlirFolgt) {
    let bruker1 = hentBruker(brukerSomFolger);
    let bruker2 = hentBruker(brukerSomBlirFolgt);
    bruker1["following"].splice(bruker1["following"].indexOf(brukerSomBlirFolgt), 1);
    bruker2["followers"].splice(bruker2["followers"].indexOf(brukerSomFolger), 1);
    lagreData(["users", brukerSomFolger], bruker1);
    lagreData(["users", brukerSomBlirFolgt], bruker2);
}

/*
eksempel på bruker-objekt:
"elonmusk": {
    password: "passord123",
    joined: "2020-12-12",

    bannerImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYA...", // default er null
    bannerColor: "#808080",
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
            
    },
    likedPosts: ["postId1", "postId2", "postId3"], // id-er til tweets som brukeren har likt
    retweetedPosts: ["postId1", "postId2", "postId3"], // id-er til tweets som brukeren har retweetet
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



