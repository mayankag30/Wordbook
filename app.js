let input = document.querySelector("#input");
let searchBtn = document.querySelector("#search");
let apiKey = "0c8732da-fa07-4dbc-97fe-242a9eb56090";
let notFound = document.querySelector(".not__found");
let defBox = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");
let suggestedBtn = document.querySelector(".suggested");

const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");
const clearButton = document.getElementById("clear");
const textInput = document.getElementById("text");
const speedInput = document.getElementById("speed");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // get the input data
  let word = input.value;

  searching(word);
});

// if (suggestedBtn) {
// suggestedBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   // console.log(e.target.innerText);

//   const word = e.target.innerText;

//   searching(word);
// });
// }

function searching(word) {
  // clear the old data
  audioBox.innerHTML = "";
  defBox.innerText = "";
  notFound.innerText = "";

  // Check if the word is entered
  if (word === "") {
    alert("Please Enter a word to be searched");
    return;
  }
  // Get the data from the api
  getData(word);
  input.value = "";
}

async function getData(word) {
  loading.style.display = "block";

  // Ajax call
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
  );

  const data = await response.json();
  // console.log(data);

  // Data is empty - Result is empty
  if (!data.length) {
    loading.style.display = "none";
    notFound.innerText = "No result found";
    return;
  }

  // Suggested words - Results is suggestion
  if (typeof data[0] === "string") {
    loading.style.display = "none";
    let heading = document.createElement("h3");
    heading.innerText = "Did you Mean?";
    notFound.appendChild(heading);

    data.forEach((ele) => {
      let suggestion = document.createElement("span");
      suggestion.classList.add("suggested");
      suggestion.innerText = ele;

      notFound.appendChild(suggestion);
    });
    return;
  }

  // Result Found
  loading.style.display = "none";
  let defination = data[0].shortdef[0];
  defBox.innerText = defination;

  // Add Sound
  const soundName = data[0].hwi.prs[0].sound.audio;

  // if sound exists
  if (soundName) {
    renderSound(soundName);
  }
}

function renderSound(soundName) {
  let subfolder = soundName.charAt(0);
  let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${apiKey}`;

  let aud = document.createElement("audio");
  aud.src = soundSrc;
  aud.controls = true;

  audioBox.appendChild(aud);
}

// Text to Speech
let currectCharacter;

playButton.addEventListener("click", () => {
  playText(textInput.value);
});

stopButton.addEventListener("click", stopText);

pauseButton.addEventListener("click", pauseText);

clearButton.addEventListener("click", () => {
  textInput.value = "";
});

speedInput.addEventListener("input", () => {
  stopText();
  playText(utterance.text.substring(currectCharacter));
});

const utterance = new SpeechSynthesisUtterance();

utterance.addEventListener("end", () => {
  textInput.disabled = false;
});

utterance.addEventListener("boundary", (e) => {
  currectCharacter = e.charIndex;
});

function playText(text) {
  if (speechSynthesis.paused && speechSynthesis.speaking) {
    return speechSynthesis.resume();
  }
  utterance.text = text;
  utterance.rate = speedInput.value || 1;
  textInput.disabled = true;
  speechSynthesis.speak(utterance);
}

function pauseText() {
  if (speechSynthesis.speaking) {
    speechSynthesis.pause();
  }
}

function stopText() {
  speechSynthesis.resume();
  speechSynthesis.cancel();
}
