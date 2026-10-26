// Atividade 2 - Estados e cidades com a API do IBGE
// Aluno(a): ________________________

const selectEstado = document.getElementById('estado')
const selectCidade = document.getElementById('cidade')
const qtdCidades = document.getElementById('qtdCidades')
const campoFiltro = document.getElementById('filtro')
const resumo = document.getElementById('resumo')

const URL_ESTADOS = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'

// Guarda as cidades do estado escolhido (usado no filtro)
let listaCidades = []

// 1) Carregar os estados ao abrir a pagina
function carregarEstados() {
    fetch(URL_ESTADOS)
        .then(resposta => resposta.json())
        .then(estados => {
            console.log(estados)
            selectEstado.innerHTML = '<option value="">Selecione o estado</option>'

            // TODO 1: um <option> para cada estado
            estados.forEach(estado => {
                selectEstado.innerHTML += `<option value="${estado.sigla}">${estado.nome}</option>`
            })
        })
        .catch(erro => {
            selectEstado.innerHTML = '<option value="">Erro ao carregar estados</option>'
            console.log(erro)
        })
}

// Preenche o select de cidades com a lista recebida
function mostrarCidades(cidades) {
    selectCidade.innerHTML = '<option value="">Selecione a cidade</option>'

    cidades.forEach(cidade => {
        selectCidade.innerHTML += `<option value="${cidade.nome}">${cidade.nome}</option>`
    })
}

// 2) Carregar as cidades quando o estado mudar
selectEstado.addEventListener('change', () => {
    const uf = selectEstado.value
    qtdCidades.innerHTML = ''
    campoFiltro.value = ''

    if (uf === '') {
        selectCidade.innerHTML = '<option value="">Escolha um estado primeiro</option>'
        selectCidade.disabled = true
        campoFiltro.disabled = true
        return
    }

    // TODO 2: mostrar "Carregando..." e desabilitar
    selectCidade.innerHTML = '<option value="">Carregando...</option>'
    selectCidade.disabled = true
    campoFiltro.disabled = true

    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(resposta => resposta.json())
        .then(cidades => {
            listaCidades = cidades

            // TODO 3: preencher o select de cidades
            mostrarCidades(cidades)

            // TODO 4: habilitar o select novamente
            selectCidade.disabled = false
            campoFiltro.disabled = false

            // TODO 5: quantidade de cidades
            qtdCidades.innerHTML = `Este estado tem <strong>${cidades.length}</strong> cidades.`
        })
        .catch(erro => {
            selectCidade.innerHTML = '<option value="">Erro ao carregar cidades</option>'
            console.log(erro)
        })
})

// Desafio extra: filtra as cidades enquanto o usuario digita
campoFiltro.addEventListener('input', () => {
    const texto = campoFiltro.value.toLowerCase()

    const filtradas = listaCidades.filter(cidade =>
        cidade.nome.toLowerCase().includes(texto)
    )

    mostrarCidades(filtradas)
    qtdCidades.innerHTML = `Mostrando <strong>${filtradas.length}</strong> de ${listaCidades.length} cidades.`
})

// 3) Enviar o formulario
document.getElementById('formInscricao').addEventListener('submit', (evento) => {
    evento.preventDefault() // impede a pagina de recarregar

    const nome = document.getElementById('nome').value
    const cidade = selectCidade.value
    const uf = selectEstado.value

    // TODO 6: montar o resumo
    resumo.innerHTML = `${nome}, de ${cidade}/${uf}, inscrito com sucesso`
})

carregarEstados()
