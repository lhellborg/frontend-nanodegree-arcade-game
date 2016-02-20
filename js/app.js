// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    //initial location
    this.x = x;
    this.y = y;
    //speed
    this.speed = speed; 
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt, player) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if (this.x < 505 ) 
    {
        //update enemy location as long as inside of the canvas
        var move = this.speed * dt;
        this.x += move;
    }
    else //restart the bug at the beginning of the canvas
    {
        this.x = 0;
    };

    //upon collision with the player the player have to restart
    var plx = player.x;
    var ply = player.y;
    if (this.x < (plx+30) && this.x > (plx-70) && this.y === ply) {
        player.x = 200;
        player.y = 375;
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // initial location
    this.x = 200;
    this.y = 375;
    // picture of the player
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function() {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
 
 Player.prototype.handleInput = function(userInput) {
    // stay inside the canvas
    if (this.x >= 0 && this.x <= 400 && this.y >= 10 && this.y <= 375) 
    {
        if (userInput === "left" && this.x > 0) 
        {
            this.x += -100;
        }
        else if (userInput === "up" && this.y > 10)
        {
            this.y += -80;
        }
        else if (userInput === "right" && this.x < 400) 
        {
            this.x += 100;
        } 
        else if (userInput === "down" && this.y < 375) 
        {
            this.y += 80;
        }
    }  
    // the player has reached the water
    if (this.x > -10 && this.x < 405 && this.y < 0) 
    {
        this.x = 200;
        this.y = 375;
    }

 };

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var bug1 = new Enemy(0, 55, 175);
var bug2 = new Enemy(0, 135, 50);
var bug3 = new Enemy(0, 215, 100);
var allEnemies = [bug1, bug2, bug3];

// Place the player object in a variable called player
var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


