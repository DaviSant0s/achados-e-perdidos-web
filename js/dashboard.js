const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'login.html'; // Redireciona para login se não tiver token
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}