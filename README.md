# SITE-FACULDADE-PLI

## Descrição

Este é um sistema web desenvolvido usando Node.js com Express.js. O sistema está dividido em duas partes principais: o servidor (`server`) e o cliente (`client`). O servidor gerencia as requisições e a lógica de negócio, enquanto o cliente cuida da interface do usuário e das animações.

## Dependências

### Servidor (server)

- express: Framework para Node.js
- mysql2: Biblioteca para conectar ao MySQL
- cors: Middleware para habilitar CORS (Cross-Origin Resource Sharing)
- body-parser: Middleware para analisar requisições JSON
- dotenv: Módulo para carregar variáveis de ambiente dentro do arquivo `.env`

### Cliente (client)

- animejs: Biblioteca para animações

## Instalação

### Pré-requisitos

- Node.js
- npm (Node Package Manager)

### Passos para Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/Luanbfar/site-faculdade-pli.git
    cd site-faculdade-pli
    ```

2. Instale as dependências do servidor:

    ```bash
    cd server
    npm install
    ```

3. Instale as dependências do cliente:

    ```bash
    cd ../client
    npm install
    ```

## Execução

### Servidor

Para iniciar o servidor, navegue até o diretório `server` e execute o seguinte comando:

```bash
cd server
node server.js
```
O servidor será iniciado e estará disponível em http://localhost:8080.

## Cliente

Os arquivos estáticos nas pastas `public` e `src` são servidos pelo `server.js`. Para acessar a página inicial, basta entrar em http://localhost:8080.

## Uso

### Rotas do servidor

As rotas disponíveis no servidor são definidas no diretório `routes`. Exemplos de rotas incluem:

- `GET /api/cars`: Retorna uma lista de carros.
- `POST /api/cars`: Cria um novo carro.
- `PUT /api/cars/:id`: Atualiza um carro existente.
- `DELETE /api/cars/:id`: Remove um carro.

### Animações do cliente

As animações são gerenciadas pela biblioteca [animejs](https://animejs.com/) e podem ser vistas e configuradas no arquivo `anime.min.js` no diretório `client/src/modules`.

## Contribuição

Se você quiser contribuir com este projeto, por favor, siga os passos abaixo:

1. Faça um fork do projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/fooBar`).
3. Commit suas mudanças (`git commit -m 'Add some fooBar'`).
4. Faça o push para a branch (`git push origin feature/fooBar`).
5. Crie um novo Pull Request.

## Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para mais detalhes.