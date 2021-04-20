class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.resetButton.class("resetButton");
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
    this.resetButton.position(width / 2 + 230, 100);
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if (allPlayers !== undefined) {
      bgImg = backgroundImage2;
      image(track, 0, -height * 5, width, height * 6);

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
      this.showLeaderboard();
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
