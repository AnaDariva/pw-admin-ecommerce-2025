# 🛒 E-Commerce Web - Projeto Final

**Aplicação de E-commerce** desenvolvida como projeto final da disciplina de **Tópicos avançados em programação para Web**.

Este projeto consiste em uma plataforma de e-commerce completa, dividida em dois módulos principais: uma **loja virtual (vitrine)** para os clientes e um **painel administrativo** para o gerenciamento de pedidos, usuários e operações.

📁 O projeto é estruturado em:
- `server/` – API RESTful desenvolvida com **Spring Boot**.
- `client/` – Cliente Web (Vitrine e Painel Admin) desenvolvido com **React.js**, **TypeScript**, **HTML** e **CSS**.

---

<h2 align="left"> 🖥️ Tecnologias Utilizadas </h2>

<p align="left">
  <a href="https://www.java.com" target="_blank">
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg" alt="java" width="40" height="40"/>
</a>
  <a href="https://spring.io/projects/spring-boot" target="_blank">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/spring/spring-original.svg" alt="spring" width="40" height="40"/>
  </a>
  <a href="https://react.dev" target="_blank">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="react" width="40" height="40"/>
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original.svg" alt="html" width="40" height="40"/>
  </a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS" target="_blank">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original.svg" alt="css" width="40" height="40"/>
  </a>
  <a href="https://git-scm.com/" target="_blank">
    <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg" alt="git" width="40" height="40"/>
  </a>
  <a href="https://www.postman.com/" target="_blank">
    <img src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg" alt="postman" width="40" height="40"/>
  </a>

</p>

---

## 🎯 Objetivo do Trabalho

- Criar uma aplicação **cliente-servidor Web completa com acesso a banco de dados**.
- Implementar uma **API RESTful** com Spring Boot, incluindo autenticação, gerenciamento de permissões, envio de e-mails e upload de arquivos.
- Desenvolver uma **interface web responsiva** com React.js, contendo tanto a vitrine para o cliente quanto um painel administrativo.
- Aplicar boas práticas de arquitetura em aplicações web modernas.

---

## 🛠️ Funcionalidades

A aplicação é dividida em dois módulos funcionais principais:

### 🛍️ Módulo Cliente (Vitrine)
- ✅ Listagem de produtos e categorias
- ✅ Página de detalhes de produto
- ✅ Carrinho de compras (com edição e remoção, mesmo sem login)
- ✅ Cadastro e login de clientes
- ✅ Gerenciamento de endereços
- ✅ Tela de finalização de pedido
- ✅ Histórico de pedidos do usuário

### 🔐 Módulo Administrativo (Painel)
- ✅ Tela de cadastro e autenticação para usuários administrativos.
- ✅ **Painel Administrativo (Dashboard)** com totalizadores (ex: nº de pedidos por situação).
- ✅ **Gerenciamento de Usuários**:
    - Apenas administradores podem acessar.
    - Novos usuários ficam inativos até um admin ativar e atribuir permissões.
- ✅ **Gerenciamento de Pedidos**:
    - Listagem de pedidos com filtros (por status, cliente, data).
    - Alteração de status do pedido (ex: `AGUARDANDO_PAGAMENTO`, `PAGO`, `EM_TRANSPORTE`, `CANCELADO`).
- ✅ **Anexos em Pedidos**:
    - Upload de arquivos (.pdf, etc.) associados ao pedido (ex: Nota Fiscal, comprovantes).
    - Visualização e download dos anexos.

### ⚙️ Backend (API `server/`)
- ✅ Cadastro e autenticação de usuários com **perfis e permissões (Spring Security)**.
- ✅ Gerenciamento de produtos e categorias.
- ✅ Gerenciamento de carrinho de compras.
- ✅ Endpoints para **CRUD de pedidos e alteração de status**.
- ✅ Endpoint de **upload de arquivos** (salvamento local, S3 ou Minio) associado a pedidos.
- ✅ Serviço de **envio de e-mail (Spring Mail)** para notificar clientes sobre atualizações de status.
- ✅ **Registro de Logs** para operações de atualização de pedidos e envio de e-mails.
- ✅ Integração com banco de dados (PostgreSQL, MySQL).

---

## 🏗️ Ferramentas e Requisitos

### Backend
- Java JDK 21
- Spring Boot, Spring Web, Spring Data JPA, Spring Security
- Spring Mail 
- Banco de Dados: H2 
- IDE: IntelliJ 
- Testes: Postman ou Insomnia

### Frontend
- React.js com TypeScript
- HTML & CSS
- Node.js & npm
- IDE: WebStorm

---

## 🗄️ Banco de Dados

O projeto utiliza o H2 (em memória) para testes.

**Estrutura de Tabelas Sugerida:**
- `usuarios`: Armazena usuários administrativos e clientes (ou separados), com seus perfis e permissões.
- `pedidos`: Cabeçalho dos pedidos, status, cliente associado.
- `pedidos_itens`: Itens de cada pedido.
- `documentos`: Armazena metadados de anexos (ex: nota fiscal) relacionados aos pedidos.
- `produtos`: Cadastro de produtos.
- `categorias`: Cadastro de categorias.

---

## 👩‍💻 Autor
- **Ana Luisa Dariva Ramos** - Acadêmica de Análise e Desenvolvimento de Sistemas na UTFPR-PB
