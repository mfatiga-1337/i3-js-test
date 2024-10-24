let questions = [
    { text: "Question 1" },
    { text: "Question 2" },
    { text: "Question 3" },
    { text: "Question 4" }
];

let currentQuestionIndex = 0;
let userAnswers = [];
let optionsCache = [];

function showAlert(message) {
    let warningDiv = document.getElementById('warning-message');
    warningDiv.textContent = message;
    warningDiv.style.display = 'block';

    setTimeout(function() {
        warningDiv.style.display = 'none';
    }, 3000);
}

function getOptions(questionIndex) {
    if (optionsCache[questionIndex]) {
        return optionsCache[questionIndex];
    }

    let options = [];
    let numOptions = Math.floor(Math.random() * 6) + 2;
    for (let i = 1; i <= numOptions; i++) {
        options.push(i);
    }

    optionsCache[questionIndex] = options;
    return options;
}

function buildQuiz() {
    let quizContainer = document.getElementById('quiz');
    quizContainer.innerHTML = ''; 

    let question = questions[currentQuestionIndex];
    let questionText = question.text;

    let questionDiv = document.createElement('div');
    questionDiv.textContent = questionText;
    quizContainer.appendChild(questionDiv);

    let options = getOptions(currentQuestionIndex);
	console.log(options)
	console.log(userAnswers)

    for (let i = 0; i < options.length; i++) {
        let button = document.createElement('button');
        button.textContent = options[i];
        button.className = 'answer-button';

        if (userAnswers[currentQuestionIndex] && userAnswers[currentQuestionIndex].includes(options[i])) {
			button.classList.add('answered');
        }

        button.onclick = function() {
            selectAnswer(button);
        };

        quizContainer.appendChild(button);
    }

    updateButtons();
    updateShowResultsButton();
}

function selectAnswer(selectedButton) {
    let maxAnswers = 2 + currentQuestionIndex + 1;
    let selectedAnswer = parseInt(selectedButton.textContent);
    let selectedAnswers = userAnswers[currentQuestionIndex] || [];

    if (selectedAnswers.indexOf(selectedAnswer) !== -1) {
        let index = selectedAnswers.indexOf(selectedAnswer);
        selectedAnswers.splice(index, 1);
		selectedButton.classList.remove('answered');
    } else {
        if (selectedAnswers.length < maxAnswers) {
            selectedAnswers.push(selectedAnswer);
		    selectedButton.classList.add('answered');
        } else {
            showAlert('You can only select ' + maxAnswers + ' answers for this question!');
            return;
        }
    }

    userAnswers[currentQuestionIndex] = selectedAnswers;

    updateShowResultsButton();
    updateNavButtonsState();
}

function updateButtons() {
    let prevButton = document.getElementById('prev-button');
    let nextButton = document.getElementById('next-button');

    if (currentQuestionIndex === 0) {
        prevButton.style.display = 'none';
    } else {
        prevButton.style.display = 'inline-block';
    }

    if (currentQuestionIndex === questions.length - 1) {
        nextButton.style.display = 'none';
    } else {
        nextButton.style.display = 'inline-block';
    }
}

function updateNavButtonsState() {
    let navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(function(button, index) {
        button.className = 'nav-button';

        if (index === currentQuestionIndex) {
            button.classList.add('current');
        }

        if (userAnswers[index] && userAnswers[index].length > 0) {
            button.classList.add('answered');
        }
    });
}

function updateShowResultsButton() {
    let showResultsButton = document.getElementById('show-results-button');

    if (currentQuestionIndex === questions.length - 1) {
        showResultsButton.style.display = 'inline-block';
        if (allQuestionsAnswered()) {
            showResultsButton.disabled = false;
        } else {
            showResultsButton.disabled = true;
        }
    } else {
        showResultsButton.style.display = 'none';
    }
}

function allQuestionsAnswered() {
    for (let i = 0; i < questions.length; i++) {
        if (!userAnswers[i] || userAnswers[i].length === 0) {
            return false;
        }
    }
    return true;
}

function showResults() {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; 

    for (let i = 0; i < questions.length; i++) {
        let userAnswer = userAnswers[i] ? userAnswers[i].join(', ') : 'Not answered'; 
        let resultText = 'Question ' + (i + 1) + ': Your answers are ' + userAnswer + '.<br>';
        resultsDiv.innerHTML += resultText;
    }

    document.getElementById('quiz').style.display = 'none';
    document.querySelector('.button-container').style.display = 'none';
}

document.getElementById('prev-button').addEventListener('click', function() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        buildQuiz();
    }
});

document.getElementById('next-button').addEventListener('click', function() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        buildQuiz();
    } else {
        updateShowResultsButton();
    }
});

document.getElementById('show-results-button').addEventListener('click', showResults);

function createNavButtons() {
    let navContainer = document.getElementById('nav-buttons');
    navContainer.innerHTML = ''; 
    for (let i = 0; i < questions.length; i++) {
        let navButton = document.createElement('button');
        navButton.textContent = questions[i].text;
        navButton.className = 'nav-button';

        navButton.addEventListener('click', function() {
            currentQuestionIndex = i;
            buildQuiz();
			updateNavButtonsState();
        });

        navContainer.appendChild(navButton);
    }

    updateNavButtonsState();
}

createNavButtons();
buildQuiz();
