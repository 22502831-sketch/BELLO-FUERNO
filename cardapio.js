//CARDÁPIO
//se a API responder, usa os produtos do banco; se não, fica o que está no HTML
function carregar_cardapio ()
{
    //se a API não responder, mantém o cardápio do HTML
    var produtos = api_get("/produtos")
    if (produtos == null || produtos.length == 0)
    {
        return
    }

    //cada seção pega os produtos da sua categoria
    var secoes = document.querySelectorAll(".secao")
    for (var i=0; i<secoes.length; i++)
    {
        var categoria = secoes[i].querySelector(".titulo6").innerText
        var lista = secoes[i].querySelector(".pratos")
        var html = ""

        for (var j=0; j<produtos.length; j++)
        {
            var produto = produtos[j]
            if (produto.categoria != categoria)
            {
                continue
            }

            //selo da mais pedida
            var selo = ""
            if (produto.nome == "Quattro Formaggi")
            {
                selo = '<span class="pedida1">Mais pedida</span>'
            }

            //bebidas não têm descrição
            var descricao = ""
            if (produto.descricao != null && produto.descricao != "")
            {
                descricao = '<p class="ingredientes1">'+produto.descricao+'</p>'
            }

            html = html+'<div class="prato3" data-id="'+produto.id+'">'
            html = html+'<div class="prato2">'
            html = html+'<p class="nome1">'+produto.nome+'</p>'
            html = html+selo
            html = html+'<span class="pontos"></span>'
            html = html+'<p class="preco2">'+formatar_dinheiro(produto.preco)+'</p>'
            html = html+'</div>'
            html = html+descricao
            html = html+'<a href="carrinho.html" class="adicionar2" onclick="adicionar(this)">Adicionar</a>'
            html = html+'</div>'
        }

        //só troca se vieram produtos
        if (html != "")
        {
            lista.innerHTML = html
        }
    }
}

carregar_cardapio()
