//CADASTRO
function avisar2 (mensagem, deu_erro)
{
    var recado = document.getElementById("recado2")
    recado.innerText = mensagem
    recado.className = "recado2"
    if (deu_erro == true)
    {
        recado.className = "recado2 erro2"
    }
}

function mostrar_resumo ()
{
    //avisa quantos itens vão no pedido
    var carrinho = pegar_carrinho()
    var quantidade = 0
    for (var i=0; i<carrinho.length; i++)
    {
        quantidade = quantidade+carrinho[i].qtd
    }
    if (quantidade == 0)
    {
        document.getElementById("descricao4").innerText = "Seu carrinho está vazio. Escolha suas pizzas no cardápio antes de finalizar."
        return
    }
    document.getElementById("descricao4").innerText = "Preencha seus dados para finalizar o pedido de "+quantidade+(quantidade==1 ? " item." : " itens.")
}

function data_agora ()
{
    //2026-11-16T22:41:00, no formato que o C# entende
    var data = new Date()
    var dia = ("0"+data.getDate()).slice(-2)
    var mes = ("0"+(data.getMonth()+1)).slice(-2)
    var hora = ("0"+data.getHours()).slice(-2)
    var minuto = ("0"+data.getMinutes()).slice(-2)
    var segundo = ("0"+data.getSeconds()).slice(-2)
    return data.getFullYear()+"-"+mes+"-"+dia+"T"+hora+":"+minuto+":"+segundo
}

function enviar_cadastro ()
{
    //confere se o carrinho tem algo
    var carrinho = pegar_carrinho()
    if (carrinho.length == 0)
    {
        avisar2("Seu carrinho está vazio. Escolha suas pizzas no cardápio.", true)
        return
    }

    //confere se os campos estão preenchidos
    var nome = document.getElementById("nome").value.trim()
    var email = document.getElementById("email").value.trim()
    var telefone = document.getElementById("telefone").value.trim()
    var cep = document.getElementById("cep").value.trim()
    var rua = document.getElementById("rua").value.trim()
    var numero = document.getElementById("numero").value.trim()

    if (nome == "" || email == "" || telefone == "" || cep == "" || rua == "" || numero == "")
    {
        avisar2("Preencha todos os campos antes de finalizar.", true)
        return
    }

    //monta os itens com o que está no carrinho
    var itens = []
    var total = 0
    for (var i=0; i<carrinho.length; i++)
    {
        var item = carrinho[i]
        total = total+item.preco*item.qtd
        itens.push({produtoId: item.id, produtoNome: item.nome, quantidade: item.qtd, precoUnitario: item.preco})
    }

    //o pedido tem os mesmos campos das tabelas do banco
    var pedido =
    {
        cliente: {nome: nome, email: email, telefone: telefone, endereco: rua+", "+numero+" - CEP "+cep},
        statusPedido: "Recebido",
        valorTotal: total+8,
        dataPedido: data_agora(),
        itens: itens
    }

    //guarda o pedido e baixa o arquivo que o sistema vai ler
    var pedidos = pegar_pedidos()
    pedidos.push(pedido)
    salvar_pedidos(pedidos)
    baixar_json("pedido-"+pedidos.length+".json", pedido)

    //pedido fechado, esvazia o carrinho
    salvar_carrinho([])
    atualizar_contador()
    mostrar_resumo()
    avisar2("Pedido #"+pedidos.length+" registrado. O arquivo do pedido foi baixado.", false)
    setTimeout(function ()
    {
        window.location.href = "pedidos.html"
    }, 1800)
}

mostrar_resumo()
