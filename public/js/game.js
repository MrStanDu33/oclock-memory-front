(async () => {
  const gameContainer = document.querySelector('table.game');
  const timeContainer = document.querySelector('aside.timer');
  const rawResponse = await fetch('http://localhost:3000/api/v1/game/', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });
  const response = await rawResponse.json();
  const leaderBoardContainer = document.querySelector('ul.leaderBoardList');
  response
    .filter((game) => game.status)
    .forEach((game) => {
      const li = document.createElement('li');
      li.classList.add('flex', 'row', 'nowrap', 'yCenter');
      li.innerHTML = `
        <img alt="${game.User.username}'s avatar" class="avatar" src="${game.User.avatar}" />
        <span class="bold">${game.User.username} - </span>
        <span class="time">${game.timeLeft}s</span>`;
      leaderBoardContainer.appendChild(li);
    });
  const game = new Game(gameContainer, timeContainer);
  window.MemoGame = { game };
})();
