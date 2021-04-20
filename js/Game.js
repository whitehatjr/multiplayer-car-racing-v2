class Game {
  constructor() {
    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
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

    this.leadeboardTitle.html("Leaders");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 20, 40);

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
      bgImg = backgroundImage2;
      image(track, 0, -height * 5, width, height * 6);

      this.showLife();
      this.showFuel();
      this.showLeaderboard();

      if (player.fuel > 0) {
        player.fuel -= 0.3;
      }

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
    }

    if (keyIsDown(UP_ARROW) && player.index !== null) {
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
        players[0].distanceY;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].distanceY;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].distanceY;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].distanceY;
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

  end() {
    bgImg = backgroundImage;
  }
}
