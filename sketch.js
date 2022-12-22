const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var fruit, rope, rope2;
var fruit_con, fruit_con2;

var bg_img;
var food;
var rabbit;

var button, btn2, muteBtn;
var bunny;
var blink,eat,sad;
var airBlower;

var WIN= 2;
var PLAY=1;
var END= 0;
var gamestate= 1;

var bgSound, eatingSound, sadSound, cutSound, blowSound;

var canW, canH;

function preload()
{
  bg_img = loadImage('./images/background.png');
  food = loadImage('./images/melon.png');
  rabbit = loadImage('./images/Rabbit-01.png');;
  blink = loadAnimation("./images/blink_1.png","./images/blink_2.png","./images/blink_3.png");
  eat = loadAnimation("./images/eat_0.png" , "./images/eat_1.png","./images/eat_2.png",
  "./images/eat_3.png","./images/eat_4.png");
  sad = loadAnimation("./images/sad_1.png","./images/sad_2.png","./images/sad_3.png");

  bgSound= loadSound("./assets/sound1.mp3");
  eatingSound= loadSound("./assets/eating_sound.mp3");
  sadSound= loadSound("./assets/sad.wav");
  cutSound= loadSound("./assets/rope_cut.mp3");
  blowSound= loadSound("./assets/air.wav");
  
  blink.playing = true;
  eat.playing = true;
  sad.playing = true;
  sad.looping= false;
  eat.looping = false; 
}

function setup() {

  var isMobile= /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    canW= displayWidth;
    canH= displayHeight;
    createCanvas(displayWidth+50, displayHeight);
  }
  else{
    canW= windowWidth;
    canH= windowHeight;
    createCanvas(windowWidth-10, windowHeight-10);
  }


  frameRate(80);

  bgSound.play();
  bgSound.setVolume(0.2);

  engine = Engine.create();
  world = engine.world;
  
  button = createImg('./images/cut_btn.png');
  button.position(220,30);
  button.size(50,50);
  button.mouseClicked(drop);

  btn2= createImg("./images/cut_btn.png");
  btn2.position(80, 130);
  btn2.size(50,50);
  btn2.mouseClicked(drop2);
  
  muteBtn= createImg("./images/mute.png");
  muteBtn.position(width-50, 20);
  muteBtn.size(50,50);
  muteBtn.mouseClicked(mute);

  airBlower= createImg("./images/balloon.png");
  airBlower.position(20,260);
  airBlower.size(80,80);
  airBlower.mouseClicked(airBlow);

  blink.frameDelay = 10;
  eat.frameDelay = 20;
  bunny = createSprite(230,canH-80,100,100);
  bunny.scale = 0.2;
  bunny.velocityX= -2;

  edges= createEdgeSprites();
  

  bunny.addAnimation('blinking',blink);
  bunny.addAnimation('eating',eat);
  bunny.addAnimation('crying',sad);
  bunny.changeAnimation('blinking');
  
  rope = new Rope(7,{x:245,y:30});
  rope2= new Rope(7, {x:100, y:130});

  ground = new Ground(width/2,canH,canW,20);
  
  fruit = Bodies.circle(300,300,20);
  Matter.Composite.add(rope.body,fruit);
  //Matter.Composite.add(rope2.body,fruit);

  fruit_con = new Link(rope,fruit);
  fruit_con2= new Link(rope2, fruit);

  rectMode(CENTER);
  ellipseMode(RADIUS);
  imageMode(CENTER);
  
}

function draw() 
{
  background(51);
  image(bg_img,width/2,height/2,canW+50,canH);

  if (fruit!=null) {
    push();
    translate(fruit.position.x,fruit.position.y);
    image(food,0, 0,70,70);
    pop();
  }


  rope.show();
  rope2.show();
  Engine.update(engine);
  ground.show();

  if (collide(fruit, bunny)) {
    gamestate= WIN;

    if (!eatingSound.isPlaying()) {
      eatingSound.play();
    }    
  }

  if (collide(fruit, ground.body)) {
    gamestate= END;

    if (!sadSound.isPlaying()) {
      sadSound.play(); 
    }

  }

    bunny.bounceOff(edges);

  if (gamestate== WIN) {
    bunny.changeAnimation("eating");
    bunny.velocityX= 0;

    textSize(50);
    textAlign("center");
    textFont("Courier New");
    stroke("orange");
    strokeWeight(17);
    fill("yellow");
    text("⭐WELL DONE⭐", width/2, height/2);
  }

  if (gamestate== END) {
    bunny.changeAnimation("crying");
    bunny.velocityX= 0;

    textSize(50);
    textAlign("center");
    stroke("black");
    strokeWeight(17);
    textFont("Courier New");
    fill("red");
    text("❌GAME OVER❌", width/2, height/2);
  }

   drawSprites();
}

function drop()
{
  rope.break();
  cutSound.play();
  fruit_con.detach();
  fruit_con = null; 
}

function drop2(){
  rope2.break();
  cutSound.play();
  fruit_con2.detach();
  fruit_con2= null;
}

function collide(fruitBody, body) {
  
  if (fruitBody!= null) {
    var d= dist(fruitBody.position.x, fruitBody.position.y, body.position.x, body.position.y);

    if (d<=100) {
      World.remove(world, fruit);
      fruit= null;
      return true;
    }
    else{
      return false;
    }
  }

}

function mute(){
  if (bgSound.isPlaying()) {
    bgSound.stop();
  }
  else{
    bgSound.play();
  }
}

function airBlow(){

  if (fruit_con!==null && fruit_con2!==null) {
    Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0.07, y:0});
  }

}

