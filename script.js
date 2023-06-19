var horizontalres = 640;
var verticalres = 480;
let birdimg; //I made a custom sprite for the bird.
let ailenimg;
let bulletSound;
var ailen;
var score = 0;

var highScore = 0;

//this object stores the bird properties
bird = {
  x: 45,
  y: verticalres - 50,
  width: 36,
  height: 64
}

//this object stores the bullet properties
bullet = {
  x: bird.x, //follows bird
  y: bird.y,
  width: 20,
  height: 7,
  position: 0,
  fire: false,
  speed: 69 //nice
}



function preload() {
  birdimg = loadImage("assets/bird.png"); //I drew a picture of a bird. It's in the assets folder.
  ailenimg = loadImage("assets/ailen.png"); //Picture of ailen.

  //initalize gunshot sound. Source: https://youtu.be/f53fti1kwgc and converted with https://mp3fy.com/
  bulletSound = loadSound("assets/[MP3FY] Realistic Gunshot Sound Effect.mp3");
}

//this creates three new ailens (green squares). They will show up at different times.
function setup() {
  createCanvas(horizontalres, verticalres);
  ailen = new enemy(35);
  ailen1 = new enemy(56);
  ailen2 = new enemy(45);
}


function draw() {
  background("#0C0404"); //background color
  fill("black");
  bulletControl(); //allows you to shoot bullet
  showScore(); //displays socre

  //console.log(bullet.x);
  birdControl(); //allows you to move bird. 

  //controls different enemies.
  ailen.draw(); //draws the first ailen.
  if (score >= 10) { //will add another one if you scored 10 points.
    ailen1.draw();

    if (score >= 25) { //will add another one if you scored 25 points. This is a nested if statement.
      ailen2.draw();
    }
  }

  //fill("#FF7F27");
  //bird uses my custom sprite. Note the use of my custom newImage() function. 
  newImage(birdimg, bird.x, bird.y, bird.height, bird.width);

  //bullet function
  shootBullet();
}

//controls bird and uses object at beginning of code.
function birdControl() {
  if (keyIsDown(32)) { // 32 is the javascript code for the spacebar (this is a vanilla JavaScript function, and NOT p5.js)
    bird.y -= 15;

  } else if (keyIsDown(32) == false) {
    bird.y += 5; //bird will fall down
  }

  if (bird.y >= verticalres - 50) {
    bird.y = verticalres - 50;

  } else if (bird.y <= 50) {
    bird.y = 50

  }
}

//shows scores
function showScore() {
  fill("#ffffff")
  textSize(25);
  text("Score: " + score, 10, 30); //shows current score.
  text("High Score: " + highScore, 150, 30); //shows high scors
}

//press x to shoot bullet. 
function bulletControl() {
  if (key == "x" && keyIsPressed) { //p5.js function for checking whether or not key is pressed.
    bullet.fire = true;
    bulletSound.play(); //plays sound effect. I put it here so it only plays once and not during the entire time that the bullet is fired.
  } else if (key == "x" && keyIsPressed) {
    bullet.fire = false;
  }
  //console.log(bullet.fire);
}

function shootBullet() {
  //bullet.position has three states:
  //0 = bullet is at the bird, and is ready to be fired
  //1 = in motion after firing
  //2 = collision with object, or went back to the screen, reloads bullet.

  //draws bullet (a rectangle.)
  fill("Yellow");
  newRect(bullet.x, bullet.y, bullet.width, bullet.height);

  //track and fire bullets.
  if (bullet.fire == true && bullet.position == 0) {
    bullet.position = 1;
  }

  // fire rockets code
  if (bullet.position == 1) {
    bullet.x = bullet.x + bullet.speed; //move horizontally
    bullet.y = bullet.y + 0; //stop following bird.

    //if exceeds window or misses
    if (bullet.x >= horizontalres) {
      bullet.position = 2;
    }

  } else if (bullet.fire == false) { // close fire
    bullet.x = bird.x; //not firing. bullet should be with bird.
    bullet.y = bird.y;
  }

  //reload on 2
  if (bullet.position == 2) {
    bullet.x = bird.x;
    bullet.y = bird.y;
    bullet.position = 0; //resets to fire again
    bullet.fire = false;
  }
}

//newRect is a modified rect() function, who's x and y coordinates are at the CENTER, as opposed to the top left corner.
function newRect(x, y, width, height) {
  rect(x - width / 2, y - height, width, height);
}

//newImage is the same thing as newRect(), except it uses the image() function and has one more parameter. Both newImage() and newRect() can be used freely without restriction. You have my permission and please share as this can help new coders.
function newImage(img, x, y, width, height) {
  image(img, x - width / 2, y - height, width, height);
}

//enemy class. this determines the functionality for all the ailens.
class enemy {

  constructor(size) {
    this.x = floor(random(horizontalres * 0.6, horizontalres))
    this.y = floor(random(50, verticalres - 50));
    this.size = size;
  }

  //displays enemy on screen.
  draw() {
    fill("#008000");
    newImage(ailenimg, this.x, this.y, this.size, this.size);
    //console.log(this.x);
    this.collide();
    this.x -= 2; //controls speed of enemy
  }

  //what happens if bullet hits ailen
  collide() {
    if (bullet.x + bullet.width / 2 <= this.x + this.size && bullet.x - bullet.width / 2 >= this.x - this.size / 2 && bullet.y <= this.y + this.size / 2 && bullet.y >= this.y - this.size / 2) {
      score++;
      fill("white");

      this.reset();

    } else if (this.x < bird.x) {
      this.x = this.x;
      window.alert("You died"); //show the "you died" screen every time you die.
      if (score > highScore) {
        highScore = score; //updates your high score.
      }
      this.reset();
      score = 0; //resets your score
    }
  }

  //if it dies, it will respawn in a random spot, so it looks as though new ones show up all the time.
  reset() {
    this.x = horizontalres + 100;
    this.y = floor(random(100, verticalres - 50));
  }
}



