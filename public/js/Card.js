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
    return [
      '\u{1F95D}',
      '\u{1F965}',
      '\u{1F347}',
      '\u{1F348}',
      '\u{1F349}',
      '\u{1F34A}',
      '\u{1F34B}',
      '\u{1F34C}',
      '\u{1F34D}',
      '\u{1F96D}',
      '\u{1F34E}',
      '\u{1F34F}',
      '\u{1F350}',
      '\u{1F351}',
    ];
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
