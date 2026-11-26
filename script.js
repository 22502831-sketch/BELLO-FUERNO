function mascara_telefone ()
{
    //deixa só números
    var tel = document.getElementById("telefone").value.replace(/\D/g,"")

    //celular começa com 9 (11 números), fixo tem 10 números
    var corte = 4
    if (tel[2]=="9")
    {
        corte = 5
    }

    //limitador
    tel = tel.slice(0,2+corte+4)

    //máscara
    var tel_formatado = ""
    if (tel.length>0)
    {
        tel_formatado = "("+tel.slice(0,2)
    }
    if (tel.length>2)
    {
        tel_formatado = tel_formatado+")"+tel.slice(2,2+corte)
    }
    if (tel.length>2+corte)
    {
        tel_formatado = tel_formatado+"-"+tel.slice(2+corte)
    }
    document.getElementById("telefone").value = tel_formatado
}

function mascara_cep()
{
    //deixa só números e limita em 8
    var cep = document.getElementById("cep").value.replace(/\D/g,"").slice(0,8)

    //máscara
    var cep_formatado = ""
    if (cep.length>0)
    {
        cep_formatado = cep.slice(0,2)
    }
    if (cep.length>2)
    {
        cep_formatado = cep_formatado+"."+cep.slice(2,5)
    }
    if (cep.length>5)
    {
        cep_formatado = cep_formatado+"-"+cep.slice(5)
    }
    document.getElementById("cep").value = cep_formatado
}


//CARRINHO
function pegar_carrinho ()
{
    //lê os itens salvos no navegador
    var carrinho = []
    try
    {
        carrinho = JSON.parse(localStorage.getItem("carrinho")) || []
    }
    catch (erro)
    {
        carrinho = []
    }
    return carrinho
}

function salvar_carrinho (carrinho)
{
    localStorage.setItem("carrinho", JSON.stringify(carrinho))
}

function formatar_dinheiro (valor)
{
    //R$ 64 ou R$ 64,50
    valor = Math.round(valor*100)/100
    if (Number.isInteger(valor))
    {
        return "R$ "+valor
    }
    return "R$ "+valor.toFixed(2).replace(".",",")
}

function adicionar (botao)
{
    //pega os dados do prato que está na tela
    var prato = botao.closest(".pizza, .prato3, .cupom")
    var nome = prato.querySelector(".nome, .nome1, .cupom1").innerText
    var preco = parseFloat(prato.querySelector(".preco2, .cupom2").innerText.replace("R$","").replace(",","."))
    var ingredientes = ""
    var texto = prato.querySelector(".ingredientes, .ingredientes1, .cupom3")
    if (texto != null)
    {
        ingredientes = texto.innerText
    }

    //id do produto na tabela produtos, usado para gravar o pedido
    var id = parseInt(prato.getAttribute("data-id"))

    //se já está no carrinho aumenta a quantidade
    var carrinho = pegar_carrinho()
    var achou = false
    for (var i=0; i<carrinho.length; i++)
    {
        if (carrinho[i].nome == nome)
        {
            carrinho[i].qtd = carrinho[i].qtd+1
            achou = true
        }
    }
    if (achou == false)
    {
        carrinho.push({id: id, nome: nome, ingredientes: ingredientes, preco: preco, qtd: 1})
    }
    salvar_carrinho(carrinho)
    atualizar_contador()
}

function mudar_quantidade (indice, valor)
{
    var carrinho = pegar_carrinho()
    carrinho[indice].qtd = carrinho[indice].qtd+valor
    if (carrinho[indice].qtd < 1)
    {
        carrinho[indice].qtd = 1
    }
    salvar_carrinho(carrinho)
    atualizar_contador()
    mostrar_carrinho()
}

function remover_item (indice)
{
    var carrinho = pegar_carrinho()
    carrinho.splice(indice,1)
    salvar_carrinho(carrinho)
    atualizar_contador()
    mostrar_carrinho()
}

function atualizar_contador ()
{
    //mostra quantos itens tem no "Carrinho" do menu
    var carrinho = pegar_carrinho()
    var quantidade = 0
    for (var i=0; i<carrinho.length; i++)
    {
        quantidade = quantidade+carrinho[i].qtd
    }
    var link = document.querySelector(".lista a[href='carrinho.html']")
    if (link != null)
    {
        link.innerText = "Carrinho"
        if (quantidade > 0)
        {
            link.innerText = "Carrinho ("+quantidade+")"
        }
    }
}

function mostrar_carrinho ()
{
    //só roda na página do carrinho
    var pedidos = document.getElementById("pedidos")
    if (pedidos == null)
    {
        return
    }

    var carrinho = pegar_carrinho()
    var lista = ""
    var subtotal = 0
    var quantidade = 0
    for (var i=0; i<carrinho.length; i++)
    {
        var item = carrinho[i]
        subtotal = subtotal+item.preco*item.qtd
        quantidade = quantidade+item.qtd
        lista = lista+'<div class="pedido">'
        lista = lista+'<div class="pedido1"><p class="nome1">'+item.nome+'</p><p class="ingredientes1">'+item.ingredientes+'</p></div>'
        lista = lista+'<div class="quantidade controle"><button class="mais" onclick="mudar_quantidade('+i+',-1)">-</button><p>'+item.qtd+'</p><button class="mais" onclick="mudar_quantidade('+i+',1)">+</button></div>'
        lista = lista+'<p class="preco2">'+formatar_dinheiro(item.preco*item.qtd)+'</p>'
        lista = lista+'<button class="remover" onclick="remover_item('+i+')">Remover</button>'
        lista = lista+'</div>'
    }

    //carrinho vazio
    if (carrinho.length == 0)
    {
        pedidos.innerHTML = '<p class="vazio">Seu carrinho está vazio.</p>'
        document.getElementById("descricao").innerText = "Escolha suas pizzas no cardápio."
        document.getElementById("resumo").style.display = "none"
        return
    }

    //carrinho com itens
    var entrega = 8
    pedidos.innerHTML = lista
    document.getElementById("descricao").innerText = quantidade+(quantidade==1 ? " item pronto" : " itens prontos")+" para ir ao forno."
    document.getElementById("resumo").style.display = ""
    document.getElementById("subtotal").innerText = formatar_dinheiro(subtotal)
    document.getElementById("entrega").innerText = formatar_dinheiro(entrega)
    document.getElementById("total").innerText = formatar_dinheiro(subtotal+entrega)
}

atualizar_contador()
mostrar_carrinho()


//PEDIDOS SALVOS
function pegar_pedidos ()
{
    //lê os pedidos já feitos neste navegador
    var pedidos = []
    try
    {
        pedidos = JSON.parse(localStorage.getItem("pedidos")) || []
    }
    catch (erro)
    {
        pedidos = []
    }
    return pedidos
}

function salvar_pedidos (pedidos)
{
    localStorage.setItem("pedidos", JSON.stringify(pedidos))
}

function baixar_json (nome, dados)
{
    //gera o arquivo que o sistema em C# vai ler
    var texto = JSON.stringify(dados, null, 2)
    var arquivo = new Blob([texto], {type: "application/json"})
    var link = document.createElement("a")
    link.href = URL.createObjectURL(arquivo)
    link.download = nome
    link.click()
    URL.revokeObjectURL(link.href)
}
