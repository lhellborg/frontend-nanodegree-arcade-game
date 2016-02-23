/**
* @description Enemies our player must avoid
* @constructor
* @param {number} x - the position on the x axes
* @param {number} y - the position on the y axes
* @param {number} speed - the relative speed of the enemy
*/
var Enemy = function (x, y, speed) {
    //initial location
    this.x = x;
    this.y = y;
    //speed
    this.speed = speed;
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

/**
* @description Update the enemy's position, required method for game, checks if collision with the player
* @param {number} dt, a time delta between ticks, recieved from the engine.js
*/
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.x < 505) {
        //update enemy location as long as inside of the canvas
        var move = this.speed * dt;
        this.x += move;
    } else {  //restart the bug at the beginning of the canvas
        this.x = 0;
    }

    //upon collision with the player call hte player dead function where the player have to restart
    var plx = player.x;
    var ply = player.y;
    if (this.x < (plx + 30) && this.x > (plx - 70) && this.y === ply) {
        player.dead();
    }
};

/**
* @description Draw the enemy on the screen, required method for game
*/
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
/**
* @description the varibale imagePlayer is made a global variable so it can be populated by the choice of the
* choosePlayer function from engine.js
*/
var imagePlayer;

/**
* @description The main character of our game the player
* @constructor
* @param {string} imagePlayer - the character chosen in hte choosePlayer function in engine.js
* @param {number} lives - number of lives the player should have at the start of the game
* @param {number} success- number of points the player should have at the start of the game, good for cheating
*/
var Player = function (imagePlayer, lives, success) {
    // initial location
    this.x = 200;
    this.y = 375;
    // picture of the player
    this.sprite = imagePlayer;
    this.lives = lives;
    this.oldLife = lives + 1;
    this.success = success;
    this.oldSuccess = success - 1;
};

/**
* @description updates the scores for the lives
* the variable oldLife keeps track of how many lives so the old score can be erased by painting over it with white
*/
Player.prototype.score = function () {
    if (this.lives != this.oldLife) {
        ctx.font = "36px Impact";
        ctx.fillStyle = "white";
        ctx.fillText("Lives left: " + this.oldLife, 100, 40);
        ctx.fillStyle = "black";
        ctx.fillText("Lives left: " + this.lives, 100, 40);
        this.oldLife = this.lives;
    }
};

/**
* @description updates the points
* the variable oldSuccess keep track of how many points so the old score can be erased by painting over it with white
*/
Player.prototype.point = function () {
    if (this.success != this.oldSuccess) {
        ctx.font = "36px Impact";
        ctx.fillStyle = "white";
        ctx.fillText("Points: " + this.oldSuccess, 340, 40);
        ctx.fillStyle = "black";
        ctx.fillText("Points: " + this.success, 340, 40);
        this.oldSuccess = this.success;
    }
};

/**
* @description add points to the player by adding 1 to the success variable
*/
Player.prototype.addPoints = function () {
    this.success += 1;
};

/**
* @description add lives to the player by adding 1 to the lives variable
*/
Player.prototype.addLife = function () {
    this.lives += 1;
};

/**
* @description updates the player by calling the score function and the point function
* @returns {Boolean} true or false to the statement "this.lives < 1", if true, the game ends otherwise it keeps going
*/
Player.prototype.update = function () {
    //keep track of the lives
    player.score();
    //keep track of the points
    player.point();
    return (this.lives < 1);
};

/**
* @description removes one life and returns the player to the original position
*/
Player.prototype.dead = function () {
        this.lives -= 1;
        this.x = 200;
        this.y = 375;
};

