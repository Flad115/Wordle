// Reference DOM elements and load event listeners after the page is loaded.
// You are implicitly doing that but that is just a side effect of the placement
// of the script at the bottom of the web page.  but you should explicit.
// See window.addEventListener("load", [some function])
window.addEventListener("load", hydratePage);

function hydratePage() {
  //retrieve the word of the day from the api
  var answer; //the word of the day
  var puzzle = ""; //this is for the word of the day api, each word as an attached puzzle number
  getWord(puzzle);

  //these constants are for the html elements that will be enabled/disabled throughout runtime
  var invalidBox = document.querySelector(".invalid");
  var endScreen = document.getElementById("endScreen");
  var beginText = document.querySelector(".beginText");
  var resetBtn = document.querySelector(".reset");
  var okayBtn = document.createElement("button");
  okayBtn.classList.add("okay");
  okayBtn.textContent = "Okay";

  //letters represents the users valid input.
  //backspace will also effect this
  //letters will be passed into makeGuess()
  var letters = "";

  //index tracks where in the letters string a valid key press will be stored
  //index is also effected by backspace so when new input is entered,
  //it will be properly stored into letters
  var index = 0;

  var guesses = 0;

  //The focus on the first letter box must be initialized.
  //Afterwards it will be updated in the addKey, back and guess functions.
  updateFocus();
  //this function is immediately called so the page starts with user input enabled
  createUserInputListener();

  //-------------------------------------------   *** Event listeners ***   ---------------------------------------
  if (resetBtn) resetBtn.addEventListener("click", onClickResetBtn);
  okayBtn.addEventListener("click", onClickOkayBtn);

  //the listener must be created in a function so it can be enabled and disabled when the alert box is enabled/disabled
  function createUserInputListener() {
    document.addEventListener("keydown", handleUserInput);
  }
  function removeUserInputListener() {
    document.removeEventListener("keydown", handleUserInput);
  }

  // -------------------------------   *** Event functions and references ***   -------------------------------------

  //create a function for handling user keyboard input
  //when a key press is made, it must be checked if it's a valid key using isLetter()
  //backspace and enter must also be checked for and handled appropriately
  //any keypress that is not a valid letter, backspace, or enter should be ignored
  function handleUserInput(event) {
    if (isLetter(event.key) && letters.length < 5) {
      if (!beginText.classList.contains("hidden")) {
        beginText.classList.add("hidden");
      }
      addKey(event.key);
    } else if (event.key === "Backspace") {
      handleBackSpace();
    } else if (event.key === "Enter") {
      if (letters.length >= 5) {
        validate(letters, makeGuess);
      } else {
        invalid("Must enter 5 letters!");
      }
    }
    updateFocus();
  }

  function onClickResetBtn() {
    //reset and okay button event listeners
    resetBtn.classList.add("hidden");
    if (resetBtn.textContent === "New Game") {
      getWord("?random=1"); //obtain a new word after a victory
    }
    resetGame();
  }

  //this function will re-enable user input by calling createUserInputListener()
  //then it will add the hidden class back to the invalid box, removing it
  function onClickOkayBtn() {
    createUserInputListener();
    invalidBox.classList.add("hidden");
  }

  //--------------------------------  *** game management functions ***   ----------------------------------
  function updateFocus() {
    if (letters.length < 5) {
      document.getElementById(`letter-${index}`).focus();
    }
  }
  updateFocus();

  //resetGame() re-initializes the game to it's starting state
  //this is needed for if the user wishes to reset the game after a loss
  function resetGame() {
    for (let i = 0; i < 30; i++) {
      document.getElementById(`letter-${i}`).textContent = "";
      document.getElementById(`letter-${i}`).style.backgroundColor = "white";
    }
    letters = "";
    index = 0;
    guesses = 0;
    createUserInputListener();
    endScreen.classList.add("hidden");
    if (endScreen.classList.contains("loss")) {
      endScreen.classList.remove("loss");
    } else {
      endScreen.classList.remove("victory");
    }
    updateFocus();
  }

  //this function checked the given parameter if it's a letter a-z
  //it ignored case sensitivity and returns true if valid
  function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  }

  //this function is what adds user input to display in the boxes
  function addKey(key) {
    document.getElementById(`letter-${index}`).textContent = key;
    //add key to letters for when the guess is made
    //And increase index for the 'letters' string
    letters += key;
    index++;
  }

  function handleBackSpace() {
    if (letters != "") {
      //remove the last key entered from the guess
      letters = letters.substring(0, letters.length - 1);
      //lower index remove the last key entered from the display
      index--;
      document.getElementById(`letter-${index}`).textContent = "";
    }
  }

  //check if the user typed in 5 letters and if the word is valid
  //increment how many valid guesses the user has made
  function makeGuess() {
    console.log("making guess");
    for (let i = 0; i < 5; i++) {
      checkLetter(i);
    }
    guesses++; //increment how many valid guesses the user has made
    if (letters.toLowerCase() === answer.toLowerCase()) {
      gameEnd(true); //word was correctly guessed, game end win
    } else if (guesses >= 6) {
      gameEnd(false);
    } else {
      letters = "";
    }
    updateFocus();
  }
  //this function checks if the letter at index i is in the word and in the right position
  //then changes the color of the letter box it's in to show the result
  function checkLetter(i) {
    var box = document.getElementById(`letter-${i + 5 * guesses}`);
    if (letters[i].toLowerCase() === answer[i].toLowerCase()) {
      box.style.backgroundColor = "green";
    } else if (answer.toLowerCase().includes(letters[i].toLowerCase())) {
      box.style.backgroundColor = "yellow";
    } else {
      box.style.backgroundColor = "red";
    }
  }

  // TO DO: ACTUALLY MAKE THE GAME END LOL
  function gameEnd(guessed) {
    removeUserInputListener();
    resetBtn.classList.remove("hidden");
    endScreen.classList.remove("hidden");
    if (guessed) {
      endScreen.textContent = "Congrats, You Win!!!";
      endScreen.classList.add("victory");
      resetBtn.textContent = "New Game";
    } else {
      endScreen.textContent = "Well you lost...You Suck";
      endScreen.classList.add("loss");
      resetBtn.textContent = "Reset Game";
    }
  }

  //async function for posting to an api that will validate any 5 letter input as a english word
  //it must take a callback function which references the make guess function
  //the callback function should only be called if the guess passed to validate() is valid
  async function validate(guess, callBack) {
    const response = await fetch("https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: guess }),
    });

    const resObj = await response.json();

    var valid = resObj.validWord;

    if (valid) {
      callBack();
    } else {
      invalid("Must enter a real word!");
    }
  }
  //Function invalid will take a string and make the textContent of the invalid box equal that string
  //it will also make the invalid box no longer hidden
  function invalid(message) {
    removeUserInputListener();
    invalidBox.classList.remove("hidden");
    invalidBox.textContent = message;
    invalidBox.appendChild(okayBtn);
  }

  //async function for making a fetch get request to an api that will return a 5 letter word
  async function getWord(puzzleNumber) {
    const promise = await fetch(
      `https://words.dev-apis.com/word-of-the-day${puzzleNumber}`
    );
    const processedPromise = await promise.json();
    // console.log("promise: ", promise);
    // console.log("processedPromise: ", processedPromise);
    answer = processedPromise.word;
    puzzle = processedPromise.puzzleNumber;
    console.log(`answer is ${answer}, puzzle number: ${puzzle}`);
  }
}
