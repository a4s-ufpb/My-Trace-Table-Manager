# 🖥️ My-Trace-Table-Manager

Front-end administrativo do projeto **Apps4Society (UFPB)**.

Esta aplicação é responsável pelo gerenciamento do sistema, consumindo a API do backend.

---

# 🏗️ Arquitetura do Sistema

O sistema completo é composto por:

- 👤 Front-end do Usuário  
  https://github.com/a4s-ufpb/My-Trace-Table

- 🖥️ Front-end Administrativo (este repositório)  
  https://github.com/a4s-ufpb/My-Trace-Table-Manager

- ⚙️ Backend (API)  
  https://github.com/a4s-ufpb/My-Trace-Table-Manager-API

⚠️ A API precisa estar rodando antes de iniciar este projeto.

---

# 🐳 Como Rodar com Docker

Este projeto utiliza Docker para build e execução da aplicação.

---

## 1️⃣ Pré-requisitos

- Docker instalado
- Docker Compose instalado
- A API já deve estar rodando
- A rede Docker `tracetable-network` deve existir

obs: a rede é criada automaticamente ao subir primeiro a API.

---

## 2️⃣ Configuração do `.env`

O projeto possui o arquivo:

```
.env.example
```

### Passos:

1. Copie o arquivo:

```bash
cp .env.example .env
```

*(No Windows, copie manualmente e renomeie para `.env`)*

2. Verifique a variável da API:

```env
VITE_API_URL=http://localhost:8080/v1
```

Essa variável define a URL base do backend que o front-end irá consumir.

---

## 3️⃣ Subindo o Container

Na raiz do projeto, execute:

```bash
docker compose up -d --build
```

Isso irá:

- Construir a imagem da aplicação
- Subir o container
- Expor a aplicação na porta 8888

---

## 🌐 Acessando a Aplicação

Após subir o container, acesse:

```
http://localhost:8888
```

---

# 🧹 Parando o Container

Para parar:

```bash
docker compose down
```

---

# 🧠 Estrutura do Docker Compose

O projeto sobe o seguinte serviço:

- `trace-table-manager-front` → Aplicação Front-end

Ele utiliza a rede externa:

```
tracetable-network
```

⚠️ Essa rede deve ser a mesma utilizada pela API para permitir comunicação entre os containers.

---

# 🔗 Ordem Recomendada para Subir o Sistema Completo

1. Subir a API (My-Trace-Table-Manager-API)
2. Subir o Manager (este projeto)
3. Subir o Front-end do Usuário (My-Trace-Table)

---

# 📌 Observações Importantes

- O front-end depende da API
- A variável `VITE_API_URL` deve apontar corretamente para o backend
- Caso altere a porta da API, atualize no `.env`
