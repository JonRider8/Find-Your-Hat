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
        this._border = false;
        this._badInput = false;
    }

    get field(){
        return this._field;
    }

    get playerPosition(){
        return this._playerPosition;
    }

    get border(){
        return this._border;
    }

    set border(newBorder){
        this._border = newBorder;
    }

    get badInput(){
        return this._badInput;
    }

    set badInput(newBadInput){
        this._badInput = newBadInput;
    }

    //Method that changes player position in the field and reprints
    set playerPosition(newPosition){
        let preposition = this.playerPosition;
        
        var fieldLength = 0;
        var fieldWidth = 0;

        for(let arr in this.field){
            fieldLength++;
        }
        for(let arr in this.field[0]){
            fieldWidth++;
        }

        //Exit game
        if(newPosition === 'e'){
            console.log("\nYou have exited the game.");
            process.exit();
        }

        //changes player position in the field
        switch(newPosition){
            case 'w':
                preposition.y -= 1;
                break;
            case 's':
                preposition.y += 1;
                break;
            case 'a':
                preposition.x -= 1;
                break;
            case 'd':
                preposition.x += 1;
                break;
            default:
                this.badInput = true;

        }

        //checks if player is out of bounds
        if(this.field[preposition.y] === undefined || this.field[preposition.x] === undefined){
            this.border = true;

            switch(newPosition){
                case 'w':
                    preposition.y += 1;
                    break;
                case 's':
                    preposition.y -= 1;
                    break;
                case 'a':
                    preposition.x += 1;
                    break;
                case 'd':
                    preposition.x -= 1;
                    break;
            }

        }else{

            this.hatOrHole();

            //update player position
            this.field[this.playerPosition.y][this.playerPosition.x] = pathCharacter;
        }
        
        this.print()
        
    }

    //checks if player has found the hat or fell into a hole
    hatOrHole(){
        if(this.field[this.playerPosition.y][this.playerPosition.x] === hat){
            console.log("You found the hat! You win!");
            process.exit();
        } else if(this.field[this.playerPosition.y][this.playerPosition.x] === hole){
            console.log("You fell into a hole! You lose!");
            process.exit();
        }
    }

    //prints the field with player position
    print() {
        console.clear();
        this.field.forEach(row => {
            console.log(row.join(' '));
        });
        if(this.border === true){
            console.log("You have hit the wall!");
            this.border = false;
        } else if(this.badInput === true){
            console.log("Invalid input! Please try again.");
            this.badInput = false;
        }
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