class Card {
  constructor(settings) {
    this.boot(settings);
  }

  boot(settings) {
    const { pos, icon, status } = settings;
    this.pos = pos;
    this.icon = icon;
    this.status = status;
  }

  static getCards() {
    return ICONS;
  }

  getStatus() {
    return this.status;
  }

  setTempVisible() {
    this.status = 'tempVisible';
  }

  setHidden() {
    this.status = 'hidden';
  }

  setVisible() {
    this.status = 'visible';
  }
}
