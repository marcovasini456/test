// Gioco "Indovina il Numero" semplice

document.addEventListener('DOMContentLoaded', () => {
    const guessSection = document.getElementById('guess-section');
    if (!guessSection) {
        return; // Sezione non presente
    }

    const guessInput = document.getElementById('guess-input');
    const guessBtn = document.getElementById('guess-btn');
    const feedback = document.getElementById('guess-feedback');
    const attemptsInfo = document.getElementById('guess-attempts');
    const restartBtn = document.getElementById('guess-restart-btn');

    let secretNumber;
    let attempts;

    function initGame() {
        secretNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        feedback.textContent = 'Indovina un numero tra 1 e 100.';
        attemptsInfo.textContent = `Tentativi: ${attempts}`;
        guessInput.value = '';
        guessInput.disabled = false;
        guessBtn.disabled = false;
    }

    function checkGuess() {
        const guess = parseInt(guessInput.value, 10);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            feedback.textContent = 'Inserisci un numero valido tra 1 e 100.';
            return;
        }
        attempts++;
        attemptsInfo.textContent = `Tentativi: ${attempts}`;
        if (guess === secretNumber) {
            feedback.textContent = `Complimenti! Hai indovinato il numero ${secretNumber} in ${attempts} tentativi.`;
            guessInput.disabled = true;
            guessBtn.disabled = true;
        } else if (guess < secretNumber) {
            feedback.textContent = 'Troppo basso!';
        } else {
            feedback.textContent = 'Troppo alto!';
        }
        guessInput.value = '';
    }

    if (guessBtn) {
        guessBtn.addEventListener('click', checkGuess);
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', initGame);
    }

    initGame();
});
