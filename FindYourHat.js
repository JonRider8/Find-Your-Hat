const prompt = require('prompt-sync')({sigint: true});
let events = require('events');

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor(field) {
        this._field = field;
        this._playerPosition = { x: 0, y: 0 };
    }

    get field(){
        return this._field;
    }

    get playerPosition(){
        return this._playerPosition;
    }

    //Method that changes player position in the field and reprints
    set playerPosition(newPosition){
        let preposition = this.playerPosition;
        let border = false;
        var fieldLength = 0;
        var fieldWidth = 0;

        for(let arr in this._field){
            fieldLength++;
        }
        for(let arr in this._field[0]){
            fieldWidth++;
        }

        if(newPosition === 'w'){
            this.playerPosition.y -= 1;
        }else if(newPosition === 's'){
            this.playerPosition.y += 1;
        } else if(newPosition === 'a'){
            this.playerPosition.x -= 1;
        } else if(newPosition === 'd'){
            this.playerPosition.x += 1;
        }else if(newPosition === 'e'){
            console.log("You have exited the game.");
            process.exit();
        }

        if(this.field[this.playerPosition.y] === undefined || this.field[this.playerPosition.x] === undefined){
            this.playerPosition = preposition;
            border = true;
        }else{
            this.hatOrHole();
            this.field[this.playerPosition.y][this.playerPosition.x] = pathCharacter;
            border = false;
        }
        
        console.clear();
        this.field.forEach(row => {
            console.log(row.join(' '));
        });
        if(border === true){
            console.log("You have hit the wall!");
        }
        console.log("What way do you want to go? (E to Exit)> ")
    }

    hatOrHole(){
        if(this.field[this.playerPosition.y] === hat || this.field[this.playerPosition.x] === hat){
            console.log("You found the hat! You win!");
            process.exit();
        } else if(this.field[this.playerPosition.y] === hole || this.field[this.playerPosition.x] === hole){
            console.log("You fell into a hole! You lose!");
            process.exit();
        }
    }


    print() {
        console.clear();
        this._field.forEach(row => {
            console.log(row.join(' '));
        });
        console.log("What way do you want to go? (E to Exit)> ")
    }
}

// creates a new field with a player, a hat and holes
const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
  ]);
  
  myField.print();

// moves the player in the field
process.stdin.on('data', (userInput) => {
    userInput = userInput.toString().trim().toLowerCase();
    myField.playerPosition = userInput;
});