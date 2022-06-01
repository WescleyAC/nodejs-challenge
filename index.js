const { response, request } = require('express');
const express = require('express');
const app = express();
const uuid = require('uuid')
const port = 3000;
app.use(express.json())


const orders = [];

/* Esse middleware é utilizado em todas rotas que recebem o parâmetro ID,  ele verifica se o ID passado existe. 
Se não existi ele retorna um erro, caso contrário permite que a requisição continuae normalmente; */

function checkId (request, response, next) {

    const { id } = request.params

    const orderIndex = orders.findIndex(require => require.id === id)

    if (orderIndex < 0) {

        return response.status(400).json({ menssage: "Project not found" })

    }



 request.index = orderIndex;
 request.id = id;

    next()

};

// Esse middleware é chamado em todas requisições e tem um console.log que mostra o método da requisiçao.

function  requestMethod (request, response, next) {

    console.log(request.method + "-" + request.url);


    next();
}

// Rota que lista todos os pedidos já feitos.

app.get('/orders', requestMethod, (request, response) => {

    return response.json(orders)

})
// Essa rota recebe o id nos parâmentro e retorna um pedido específico.

app.get('/orders/:id', requestMethod, checkId, (request, response) => {

const idRequest = orders.filter(value => value.id === request.params.id);
response.json(idRequest);
    
    

})

// A rota post recebe o pedido do cliente, nome do cliente e valor do pedido. Informações passada dentro do corpo body. 

app.post('/orders', requestMethod,  (request, response) => {

    const { order, clienteName, price,} = request.body; //informações que vem do body.

    const processOrder = {

        id: uuid.v4(),
        order,
        clienteName,
        price,
        status: "em preparação"
    }

    orders.push(processOrder); // Aqui a variável é passada para dentro do array

    return response.status(201).json(processOrder);


});

// Essa rota altera os dados do pedido já feito, os dados do pedido e enviado pelo parâmetro da rota id.

app.put('/orders/:id', checkId, requestMethod, (request, response) => {

    const { id } = request.params;  // O require.params recebe os parâmetros que vem da rota. Nesse caso o id.  
    const { order, clienteName, price,} = request.body;


    let newOrder = {

        id,
        order,
        clienteName,
        price,
        status: "em preparação"

    }


    const orderIndex = orders.findIndex(require => require.id === id)  //request é uma variável interada dentro do vetor. Essa variável da posição 'X' vai ser atualizada pela variável newOrder.

    orders[orderIndex] = newOrder; // // O array recebe pelo index a posição da order que vai receber o objeto atualizado peo newOrder

    return response.json(newOrder);

});


// Essa rota deleta o pedido onde ela recebe o id do pedido enviado pelo parâmetro da rota. 

app.delete('/orders/:id', checkId, requestMethod, (request, response) => {

    const { id } = request.params;

    const orderIndex = orders.findIndex(require => require.id === id)  //request é uma variável interada dentro do vetor

    orders.splice(orderIndex, 1);

    return response.status(204).send();

})

// Essa rota recebe o id nos parâmetros e assim que ela é chamada, altera o status do pedido recebido pelo id para "Pronto".

app.patch ('/orders/:id', checkId, requestMethod, (request, response) => {
    
const index = request.index; // Essa variável da posição 'X' vai ser atualizada pela variável newIndex
const id = request.id;

const {order, clienteName, price} = orders[index];


const newIdex = {id, order, clienteName, price, status: "pronto"};

orders[index] = newIdex  

return response.json(newIdex);


})

app.listen(port, () => {

    console.log('😠 active server on port 3000');

})
