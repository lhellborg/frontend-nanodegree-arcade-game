// Enemies our player must avoid
var Enemy = function(x, y, speed) 
{
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
Enemy.prototype.update = function(dt) 
{
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
    if (this.x < (plx+30) && this.x > (plx-70) && this.y === ply) 
    {
        player.dead();
    };
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() 
{
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var imagePlayer


var Player = function(imagePlayer, lives, success) 
{
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

// the variable oldLife keeps track of how many lives so the old score can be erased by painting over it

Player.prototype.score = function() 
{
    if (this.lives != this.oldLife) 
    {
        ctx.font = "36px Impact";
        ctx.fillStyle = "white";
        ctx.fillText("Lives left: " + this.oldLife, 100, 40);
        ctx.fillStyle = "black";
        ctx.fillText("Lives left: " + this.lives, 100, 40);
        this.oldLife = this.lives;
    }    
};

// the variable oldSuccess keep track of how many points so the old score can be erased by painting over it

Player.prototype.point = function() 
{
    if (this.success != this.oldSuccess) 
    {
        ctx.font = "36px Impact";
        ctx.fillStyle = "white";
        ctx.fillText("Points: " + this.oldSuccess, 340, 40);
        ctx.fillStyle = "black";
        ctx.fillText("Points: " + this.success, 340, 40);
        this.oldSuccess = this.success;
    }    
};

Player.prototype.addPoints = function() 
{
    this.success += 1;
}

Player.prototype.addLife = function() 
{
    this.lives += 1;
};

Player.prototype.update = function() 
{
    return (this.lives < 1);
};

Player.prototype.dead = function() 
{
    if (this.lives > 0) 
    {
        this.lives -= 1;
        this.x = 200;
        this.y = 375;
    }
};

Player.prototype.render = function() 
{
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
 
 Player.prototype.handleInput = function(userInput)
 {
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
    // the player has reached the water and gets an extra point in the success variable
    if (this.x > -10 && this.x < 405 && this.y < 0) 
    {
        this.x = 200;
        this.y = 375;
        this.addPoints();
    }

 };

var Thing = function(x, y, image) 
{
    //initial location
    this.x = x * 100;
    this.y = y * 80 + 55;
    //the image choosen
    this.sprite = image;
    this.colour = 1; 
}; 

// when thing is taken by the player, the points update with 1 and the thing moves to the right
Thing.prototype.update = function() {
    var plx = player.x;
    var ply = player.y;
    if (this.x === plx  && this.y === ply) 
    {
        player.addPoints();
        gem.changeColour();
        thing.changeThing();
        if (this.x < 150) 
        {
            this.x += 300;
        } 
        else 
        {
            this.x = 0;
        }
    };
};

Thing.prototype.changeThing = function() 
{
    {
        if (this.colour % 3 === 0) {
            this.sprite = 'images/Key.png';
        }
        else if (this.colour % 2 === 0) 
        {
            this.sprite = 'images/Rock.png';
        }
        else 
        {
            this.sprite = 'images/Star.png';
        }
    }
    this.colour += 1;
};

//changes colour of the gem
Thing.prototype.changeColour = function() 
{
    {
        if (this.colour % 3 === 0) {
            this.sprite = 'images/GemBlue.png';
        }
        else if (this.colour % 2 === 0) 
        {
            this.sprite = 'images/GemGreen.png';
        }
        else 
        {
            this.sprite = 'images/GemOrange.png';
        }
    }
    this.colour += 1;
};

Thing.prototype.render = function() 
{
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// the heart will give extra life (XLife) which will be a subclass of Thing, but upon collision will give extra lives instead of extra points
var XLife = function(x, y, image) 
{
    Thing.call(this, x, y, image)
}; 

XLife.prototype = Object.create(Thing.prototype);
XLife.prototype.constructor = XLife;

XLife.prototype.update = function() 
{
    var plx = player.x;
    var ply = player.y;
    if (this.x === plx  && this.y === ply) 
    {
        player.addLife();
        this.x += 200;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var bug1 = new Enemy(0, 55, 275);
var bug2 = new Enemy(0, 135, 50);
var bug3 = new Enemy(0, 215, 100);
var bug4 = new Enemy(0, 55, 25);
var allEnemies = [bug1, bug2, bug3, bug4];

// Place the player object in a variable called player
//the new Player object is defined in init funciton in init to be able to choose player image
var player  

//set the x position between 0 - 4 and y position between 0-2
var thing = new Thing(0, 0, "images/Key.png");
var gem = new Thing(1, 1, 'images/GemBlue.png');
var allThings = [thing, gem];

var heart = new XLife(3, 2, 'images/Heart.png');

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) 
{
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});