/**
* @description draw the player on the canvas
*/
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description moves the player inside the canvas depending on the keypressed by user
* @param {keypress} userInput - the key pressed
*/
Player.prototype.handleInput = function (userInput) {
    // stay inside the canvas
    if (this.x >= 0 && this.x <= 400 && this.y >= 10 && this.y <= 375) {
        if (userInput === "left" && this.x > 0) {
            this.x += -100;
        } else if (userInput === "up" && this.y > 10) {
            this.y += -80;
        } else if (userInput === "right" && this.x < 400) {
            this.x += 100;
        } else if (userInput === "down" && this.y < 375) {
            this.y += 80;
        }
    }
    // the player has reached the water and gets an extra point in the success variable
    if (this.x > -10 && this.x < 405 && this.y < 0) {
        this.x = 200;
        this.y = 375;
        this.addPoints();
    }

};

/**
* @description Collactable things
* @constructor
* @param {number} x - the position on the x axes
* @param {number} y - the position on the y axes
* @param {string} image - the image of the thing
*/
var Thing = function (x, y, image) {
    //initial location
    this.x = x * 100;
    this.y = y * 80 + 55;
    //the image choosen
    this.sprite = image;
};

/**
* @description when thing is taken by the player, the points update with 1 and the thing changes image and moves to the right
*/
Thing.prototype.update = function () {
    var plx = player.x;
    var ply = player.y;
    if (this.x === plx && this.y === ply) {
        player.addPoints();
        this.changeMe();
        if (this.x < 250) {
            this.x += 200;
        } else {
            this.x = 0;
        }
    };
};

/**
* @description changes the image of the thing by calling a random function
*/
Thing.prototype.changeMe = function () {
    var randomNr = Math.floor((Math.random() * 10) + 1) //generates a number between 1-10
    switch (randomNr) {
    case 1:
        this.sprite = 'images/Key.png';
        break;
    case 2:
        this.sprite = 'images/Rock.png';
        break;
    case 3:
        this.sprite = 'images/Star.png';
        break;
    case 4:
        this.sprite = 'images/GemBlue.png';
        break;
    case 5:
        this.sprite = 'images/GemGreen.png';
        break;
    case 6:
        this.sprite = 'images/GemOrange.png';
        break;
    default:
        this.sprite = 'images/Selector.png';
    }

};

/**
* @description draw the things on the canvas
*/
Thing.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
* @description Collactable heart which is a subclass of Thing, and gives extra lives instead of points
* @constructor
* @param {number} x - the position on the x axes
* @param {number} y - the position on the y axes
* @param {string} image - the image of the XLife
*/
var XLife = function (x, y, image) {
    Thing.call(this, x, y, image);
};

/**
* @description to make the XLife inherit the functions of Thing but not create a new instace of Thing
*/
XLife.prototype = Object.create(Thing.prototype);
/**
* @description to make the XLife point to its own constructor when called and not to Thing
*/
XLife.prototype.constructor = XLife;

/**
* @description upon collision with the player, the players addLife is called and the instance of XLife will move 2 squares
*/
XLife.prototype.update = function () {
    var plx = player.x;
    var ply = player.y;
    if (this.x === plx && this.y === ply) {
        player.addLife();
        this.x += 200;
    }
};

/**
* @description instantiate the objects.
* Place all enemy objects in an array called allEnemies
*/
var bug1 = new Enemy(0, 55, 275);
var bug2 = new Enemy(0, 135, 200);
var bug3 = new Enemy(0, 215, 300);
var bug4 = new Enemy(0, 55, 100);
var allEnemies = [bug1, bug2, bug3, bug4];

/**
* @description a global variable player which will be instantied with the Player class in the init function in engine.js to be able to choose player image
*/
var player;

/**
* @description instantiate the Thing objects, set the x position between 0 - 4 and y position between 0-2
*/
var thing = new Thing(0, 0, "images/Key.png");
var gem = new Thing(1, 2, 'images/GemBlue.png');

/**
* @description instantiate the XLife objects, set the x position between 0 - 4 and y position between 0-2
*/
var heart = new XLife(2, 1, 'images/Heart.png');

/**
* @description all things objects is collected in teh allThing array to be called at the same time
*/
var allThings = [thing, gem, heart];

/**
* @description This listens for key presses and sends the keys to your Player.handleInput() method. You don't need to modify this.
*/
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    //player is not defined until chosenPlayer
    if (player) {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});