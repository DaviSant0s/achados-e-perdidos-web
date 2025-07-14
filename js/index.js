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
  const container = document.querySelector('.row');
  container.innerHTML = '';

  objetos.forEach((obj) => {
    const primeiraImagem =
      obj.Pictures.length > 0
        ? `http://localhost:3000/public/${obj.Pictures[0].img}`
        : '';

    container.innerHTML += `
      <div class="col">
        <div class="card shadow-lg">
          <div class="card-img-top border-bottom d-flex justify-content-center align-items-center pb-3 pt-3">
            <img src="${primeiraImagem}" style="height: 120px; object-fit: cover;" alt="${obj.name}" />
          </div>
          <div class="card-body d-flex flex-column">
            <h4 class="card-title fw-bold">${obj.name}</h4>
            <p class="card-text">${obj.description}</p>
            <button class="btn btn-primary btn-detalhes" data-id="${obj.id}" data-bs-toggle="modal" data-bs-target="#detalhesModal">Mais detalhes</button>
          </div>
        </div>
      </div>`;
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
        // aqui renderiza as informações
        document.getElementById('detalhesDescricao').innerHTML = `
          <strong>Nome:</strong> ${obj.name}<br>
          <strong>Descrição:</strong> ${obj.description}<br>
          <strong>Categoria:</strong> ${obj.category}<br>
          <strong>Local da perda:</strong> ${obj.location_of_loss}<br>
          <strong>Data da perda:</strong> ${formatarData(obj.date_of_loss)}<br>

          <h4 class='fs-4 mb-2 mt-3'>Informações do prprietário:</h4>

          <strong>Nome:</strong> ${obj.User.firstName} ${obj.User.lastName}<br>
          <strong>Email:</strong> ${obj.User.email}</br>
          <strong>Telefone:</strong> ${obj.User.contactNumber}
        `;

        // aqui renderiza as imagens

        const imagensContainer = document.getElementById('detalhesImagens');
        imagensContainer.innerHTML = ''; // limpa o qu estava

        let imagensHTML = '';

        obj.Pictures.forEach((picture) => {

          imagensHTML += `
              <img 
                src="http://localhost:3000/public/${picture.img}" 
                alt="${obj.name}" 
                style="height: 120px; object-fit: cover;" 
                class="rounded shadow-sm"
              />
          `;

        });

        imagensContainer.innerHTML = imagensHTML;
      }
    });
  });
}

async function carregarObjetos() {
  objetosCarregados = await buscarObjetos();
  renderizarObjetos(objetosCarregados);
}

window.addEventListener('DOMContentLoaded', carregarObjetos);
