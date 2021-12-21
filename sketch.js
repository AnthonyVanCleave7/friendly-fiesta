var bg,bgImg;
var player, shooterImg, shooter_shooting;
var enemy_Img
var enemyGroup
var heart1,heart2,heart3;
var heart1Img, heart2Img, heart3Img;
var bullet_Img
var score = 0;
var life = 3;
var bullets = 70;
var gameState = "fight"
var bulletGroup
var lose, winning, explosionSound;


function preload(){
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")

  shooterImg = loadImage("assets/hunter_1.png")
  shooter_shooting = loadImage("assets/hunter_2.png")

  bgImg = loadImage("assets/bg.jpg")
enemy_Img = loadImage("assets/enemy.png")
bullet_Img = loadImage("assets/bullet.png")

lose = loadSound("assets/lose.mp3")
winning = loadSound("assets/win.mp3")
explosionSound = loadSound("assets/explosion.mp3")
}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 2.25
imageMode(CENTER)
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 2
   player.debug = false
   player.setCollider("rectangle",0,0,100,100)

   heart1 = createSprite(displayWidth-150,40,20,20)
   heart1.visible = false
    heart1.addImage("heart1",heart1Img)
    heart1.scale = 0.4

    heart2 = createSprite(displayWidth-100,40,20,20)
    heart2.visible = false
    heart2.addImage("heart2",heart2Img)
    heart2.scale = 0.4

    heart3 = createSprite(displayWidth-150,40,20,20)
    heart3.addImage("heart3",heart3Img)
    heart3.scale = 0.4


enemyGroup= new Group()
bulletGroup = new Group()
}

function draw() {
  background(0); 

if(gameState === "fight"){

  //displaying the image according to the remaining lives remaining
if(life===3){
  heart3.visible = true
  heart2.visible = false
  heart1.visible = false
}
if(life===2){
  heart2.visible = true
  heart1.visible = false
  heart3.visible = false
}
if(life===1){
  heart1.visible = true
  heart2.visible = false
  heart3.visible = false
}

// go to gameState "lost" when 0 lives are remaining
if(life===0){
  gameState = "lost"

}

//go to gameState "won" if score is 100
if(life===100){
  gameState = "won"
  winning.play();
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
 bullet = createSprite(displayWidth-1150,player.y-30,20,10);
 bullet.addImage(bullet_Img)
 bullet.velocityX = 10;
bullet.scale = 0.5
 bulletGroup.add(bullet)
 player.depth = bullet.depth
 player.depth = player.depth+2
  player.addImage(shooter_shooting)
 bullets = bullets-1
}

//player goes back to original standing image once we stop pressing the space bar
else if(keyWentUp("space")){
  player.addImage(shooterImg)
}

//go to gameState "bullet" when player runs out of bullets
if(bullets==0){
  gameState = "bullet"
  lose.play();
}

//destroy the enemy when bullet touches it
if(enemyGroup.isTouching(bulletGroup)){
  for(var i=0;i<enemyGroup.length;i++){
    if(enemyGroup[i].isTouching(bulletGroup)){
      enemyGroup[i].destroy()
      bulletGroup.destroyEach()
      explosionSound.play();

      score = score+2
    }
  }
}

//reduce life and destroy zombie when player touches it
if(enemyGroup.isTouching(player)){
  lose.play();

  for(var i=0; i<enemyGroup.length;i++){
    if(enemyGroup[i].isTouching(player)){
      enemyGroup[i].destroy();

      life=life-1
    }
  }
}
enemy();
}
drawSprites();

//displaying the score and remaining lives and bullets
textSize(20)
fill("white")
text("Bullets = " +bullets,displayWidth-210,displayHeight/2-250)
text("Score = " + score,displayWidth-200, displayHeight/2-220)
text("Lives = " + life, displayWidth-200,displayHeight/2-280)


// destroy zombie and player and display a message in gameState "lost"
if(gameState == "lost"){

  textSize(100);
  fill("red")
  text("You Lost", 400,400)
  enemyGroup.destroyEach();
  player.destroy();
}
//destroy zombie and player and display a message in gameState "won"
else if(gameState =="won"){

  textSize(100)
  fill("yellow")
  text("You Won",400,400)
  enemyGroup.destroyEach()
  player.destroy();
}

//destroy zombie, player and bullets and display a message in gameState "bullet"
else if (gameState =="bullet"){

  textSize(50)
  fill("yellow")
  text("You ran out of bullets!",470,410)
enemyGroup.destroyEach();
player.destroy()
bulletGroup.destroyEach();
}
}

function enemy(){
  if(frameCount%50===0){

  villian = createSprite(random(500,1100),random(100,500),40,40)

  villian.addImage(enemy_Img);
  villian.scale = 2.2
  villian.velocityX = -3
  villian.debug = false
  villian.setCollider("rectangle",0,0,50,50)

  villian.lifetime=400
  enemyGroup.add(villian)
  }
}