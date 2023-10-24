import { APP_TITLE } from './consts.js';

// html elementen ophalen
const selectDifficulty = document.getElementById("difficulty");
const selectCategorie = document.getElementById("category");
const chooseLimit = document.getElementById("limit");

const settingsDiv = document.getElementById("settings");
const settingsConfirm = document.getElementById("settingsBtn");

const questionCard = document.getElementById("cards");
const questionDiv = document.getElementById("question");
const answersDiv = document.getElementById("answers");
const results = document.getElementById('results');
const resultsAnswersDiv = document.getElementById('resultsAnswer');
const preResultsDiv = document.getElementById("preResults");

const tracker = document.getElementById("tracker");

const nexBtn = document.getElementById("next");
const quitBtn = document.getElementsByClassName("quit");
const preResultsBtn = document.getElementById("preResultsBtn");

const timerTimed = document.getElementById("timerTimed");
const timerTime = document.getElementById("time");

// interval variablen maken
let maxTimeInteval;
let timeSeconds;
let filler;

// arrays
let dataArray = [];
let userAnswer = [];
let userAnswerNumber = [];

// counters
let questionCounter = 0;

// timer
let time = {
  timer: 30,
  intervalTime: 30100
};
let timeUsed;
let usedTime = 0;

// previous results
let previousResults = [];

// fetch function
const getQuestions = async (cat, dif, lim) => {
    const settings = `https://quizapi.io/api/v1/questions?apiKey=7PlWKuJIGUw0FYu6TPvUcnAqI837FPj9DIgbKckj&category=${cat}&difficulty=${dif}&limit=${lim}`;
    const response = await fetch(`${settings}`);
    // if (!response.ok) throw new Error('The given response is not ok');

    return await response.json();
}

const countTime = () => {
  usedTime = 0;

  timeUsed = setInterval(() => {
    usedTime++;
  }, 1000)
}
settingsConfirm.addEventListener("click", () => {
    questionCounter = 0;
    // console.log(dataArray);
    // localStorage.clear();

    const categorie = selectCategorie.value;
    const difficulty = selectDifficulty.value;
    const limit = chooseLimit.value;
  
    getQuestions(categorie, difficulty, limit)
      .then(questionData => {
        for (let i = 0; i < questionData.length; i++) {
          dataArray.push(questionData[i]);
          // console.log(questionData[i].correct_answers);
        }
        // console.log(questionData);
        
        storeQuestions(questionData);
        createQuestions(questionData);
      })
  
    const storeQuestions = (questions) => {
      let keyValue = 0;
      questions.forEach(question => {
        let questions = question.question;

        // console.log(questions);
        localStorage.setItem(keyValue, questions); 

        keyValue++;
      });
    }
    countTime();
})

// next question button
nexBtn.addEventListener('click', () => {
  const answBtn = document.getElementsByClassName("answer");
  // console.log(answBtn);

  checkForAnsweredAnswer(answBtn);
  createQuestions(dataArray);
})

// quit button
const quit = () => {
  userAnswer = [];
  userAnswerNumber = [];
  resultsAnswersDiv.innerHTML = "";
  settingsDiv.classList.remove("hide");
  questionCard.classList.add("hide");
  questionCard.classList.add("hide");
  results.classList.add("hide");
  preResultsDiv.classList.add("hide");
}

const checkForAnsweredAnswer = (htmlcollection) => {
  let checkIfNotClicked = true;
  let arrayFalse = [false];
  let arrayNiks = ["niks"]
  // console.log(htmlcollection);
  let userAnswersObject = []; 
  let userAnswerNumberObject = [];

  for (let y = 0; y < htmlcollection.length; y++) {
    if (htmlcollection[y].classList.contains("answerClicked")) {
      if (htmlcollection[y].value === "false") {
        userAnswersObject.push(false);
        userAnswerNumberObject.push(y);
      } else {
        userAnswersObject.push(true);
        userAnswerNumberObject.push(y);
      }
      checkIfNotClicked = false;
    }
  }

  // console.log(checkIfNotClicked);
  if (!checkIfNotClicked) {
    userAnswer.push(userAnswersObject);
    userAnswerNumber.push(userAnswerNumberObject);
  }
  if (checkIfNotClicked) {
    // console.log('er is niks geantwoord');
    userAnswer.push(arrayFalse);
    userAnswerNumber.push(arrayNiks);
  }
}

