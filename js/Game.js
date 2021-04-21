class Game {
  constructor() {
    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.playerMoving = false;
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();
    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;
    cars = [car1, car2];

    fuels = new Group();
    powerCoins = new Group();

    for (var i = 0; i < 4; i++) {
      var newFuel = createSprite(
        random(width / 2 + 150, width / 2 - 150),
        random(-height * 4.5, height - 400)
      );

      newFuel.addAnimation("normal", fuelImage, fuelImage);
      newFuel.scale = 0.02;
      fuels.add(newFuel);
    }

    for (var i = 0; i < 18; i++) {
      var power = createSprite(
        random(width / 2 + 150, width / 2 - 150),
        random(-height * 4.5, height - 400)
      );

      power.addAnimation("normal", powerCoinImage, powerCoinImage);
      power.scale = 0.09;
      powerCoins.add(power);
    }
  }

  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");

    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);

    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
      // bgImg = backgroundImage2;
      image(track, 0, -height * 5, width, height * 6);

      this.showLife();
      this.showFuel();
      this.showLeaderboard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].distanceX;
        var y = height - allPlayers[plr].distanceY;

        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        if (index === player.index) {
          this.handleFuel(index);
          this.handlePowerCoins(index);
          this.handleCarACollisionWithCarB(index);

          stroke(10);
          fill("red");
          ellipse(
            cars[index - 1].position.x,
            cars[index - 1].position.y,
            60,
            60
          );

          // Changing camera position in y direction
          camera.position.y = cars[index - 1].position.y;
        }
      }

      if (this.playerMoving) {
        player.distanceY += 5;
        player.update();
      }
    }

    if (keyIsDown(UP_ARROW) && player.index !== null) {
      this.playerMoving = true;
      player.distanceY += 10;
      player.update();
    }

    if (
      keyIsDown(LEFT_ARROW) &&
      player.index !== null &&
      player.distanceX > width / 3 - 50
    ) {
      player.distanceX -= 5;
      player.update();
    }

    if (
      keyIsDown(RIGHT_ARROW) &&
      player.index !== null &&
      player.distanceX < width / 2 + 300
    ) {
      player.distanceX += 5;
      player.update();
    }

    // Finshing Line
    const finshLine = height * 6 - 100;

    if (player.distanceY > finshLine) {
      gameState = 2;
      player.rank += 1;
      Player.updateCarsAtEnd(player.rank);
      player.update();
      this.showRank();
    }

    drawSprites();
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      game.reset();
      window.location.reload();
    });
  }

  reset() {
    database.ref("/").set({
      carsAtEnd: 0,
      playerCount: 0,
      gameState: 0,
      palyers: {}
    });
  }

  showLeaderboard() {
    var leader1, leader2;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
  }

  showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.distanceY - 400, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.distanceY - 400, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.distanceY - 400, player.life, 20);
    noStroke();
    pop();
  }

  showFuel() {
    push();
    image(fuelImage, width / 2 - 130, height - player.distanceY - 350, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.distanceY - 350, 185, 20);
    fill("#ffc400");
    rect(width / 2 - 100, height - player.distanceY - 350, player.fuel, 20);
    noStroke();
    pop();
  }

  handleFuel(index) {
    // Reducing Player car fuel
    if (player.fuel > 0 && this.playerMoving) {
      player.fuel -= 0.3;
    }
    cars[index - 1].overlap(fuels, this.collectFuel);

    if (player.fuel <= 0) {
      gameState = 2;
      player.update();
      this.gameOver();
    }
  }

  collectFuel(collector, collected) {
    player.fuel = 185;
    //collected is the sprite in the group collectibles that triggered
    //the event
    collected.remove();
  }

  handlePowerCoins(index) {
    cars[index - 1].overlap(powerCoins, function(collector, collected) {
      player.score += 7 * 3;
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  handleCarACollisionWithCarB(index) {
    if (index === 1) {
      var x1 = cars[index - 1].position.x;
      var y1 = cars[index - 1].position.y;

      var x2 = cars[1].position.x;
      var y2 = cars[1].position.y;
      var d = dist(x1, y1, x2, y2);
      if (d === 50) {
        if (player.life > 0) player.life -= 43.25;
      }
    }

    if (index === 2) {
      var x1 = cars[index - 1].position.x;
      var y1 = cars[index - 1].position.y;

      var x2 = cars[0].position.x;
      var y2 = cars[0].position.y;
      var d = dist(x1, y1, x2, y2);
      if (d === 50) {
        if (player.life > 0) player.life -= 43.25;
      }
    }
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
  }

  end() {
    // bgImg = backgroundImage;
  }
}
