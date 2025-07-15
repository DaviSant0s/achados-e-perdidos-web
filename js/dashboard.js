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

    const response = await fetch('http://localhost:3000/api/object/getUserObjects', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error('Erro ao buscar objetos');

    const { objects } = await response.json();

    return objects;

  } catch (error) {

    console.error(error);
    alert(error.message);
    return [];
  }
}

function criarObjeto() {
  // Limpa os campos do modal
  document.getElementById('editarObjetoId').value = '';
  document.getElementById('editarNome').value = '';
  document.getElementById('editarDescricao').value = '';
  document.getElementById('editarCategoria').value = '';
  document.getElementById('editarLocal').value = '';
  document.getElementById('editarData').value = '';

  document.getElementById('editarNovasImagens').value = '';

  // Abre o modal
  const editarModal = new bootstrap.Modal(document.getElementById('editarModal'));
  editarModal.show();

  const form = document.getElementById('formEditarObjeto');

  form.onsubmit = async function (e) {
    e.preventDefault();

    const nome = document.getElementById('editarNome').value;
    const descricao = document.getElementById('editarDescricao').value;
    const categoria = document.getElementById('editarCategoria').value;
    const local = document.getElementById('editarLocal').value;
    const data = document.getElementById('editarData').value;
    const novasImagens = document.getElementById('editarNovasImagens').files;

    const formData = new FormData();
    formData.append("name", nome);
    formData.append("description", descricao);
    formData.append("category", categoria);
    formData.append("location_of_loss", local);
    formData.append("date_of_loss", data);

    for (let file of novasImagens) {
      formData.append("objectPicture", file);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/object/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Erro ao criar o objeto.");

      alert("Objeto criado com sucesso!");

      editarModal.hide();

      carregarObjetos();

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }
}

async function editarObjeto(id){

  const obj = objetosCarregados.find(obj => obj.id === id);

  if (!obj) {
    alert("Objeto não encontrado");
    return;
  }

  // Preenche os campos do modal com os dados do objeto
  document.getElementById('editarObjetoId').value = obj.id;
  document.getElementById('editarNome').value = obj.name;
  document.getElementById('editarDescricao').value = obj.description;
  document.getElementById('editarCategoria').value = obj.category;
  document.getElementById('editarLocal').value = obj.location_of_loss;
  document.getElementById('editarData').value = obj.date_of_loss; // formato YYYY-MM-DD

  // Abre o modal
  const editarModal = new bootstrap.Modal(document.getElementById('editarModal'));
  editarModal.show();

  const form = document.getElementById('formEditarObjeto');

  form.onsubmit = async function (e) {
    e.preventDefault();

    const nome = document.getElementById('editarNome').value;
    const descricao = document.getElementById('editarDescricao').value;
    const categoria = document.getElementById('editarCategoria').value;
    const local = document.getElementById('editarLocal').value;
    const data = document.getElementById('editarData').value;
    const novasImagens = document.getElementById('editarNovasImagens').files;

    const formData = new FormData();
    formData.append("name", nome);
    formData.append("description", descricao);
    formData.append("category", categoria);
    formData.append("location_of_loss", local);
    formData.append("date_of_loss", data);

    for (let file of novasImagens) {
      formData.append("objectPicture", file);
    }

    try {
      const response = await fetch(`http://localhost:3000/api/object/updateObject/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error("Erro ao atualizar o objeto.");

      alert("Objeto atualizado com sucesso!");

      editarModal.hide();

      carregarObjetos();

    } catch (error) {
      console.error(error);
      alert(error.message);
    }

  }
  
}

async function excluirObjeto(id){
  
  if (!confirm("Tem certeza que deseja excluir este item?")) return;

  try {
    const response = await fetch(`http://localhost:3000/api/object/deleteObject/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Erro ao excluir o objeto.");

    alert("Objeto excluído com sucesso!");
    carregarObjetos();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }

}

function renderizarObjetos(objetos) {
  const tabela = document.getElementById('tabelaObjetos');
  tabela.innerHTML = '';

  objetos.forEach((obj) => {
    console.log(obj.id);
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
          <td>
            
            <button class="btn btn-sm btn-warning me-1" onclick="editarObjeto('${obj.id}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="excluirObjeto('${obj.id}')">Excluir</button>
          </td>
      </tr>`;
  });

}

// <button onClick='configurarModal()' class="btn btn-primary btn-detalhes" data-id="${obj.id}" data-bs-toggle="modal" data-bs-target="#detalhesModal">Mais detalhes</button>

function formatarData(dataISO) {
  const [ano, mes, dia] = dataISO.split('-');
  return `${dia}/${mes}/${ano}`;
}

async function carregarObjetos() {
  objetosCarregados = await buscarObjetos();
  renderizarObjetos(objetosCarregados);
}

window.addEventListener('DOMContentLoaded', carregarObjetos);
