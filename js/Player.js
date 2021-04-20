class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.distanceX = 0;
    this.distanceY = 0;
    this.rank = 0;
    this.fuel = 185;
    this.life = 185;
  }

  addPlayer() {
    var playerIndex = "players/player" + this.index;
    var distanceX;
    if (this.index === 1) {
      distanceX = width / 2 - 100;
    } else {
      distanceX = width / 2 + 100;
    }

    database.ref(playerIndex).set({
      name: this.name,
      distanceX: distanceX,
      distanceY: this.distanceY,
      rank: this.rank
    });
  }

  getDistance() {
    var playerDistanceRef = database.ref("players/player" + this.index);
    playerDistanceRef.on("value", data => {
      var data = data.val();
      this.distanceX = data.distanceX;
      this.distanceY = data.distanceY;
    });
  }

  getCount() {
    var playerCountRef = database.ref("playerCount");
    playerCountRef.on("value", data => {
      playerCount = data.val();
    });
  }

  update() {
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      distanceX: this.distanceX,
      distanceY: this.distanceY,
      rank: this.rank
    });
  }

  updateCount(count) {
    database.ref("/").update({
      playerCount: count
    });
  }

  static getPlayersInfo() {
    var playerInfoRef = database.ref("players");
    playerInfoRef.on("value", data => {
      allPlayers = data.val();
    });
  }

  getCarsAtEnd() {
    database.ref("carsAtEnd").on("value", data => {
      this.rank = data.val();
    });
  }

  static updateCarsAtEnd(rank) {
    database.ref("/").update({
      carsAtEnd: rank
    });
  }
}
