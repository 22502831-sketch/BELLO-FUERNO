//PEDIDOS
function formatar_data (texto)
{
    //2026-11-16T22:41:00 vira 16/11/2026 às 22:41
    var data = new Date(texto)
    var dia = ("0"+data.getDate()).slice(-2)
    var mes = ("0"+(data.getMonth()+1)).slice(-2)
    var hora = ("0"+data.getHours()).slice(-2)
    var minuto = ("0"+data.getMinutes()).slice(-2)
    return dia+"/"+mes+"/"+data.getFullYear()+" às "+hora+":"+minuto
}

function mostrar_pedidos ()
{
    var pedidos = pegar_pedidos()

    //nenhum pedido feito ainda
    if (pedidos.length == 0)
    {
        document.getElementById("descricao3").innerText = "Você ainda não fez nenhum pedido."
        document.getElementById("lista_pedidos").innerHTML = '<p class="vazio2">Seus pedidos aparecem aqui depois de finalizados.</p>'
        document.getElementById("baixar_todos").style.display = "none"
        return
    }

    var html = ""
    for (var i=0; i<pedidos.length; i++)
    {
        var pedido = pedidos[i]

        var itens = ""
        for (var j=0; j<pedido.itens.length; j++)
        {
            var item = pedido.itens[j]
            itens = itens+'<div class="item4">'
            itens = itens+'<span class="qtd">'+item.quantidade+'x</span>'
            itens = itens+'<p class="nome1">'+item.produtoNome+'</p>'
            itens = itens+'<span class="pontos"></span>'
            itens = itens+'<p class="preco2">'+formatar_dinheiro(item.precoUnitario*item.quantidade)+'</p>'
            itens = itens+'</div>'
        }

        html = html+'<div class="cartao2">'
        html = html+'<div class="topo2"><p class="numero">Pedido #'+(i+1)+'</p><span class="status recebido">'+pedido.statusPedido+'</span></div>'
        html = html+'<p class="data">'+formatar_data(pedido.dataPedido)+'</p>'
        html = html+'<div class="dados">'
        html = html+'<div><p class="dado1">Cliente</p><p class="dado2">'+pedido.cliente.nome+'</p></div>'
        html = html+'<div><p class="dado1">Entrega</p><p class="dado2">'+pedido.cliente.endereco+'</p></div>'
        html = html+'</div>'
        html = html+'<div class="itens">'+itens+'</div>'
        html = html+'<div class="rodape3">'
        html = html+'<p class="total2">'+formatar_dinheiro(pedido.valorTotal)+'</p>'
        html = html+'<button class="cancelar" onclick="baixar_pedido('+i+')">Baixar este pedido</button>'
        html = html+'</div></div>'
    }

    document.getElementById("lista_pedidos").innerHTML = html
    document.getElementById("descricao3").innerText = pedidos.length+(pedidos.length==1 ? " pedido feito" : " pedidos feitos")+" neste navegador."
    document.getElementById("baixar_todos").style.display = ""
}

function baixar_pedido (indice)
{
    //baixa um pedido sozinho
    var pedidos = pegar_pedidos()
    baixar_json("pedido-"+(indice+1)+".json", pedidos[indice])
}

function baixar_todos ()
{
    //baixa todos os pedidos num arquivo só
    baixar_json("pedidos.json", pegar_pedidos())
}

mostrar_pedidos()