const timer = (antwoorden) => {
  let scale = 0;
  time.timer = 30;
  // timerTimed.style.transform = `scaleX(0)`
  // console.log(antwoorden);

  timeSeconds = setInterval(() => {
    time.timer--;
    timerTime.innerHTML = time.timer;
    if (time.timer === 0) {
      checkForAnsweredAnswer(antwoorden);
    }
  }, 1000)

  filler = setInterval(() => {
    scale += .00175;
    timerTimed.style.transform = `scaleX(${scale})`;
  }, 50)
}

// quit btn eventlistener
for (let i = 0; i < quitBtn.length; i++) {
  quitBtn[i].addEventListener('click', () => {
    // console.log("test");
    quit();
    clearInterval(maxTimeInteval);
    clearInterval(filler);
    dataArray = [];
    antwoorden = [];
  })
}

const toggleSettings = () => {
  settingsDiv.classList.toggle("hide");
}

const displayQuestion = () => {
  questionCard.classList.remove("hide");
  questionCard.classList.remove("hide");
}

const createQuestions = (data) => {
  const limit = chooseLimit.value;
  let counter = questionCounter + 1;

  clearInterval(maxTimeInteval);

  maxTimeInteval = setInterval(() => {


    createQuestions(dataArray);
  }, time.intervalTime);
  
  displayQuestion();
  toggleSettings();

  clearInterval(timeSeconds);
  clearInterval(filler);

  tracker.innerText = `${counter} / ${limit}`;

  timerTime.innerText = 30;

  questionCounter.innerText = "";
  answersDiv.innerText = "";
  questionDiv.innerText = "";

  if (!settingsDiv.classList.contains("hide")) {
    settingsDiv.classList.add("hide");
    
    
  }
  if (questionCard.classList.contains("hide")) {
    questionCard.classList.remove("hide");
    questionCard.classList.remove("hide");
  }
  // console.log(localStorage.getItem(1));
  if (counter <= limit) {
    const multipleAnswers = data[[questionCounter]].multiple_correct_answers;
    const answer = data[questionCounter].answers;
    const correctAnswer = data[questionCounter].correct_answers;

    let answerOption;
    let answerCount = 0;

    questionDiv.innerHTML = localStorage.getItem(questionCounter);

    if (multipleAnswers === "false") {
      for (const property in answer) {
        questionDiv.classList.remove('multipleChoiceQuestion')
        if (answer[property] === null) {
            continue;
        } else {
          answerOption = document.createElement("button");
          // console.log(correctAnswer);
          // console.log(Object.values(correctAnswer)[answerCount]);
          answerOption.setAttribute('value', Object.values(correctAnswer)[answerCount])
          answerOption.setAttribute("class", "answer");
          answerOption.innerText = answer[property];
          answersDiv.appendChild(answerOption);
        }
        answerCount++;
      }
      clickedAnswerOneAnswer();
      questionCounter++;
      timer(document.getElementsByClassName("answer"));
    } 
    else if (multipleAnswers === "true") {
      questionDiv.classList.add('multipleChoiceQuestion')
      for (const property in answer) {
        
        if (answer[property] === null) {
            continue;
        } else {
          answerOption = document.createElement("button");
          // console.log(correctAnswer);
          // console.log(Object.values(correctAnswer)[answerCount]);
          answerOption.setAttribute('value', Object.values(correctAnswer)[answerCount])
          answerOption.setAttribute("class", "answer");
          answerOption.classList.add("multiple")
          answerOption.innerText = answer[property];
          answersDiv.appendChild(answerOption);
        }
        answerCount++;
        
      }
      clickedAnswerMultipleAnswer();
      questionCounter++;
      timer(document.getElementsByClassName("answer"));
    }
  } else if (counter > limit) {
    // console.log("test finished");
    goToResult(dataArray);
    clearInterval(timeUsed);
  }
}

