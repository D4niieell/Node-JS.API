/* Variável - Método - O que faz */

/* name - getElementById: Busca um elemento pelo atributo: id="name" */

/* btSave - getElementById: Busca um elemento pelo atributo: id="btnSave" */

/* telefone - querySelector: Busca um elemento usando seletor: CSS #telefone */

/* email - querySelector: Busca um elemento usando seletor CSS: #email */

/*
Diferença entre os métodos: 
getElementById aceita apenas IDs, enquanto querySelector aceita qualquer seletor CSS 
(classes, tags, IDs, etc.), sendo mais flexível.
*/

/*
btnSave.addEventListener("click", ...)
Adiciona um "ouvinte" que aguarda o clique no botão de salvar.
*/

/* 
e.preventDefault()
Cancela o comportamento padrão do evento. Se o botão estiver dentro de um <form>, 
impede que a página seja recarregada ao clicar.
*/

/* 
const userData = { name: name.value }
Cria um objeto chamado userData contendo o valor digitado no campo name. O .value pega o texto atual do input.
*/

/*
console.log(userData)
Exibe o objeto no console do navegador (DevTools), útil para depuração.
*/

/* 
Resumo do Fluxo
Usuário digita o nome -> clica no botão -> JS captura o valor -> exibe no console 

As variáveis telefone e email são capturadas mas não são utilizadas em nenhuma parte do código, 
indicando que provavelmente seriam usadas futuramente.
*/

const name = document.getElementById("name");
const btnSave = document.getElementById("btnSave");
const telefone = document.querySelector("#telefone");
const email = document.querySelector("#email");
const btnAtualizar = document.querySelector("#btnAtualizar");
const btnCancelar = document.querySelector("#btnCancelar");

const resultado = document.querySelector("#resultado");

/* ternaria => condução ? bloco de codigo : */
const storeData = localStorage.getItem("users")
  ? JSON.parse(localStorage.getItem("users"))
  : [];

  /* 
    name.addEventListener("input", (e) => {
      console.log(name.value);
    
    });
  */

const loadData = () => {
  for (let i = 0; i < storeData.length; i++) {
    const user = storeData[i];
    console.log(user);

    resultado.innerHTML += `
    <div class="card">
      <h1>Cliente</h1>
      <h2>${user.name};</h2>
      <div>${user.email};</div>
      <div>${user.telefone};</div>
      <br>
      <div class="btn-action">
        <button class="edit" data-id="${user.id}">Editar</button>
        <button class="delete" data-id="${user.id}" id="delete">Deletar</button>
      </div>
    </div>
    `
   }
  
  /*  
    const users = storeData.map((user) => {
      console.log(user);
    });
  */
};

const edit = (id) => {
  const findUser = storeData.find((user) => user.id === id );
  
  name.value = findUser.name;
  email.value = findUser.email;
  telefone.value = findUser.telefone;

  btnAtualizar.setAttribute("data-id", findUser.id);
};

const atuaizarUser = (id) => {
  const findUser = storeData.find((user) => user.id === id);

  findUser.name = name.value;
  findUser.email = email.value;
  findUser.telefone = telefone.value;

  localStorage.setItem("users", JSON.stringify(storeData));

  btnAtualizar.classList.add("hide");
  btnCancelar.classList.add("hide");
  btnSave.classList.remove("hide");

  name.value = "";
  email.value = "";
  telefone.value = "";

  
  location.reload();
};

const deleteUser = (id) => {
  const delUser = storeData.filter((user) => user.id !== id);
  localStorage.setItem("users", JSON.stringify(delUser));
  location.reload();
}

btnSave.addEventListener("click", async (e) => {
  e.preventDefault();
  // dkjhf
  const userData = {
    id: storeData.length + 1,
    name: name.value,
    email: email.value,
    telefone: telefone.value,
  };

  storeData.push(userData);

  localStorage.setItem("users", JSON.stringify(storeData));

    /*
      const result = await fetch("http://localhost:5600/", {
       method: "POST",
       headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
    */
   
  location.reload();
});

resultado.addEventListener("click", (e) => {
  e.preventDefault();
  
  const el = e.target;

  if(el.classList.contains("edit")){
    const id = Number(el.getAttribute("data-id"));
    edit(id);

    btnAtualizar.classList.remove("hide");
    btnCancelar.classList.remove("hide");
    btnSave.classList.add("hide")
  }

  if (el.classList.contains("delete")) {
    const id = Number(el.getAttribute("data-id"));
    deleteUser(id);
  }
});

btnAtualizar.addEventListener("click", (e) => {
  e.preventDefault();

  const el = e.target;
  const id = Number(el.getAttribute("data-id"));
  atuaizarUser(id);
})

loadData(); 