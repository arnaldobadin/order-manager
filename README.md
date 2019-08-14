# Order Manager

A Simple Order Manager;

### Usage:

...

### Todo:


- [ ] Create storage model (probably mysql);
- [ ] Create server module;
- [ ] Create context;
- [ ] Manage routes;
- [ ] Add functionality to routes using context module;
- [ ] "Dockerize";

### Instructions:

```
# Back-End Test

Clone este projeto e mande um .zip com o resultado final.

## O que fazer?

1. Criar uma API REST para um CRUD de pedido
2. Salvar as informações em algum banco de dados (relacional ou não-relacional).
3. Gravar o valor do frete rateado por item. (Se der dízima periódica dividir os centavos)

| Campo | Descrição
|---|---|
| nome  | Obrigatório. Nome do cliente |
| email  | Obrigatório. Validar formato do e-mail |
| cpf  | Obrigatório. Validar formato do CPF |
| cep  | Obrigatório. Validar formato do CEP |
| frete  | Obrigatório. Valor do frete |
| valor  | Obrigatório. Valor total do pedido |
| itens  | Obrigatório. Array |
| itens.sku  | Obrigatório. SKU do produto |
| itens.descricao  | Obrigatório. Descrição do produto |
| itens.valor  | Obrigatório. Valor do produto |
| itens.quantidade  | Obrigatório. Quantidade do produto |


## Requisitos
1. O teste pode ser feito usando qualquer linguagem ou framework
2. É necessário ter um passo a passo de como fazer pra rodar o teste, se possível deixar como um docker

Boa sorte!
```