const clickedAnswerOneAnswer = async () => {
  if (await questionCard.hasChildNodes) {
    const clickeble = document.getElementsByClassName("answer");
    // console.log("created")

    for (let i = 0; i < clickeble.length; i++) {
      clickeble[i].addEventListener("click", () => {
        for (let i = 0; i < clickeble.length; i++) {
          clickeble[i].classList.remove("answerClicked");
          clickeble[i].style.background = "#012E40";
        }
        clickeble[i].classList.add("answerClicked");
        clickeble[i].style.background = "#026773";
      })
    }
  }
}
const clickedAnswerMultipleAnswer = async () => {
  if (await questionCard.hasChildNodes) {
    const clickeble = document.getElementsByClassName("answer");
    // console.log("created")

    for (let i = 0; i < clickeble.length; i++) {
      clickeble[i].addEventListener("click", () => {
        clickeble[i].classList.add("answerClicked");
        clickeble[i].style.background = "#026773";
      })
    }
  }
}

let thisResult = [];
const goToResult = (data) => {
  thisResult = [];

  const todayDate = new Date();
  const date = todayDate.getFullYear()+'-'+(todayDate.getMonth()+1)+'-'+todayDate.getDate();

  const todayTime = new Date();
  const time = todayTime.getHours() + ":" + todayTime.getMinutes() + ":" + todayTime.getSeconds();

  thisResult.push(date + " " + time);
  thisResult.push(selectDifficulty.value);
  thisResult.push(selectCategorie.value);
  thisResult.push(chooseLimit.value)
  let qCount = 0;
  questionCounter = 0;
  procentBar();
  showUsedTime();
  // console.log(userAnswer);
  // console.log(userAnswerNumber);

  // stop the counters
  clearInterval(maxTimeInteval);
  clearInterval(filler);
  clearInterval(timeSeconds);

  

  // hide / show
  results.classList.remove("hide");
  questionCard.classList.add('hide');

  const limit = chooseLimit.value;

  for (let i = 0; i < limit; i++) {
    const newDiv = document.createElement('div');
    newDiv.setAttribute('class', "resultCard");

    const newP = document.createElement('p');
    newP.innerHTML = localStorage.getItem(i);
    newDiv.appendChild(newP);
    
    const answer = data[questionCounter].answers;
    const correctAnswer = data[questionCounter].correct_answers;
    let answerCount = 0;
    for (const property in answer) {
      
      if (answer[property] === null) {
          continue;
      } else {
        const answerOption = document.createElement("button");
        // console.log(correctAnswer);
        // console.log(Object.values(correctAnswer)[answerCount]);
        answerOption.setAttribute('value', Object.values(correctAnswer)[answerCount])
        for (let i = 0; i < userAnswerNumber.length; qCount++) {
          for (let y = 0; y < userAnswerNumber.length; y++) {
            if (userAnswerNumber[qCount][0] === "niks"){
              if (Object.values(correctAnswer)[answerCount] === "true") {
                // console.log("er is niks geantwoord");
                newP.setAttribute("class", "notAnswered");
                answerOption.style.borderColor = "orange";
              } 
            } else if (userAnswerNumber[qCount][y] === answerCount) {
              // console.log("we zitten aan de geantwoorde vraag");
              if (Object.values(correctAnswer)[answerCount] === "true") {
                // console.log("we zitten aan de geantwoorde vraag die juist was");
                answerOption.style.borderColor = "green";
              } else {
                // console.log("we zitten aan de geantwoorde vraag die fout was");
                answerOption.style.borderColor = "red";
              }
            } else if (Object.values(correctAnswer)[answerCount] === "true") {
              answerOption.style.borderColor = "green";
            }    
          }
          break;
        }
        
        answerOption.setAttribute("class", "answerResult");
        answerOption.innerText = answer[property];

        newDiv.appendChild(answerOption);
      }
      answerCount++;
    }
    qCount++;
    questionCounter++;
    resultsAnswersDiv.appendChild(newDiv);
  }

  let resultsStorage;
  let PreRusultsStorage;

  if (localStorage.getItem("preResults") === null) {
    localStorage.setItem("preResults", "null");
  } 

  if (localStorage.getItem("preResults") != "null") {
    PreRusultsStorage = JSON.parse(localStorage.preResults);
    resultsStorage = PreRusultsStorage;
    resultsStorage.unshift(thisResult);
  } else {
    resultsStorage = [];
    resultsStorage.push(thisResult);
  }
  
  // console.log(PreRusultsStorage);
  
  
  
  // console.log(resultsStorage);
  
  
  localStorage.preResults = JSON.stringify(resultsStorage);
  previousResults.push(thisResult);
}


