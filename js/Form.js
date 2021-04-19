class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Enter your name");
    this.playButton = createButton("Play");
    this.greeting = createElement("h2");

    // this.reset = createButton("Reset");
  }

  setElementsPosition() {
    this.input.position(width / 2 - 100, height / 2 - 80);
    this.playButton.position(width / 2 - 90, height / 2 - 30);
    this.greeting.position(width / 2 - 300, height / 2 - 200);
  }

  setElementsStyle() {
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.greeting.class("greeting");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  handleMousePressed() {
    this.playButton.mousePressed(() => {
      this.input.hide();
      this.playButton.hide();
      var message = `
      Hello ${this.input.value()}
      </br></br>wait for another player to join...`;
      this.greeting.html(message);
      playerCount += 1;
      player.name = this.input.value();
      player.index = playerCount;
      player.update();
      player.updateCount(playerCount);
    });
  }

  display() {
    this.setElementsPosition();
    this.setElementsStyle();
    this.handleMousePressed();
    // this.reset.position(displayWidth - 100, 20);
    //

    //
    // this.reset.mousePressed(() => {
    //   player.updateCount(0);
    //   game.update(0);
    // });
  }
}
