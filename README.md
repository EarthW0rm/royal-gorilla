## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:${.env.DEV_PORT}/`.

## Code scaffolding

Don't use.

## Npm Scripts
* `npm run lint` - Executa o tslint para efetuar a validação básica da sintaxe.

* `npm test` - Executa as tarefas de teste unitário mocha, via gulp. Os testes a serem executados sao todos os arquivos *.spec.js na pasta royal-gorilla/tests.

* `npm start` - Valida o tslint e Inicia o aplicativo em modo desenvolvimento, nao possibilita atachar o debug do vscode.

* `npm debug` - Inicia o aplicativo em modo desenvolvimento, sem verificacao de tslint e possibilita atachar o debug do vscode.

* `npm build` - Efetua o build do aplicativo para modo Produção.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Executando via Docker
Royal-Gorilla instala facilmente no docker.

Por padrao o Docker vai expor pela porta 8080, se for necessário alterar essa porta procure nos arquivos Dockerfile and nginx.conf se necessário. 

Para montar uma nova imagem o comando abaixo pode ser utilizado.

```sh
cd royal-gorilla
docker build -t royal-gorilla:latest .
```

Após a criacao da imagem, o container poderá ser executado. Abaixo um exemplo do comando utilizado para run.
```sh
docker run -d -p 3000:8080 royal-gorilla:latest
```

## More Info?

Read the code or call the nearest Jedi.