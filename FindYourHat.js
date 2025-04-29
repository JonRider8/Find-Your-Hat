const prompt = require('prompt-sync')({sigint: true});
var term = require( 'terminal-kit' ).terminal // Importing terminal kit for colored output

const hat = term.brightCyan.str('^');
const hole = term.yellow.str('O');
const fieldCharacter = term.green.str('░');
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
        //Exit game
        if(newPosition === 'e'){
            console.clear();
            console.log("\nYou have exited the game.\n");
            process.exit();
        }

        //changes player position in the field
        switch(newPosition){
            case 'w':
                this.playerPosition.y -= 1;
                break;
            case 's':
                this.playerPosition.y += 1;
                break;
            case 'a':
                this.playerPosition.x -= 1;
                break;
            case 'd':
                this.playerPosition.x += 1;
                break;
            default:
                this.badInput = true;

        }

        //checks if player is out of bounds
        if(this.field[this.playerPosition.y] === undefined || this.field[this.playerPosition.x] === undefined){
            this.border = true;

            switch(newPosition){
                case 'w':
                    this.playerPosition.y += 1;
                    break;
                case 's':
                    this.playerPosition.y -= 1;
                    break;
                case 'a':
                    this.playerPosition.x += 1;
                    break;
                case 'd':
                    this.playerPosition.x -= 1;
                    break;
            }

        }else{

            this.hatOrHole();

            //update player position
            this.field[this.playerPosition.y][this.playerPosition.x] = pathCharacter;
        }
        
        this.print();
        
    }

    //checks if player has found the hat or fell into a hole
    hatOrHole(){
        if(this.field[this.playerPosition.y][this.playerPosition.x] === hat){
            console.log("\n You found the hat! You win!\n ");
            process.exit();
        } else if(this.field[this.playerPosition.y][this.playerPosition.x] === hole){
            console.log("\n You fell into a hole! You lose! \n");
            process.exit();
        }
    }

    findPlayer(){
        for(let i = 0; i < this.field.length; i++){
            for(let j = 0; j < this.field[i].length; j++){
                if(this.field[i][j] === pathCharacter){
                    this.playerPosition.x = j;
                    this.playerPosition.y = i;
                }
            }
        }
    }

    //prints the field with player position
    print() {
        console.clear();
        term.red("\nYou are in the ").green("field").red(". You can move with ").yellow("'w'").red(", ").blue("'a'").red(", ").magenta('s').red(", ").cyan("'d'").red(". Type 'e' to exit the game.");
        term.red("\nYou are '").white("*").red("' and the hat is '").brightCyan("^").red("'. Watch out for holes 'O'!\n");
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
        process.stdout.write("What way do you want to go? >");
    }

    //generates a new field with a player, a hat and holes
    static generateField(height, width, holePercent) {
        let field = [];
        let holeCount = Math.ceil(height * width * holePercent / 100);
        let x, y;

        //Gens field
        for (let i = 0; i < height; i++) {
            field[i] = [];
            for (let j = 0; j < width; j++) {
                field[i][j] = fieldCharacter;
            }
        }

        //Gens holes
        for(let i = 0; i < holeCount; i++) {
            x = Math.floor(Math.random() * height);
            y = Math.floor(Math.random() * width);
            if (field[x][y] === fieldCharacter && (x !== 0 || y !== 0)) {
                field[x][y] = hole;
            }else {
                i--;
            }
        }

        ///Gens hat
        do {
            x = Math.floor(Math.random() * height);
            y = Math.floor(Math.random() * width);
        } while (field[x][y] !== fieldCharacter || (x === 0 && y === 0));
        field[x][y] = hat;

        //Gens player
        do {
            x = Math.floor(Math.random() * height);
            y = Math.floor(Math.random() * width);
        } while (field[x][y] !== fieldCharacter);
        field[x][y] = pathCharacter;
        
        return field;
    }
}

const generateField = Field.generateField(5, 5, 20);

const myField = new Field(generateField);
  
myField.print();

myField.findPlayer();

// Player input
process.stdin.on('data', (userInput) => {
    userInput = userInput.toString().trim().toLowerCase();
    myField.playerPosition = userInput;
});