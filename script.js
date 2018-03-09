/**
 * Formulário de cadastro offline
 * @author Deigmar Anderson <deigmar@gmail.com>
 * @version 1.0
 */

/**
 * Inicia as váriáveis globais
 */
var clientArray = [];
var selectedIndex = -1;
/**
 * Verifica se existem a key clientsData no LocalStorage
 * Adiciona listener no campo de busca
 */
function init() {
    cleanRows();
    if (localStorage.clientsData) {
        startTable();

        document.getElementById("text-search").addEventListener('input', function (evt) {
            if (this.value.length >= 3) {
                cleanRows();
                toSearch = this.value;
                filterRegister(toSearch);
            } else {
                startTable();
            }
        });
    }
}
/**
 * Inicia a Tabela
 */
function startTable() {
    cleanRows();
    clientArray = JSON.parse(localStorage.clientsData);
    document.getElementById('qtdRegistros').textContent = clientArray.length + (clientArray.length > 1 ? ' Registros' : ' Registro');
    for (var i = 0; i < clientArray.length; i++) {
        toRows(i, clientArray[i].firstname, clientArray[i].lastname, clientArray[i].cpf, clientArray[i].subject);
    }
}
/**
 * Limpa as linhas da tabela
 */
function cleanRows() {
    document.getElementById("rows").innerHTML = "";
}
/**
 * Faz a pesquisa no array gravado no localStorage
 * Cria um novo array com o resultado da pesquisa e envia para a tabela
 * 
 * TODO: o resultado da pesquisa necessitou ser convertido para toLower para maior aderência dos resultados
 * no entanto o retorno deverá ser na forma original dos dados.
 * 
 * @param {*} searchKey 
 */
function filterRegister(searchKey) {
    resultSearch = [];
    if (localStorage.clientsData) {
        dataToSearch = JSON.parse(localStorage.clientsData.toLowerCase());
        resultSearch = dataToSearch.filter((obj) =>
            Object.keys(obj).some((key) =>
                obj[key].includes(searchKey.toLowerCase())
            )
        );
        document.getElementById('qtdRegistros').textContent = resultSearch.length + (clientArray.length > 1 ? ' Registros' : ' Registro');
        for (var i = 0; i < resultSearch.length; i++) {
            toRows(i, resultSearch[i].firstname, resultSearch[i].lastname, resultSearch[i].cpf, resultSearch[i].subject);
        }
    }
}
/**
 * Salva o registro no LocalStorage
 */
function onSave() {
    validate();
    var firstName = document.getElementById("firstname").value;
    var lastName = document.getElementById("lastname").value;
    var cpf = document.getElementById("cpf").value;
    var subject = document.getElementById("subject").value;
    var stuObj = { firstname: firstName, lastname: lastName, cpf: cpf, subject: subject };
    if (selectedIndex === -1) {
        clientArray.push(stuObj);
    } else {
        clientArray.splice(selectedIndex, 1, stuObj);
    }
    localStorage.clientsData = JSON.stringify(clientArray);
    init();
}
/**
 * Auxiliar para abrir o modal
 */
function openModal() {
    return location.hash = "modal";
}
/**
 * Auxiliar para fechar o modal
 */
function closeModal() {
    return location.hash = "#";
}
/**
 * Envia os dados para composição da tabela
 * @param {*} index 
 * @param {*} firstName 
 * @param {*} lastName 
 * @param {*} cpf 
 * @param {*} subject 
 */
function toRows(index, firstName, lastName, cpf, subject) {
    var table = document.getElementById("rows");
    var row = table.insertRow();
    var firstNameCell = row.insertCell(0);
    var lastNameCell = row.insertCell(1);
    var cpfCell = row.insertCell(2);
    var subjectCell = row.insertCell(3);
    var actionCell = row.insertCell(4);
    firstNameCell.innerHTML = firstName;
    lastNameCell.innerHTML = lastName;
    cpfCell.innerHTML = cpf;
    subjectCell.innerHTML = subject;
    actionCell.innerHTML =
        '<button onclick="onEdit(' + index + '); openModal();">' +
        '<i class="fas fa-check"></i> Editar</button><br/>' +
        '<button onclick="deleteRow(' + index + ');" class="del">' +
        '<i class="fas fa-trash-alt"></i> Deletar</button>';
}
/**
 * Exclui um registro
 * @param {*} index 
 */
function deleteRow(index) {
    if (confirm("Tem certeza que deseja excluir o registro?")) {
        clientArray.splice(index, 1);
        localStorage.clientsData = JSON.stringify(clientArray);
        init();
    }
}
/**
 * Limpa os campos do form
 */
function onClear() {
    selectedIndex = -1;
    document.getElementById("firstname").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("cpf").value = "";
    document.getElementById("subject").value = "Contato";
    document.getElementById("submit").innerHTML = "Registrar";
}
/**
 * Edição dos campos do form
 * @param {*} index 
 */
function onEdit(index) {
    selectedIndex = index;
    var stuObj = clientArray[index];
    document.getElementById("firstname").value = stuObj.firstname;
    document.getElementById("lastname").value = stuObj.lastname;
    document.getElementById("cpf").value = stuObj.cpf;
    document.getElementById("subject").value = stuObj.subject;
    document.getElementById("submit").innerHTML = "Atualizar";

}
/**
 * Adiciona um listener para fechar o modal clicando na sombra
 */
document.addEventListener('click', function (e) {
    if (e.target && e.target.id == 'overlay') {
        location.hash = "#";
    }
});
/**
 * Adiciona um listener para zerar os campos do form ao incluir novo registro
 */
document.addEventListener('click', function (e) {
    if (e.target && e.target.id == 'incluirNovo') {
        onClear();
    }
});
/**
 * Função de validaçaõ dos campos do form
 */
function validate() {
    if (document.forms.cadastro.firstname.value == "") {
        alert("Digite seu primeiro nome!");
        document.forms.cadastro.firstname.focus();
        return false;
    }
    if (document.forms.cadastro.lastname.value == "") {
        alert("Digite seu sobrenome!");
        document.forms.cadastro.lastname.focus();
        return false;
    }
    if (document.forms.cadastro.cpf.value == "") {
        alert("Digite seu CPF!");
        document.forms.cadastro.cpf.focus();
        return false;
    }
    closeModal();
    return (true);
}
