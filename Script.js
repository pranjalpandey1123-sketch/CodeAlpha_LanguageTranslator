const source = document.getElementById("source");
const target = document.getElementById("target");

const inputText = document.getElementById("inputText");
const result = document.getElementById("result");
const status = document.getElementById("status");

const translateBtn = document.getElementById("translateBtn");
const swapBtn = document.getElementById("swapBtn");
const copyBtn = document.getElementById("copyBtn");

// TRANSLATION FUNCTION

async function translateText() {

    const text = inputText.value.trim();

    if (!text) {
        status.innerText = "Please enter some text!";
        return;
    }

    if (source.value === target.value) {
        status.innerText = "Select different languages!";
        return;
    }

    translateBtn.disabled = true;
    translateBtn.innerText = "Translating...";
    status.innerText = "Please wait...";
    result.innerText = "";

    try {

        const url =
            "https://translate.googleapis.com/translate_a/single" +
            "?client=gtx&sl=" + source.value +
            "&tl=" + target.value +
            "&dt=t&q=" + encodeURIComponent(text);

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Translation service unavailable");
        }

        const data = await response.json();

        const translatedText = data[0]
            .map(item => item[0] || "")
            .join("");

        if (!translatedText) {
            throw new Error("Translation not found");
        }

        result.innerText = translatedText;
        status.innerText = "Translation completed!";

    } catch (error) {

        result.innerText = "Unable to translate. Please try again.";
        status.innerText = error.message;

    } finally {

        translateBtn.disabled = false;
        translateBtn.innerText = "Translate Now";

    }
}

// SWAP LANGUAGES

function swapLanguages() {

    const temp = source.value;

    source.value = target.value;
    target.value = temp;

    const oldText = inputText.value;

    if (result.innerText !== "Your translation will appear here...") {
        inputText.value = result.innerText;
        result.innerText = oldText || "Your translation will appear here...";
    }

    status.innerText = "Languages swapped!";

}

// COPY TRANSLATION

async function copyText() {

    const text = result.innerText;

    if (!text || text === "Your translation will appear here...") {
        status.innerText = "Nothing to copy!";
        return;
    }

    try {

        await navigator.clipboard.writeText(text);
        status.innerText = "Copied successfully!";

    } catch (error) {

        status.innerText = "Copy unavailable. Copy manually.";

    }

}

// BUTTON EVENTS

translateBtn.addEventListener("click", translateText);
swapBtn.addEventListener("click", swapLanguages);
copyBtn.addEventListener("click", copyText);
