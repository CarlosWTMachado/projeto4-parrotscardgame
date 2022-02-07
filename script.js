function timer(callback, delay) {
    var timerId;
    var start;
    var remaining = delay;

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= new Date() - start;
    };

    var resume = function() {
        start = new Date();
        timerId = window.setTimeout(function() {
            remaining = delay;
            resume();
            callback();
        }, remaining);
    };
    this.resume = resume;

    this.reset = function() {
        remaining = delay;
    };
}

(function() {
    window.onresize = resizeTitle;

    var delay = 1000;

    var label = document.getElementById("#label");
    var value = parseInt(label.textContent);

    var t = new timer(function() {
        label.textContent = ++value;
    }, delay);

    const cardGifs = ["assets/front.png", "assets/bobrossparrot.gif", "assets/explodyparrot.gif", "assets/fiestaparrot.gif", "assets/metalparrot.gif", "assets/revertitparrot.gif", "assets/tripletsparrot.gif", "assets/unicornparrot.gif"];
    let numCards = 0;
    let numPlays = 0;
    let arrayCards = [];
    let flipped = [];
    flipped[0] = 0;

    function start() {
        resizeTitle();
        let sectionCards = document.createElement("section");
        sectionCards.id = "cards";
        document.body.appendChild(sectionCards);
        let flagCard = 1;
        while (flagCard) {
            numCards = parseInt(prompt("Selecione o numero de cartas: (de 4 a 14, apenas numeros pares)"));
            if (numCards % 2 == 0 && numCards >= 4 && numCards <= 14) {
                flagCard = game();
            } else if (numCards < 4 || numCards > 14) {
                alert("Escolha um numero de 4 a 14, apenas numeros pares");
            } else if (numCards % 2 == 1) {
                alert("Selecione apenas numeros pares, de 4 a 14")
            }
        }
        t.resume();
    }

    function resizeTitle() {
        var square = document.getElementById("titulo");
        if (screen.width >= 1110) {
            square.style.fontSize = '56px';
        } else {
            square.style.fontSize = '36px';
        }
    }

    function game() {
        for (let i = 1; i <= numCards / 2; i++) {
            arrayCards.push(i);
            arrayCards.push(i);
        }
        arrayCards.sort(function() {
            return Math.random() - 0.5;
        });
        for (let i = 1; i <= numCards / 2; i++) {
            createCard((i * 2) - 1);
            createCard(i * 2);
        }
    }

    function createCard(cardId) {
        let divNova = document.createElement("div");
        divNova.className = "card";
        divNova.id = cardId;
        divNova.setAttribute("data-identifier", "card");
        divNova.addEventListener("click", doAFlip);
        document.getElementById("cards").appendChild(divNova);
        let divFront = document.createElement("div");
        divFront.className = "front-face face";
        divFront.id = "front" + cardId;
        divFront.setAttribute("data-identifier", "front-face");
        document.getElementById(cardId).appendChild(divFront);
        let divBack = document.createElement("div");
        divBack.className = "back-face face";
        divBack.id = "back" + cardId;
        divBack.setAttribute("data-identifier", "back-face");
        document.getElementById(cardId).appendChild(divBack);
        let imagemNovaFront = document.createElement("img");
        imagemNovaFront.src = cardGifs[0];
        imagemNovaFront.id = "frontParrot";
        document.getElementById("front" + cardId).appendChild(imagemNovaFront);
        let imagemNovaBack = document.createElement("img");
        imagemNovaBack.src = cardGifs[arrayCards[cardId - 1]];
        imagemNovaBack.id = "backParrot";
        document.getElementById("back" + cardId).appendChild(imagemNovaBack);
    }

    function doAFlip() {
        if (flipped.includes(this) || flipped[0] >= 2) {
            return;
        } else {
            this.children[0].style.transform = "rotateY(-180deg)";
            this.children[1].style.transform = "rotateY(0deg)";
            flipped[0]++;
            numPlays++;
            flipped.push(this);
            if (flipped[0] == 2) {
                if (arrayCards[flipped[flipped.length - 1].id - 1] == arrayCards[flipped[flipped.length - 2].id - 1]) {
                    if (flipped.length == numCards + 1) {
                        t.pause();
                        alert("Você ganhou em " + value + " segundos e " + numPlays + " jogadas!");
                        let playAgain = prompt("Quer jogar novamente? (s para sim e n para nao)");
                        if (playAgain == 's') {
                            document.getElementById("cards").remove();
                            document.getElementById("#label").innerHTML = 0;
                            value = 0;
                            t = new timer(function() { label.textContent = ++value; }, delay);
                            numCards = 0;
                            numPlays = 0;
                            arrayCards = [];
                            flipped = [];
                            flipped[0] = 0;
                            start();
                        } else return;
                    }
                    flipped[0] = 0;
                    return;
                }
                if (flipped[flipped.length - 1]) setTimeout(undoAFlip, 1000);
            }
        }
    }

    function undoAFlip() {
        for (let i = 0; i < 2; i++) {
            card = flipped.pop();
            card.children[0].style.transform = "rotateY(0deg)";
            card.children[1].style.transform = "rotateY(-180deg)";
        }
        flipped[0] = 0;
    }

    start();
})();