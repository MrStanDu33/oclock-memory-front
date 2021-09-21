class Game {
  constructor(gameContainer, timerContainer) {
    this.boot(gameContainer, timerContainer);
  }

  async boot(gameContainer, timerContainer) {
    const rawResponse = await fetch('http://localhost:3000/api/v1/game/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    const response = await rawResponse.json();
    this.gameId = response.id;
    this.gameContainer = gameContainer;
    this.timerContainer = timerContainer;
    this.timeLeft = 120;
    this.map = new Map();
    this.printMap();
    this.setTimer();
    this.setClickListeners();
  }

  refreshTimer() {
    const timerEl = this.timerContainer.querySelector('div.time');
    timerEl.style.height = `${(100 * this.timeLeft) / 120}%`;
  }

  setTimer() {
    this.timerInterval = window.setInterval(async () => {
      this.timeLeft -= 1;
      this.refreshTimer();
      if (this.isTimeOver() || this.isGameFinished()) {
        window.clearInterval(this.timerInterval);
      }
      if (this.isTimeOver()) {
        await fetch(`http://localhost:3000/api/v1/game/${this.gameId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: false,
            timeLeft: 0,
          }),
        });
        const wantContinue = window.confirm(
          'Temps écoulé ! Voulez-vous recommencer ?',
        );
        if (wantContinue) {
          window.location.reload();
        }
      }
      if (this.isGameFinished()) {
        await fetch(`http://localhost:3000/api/v1/game/${this.gameId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: true,
            timeLeft: this.timeLeft,
          }),
        });
        const wantContinue = window.confirm(
          'Jeu réussi ! Voulez-vous recommencer ?',
        );
        if (wantContinue) {
          window.location.reload();
        }
      }
    }, 1000);
  }

  isTimeOver() {
    return this.timeLeft === 0;
  }

  isGameFinished() {
    return !JSON.stringify(this.map.getMap()).includes('"status":"hidden"');
  }

  printMap() {
    this.map.getMap().forEach((row, y) => {
      const rowElement = document.createElement('tr');
      rowElement.classList.add('row');
      rowElement.dataset.y = y;
      this.gameContainer.appendChild(rowElement);
      row.forEach((cell, x) => {
        const cellElement = document.createElement('td');
        cellElement.classList.add('card', 'hidden');
        cellElement.dataset.y = y;
        cellElement.dataset.x = x;
        cellElement.innerHTML = /* html */ `
          <div class="front flex row nowrap xCenter yCenter">${cell.icon}</div>
          <div class="back flex row nowrap xCenter yCenter"></div>
        `;
        rowElement.appendChild(cellElement);
      });
    });
  }

  refreshMap() {
    this.map.getMap().forEach((row) => {
      row.forEach((cell) => {
        const cardEl = document.querySelector(
          `td.card[data-y="${cell.pos.y}"][data-x="${cell.pos.x}"]`,
        );
        if (cell.getStatus() === 'hidden') {
          cardEl.classList.add('hidden');
          return;
        }
        if (cell.getStatus() === 'tempVisible') {
          cardEl.classList.remove('hidden');
          return;
        }
        if (cell.getStatus() === 'visible') {
          cardEl.classList.remove('hidden');
        }
      });
    });
  }

  setClickListeners() {
    const cards = this.gameContainer.querySelectorAll('td.card');
    cards.forEach((cardEl) => {
      const card = this.map.getCell({
        x: cardEl.dataset.x,
        y: cardEl.dataset.y,
      });
      cardEl.addEventListener('click', () => {
        if (this.failMatchDelay) return;
        if (this.isTimeOver()) return;

        const tempVisibleCard = this.map.getTempVisibleCard();

        if (tempVisibleCard === undefined) {
          this.map.setTempVisibleCard(card.pos);
          this.refreshMap();
          return;
        }

        if (tempVisibleCard.icon !== card.icon) {
          this.failMatchDelay = true;
          this.map.setTempVisibleCard(card.pos);
          window.setTimeout(() => {
            this.map.setHiddenCard(card.pos);
            this.map.setHiddenCard(tempVisibleCard.pos);
            this.refreshMap();
            this.failMatchDelay = false;
          }, 800);
          this.refreshMap();
          return;
        }
        this.map.setVisibleCard(tempVisibleCard.pos);
        this.map.setVisibleCard(card.pos);
        this.refreshMap();
      });
    });
  }
}
