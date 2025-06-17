document.addEventListener("DOMContentLoaded", () => {
    const questions = [
        {
            question: "Da quale paese antico provengono originariamente i Carlini?",
            options: ["Egitto", "Cina", "Roma", "Grecia"],
            correctAnswer: "Cina"
        },
        {
            question: "A quale famoso personaggio della Commedia dell'Arte deve il suo nome italiano il Carlino?",
            options: ["Pulcinella", "Pantalone", "Colombina", "Arlecchino"],
            correctAnswer: "Arlecchino"
        },
        {
            question: "Quale casa reale europea adottò il Carlino come mascotte?",
            options: ["Casa Tudor (Inghilterra)", "Casa d'Orange (Paesi Bassi)", "Casa Borbone (Francia)", "Casa Asburgo (Austria)"],
            correctAnswer: "Casa d'Orange (Paesi Bassi)"
        },
        {
            question: "In inglese, come si chiama la razza del Carlino?",
            options: ["Doggy", "Pug", "Shorty", "Mops"],
            correctAnswer: "Pug"
        },
        {
            question: "Quale di questi NON è un colore del mantello del Carlino riconosciuto ufficialmente?",
            options: ["Fulvo", "Nero", "Cioccolato", "Argento"],
            correctAnswer: "Cioccolato"
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOptionButton = null;

    const questionContainer = document.getElementById("question-container");
    const optionsContainer = document.getElementById("options-container");
    const nextButton = document.getElementById("quiz-next-btn");
    const feedbackDiv = document.getElementById("quiz-feedback");
    const scoreDiv = document.getElementById("quiz-score");

    function loadQuestion() {
        if (!questionContainer || !optionsContainer || !nextButton || !feedbackDiv || !scoreDiv) {
            // console.error("Elementi del quiz non trovati nel DOM. Assicurati che giochi.html sia corretto.");
            const quizSection = document.getElementById("quiz-section");
            if (quizSection) quizSection.style.display = "none";
            return;
        }

        feedbackDiv.textContent = "";
        scoreDiv.textContent = `Punteggio: ${score}`;
        selectedOptionButton = null;

        while (optionsContainer.firstChild) {
            optionsContainer.removeChild(optionsContainer.firstChild);
        }

        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionContainer.textContent = currentQuestion.question;

            currentQuestion.options.forEach(option => {
                const button = document.createElement("button");
                button.textContent = option;
                button.addEventListener("click", () => selectOption(button, option, currentQuestion.correctAnswer));
                optionsContainer.appendChild(button);
            });
            nextButton.textContent = "Verifica Risposta";
            nextButton.removeEventListener("click", handleNextQuestion);
            nextButton.addEventListener("click", checkAnswer);
            nextButton.style.display = "block";

        } else {
            questionContainer.textContent = "Quiz completato!";
            optionsContainer.innerHTML = "";
            nextButton.style.display = "none";
            feedbackDiv.textContent = `Hai risposto correttamente a ${score} domande su ${questions.length}!`;
            scoreDiv.textContent = `Punteggio Finale: ${score}`;
        }
    }

    function selectOption(button, option, correctAnswer) {
        if (selectedOptionButton) {
            selectedOptionButton.classList.remove("selected");
        }
        button.classList.add("selected");
        selectedOptionButton = button;
    }

    function checkAnswer() {
        if (!selectedOptionButton) {
            feedbackDiv.textContent = "Per favore, seleziona una risposta prima di verificare.";
            return;
        }

        const selectedAnswer = selectedOptionButton.textContent;
        const correctAnswer = questions[currentQuestionIndex].correctAnswer;

        Array.from(optionsContainer.children).forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === correctAnswer) {
                btn.classList.add("correct");
            } else if (btn === selectedOptionButton && btn.textContent !== correctAnswer) {
                btn.classList.add("incorrect");
            }
        });

        if (selectedAnswer === correctAnswer) {
            score++;
            feedbackDiv.textContent = "Corretto!";
        } else {
            feedbackDiv.textContent = `Sbagliato! La risposta corretta era: ${correctAnswer}`;
        }
        scoreDiv.textContent = `Punteggio: ${score}`;
        nextButton.textContent = "Prossima Domanda";
        nextButton.removeEventListener("click", checkAnswer);
        nextButton.addEventListener("click", handleNextQuestion);
    }

    function handleNextQuestion() {
        currentQuestionIndex++;
        Array.from(optionsContainer.children).forEach(btn => {
            btn.disabled = false;
            btn.classList.remove("correct", "incorrect", "selected");
        });
        loadQuestion();
    }

    if (document.getElementById("quiz-section")) {
        loadQuestion();
    }
});
