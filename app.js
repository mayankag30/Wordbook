let input = document.querySelector("#input");
let searchBtn = document.querySelector("#search");
let apiKey = "0c8732da-fa07-4dbc-97fe-242a9eb56090";
let notFound = document.querySelector(".not__found");
let defBox = document.querySelector(".def");
let audioBox = document.querySelector(".audio");
let loading = document.querySelector(".loading");

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // clear the old data
  audioBox.innerHTML = "";
  defBox.innerText = "";
  notFound.innerText = "";

  // get the input data
  let word = input.value;

  // Check if the word is entered
  if (word === "") {
    alert("Please Enter a word to be searched");
    return;
  }
  // Get the data from the api
  getData(word);
  input.value = "";
});

async function getData(word) {
  loading.style.display = "block";

  // Ajax call
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`
  );

  const data = await response.json();
  console.log(data);

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
