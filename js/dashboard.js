const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'login.html'; // Redireciona para login se não tiver token
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

let objetosCarregados = [];

async function buscarObjetos() {
  try {
    const response = await fetch('http://localhost:3000/api/object/getObjects');
    if (!response.ok) throw new Error('Erro ao buscar objetos');
    const { objects } = await response.json();
    return objects;
  } catch (error) {
    console.error(error);
    alert(error.message);
    return [];
  }
}

function renderizarObjetos(objetos) {
  const tabela = document.getElementById('tabelaObjetos');
  tabela.innerHTML = '';

  objetos.forEach((obj) => {
    const primeiraImagem = obj.Pictures.length > 0
      ? `http://localhost:3000/public/${obj.Pictures[0].img}`
      : '';

    tabela.innerHTML += `
      <tr>
        <td><img src="${primeiraImagem}" alt="${obj.name}" style="height: 60px; object-fit: cover;" class="rounded shadow-sm" /></td>
        <td>${obj.name}</td>
        <td>${obj.description}</td>
        <td>${obj.category}</td>
        <td>${obj.location_of_loss}</td>
        <td>${formatarData(obj.date_of_loss)}</td>
        <td><button onClick='configurarModal()' class="btn btn-primary btn-detalhes" data-id="${obj.id}" data-bs-toggle="modal" data-bs-target="#detalhesModal">Mais detalhes</button></td>
      </tr>`;
  });

  configurarModal();
}

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

function configurarModal() {
  document.querySelectorAll('.btn-detalhes').forEach((botao) => {
    botao.addEventListener('click', () => {
      const id = botao.dataset.id;
      const obj = objetosCarregados.find((obj) => obj.id == id);

      if (obj) {
        document.getElementById('detalhesDescricao').innerHTML = `
          <strong>Nome:</strong> ${obj.name}<br>
          <strong>Descrição:</strong> ${obj.description}<br>
          <strong>Categoria:</strong> ${obj.category}<br>
          <strong>Local da perda:</strong> ${obj.location_of_loss}<br>
          <strong>Data da perda:</strong> ${formatarData(obj.date_of_loss)}<br>

          <h4 class='fs-4 mb-2 mt-3'>Informações do proprietário:</h4>

          <strong>Nome:</strong> ${obj.User.firstName} ${obj.User.lastName}<br>
          <strong>Email:</strong> ${obj.User.email}</br>
          <strong>Telefone:</strong> ${obj.User.contactNumber}
        `;

        const imagensContainer = document.getElementById('detalhesImagens');
        imagensContainer.innerHTML = '';

        obj.Pictures.forEach((picture) => {
          const img = document.createElement('img');
          img.src = `http://localhost:3000/public/${picture.img}`;
          img.alt = obj.name;
          img.style.height = '120px';
          img.style.objectFit = 'cover';
          img.classList.add('rounded', 'shadow-sm');
          imagensContainer.appendChild(img);
        });
      }
    });
  });
}

async function carregarObjetos() {
  objetosCarregados = await buscarObjetos();
  renderizarObjetos(objetosCarregados);
}

window.addEventListener('DOMContentLoaded', carregarObjetos);
