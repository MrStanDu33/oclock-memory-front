(() => {
  const signAsGuest = document.querySelector('.signAsGuest');
  const loginForm = document.querySelector('#loginForm');
  const signupForm = document.querySelector('#registerForm');
  const switchToSignup = loginForm.querySelector('.toggleSignup');
  const switchToLogin = signupForm.querySelector('.toggleLogin');

  signAsGuest.addEventListener('click', () => {
    alert('sign as guest not available');
  });

  switchToSignup.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    loginForm.style.display = 'none';
    signupForm.style.display = 'flex';
  });

  switchToLogin.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    signupForm.style.display = 'none';
    loginForm.style.display = 'flex';
  });

  loginForm.addEventListener('submit', async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const email = loginForm.querySelector('input#email').value;
    const password = loginForm.querySelector('input#password').value;
    const rawResponse = await fetch(`${API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const response = await rawResponse.json();
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    window.location.href = 'game.html';
  });

  signupForm.addEventListener('submit', async (e) => {
    e.stopPropagation();
    e.preventDefault();
    const firstName = signupForm.querySelector('input#firstName').value;
    const lastName = signupForm.querySelector('input#lastName').value;
    const username = signupForm.querySelector('input#username').value;
    const email = signupForm.querySelector('input#email').value;
    const password = signupForm.querySelector('input#password').value;
    const rawResponse = await fetch(`${API_URL}/user/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName,
        lastName,
        username,
        email,
        password,
      }),
    });
    const response = await rawResponse.json();
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('user', JSON.stringify(response.user));
    window.location.href = 'game.html';
  });
})();
