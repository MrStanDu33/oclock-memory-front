class Map {
  constructor() {
    this.boot();
  }

  boot() {
    this.map = [];

    this.buildMap();
    this.placeCards();
  }

  getMap() {
    return this.map;
  }

  static getRandomPos() {
    const y = Math.floor(Math.random() * (GAME_ROWS - 1 - 0 + 1) + 0);
    const x = Math.floor(Math.random() * (GAME_COLS - 1 - 0 + 1) + 0);
    return { x, y };
  }

  getAvailableRandomPos(runs = 0) {
    const pos = Map.getRandomPos();
    if (this.map[pos.y][pos.x].icon) {
      if (runs >= (GAME_COLS - 1) * (GAME_ROWS - 1) * 5) {
        throw new Error('No more cell can be found');
      }
      return this.getAvailableRandomPos(runs + 1);
    }
    return pos;
  }

  buildMap() {
    this.map = [];
    for (let y = 0; y < GAME_ROWS; y += 1) {
      this.map.push([]);
      for (let x = 0; x < GAME_COLS; x += 1) {
        this.map[y].push(
          new Card({
            pos: { x, y },
            icon: null,
            status: 'hidden',
          }),
        );
      }
    }
  }

  placeCards() {
    const cardsList = Card.getCards();
    cardsList.forEach((card) => {
      const position1 = this.getAvailableRandomPos();
      this.map[position1.y][position1.x].icon = card;
      const position2 = this.getAvailableRandomPos();
      this.map[position2.y][position2.x].icon = card;
    });
  }

  setTempVisibleCard(pos) {
    this.map[pos.y][pos.x].setTempVisible();
  }

  setVisibleCard(pos) {
    this.map[pos.y][pos.x].setVisible();
  }

  setHiddenCard(pos) {
    this.map[pos.y][pos.x].setHidden();
  }

  getTempVisibleCard() {
    return this.map.flat().find((card) => card.getStatus() === 'tempVisible');
  }

  getCell(pos) {
    return this.map[pos.y][pos.x];
  }
}
