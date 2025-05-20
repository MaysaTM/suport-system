-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS cliente (
                                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                                       nome_completo TEXT NOT NULL,
                                       email TEXT NOT NULL UNIQUE,
                                       telefone TEXT NOT NULL,
                                       tipo_cliente TEXT NOT NULL CHECK (tipo_cliente IN ('PESSOA_FISICA', 'PESSOA_JURIDICA')),
                                       cpf TEXT,
                                       cnpj TEXT,
                                       status TEXT NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
                                       data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Validação de documentos
                                       CHECK (
                                           (tipo_cliente = 'PESSOA_FISICA' AND cpf IS NOT NULL AND cnpj IS NULL AND LENGTH(REPLACE(cpf, '.', '')) = 11) OR
                                           (tipo_cliente = 'PESSOA_JURIDICA' AND cnpj IS NOT NULL AND cpf IS NULL AND LENGTH(REPLACE(cnpj, '.', '')) = 14)
                                           )
);

-- Tabela de Tickets
CREATE TABLE IF NOT EXISTS ticket (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      titulo TEXT NOT NULL,
                                      descricao TEXT NOT NULL,
                                      categoria TEXT NOT NULL CHECK (categoria IN ('SUPORTE', 'BUG', 'MELHORIA', 'DUVIDA')),
                                      prioridade TEXT NOT NULL CHECK (prioridade IN ('BAIXA', 'MEDIA', 'ALTA', 'URGENTE')),
                                      status TEXT NOT NULL DEFAULT 'ABERTO' CHECK (status IN ('ABERTO', 'EM_ANDAMENTO', 'RESOLVIDO', 'FECHADO')),
                                      cliente_id INTEGER NOT NULL,
                                      data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                      data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                      FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuario (
                                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                                       nome TEXT NOT NULL,
                                       email TEXT NOT NULL UNIQUE,
                                       senha TEXT NOT NULL,
                                       perfil TEXT NOT NULL CHECK (perfil IN ('ADMIN', 'TECNICO', 'CLIENTE')),
                                       status TEXT NOT NULL DEFAULT 'ATIVO' CHECK (status IN ('ATIVO', 'INATIVO')),
                                       data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cliente_email ON cliente(email);
CREATE INDEX IF NOT EXISTS idx_cliente_tipo ON cliente(tipo_cliente);
CREATE INDEX IF NOT EXISTS idx_cliente_status ON cliente(status);

CREATE INDEX IF NOT EXISTS idx_ticket_cliente ON ticket(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ticket_status ON ticket(status);

-- Dados iniciais
INSERT INTO cliente (nome_completo, email, telefone, tipo_cliente, cpf, cnpj, status)
VALUES
    ('João Silva', 'joao@exemplo.com', '(11) 99999-9999', 'PESSOA_FISICA', '12345678901', NULL, 'ATIVO'),
    ('Empresa XYZ', 'contato@xyz.com', '(11) 88888-8888', 'PESSOA_JURIDICA', NULL, '12345678000190', 'ATIVO');

INSERT INTO ticket (titulo, descricao, categoria, prioridade, status, cliente_id)
VALUES
    ('Problema no login', 'Não consigo acessar o sistema', 'SUPORTE', 'ALTA', 'ABERTO', 1),
    ('Melhoria no relatório', 'Adicionar novo campo', 'MELHORIA', 'MEDIA', 'EM_ANDAMENTO', 2);

INSERT INTO usuario (nome, email, senha, perfil, status)
VALUES
    ('Admin', 'admin@support.com', '$2a$10$xptoHhUzJKONZNOdHItkUuWb0yUwJXvYb.5JQ9Gz3wV1xYq6Q1/G', 'ADMIN', 'ATIVO');