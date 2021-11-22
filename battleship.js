const view = {
    displayMessage: function (msg) {
        let messageArea = document.getElementById('messageArea');
        messageArea.innerHTML = msg;
    },
    displayHit: function (location) {
        let hi = document.getElementById(location);
        hi.setAttribute('class', 'hit');
    },
    displayMiss: function (location) {
        let miss = document.getElementById(location);
        miss.setAttribute('class', 'miss')
    },
};

const model = {
    boardSize: 7,
    numShips: 3,
    shipsSunk: 0,
    shipLength: 3,
    ships: [
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]},
        {locations: [0, 0, 0], hits: ["", "", ""]},
    ],
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            for (let j = 0; j < this.shipLength; j++) {
                if (this.ships[i].locations[j] === guess) {
                    let ship = this.ships[i]
                    ship.hits[j] = "hit"
                    view.displayHit(guess)
                    view.displayMessage("You hit my ship!")
                    if (this.isSunk(ship)) {
                        this.shipsSunk++
                    }
                    return true
                }
            }
        }
        view.displayMiss(guess)
        view.displayMessage("You miss!")
        return false
    },
    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false
            }
        }
        return true
    },
    generateShipLocations: function () {
        let locations;
        for (let i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function () {
        let direction = Math.floor(Math.random() * 2);
        let row, col;
        let newShipLocations = [];
        for (let i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                row = Math.floor(Math.random() * this.boardSize);
                col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
            }
            if (direction === 0) {
                row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
                col = Math.floor(Math.random() * this.boardSize);
            }
        }
        for(let i = 0; i < this.shipLength; i++){
            if(direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            }
            if(direction === 0) {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },
    collision: function (locations) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = model.ships[i];
            for (let j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

const controller = {
    guesses: 0,
    processGuess: function (guess) {
        let location = parseGuess(guess);
        if (location) {
            this.guesses++;
            let hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " +
                    this.guesses + " guesses");
                let buttonFire = document.getElementById("fireButton")
                buttonFire.disabled = true
            }
        }
    },
};

function parseGuess(guess) {
    let alphabet = ["a", "b", "c", "d", "e", "f", "g"];

    if (guess.length === 2) {
        let firstChar = guess[0];
        let row = alphabet.indexOf(firstChar);
        let column = guess[1];
        if (row === -1 || row >= model.boardSize ||
            column < 0 || column >= model.boardSize) {
            return null
        }
        return row + column;
    }
    alert("Oops, please enter a letter and a number on the board");
    return null;
}

function init() {
    let fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;

    let fireInput = document.getElementById("guessInput");
    fireInput.onkeypress = handlerKeyPress;

    model.generateShipLocations();
}

function handlerKeyPress(e) {
    let fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function handleFireButton() {
    let guessInput = document.getElementById("guessInput");
    let guess = guessInput.value;
    controller.processGuess(guess);

    guessInput.value = "";
}

window.onload = init;




