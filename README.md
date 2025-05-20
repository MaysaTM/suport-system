# Sistema de Suporte - Gestão de Clientes e Tickets

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

## Descrição do Projeto

Sistema completo para gestão de clientes e tickets de suporte, desenvolvido com:

- **Backend**: Spring Boot (Java) com API
- **Frontend**: React.js com Bootstrap
- **Banco de Dados**: SQLite

Funcionalidades principais:
- Cadastro e gerenciamento de clientes
- Abertura e acompanhamento de tickets
- Dashboard com estatísticas e pagina de configurações (hardcoded, apenas para estética)

- ## 💡 Dicas

### Ambiente de Desenvolvimento Recomendado

1. **Backend no IntelliJ IDEA**:
   - Abra o projeto Maven no IntelliJ
   - Configure o JDK 17
   - Use o Spring Boot run configuration (o IntelliJ detecta automaticamente)

2. **Frontend no VS Code**:
   - Abra a pasta do frontend no VS Code
   - Extensões recomendadas:
     - ES7+ React/Redux snippets
     - Prettier - Code formatter
     - ESLint
     - Bootstrap 5 Quick Snippets



## 🚀 Tecnologias Utilizadas

### Backend
- Java 17
- Spring Boot 3.2.5
  - Spring Web MVC
  - Spring Data JPA
  - Spring Validation
- SQLite
- Hibernate 6.4.4
- Lombok
- MapStruct


### Frontend
- React 18
- React Router 6
- Bootstrap 5 + React-Bootstrap
- Formik + Yup (formulários)
- Axios (chamadas HTTP)
- React Icons
- SASS

## 📦 Instalação e Execução

### Pré-requisitos
- JDK 17
- Node.js 16+
- Maven 3.6+
- NPM 8+

### Backend

1. Navegue até a pasta do backend:
   ```bash
   cd support-system/support-system
   ```

2. Compile o projeto:
   ```bash
   mvn clean install
   ```

3. Execute a aplicação:
   ```bash
   mvn spring-boot:run
   ```

### Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd support-system-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie a aplicação:
   ```bash
   npm start
   ```

4. Acesse no navegador:
   ```
   http://localhost:3000/
   ```


## 🔧 Configurações

### Backend
- Banco de dados: SQLite (automático em `./database/support-system.db`)
- Porta: 8080
- Configurações em `backend/src/main/resources/application.properties`

### Frontend
- Proxy para API: `http://localhost:8080` (configurado no package.json)
- Variáveis de ambiente no arquivo `.env`

## 📄 Documentação da API

2. **Collection do Postman**:
   - Arquivo: `SupportSystem.postman_collection.json`
   - Importe no Postman para testar todos os endpoints



##  Video do projeto funcionando


https://github.com/user-attachments/assets/c9ca6040-25c9-41ad-9480-4096a0af403b






