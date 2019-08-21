
# Order Manager

*A Simple Order Manager;*

## Introduction:

A Order Manager written on NodeJS and using MySQL Server as storage, that receives orders and items as inputs;

Orders can be set by a API Entry, just like "their" items;
Each order and item have its own attributes and can be overwritten on update;

Order attributes:
	- name;
	- contact (email or phone);
	- pid (cpf or cnpj);
	- shipping (delivery tax);

Item attributes:
	- order (order id);
	- sku (unique per order);
	- price (unity price, sku-relative);
	- amount;
	- description;

Every file was written by repo's owner, including lib folder. Except for npm modules and npm's generated files;

## Setup:

Build and starts the application and storage:
```bash
	sudo docker-compose up
```

You should have in mind that I'm using a bash script (https://github.com/ufoscout/docker-compose-wait) to wait for storage (mysql) setup status - should take 45 seconds in an average notebook -. And only after that I'm deploying the application;

Wait for: "Host storage:3306 is now available";

![](https://i.imgur.com/ihzmGf7.png)

The whole process can be up to 3-5 minutes. Its all about hardware and network;
So: compose-up > mysql up > nodejs up > can use api;

Obs: you must have access to github network at least;

## Usage:

Default API port is currently set to 7777.
So, you can just make some requests based on entries (below).

```
POST> http://localhost:7777/insert-order
{
	"name" : "A Random Guy",
	"contact" : "randomguy@gmail.com",
	"pid" : "9999999999",
	"shipping" : 20.1
}
RESULT>
{
	"status": true,
	"message": "Order set with success.",
	"data": {
		"id": 7
	}
}
```

```
POST> http://localhost:7777/insert-item
{
	"order": 7,
	"sku": "banana",
	"price" : 1.32,
	"amount" : 1,
	"description" : "Just a simple banana."
}
RESULT>
{
	"status": true,
	"message": "Item set with success.",
	"data": {
		"id": 1
	}
}
```

```
POST> http://localhost:7777/get-order
{
	"id": 7,
}
RESULT>
{
	"status": true,
	"message": "Order retrieved with success.",
	"data": {
		"id": 7,
		"name" : "A Random Guy",
		"contact" : "randomguy@gmail.com",
		"pid" : "9999999999",
		"shipping": 20.1,
		"items": [
			{
				"id": 1,
				"order": 1,
				"sku": "banana",
				"price": 1.32,
				"amount": 1,
				"description": "Just a simple banana.",
				"quota": 20.1
			}
		]
	}
}
```

Obs:
	- Quota is the relative shipping rate;
	- Both order and item are updating on duplicate. Order is changing values and item, beside changing values, is increasing amount too;

### Entries:

> Insert Order:
```json
/* route: /insert-order */
{
	"name" : "A Random Guy",
	"contact" : "randomguy@gmail.com",
	"pid" : "9999999999",
	"shipping" : 130.1
}
```

> Get Order:
```json
/* route: /get-order */
{
	"id" : 3
}
```

> Insert Item:
```json
/* route: /insert-item */
{
	"order" : 17,
	"sku" : "orange",
	"price" : 0.1,
	"amount" : 4,
	"description" : "Just a simple orange. :)"
}
```

## Todo:

- [x] Create storage model (probably mysql);
- [x] Create server module;
- [x] Create context;
- [x] Manage routes;
- [x] Add functionality to routes using context module;
- [x] Update documentation (like usage and description);
- [x] "Dockerize";

## Instructions:

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