const showUsedTime = () => {
  const usedTimeSpan = document.getElementById("usedTime");
  usedTimeSpan.innerText = "";

  const convertToMin = (usedTime - (usedTime % 60)) / 60;
  const convertToSec = usedTime % 60;

  usedTimeSpan.innerText = `${convertToMin < 10 ? "0" + convertToMin :  convertToMin} : ${convertToSec < 10 ? "0" + convertToSec :  convertToSec}`;
}

const procentBar = () => {
  const procentsBar = document.getElementById("mesure")
  const procentCount = document.getElementById("procentcount");

  const limit = chooseLimit.value;

  const joinedAnswers = userAnswer.flat(1);

  const amountOfTrue = joinedAnswers.filter(element => {
    if (element === true) {
      return element;
    } 
  })
  const amountOfTruelength = amountOfTrue.length;
  // console.log("uejjj");
  // console.log(amountOfTrue);

  const procent = (amountOfTruelength / limit);
  thisResult.push((procent * 100).toFixed(2) + "%");
  // console.log(procent);
  procentCount.innerText = (procent * 100).toFixed(2) + "%";
  
  let scale = 0;
  if (procent === 0) {
    procentsBar.style.transform = "scaleX(0)";
  } else {
    const procentFiller = setInterval(() => {
      if (scale < procent) {
        scale += .01;
        procentsBar.style.transform = `scaleX(${scale})`;
      }
    }, 20)
  }
 
}

const deleteBtn = document.getElementById("deleteBtn");
const preResultDiv = document.getElementById("previousresult");

const goToPreResults = () => {
  settingsDiv.classList.add('hide');
  preResultsDiv.classList.remove("hide");

  // console.log(previousResults);  
  // previousResultsStorage.split(",");
  preResultDiv.innerHTML = "";
  if (localStorage.getItem("preResults") === null) {
    // console.log('geen reuslts');
    const div = document.createElement("div");
    const p = document.createElement("p");
    p.innerText = "You have no results yet";

    div.setAttribute("class", "nothing");

    div.appendChild(p);
    preResultDiv.appendChild(div);
    deleteBtn.classList.add("hide");
  } else {
    deleteBtn.classList.remove("hide");
    const previousResultsStorage = JSON.parse(localStorage.preResults);

    previousResultsStorage.forEach((array) => {
      const allElementsDiv = document.createElement("div");;
      allElementsDiv.setAttribute("class", "borderForResults")
      array.forEach((element) => {
        const elementDiv = document.createElement("div");
        const ElementP = document.createElement('p');
        ElementP.innerText = element;
  
        elementDiv.appendChild(ElementP);
        allElementsDiv.appendChild(elementDiv);
      })
      preResultDiv.appendChild(allElementsDiv);
    })
  }
}

preResultsBtn.addEventListener("click", () => {
  goToPreResults()
})

deleteBtn.addEventListener("click", () => {
  localStorage.removeItem("preResults");

  preResultDiv.innerHTML = "";
  deleteBtn.classList.add("hide");
})
