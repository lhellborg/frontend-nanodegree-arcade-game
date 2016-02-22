/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    // To get the canvas-relative of a click, you need to subtract the offsetLeft and offsetTop values 
    // from clientX and clientY. 

    var c = document.querySelector("canvas");
    var playerChosen = false;
    var gameOver = true;

    function handleMouseClick(evt)
    {
            x = evt.clientX - c.offsetLeft;
            y = evt.clientY - c.offsetTop;
            console.log("x,y:"+x+","+y);
    }
    c.addEventListener("click", handleMouseClick, false);

     /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() 
    {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);

        // the animation goes on unless gameOver = true from the gameEnd function 
         if (gameOver) 
         {
            render();

            /* Set our lastTime variable which is used to determine the time delta
             * for the next time this function is called.
             */
            lastTime = now;

            /* Use the browser's requestAnimationFrame function to call this
             * function again as soon as the browser is able to draw another frame.*/
         
            win.requestAnimationFrame(main);
        }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() 
    {
        reset();
        choosePlayer();
        waitForPlayer();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) 
    {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) 
    {
        allEnemies.forEach(function(enemy) 
        {
            enemy.update(dt);
        });

        allThings.forEach(function(thing) 
        {
            thing.update(dt);
        });
        //keep track of the lives are finished
        var finished = player.update();
        if(finished) 
        {
            gameEnd();
        }
        //keep track of the lives
        player.score();
        //keep track of the points
        player.point();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() 
    {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) 
        {
            for (col = 0; col < numCols; col++) 
            {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() 
    {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allThings.forEach(function(thing)
        {
            thing.render();
        }); 

        allEnemies.forEach(function(enemy) 
        {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */

    function reset() 
    {
        ctx.textAlign = "center";
        ctx.font = "20px Impact";
        ctx.fillStyle = "blue";
        ctx.fillText("Choose a player by clicking on an image", c.width/2, 300);
        ctx.drawImage(Resources.get("images/char-boy.png"), 0, 375);
        ctx.drawImage(Resources.get("images/char-catgirl.png"), 100, 375);
        ctx.drawImage(Resources.get("images/char-horngirl.png"), 200, 375);
        ctx.drawImage(Resources.get("images/char-pinkgirl.png"), 300, 375);
        ctx.drawImage(Resources.get("images/char-princessgirl.png"), 400, 375);
    }
    
    //wait for player to be chosen
    function waitForPlayer() 
    {  
        if (!playerChosen) 
        {
            setTimeout(waitForPlayer, 250);
        } 
        else 
        {
            lastTime = Date.now();
            player = new Player(imagePlayer, 3, 0);
            main();   
        }
    }    

    //choose a player to start the game with. variable c is only defined here so can not move to app.js
    function choosePlayer() 
    {
        c.addEventListener("click", function(evt) 
        {
            x = evt.clientX - c.offsetLeft;
            y = evt.clientY - c.offsetTop;
            if (y > 425 && y < 525) 
            {
                if(x > 0 && x < 100) 
                {
                    imagePlayer =  "images/char-boy.png";
                    playerChosen = true;
                }
                else if (x > 101 && x < 200) 
                {
                    imagePlayer =  "images/char-catgirl.png";
                    playerChosen = true;
                }
                else if (x > 201 && x < 300) 
                {
                    imagePlayer =  "images/char-horngirl.png";
                    playerChosen = true;
                }
                else if (x > 301 && x < 400) 
                {
                    imagePlayer =  "images/char-pinkgirl.png";
                    playerChosen = true;
                }
                else if (x > 401 && x < 500) 
                {
                    imagePlayer =  "images/char-princessgirl.png";
                    playerChosen = true;
                }
            }
        })
    }

    /* This function shows the game over screen when the lives are finished */
    function gameEnd() 
    {     
        gameOver = false;
        ctx.font = "36px Impact";
        ctx.fillStyle = "white";
        ctx.fillText("Game over", 200, 300);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
        ctx.strokeText("Game over",  200, 300);
        return gameOver;

    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-catgirl.png',
        'images/char-horngirl.png',
        'images/char-pinkgirl.png',
        'images/char-princessgirl.png',
        'images/GemBlue.png',
        'images/Heart.png',
        'images/Key.png',
        'images/Rock.png',
        'images/Selector.png',
        'images/Star.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);


