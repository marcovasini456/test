
document.addEventListener("DOMContentLoaded", () => {
    const memorySection = document.getElementById("memory-section");
    if (!memorySection) {
        // Se la sezione memory non è in questa pagina, non fare nulla.
        return;
    }

    const imageSources = [
        "images/galleria_pug_fulvo1.jpg",
        "images/galleria_pug_nero1.jpg",
        "images/galleria_cucciolo_pug1.jpg",
        "images/galleria_pug_buffo1.jpg",
        "images/memory_pug_occhiali.jpg", // Assicurati che questa immagine esista
        "images/storia_bertinazzi_arlecchino.jpg" // Immagine dalla storia, potrebbe essere meno ideale per forma
    ];

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let attempts = 0;
    const totalPairs = imageSources.length;

    const gridContainer = document.getElementById("memory-grid");
    const attemptsSpan = document.getElementById("memory-attempts");
    const pairsFoundSpan = document.getElementById("memory-pairs-found");
    const totalPairsSpan = document.getElementById("memory-total-pairs");
    const restartButton = document.getElementById("memory-restart-btn");
    const feedbackDiv = document.getElementById("memory-feedback");

    function createCard(imageSrc) {
        const card = document.createElement("div");
        card.classList.add("memory-card");
        card.dataset.image = imageSrc;

        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = "Carlino Memory";
        card.appendChild(img);

        card.addEventListener("click", () => flipCard(card));
        return card;
    }

    function initializeGame() {
        cards = [];
        imageSources.forEach(src => {
            cards.push(createCard(src));
            cards.push(createCard(src)); // Coppia
        });

        // Shuffle cards (Algoritmo di Fisher-Yates)
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }

        gridContainer.innerHTML = ""; // Pulisci la griglia precedente
        cards.forEach(card => gridContainer.appendChild(card));

        matchedPairs = 0;
        attempts = 0;
        flippedCards = [];
        updateGameInfo();
        feedbackDiv.textContent = "Trova le coppie!";
        if(totalPairsSpan) totalPairsSpan.textContent = totalPairs;
    }

    function flipCard(card) {
        if (flippedCards.length < 2 && !card.classList.contains("flipped") && !card.classList.contains("matched")) {
            card.classList.add("flipped");
            // card.querySelector("img").style.display = "block"; // Gestito da CSS .flipped img
            flippedCards.push(card);

            if (flippedCards.length === 2) {
                attempts++;
                updateGameInfo();
                checkForMatch();
            }
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        if (card1.dataset.image === card2.dataset.image) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedPairs++;
            updateGameInfo();
            feedbackDiv.textContent = "Coppia trovata!";
            if (matchedPairs === totalPairs) {
                feedbackDiv.textContent = `Complimenti! Hai trovato tutte le coppie in ${attempts} tentativi!`;
            }
            flippedCards = [];
        } else {
            feedbackDiv.textContent = "Non corrispondono...";
            setTimeout(() => {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
                // card1.querySelector("img").style.display = "none"; // Gestito da CSS
                // card2.querySelector("img").style.display = "none"; // Gestito da CSS
                flippedCards = [];
                if (matchedPairs < totalPairs) { // Evita di sovrascrivere il messaggio di vittoria
                   feedbackDiv.textContent = "Prova ancora!";
                }
            }, 1200);
        }
    }

    function updateGameInfo() {
        if(attemptsSpan) attemptsSpan.textContent = attempts;
        if(pairsFoundSpan) pairsFoundSpan.textContent = matchedPairs;
    }

    if(restartButton) {
       restartButton.addEventListener("click", initializeGame);
    }

    // Inizializza il gioco allavvio se gli elementi esistono
    if (gridContainer && attemptsSpan && pairsFoundSpan && totalPairsSpan && restartButton && feedbackDiv) {
        initializeGame();
    } else {
        // console.error("Elementi del Memory Game non trovati nel DOM. Assicurati che giochi.html sia corretto.");
        if(memorySection) memorySection.style.display = none;
    }
});
