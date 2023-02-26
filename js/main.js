//user answers to questions
const answers = {
  2: null,
  3: null,
  4: null,
  5: null,
};

//buttons next and prev
const btnNext = document.querySelectorAll('[data-nav="next"]');
const btnPrev = document.querySelectorAll('[data-nav="prev"]');

// move forward
btnNext.forEach(function (e) {
  e.addEventListener("click", function () {
    const thisCard = this.closest("[data-card]");
    const thisCardNumber = parseInt(thisCard.dataset.card);
    if (thisCard.dataset.validate == "novalidate") {
      navigate("next", thisCard);
      updateProgressBar("next", thisCardNumber);
    } else {
      saveAnswers(thisCardNumber, gatherCardData(thisCardNumber));

      if (isFilled(thisCardNumber) && checkOnRequired(thisCardNumber)) {
        navigate("next", thisCard);
        updateProgressBar("next", thisCardNumber);
      } else {
        alert("Сделайте ответ, прежде чем продолжить");
      }
    }
  });
});

// move back
btnPrev.forEach(function (e) {
  e.addEventListener("click", function () {
    const thisCard = this.closest("[data-card]");
    const thisCardNumber = parseInt(thisCard.dataset.card);
    navigate("prev", thisCard);
    updateProgressBar("prev", thisCardNumber);
  });
});

//function navigation forward and back)
function navigate(direction, thisCard) {
  let thisCardNumber = parseInt(thisCard.dataset.card);
  let nextCard;
  let prevCard;
  if (direction == "next") {
    nextCard = thisCardNumber + 1;
    document
      .querySelector(`[data-card='${nextCard}']`)
      .classList.remove("hidden");
  } else if (direction == "prev") {
    prevCard = thisCardNumber - 1;
    document
      .querySelector(`[data-card='${prevCard}']`)
      .classList.remove("hidden");
  }

  thisCard.classList.add("hidden");
}

//function data collection from cards
function gatherCardData(number) {
  let question;
  let result = [];

  //find card by number
  let currentCard = document.querySelector(`[data-card="${number}"]`);

  //main question card
  question = currentCard.querySelector("[data-quastion]").innerText;

  // input values
  let inputValues = currentCard.querySelectorAll(
    '[type="text"], [type="email"], [type="number"]'
  );
  inputValues.forEach(function (item) {
    let itemValue = item.value;
    if (itemValue.trim() != "") {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  //checkbox values
  let checkBoxValues = currentCard.querySelectorAll('[type="checkbox"]');
  checkBoxValues.forEach((item) => {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  // radio buttons values
  let radioValues = currentCard.querySelectorAll('[type="radio"]');
  radioValues.forEach((item) => {
    if (item.checked) {
      result.push({
        name: item.name,
        value: item.value,
      });
    }
  });

  let data = {
    question: question,
    answer: result,
  };
  return data;
}

//function save answers in object
function saveAnswers(number, data) {
  answers[number] = data;
}

//function checking the user enter data or not
function isFilled(number) {
  if (answers[number].answer.length > 0) {
    return true;
  } else {
    return false;
  }
}

//email validity check
function validateEmail(email) {
  let pattern = /^[\w-\/]+@[\w-]+\.[a-z]{2,4}$/i;
  return pattern.test(email);
}

//function checking required checkbox and email
function checkOnRequired(number) {
  const currentCard = document.querySelector(`[data-card="${number}"]`);
  const requiredFills = currentCard.querySelectorAll("[required]");
  const isValidArray = [];
  requiredFills.forEach((item) => {
    if (item.type == "checkbox" && item.checked == false) {
      isValidArray.push(false);
    } else if (item.type == "email") {
      if (validateEmail(item.value)) {
        isValidArray.push(true);
      } else {
        isValidArray.push(false);
      }
    }
  });

  if (isValidArray.indexOf(false) == -1) {
    return true;
  } else {
    return false;
  }
}

//highligth frame on click radio

document.querySelectorAll(".radio-group").forEach((item) => {
  item.addEventListener("click", function (e) {
    label = e.target.closest("label");
    if (label) {
      label
        .closest(".radio-group")
        .querySelectorAll("label")
        .forEach((item) => {
          item.classList.remove("radio-block--active");
        });
      label.classList.add("radio-block--active");
    }
  });
});

//highligth frame on click checkbox

document
  .querySelectorAll('label.checkbox-block input[type="checkbox"]')
  .forEach((item) => {
    item.addEventListener("change", function () {
      if (item.checked) {
        item.closest("label").classList.add("checkbox-block--active");
      } else {
        item.closest("label").classList.remove("checkbox-block--active");
      }
    });
  });

//update progress bar

function updateProgressBar(direction, cardNumber) {
  let cardsTotalNumber = document.querySelectorAll("[data-card]").length;

  if (direction == "next") {
    cardNumber = cardNumber + 1;
  } else if (direction == "prev") {
    cardNumber = cardNumber - 1;
  }

  let progress = (cardNumber * 100) / cardsTotalNumber;
  progress = progress.toFixed();

  let progressBar = document
    .querySelector(`[data-card="${cardNumber}"]`)
    .querySelector(".progress");

  if (progressBar) {
    progressBar.querySelector(
      ".progress__label strong"
    ).innerText = `${progress}%`;
    progressBar.querySelector(
      ".progress__line-bar"
    ).style = `width: ${progress}%`;
  }
}
