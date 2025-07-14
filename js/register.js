const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const contactNumber = document.getElementById('contactNumber').value;

  try {
    const response = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, contactNumber }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer o cadastro');
    }

    alert(data.message || 'Cadastro realizado com sucesso!');
    window.location.href = 'login.html';


  } catch (error) {
    console.error(error);
    alert(error.message || 'Erro ao cadastrar.');
  }

});