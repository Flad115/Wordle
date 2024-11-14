<h1 align="center"><a href="https://flad115.github.io/Wordle/">Wordle By Dylan</a></h1>

(Click text above to play)

## This learning project is a recreation of the game wordle developed Josh Wardle.

You have 6 guesses to figure out a random 5 letter word (ENGLISH ONLY). Input answers by typing and submit a guess by pressing enter (WILL NOT WORK ON MOBILE). There is no case sensitivity

> The letterboxes will become colored when a guess is submitted:

- Red indicated that that letter is not in the answer
- Yellow indicated that the letter is in the answer, but not in the place that it is in when the guess was made
- Green indicated the letter is correct in in the right spot

#### Note:

> If the answer is something like, "great", and if you make the guess "peeks", BOTH letter "e" will light up. The first will be yellow and the second will be green. It may seem like the answer contains 2 letter "e", but it does not. The color indication only shows wether or not the letter is contained in the word, NOT how many.

## Technology Used

### APIs

It uses two separate APIs, one to GET the word answers and the other to POST the users guess to check if it's a valid word.

- https://words.dev-apis.com/word-of-the-day
- https://words.dev-apis.com/validate-word

The API that is POSTed to and the method/body needed. A header is not included because for this API it's not necessary.

```
validate(letters, makeGuess);

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
```

#### API Notes

This function also performs a callback. The information (var valid) this function gives couldn't be used with a return because it is asynchronous, meaning it is executed at a different time that it may appear in the code. Valid cannot be defined until the POST is completed JS has already moved on the the next task. To fix this problem, the function that would use this information is passed to the async function as an argument and later called within the function body.

### Focus

Focus() is used to highlight and bring attention to the letter boxes as the user enters their input.

```
function updateFocus() {
  console.log(letters.length);
  if (letters.length < 5)
    document.getElementById(`letter-${index}`).focus({ focusVisible: true });
}
```

> document.getElementById(`letter-${index}`).focus({ focusVisible: true });

#### Focus Notes

All the letter boxes are created using the div tag. By default, a div cannot be focused. To remedy this tabindex="-1" was added to each one.

```
  <div class="letterBox" id="letter-0" tabindex="-1"></div>
  <div class="letterBox" id="letter-1" tabindex="-1"></div>
  <div class="letterBox" id="letter-2" tabindex="-1"></div>
  ......
```

The negative value given to each tabindex makes the div focusable, but not by tabbing.
