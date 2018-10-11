//Wichtige Variabeln
var keypress = require('keypress');
var ansi = require('ansi');

process.stdin.setRawMode(true);
process.stdin.resume();

//Variabeln
var cursor = ansi(process.stdout);
var height = 20;
var length = 40;
var direction = 0;
var appleX = 0;
var appleY = 0;
var snakeX = 2;
var snakeY = 2;

//Starten der Funktionen
initPlayground();
makeApple();
startGame();
listenKey();

//Zeichnen der Arena
function initPlayground(){
    process.stdout.write('\x1Bc');

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < length; x++) {
            if (x === 0 || x === length - 1 || y === 0 || y === height - 1) {
                cursor.bg.grey().write(' ');
                cursor.bg.reset();
            } else {
                cursor.bg.white().write(' ');
                cursor.bg.reset();
            }
        }
        process.stdout.write('\n');
    }
    cursor.bg.reset();
}

//erster Apfel wird generiert
function makeApple(){
    deleteApple();
    appleX = Math.floor(Math.random() * Math.floor(length - 2) + 1);
    appleY = Math.floor(Math.random() * Math.floor(height - 2) + 1);
    setApple();
}

//erster Apfel wird gesetzt
function setApple(){
cursor.goto(appleX+1,appleY+1);
cursor.bg.red().write(' ');
cursor.bg.reset();
process.stdout.write('\x1B[?25l');
}

//Apfel wird entfernt
function deleteApple(){
    cursor.goto(appleX + 1, appleY + 1);
    cursor.bg.white().write(' ');
    cursor.bg.reset();
}

function startGame(){
    //Bewegen der Schlange
    deleteSnake();
    //Nach richtung abfragen
    switch(direction){
        case 0: snakeX += 1; break;    //rechts
        case 1: snakeX -= 1; break;     //links
        case 2: snakeY -= 1; break;     //rauf
        case 3: snakeY += 1; break;     //runter
    }
    setSnake();

    //Abprüfen ob ein Apfel getroffen wird
    if(snakeX === appleX && snakeY === appleY){
        makeApple();
    }

    //Abprüfen ob die Schlange noch im Spielfeld ist
    if(snakeY <= 0 || snakeY >= height || snakeX <= 0 || snakeX >= length){
        endGame();
    }
    setTimeout(startGame, 1000 / 3);
}

function setSnake(){
    cursor.goto(snakeX+1,snakeY+1);
    cursor.bg.green().write(' ');
    cursor.bg.reset();
    process.stdout.write('\x1B[?25l');
}

//Löschen der Schlange
function deleteSnake(){
    cursor.goto(snakeX + 1, snakeY + 1);
    cursor.bg.white().write(' ');
    cursor.bg.reset();
}

//Warten auf die Zeichen
function listenKey(){
    keypress(process.stdin);
    process.stdin.on('keypress', function (ch, key){
        if (key) {
            switch (key.name) {
                case 'right': direction = 0; break;
                case 'left': direction = 1; break;
                case 'up': direction = 2; break;
                case 'down': direction = 3; break;
            }
        }
    });
    process.stdin.setRawMode(true);
}

//Beende das Spiel
function endGame() {
    cursor.reset();
    cursor.bg.black();
    cursor.fg.red();

    cursor.goto(length / 2 - 3, height / 2);
    process.stdout.write('Game Over');
    cursor.goto(length + 3, height + 3);

    cursor.reset();
    process.exit();
}