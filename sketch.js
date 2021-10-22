var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var object, objectsGroup, brickImage,coinImage;
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;


function preload(){
  run_running = loadAnimation("RUN2.png","RUN3.png","RUN4.png");
  run_collided   = loadImage("RUN.png")
  pipe  = loadImage("pipe.png");
  box  = loadImage("box.png");
  backgroundImage=loadImage("MY BG.jpg")
  
  coinImage=loadImage("Coin.png")
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  restartImage = loadImage("restart.png");
  gameoverImage = loadImage("gameOver.png");
  jump=loadSound("jump.mp3")
  checkpoint=loadSound("checkpoint.mp3")
  die=loadSound("die.mp3")
  
}

function setup() {
  createCanvas(600, 200);
  
  run = createSprite(50,150,20,50);
  run.addAnimation("running", run_running);
  run.addAnimation("collided" , run_collided);
  run.scale = 0.10;
  run.debug=true;
  run.setCollider("rectangle",0,0,500,100)
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(200,170,400,10);
  invisibleGround.visible = false;

  gameOver=createSprite(300,80,10,10);
  gameOver.addImage("moving",gameoverImage);
  gameOver.scale=2.5

  restart=createSprite(300,130,20,50);
  restart.addImage("moving",restartImage)
  restart.scale=0.5
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  coinsGroup=new Group();
  
  console.log("Hello" + 5);
  
  score = 0;
}

function draw() {
  background(backgroundImage);
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){
    restart.visible=false;
    gameOver.visible=false;
    //move the ground
    ground.velocityX = -(4+score/100);
    score = score + Math.round( getFrameRate()/60);
    if(keyDown("space")&& run.y >= 160) {
       run.velocityY = -15;
      jump.play()
    }
    
    run.velocityY = run.velocityY + 0.8
    
    if (ground.x < 0){
        ground.x = ground.width/2;
    } 

    if(score%500===0&&score>0) {
      checkpoint.play()
    }
    //spawn the clouds
    spawnClouds();
    //spawn the coins
    spawnCoins();
  
  //spawn obstacles on the ground
    spawnObstacles();
    if(obstaclesGroup.isTouching(run)){
       gameState=END
      die.play()
      run.changeAnimation(run_collided)
    //run.velocityY=-15
   //jump.play()
     }
  }
  
    else if(gameState === END){
    restart.visible=true;
    gameOver.visible=true;
    //stop the ground
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    coinsGroup.destroyEach()
    run.changeAnimation("collided")
    obstaclesGroup.setLifetimeEach(-1)
    cloudsGroup.setLifetimeEach(-1)
    coinsGroup.setLifetimeEach(-1)
    run.velocityY=0
    if(mousePressedOver(restart)){
       reset()
    }
  }
  
  
  
    run.collide(invisibleGround);
  
  
  
    drawSprites();
}
function reset (){
  gameState=PLAY
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  coinsGroup.destroyEach()
  run.changeAnimation("running")
  score=0
}
function spawnObstacles(){
  if (frameCount % 60 === 0){
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6+score/100);

   
    // //generate random obstacles
    var rand = Math.round(random(1,8));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      case 7: obstacle.addImage(box);
              break;     
      case 8: obstacle.addImage(pipe);
              break;        
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(3+score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = run.depth;
    run.depth = run.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
}
  function spawnCoins() {
    //write code here to spawn the clouds
    if (frameCount % 80 === 0) {
       coin = createSprite(600,160,40,10);
      coin.y = Math.round(random(10,100));
      coin.addImage(coinImage);
      coin.scale = 0.01;
      coin.velocityX = -(3+score/100);
      
       //assign lifetime to the variable
      coin.lifetime = 200;
      
      //adjust the depth
      if(run.isTouching(coinsGroup)){
        coinsGroup.destroyEach()
      }
      
      //adding cloud to the group
     coinsGroup.add(coin);
    }
  }
  