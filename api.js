//endereço da API
var API = "http://localhost:5000/api"


function api_get (caminho)
{
    //busca uma lista ou um item no banco, devolve null se der errado
    var requisicao = new XMLHttpRequest()
    requisicao.open("GET", API+caminho, false)
    try
    {
        requisicao.send()
    }
    catch (erro)
    {
        return null
    }
    if (requisicao.status != 200)
    {
        return null
    }
    return JSON.parse(requisicao.responseText)
}

function api_post (caminho, dados)
{
    //cria um registro e devolve ele com o id que o banco gerou
    var requisicao = new XMLHttpRequest()
    requisicao.open("POST", API+caminho, false)
    requisicao.setRequestHeader("Content-Type", "application/json")
    try
    {
        requisicao.send(JSON.stringify(dados))
    }
    catch (erro)
    {
        return null
    }
    if (requisicao.status != 200 && requisicao.status != 201)
    {
        return null
    }
    return JSON.parse(requisicao.responseText)
}

function api_put (caminho, dados)
{
    //altera um registro, devolve true se deu certo
    var requisicao = new XMLHttpRequest()
    requisicao.open("PUT", API+caminho, false)
    requisicao.setRequestHeader("Content-Type", "application/json")
    try
    {
        requisicao.send(JSON.stringify(dados))
    }
    catch (erro)
    {
        return false
    }
    return requisicao.status == 200 || requisicao.status == 204
}

function api_delete (caminho)
{
    //apaga um registro, devolve true se deu certo
    var requisicao = new XMLHttpRequest()
    requisicao.open("DELETE", API+caminho, false)
    try
    {
        requisicao.send()
    }
    catch (erro)
    {
        return false
    }
    return requisicao.status == 200 || requisicao.status == 204
}


function formatar_data (texto)
{
    //2026-11-10T19:30:00 vira 10/11/2026 às 19:30
    var data = new Date(texto)
    var dia = ("0"+data.getDate()).slice(-2)
    var mes = ("0"+(data.getMonth()+1)).slice(-2)
    var hora = ("0"+data.getHours()).slice(-2)
    var minuto = ("0"+data.getMinutes()).slice(-2)
    return dia+"/"+mes+"/"+data.getFullYear()+" às "+hora+":"+minuto
}

function finalizar_pedido (cliente)
{
    //grava o cliente e pega o id que o banco gerou
    var novo = api_post("/clientes", cliente)
    if (novo == null)
    {
        return null
    }

    //monta os itens com o que está no carrinho
    var carrinho = pegar_carrinho()
    var itens = []
    var total = 0
    for (var i=0; i<carrinho.length; i++)
    {
        var item = carrinho[i]
        total = total+item.preco*item.qtd
        itens.push({produtoId: item.id, quantidade: item.qtd, precoUnitario: item.preco})
    }

    var pedido = api_post("/pedidos",
    {
        clienteId: novo.id,
        entregadorId: null,
        statusPedido: "Recebido",
        valorTotal: total+8,
        itens: itens
    })
    if (pedido == null)
    {
        return null
    }

    //pedido gravado, esvazia o carrinho
    salvar_carrinho([])
    return pedido
}
