const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const state = 'Q';
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
let questions = [];
for (let i = 0; i < 10; i++) {
const yearRace = getRndInteger(2007,2022);
const raceNo = getRndInteger(1,17);
URL = 'https://ergast.com/api/f1/'+yearRace+'/'+raceNo+'/results.json'
fetch(
    //'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
    URL
)
    .then((res) => {
        return res.json();
    })
    .then((loadedQuestions) => {
    gp = loadedQuestions.MRData.RaceTable.Races[0].raceName;
    formattedQuestion = {
        question:'Who won the '+ yearRace +' '+ gp +'?',
    };
    c_answer = loadedQuestions.MRData.RaceTable.Races[0].Results[0].Driver.givenName+" "+loadedQuestions.MRData.RaceTable.Races[0].Results[0].Driver.familyName;
    b1_answer = loadedQuestions.MRData.RaceTable.Races[0].Results[1].Driver.givenName+" "+loadedQuestions.MRData.RaceTable.Races[0].Results[1].Driver.familyName;
    b2_answer = loadedQuestions.MRData.RaceTable.Races[0].Results[2].Driver.givenName+" "+loadedQuestions.MRData.RaceTable.Races[0].Results[2].Driver.familyName;
    b3_answer = loadedQuestions.MRData.RaceTable.Races[0].Results[3].Driver.givenName+" "+loadedQuestions.MRData.RaceTable.Races[0].Results[3].Driver.familyName;
    answerChoices = [b1_answer,b2_answer,b3_answer];
    formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
    answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        c_answer
    );
    answerChoices.forEach((choice, index) => {
        formattedQuestion['choice' + (index + 1)] = choice;
    });
    console.log(formattedQuestion);
    questions.push(formattedQuestion);
        
        /*
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
            answerChoices.splice(
                formattedQuestion.answer - 1,
                0,
                loadedQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            });

            return formattedQuestion;
        });
        */
        console.log(questions);
        if (questions.length===10){
            startGame();
        }
    })
    .catch((err) => {
        console.error(err);
    });
}

//CONSTANTS
const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuesions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        //go to the end page
        return window.location.assign('/pre_race_day.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];
    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply =
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }
        

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
