async function readfile(File) {
    const reader = new FileReader();
    reader.readAsDataURL(File); // gjør om et fil-objekt til en base64 url string (data:image/png;base64,....)
    let loaded = await new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve(reader.result);
        }
    });
    return loaded;
}
async function loadFiles(filesArray) {
    let imageDataUrls = [];
    for (let i = 0; i < filesArray.length; i++) {
        let file = filesArray[i];
        let imageDataUrl = await readfile(file);
        imageDataUrls.push(imageDataUrl)
    }
    return imageDataUrls;
}