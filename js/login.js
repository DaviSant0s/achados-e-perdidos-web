
// Verifica se já está logado
const token = localStorage.getItem('token');

if (token) {
  window.location.href = 'dashboard.html'; // Ou onde for sua página protegida
}

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('http://localhost:3000/api/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }

    if (data.token) {
      localStorage.setItem('token', data.token);
      window.location.href = 'dashboard.html';
    } else {
      alert(data.message || 'Usuário ou senha inválidos!');
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});
