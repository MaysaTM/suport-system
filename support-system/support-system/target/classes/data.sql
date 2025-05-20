INSERT INTO cliente (nome_completo, email, telefone, tipo_cliente, cpf)
VALUES ('Cliente Teste', 'cliente@teste.com', '11999999999', 'PESSOA_FISICA', '12345678901');

INSERT INTO ticket (titulo, descricao, categoria, prioridade, status, cliente_id)
VALUES ('Problema no login', 'Não consigo acessar minha conta', 'SUPORTE', 'ALTA', 'ABERTO', 1);