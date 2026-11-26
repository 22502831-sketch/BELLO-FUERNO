//ADMINISTRAÇÃO
var tabela_atual = "produtos"
var registros = []
var editando = 0


function abrir (tabela)
{
    tabela_atual = tabela

    //mostra só o formulário da tabela escolhida
    document.getElementById("form_produtos").style.display = "none"
    document.getElementById("form_clientes").style.display = "none"
    document.getElementById("form_entregadores").style.display = "none"
    document.getElementById("form_"+tabela).style.display = "block"

    //pinta só a aba escolhida
    var abas = document.querySelectorAll(".categoria")
    for (var i=0; i<abas.length; i++)
    {
        abas[i].className = "categoria"
        if (abas[i].innerText.toLowerCase() == tabela)
        {
            abas[i].className = "categoria ativo2"
        }
    }

    limpar()
    carregar_registros()
}

function nome_singular ()
{
    if (tabela_atual == "produtos")
    {
        return "produto"
    }
    if (tabela_atual == "clientes")
    {
        return "cliente"
    }
    return "entregador"
}

function linha_detalhe (registro)
{
    //o resto dos campos, mostrados embaixo do nome
    if (tabela_atual == "produtos")
    {
        //as bebidas não têm descrição
        var descricao = ""
        if (registro.descricao != null && registro.descricao != "")
        {
            descricao = registro.descricao+" • "
        }
        return descricao+formatar_dinheiro(registro.preco)+" • "+registro.categoria
    }
    if (tabela_atual == "clientes")
    {
        return registro.email+" • "+registro.telefone+" • "+registro.endereco
    }
    return registro.telefone+" • "+registro.veiculo
}

function ler_formulario ()
{
    //monta o registro com o que está escrito nos campos
    if (tabela_atual == "produtos")
    {
        return {
            nome: document.getElementById("produto_nome").value.trim(),
            descricao: document.getElementById("produto_descricao").value.trim(),
            preco: document.getElementById("produto_preco").value.trim(),
            categoria: document.getElementById("produto_categoria").value.trim()
        }
    }
    if (tabela_atual == "clientes")
    {
        return {
            nome: document.getElementById("cliente_nome").value.trim(),
            email: document.getElementById("cliente_email").value.trim(),
            telefone: document.getElementById("cliente_telefone").value.trim(),
            endereco: document.getElementById("cliente_endereco").value.trim()
        }
    }
    return {
        nome: document.getElementById("entregador_nome").value.trim(),
        telefone: document.getElementById("entregador_telefone").value.trim(),
        veiculo: document.getElementById("entregador_veiculo").value.trim()
    }
}

function escrever_formulario (registro)
{
    //joga os dados do registro dentro dos campos
    if (tabela_atual == "produtos")
    {
        document.getElementById("produto_nome").value = registro.nome
        document.getElementById("produto_descricao").value = ""
        if (registro.descricao != null)
        {
            document.getElementById("produto_descricao").value = registro.descricao
        }
        document.getElementById("produto_preco").value = registro.preco
        document.getElementById("produto_categoria").value = registro.categoria
        return
    }
    if (tabela_atual == "clientes")
    {
        document.getElementById("cliente_nome").value = registro.nome
        document.getElementById("cliente_email").value = registro.email
        document.getElementById("cliente_telefone").value = registro.telefone
        document.getElementById("cliente_endereco").value = registro.endereco
        return
    }
    document.getElementById("entregador_nome").value = registro.nome
    document.getElementById("entregador_telefone").value = registro.telefone
    document.getElementById("entregador_veiculo").value = registro.veiculo
}

function carregar_registros ()
{
    //busca a tabela no banco
    registros = api_get("/"+tabela_atual)
    if (registros == null)
    {
        registros = []
        document.getElementById("lista_registros").innerHTML = '<p class="vazio2">Não foi possível carregar os registros agora.<br>Tente de novo em alguns instantes.</p>'
        return
    }
    if (registros.length == 0)
    {
        document.getElementById("lista_registros").innerHTML = '<p class="vazio2">Nenhum registro cadastrado ainda.</p>'
        return
    }

    var html = ""
    for (var i=0; i<registros.length; i++)
    {
        var registro = registros[i]
        html = html+'<div class="registro">'
        html = html+'<p class="id">#'+registro.id+'</p>'
        html = html+'<div class="registro1"><p class="nome1">'+registro.nome+'</p><p class="detalhe">'+linha_detalhe(registro)+'</p></div>'
        html = html+'<button class="editar" onclick="editar('+registro.id+')">Editar</button>'
        html = html+'<button class="excluir" onclick="excluir('+registro.id+')">Excluir</button>'
        html = html+'</div>'
    }
    document.getElementById("lista_registros").innerHTML = html
}

function editar (id)
{
    for (var i=0; i<registros.length; i++)
    {
        if (registros[i].id == id)
        {
            escrever_formulario(registros[i])
        }
    }
    editando = id
    document.getElementById("titulo_form").innerText = "Editando "+nome_singular()+" #"+id
    avisar("", false)
}

function limpar ()
{
    //volta para cadastro novo
    var campos = document.querySelectorAll(".formulario2 input")
    for (var i=0; i<campos.length; i++)
    {
        campos[i].value = ""
    }
    editando = 0
    document.getElementById("titulo_form").innerText = "Novo "+nome_singular()
    avisar("", false)
}

function avisar (mensagem, deu_erro)
{
    var recado = document.getElementById("recado")
    recado.innerText = mensagem
    recado.className = "recado"
    if (deu_erro == true)
    {
        recado.className = "recado erro"
    }
}

function salvar ()
{
    var dados = ler_formulario()

    //nenhum campo pode ficar em branco, só a descrição, que as bebidas não têm
    for (var campo in dados)
    {
        if (dados[campo] == "" && campo != "descricao")
        {
            avisar("Preencha todos os campos.", true)
            return
        }
    }

    //o preço vai como número, o resto vai como texto
    if (tabela_atual == "produtos")
    {
        dados.preco = parseFloat(dados.preco.replace(",","."))
        if (isNaN(dados.preco) == true)
        {
            avisar("O preço precisa ser um número.", true)
            return
        }
    }

    //sem id é cadastro novo, com id é alteração
    if (editando == 0)
    {
        if (api_post("/"+tabela_atual, dados) == null)
        {
            avisar("Não foi possível salvar. Tente de novo.", true)
            return
        }
        limpar()
        avisar("Registro cadastrado.", false)
    }
    else
    {
        dados.id = editando
        if (api_put("/"+tabela_atual+"/"+editando, dados) == false)
        {
            avisar("Não foi possível salvar. Tente de novo.", true)
            return
        }
        limpar()
        avisar("Registro alterado.", false)
    }
    carregar_registros()
}

function excluir (id)
{
    //apaga o registro do banco
    if (confirm("Excluir o registro #"+id+"?") == false)
    {
        return
    }
    if (api_delete("/"+tabela_atual+"/"+id) == false)
    {
        avisar("Não foi possível excluir. O registro pode estar em uso em um pedido.", true)
        return
    }
    limpar()
    avisar("Registro excluído.", false)
    carregar_registros()
}

abrir("produtos")
