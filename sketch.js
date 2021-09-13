var bg,bgImg, bullet, bulletImg, bulletGroup,destroySound;
var player, shooterImg, shooter_shooting, za, zaGroup;
var heart_1,heart_2,heart_3,heart_1Img,heart_2Img,heart_3Img;
var lifeline = 3;
var gameState = "play";
var score = 0;
var bullets = 50;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png");
  shooter_shooting = loadImage("assets/shooter_3.png");
  za = loadImage("assets/zombie.png");
  bgImg = loadImage("assets/bg.jpeg");
  bulletImg = loadImage( "assets/bullet.png");
  destroySound = loadSound("assets/explosion.mp3");
  loseSound = loadSound("assets/lose.mp3");
  winSound = loadSound("assets/win.mp3");
  heart_1Img = loadImage("assets/heart_1.png");
  heart_2Img = loadImage("assets/heart_2.png");
  heart_3Img = loadImage("assets/heart_3.png");

}

function setup() {
  createCanvas(700,500);
  console.log(width);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
  bg.addImage(bgImg)
  bg.scale = 1.1
  bg.x = displayWidth/2;

//creating the player sprite
    player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
    player.addImage(shooterImg);
    player.scale = 0.3;
    player.debug = true;
    player.setCollider("rectangle",0,0,300,300);

    heart_1 = createSprite(50,30,10,10);
    heart_1.addImage(heart_1Img);
    heart_1 .scale = 0.1;
    heart_1.visible=false;

    heart_2 = createSprite(50,30,10,10);
    heart_2.addImage(heart_2Img);
    heart_2 .scale = 0.1;
    heart_2.visible=false;

    heart_3 = createSprite(50,30,10,10);
    heart_3.addImage(heart_3Img);
    heart_3 .scale = 0.1;
    heart_3.visible=false;

    zaGroup = new Group();
    bulletGroup = new Group();
}

function draw() {
  background(0); 

  if(gameState === "play"){
    
    if(lifeline === 3){
      heart_3.visible = true;
      heart_2.visible = false;
      heart_1.visible = false;
    }
    if(lifeline === 2){
      heart_3.visible = false;
      heart_2.visible = true;
      heart_1.visible = false;
    }
    
    if(lifeline === 1){
      heart_3.visible = false;
      heart_2.visible = false;
      heart_1.visible = true;
    }
    if(lifeline === 0){
      heart_3.visible = false;
      heart_2.visible = false;
      heart_1.visible = false;
      gameState = "lose";
    }

    if(score === 10){
      gameState = "win"; 
      winSound.play();
    }
    
    bg.velocityX = -3;

    spawnz();

    if(bg.x<0){
      bg.x = displayWidth/2+20;
    }

    //moving the player up and down and making the game mobile compatible using touches
    if(keyDown("UP_ARROW")||touches.length>0){
      player.y = player.y-30
    }
    if(keyDown("DOWN_ARROW")||touches.length>0){
    player.y = player.y+30
    }

    //release bullets and change the image of shooter to shooting position when space is pressed
    if(keyWentDown("space")){
      player.addImage(shooter_shooting);
      bullet = createSprite(displayWidth-1080,player.y-25,10,5);
      bullet.addImage(bulletImg); 
      bullet.velocityX = 10;
      bullet.scale = 0.02;
      destroySound.play();
      bullets = bullets-1;
      bulletGroup.add(bullet);
    }

    //player goes back to original standing image once we stop pressing the space bar
    else if(keyWentUp("space")){
      player.addImage(shooterImg);
    }

    if(bullets === 0){
      gameState="bullet";
      loseSound.play();  
    }

    if(zaGroup.isTouching(bulletGroup)){
      for(var i = 0;i<zaGroup.length;i++){
        zaGroup[i].destroy();
        bulletGroup.destroyEach(); 
        score = score+1;
      }
    }
  
    if(zaGroup.isTouching(player)){
      loseSound.play();
      for(var i = 0;i<zaGroup.length;i++){
        zaGroup[i].destroy();
        lifeline = lifeline-1;
      }
    }  
  }
 
  drawSprites();

  textSize(20);
  fill("white");
  text("Ammo: " + bullets,600,30);
  text("Score: " + score,600,60);
  text("Lifeline: " + lifeline,600,90);

  if(gameState === "lose"){
    textSize(110);
    fill("red");
    text("You Lose ",100,300);
    zaGroup.destroyEach();
    player.destroy();
    bg.velocityX=0;
  }
  else if(gameState === "win"){
    textSize(110);
    fill("green");
    text("You Won ",100,300);
    zaGroup.destroyEach();
    player.destroy();
    bg.velocityX=0;
  }
  else if(gameState === "bullet"){
    textSize(110);
    fill("green");
    text("Out of Ammo ",100,300);
    zaGroup.destroyEach();
    player.destroy();
    bg.velocityX=0;
  }
}

function spawnz(){
  if (frameCount % 200 === 0) {
    z = createSprite(770, 400, 20, 5);
    z.addImage(za);
    z.scale = 0.15;
    z.velocityX = -3;
    z.debug = true;

    zaGroup.add(z);
  }
}
