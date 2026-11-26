DROP DATABASE IF EXISTS DB_Delivery;
CREATE DATABASE DB_Delivery CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE DB_Delivery;

CREATE TABLE clientes (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL,
telefone VARCHAR(20) NOT NULL,
endereco VARCHAR(255) NOT NULL
);
CREATE TABLE entregadores (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
telefone VARCHAR(20) NOT NULL,
veiculo VARCHAR(50) NOT NULL
);
CREATE TABLE produtos (
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
descricao TEXT,
preco DECIMAL(10, 2) NOT NULL,
categoria VARCHAR(50) NOT NULL
);
CREATE TABLE pedidos (
id INT AUTO_INCREMENT PRIMARY KEY,
cliente_id INT,
entregador_id INT,
status_pedido VARCHAR(50) NOT NULL DEFAULT 'Recebido',
valor_total DECIMAL(10, 2) NOT NULL,
data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
FOREIGN KEY (entregador_id) REFERENCES entregadores(id) ON DELETE SET NULL
);
CREATE TABLE itens_pedido (
id INT AUTO_INCREMENT PRIMARY KEY,
pedido_id INT NOT NULL,
produto_id INT NOT NULL,
quantidade INT NOT NULL DEFAULT 1,
preco_unitario DECIMAL(10, 2) NOT NULL,
FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

INSERT INTO produtos (nome, descricao, preco, categoria) VALUES
('Margherita', 'Tomate San Marzano, fior di latte, manjericão e azeite.', 64.00, 'Pizzas'),
('Quattro Formaggi', 'Fior di latte, gorgonzola, taleggio e parmesão curado.', 78.00, 'Pizzas'),
('Calabresa Artesanal', 'Linguiça artesanal, cebola roxa, azeitonas e orégano.', 69.00, 'Pizzas'),
('Prosciutto e Rúcula', 'Presunto cru, rúcula fresca, parmesão e tomate confit.', 82.00, 'Pizzas'),
('Marinara', 'Tomate San Marzano, alho, orégano e azeite.', 58.00, 'Pizzas'),
('Diavola', 'Fior di latte, salame picante, pimenta calabresa e mel.', 72.00, 'Pizzas'),
('Funghi', 'Cogumelos salteados, fior di latte, tomilho e parmesão.', 76.00, 'Pizzas'),
('Água com ou sem gás', NULL, 7.00, 'Bebidas'),
('Refrigerante lata', NULL, 9.00, 'Bebidas'),
('Vinho tinto, taça', NULL, 32.00, 'Bebidas'),
('Limoncello', NULL, 24.00, 'Bebidas'),
('Combo Família', '2 pizzas grandes e refrigerante para dividir com quem você gosta.', 159.00, 'Combos');

INSERT INTO clientes (nome, email, telefone, endereco) VALUES
('Maria Souza', 'maria.souza@email.com', '(31)99111-2233', 'Rua das Acácias, 120 - CEP 30.140-071'),
('João Pereira', 'joao.pereira@email.com', '(31)98822-3344', 'Av. Afonso Pena, 1500 - CEP 30.130-005'),
('Ana Lima', 'ana.lima@email.com', '(31)99733-4455', 'Rua Pernambuco, 45 - CEP 30.130-150'),
('Carlos Mendes', 'carlos.mendes@email.com', '(31)98644-5566', 'Rua da Bahia, 980 - CEP 30.160-011'),
('Fernanda Costa', 'fernanda.costa@email.com', '(31)99555-6677', 'Rua Sergipe, 300 - CEP 30.130-170');

INSERT INTO entregadores (nome, telefone, veiculo) VALUES
('Rafael Santos', '(31)99001-1122', 'Moto Honda CG 160'),
('Lucas Almeida', '(31)98002-2233', 'Moto Yamaha Factor'),
('Bruno Rocha', '(31)99003-3344', 'Bicicleta elétrica');

INSERT INTO pedidos (cliente_id, entregador_id, status_pedido, valor_total, data_pedido) VALUES
(1, 1, 'Entregue', 208.00, '2026-11-10 19:30:00'),
(2, 2, 'Em Entrega', 162.00, '2026-11-12 20:15:00'),
(3, 1, 'Em Preparo', 123.00, '2026-11-14 21:00:00'),
(4, 3, 'Entregue', 214.00, '2026-11-15 20:40:00'),
(5, NULL, 'Recebido', 88.00, '2026-11-16 19:10:00');

INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES
(1, 1, 2, 64.00),
(1, 6, 1, 72.00),
(2, 2, 1, 78.00),
(2, 7, 1, 76.00),
(3, 4, 1, 82.00),
(3, 9, 1, 9.00),
(3, 11, 1, 24.00),
(4, 5, 3, 58.00),
(4, 10, 1, 32.00),
(5, 1, 1, 64.00),
(5, 8, 1, 7.00),
(5, 9, 1, 9.00);
