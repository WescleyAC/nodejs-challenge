const { response, request } = require('express');
const express = require('express');
const app = express();
const uuid = require('uuid')
const port = 3000;
app.use(express.json())


const productions = []; 

function requestMethod(require, response, next) {

console.log(require.method + "-" + require.url);



//console.timeEnd(require.method + "-" + require.url);

next()

}

function checkId(require, response, next) {

    const {id} = require.params
    
    const orderIndex = productions.findIndex(request => request.id === id)

    if (orderIndex < 0) {

return response.status(400).json({menssage: "Project not found"})

    }


next();
}


app.get('/order', requestMethod,  (require, response) => {

return response.json(productions)

})

app.post('/order', requestMethod, (require, response) => {

    const {order, clienteName, price, status} = require.body;

    const production = {

        id: uuid.v4(),
        order,
        clienteName,
        price,
        status
    }

    productions.push(production);

    return response.status(201).json(production);


});


app.put('/order/:id', checkId, requestMethod , (require, response ) => {

const {id} = require.params;  // O require.params recebe os parâmetros que vem da rota. Nesse caso o id
const {order, clienteName, price, status} = require.body;


const newOrder = {

    id, 
    order,
    clienteName, 
    price,
    status

}


const orderIndex = productions.findIndex(request => request.id === id)  //request é uma variável interada dentro do vetor

productions[orderIndex] = newOrder; // acesso o vetor -productions- acesso o index -orderIndex- e atirbuo a newOrder

return response.json(newOrder);

});


app.delete('/order/:id', checkId, requestMethod, (require, response) => {

const {id} = require.params; 

const orderIndex = productions.findIndex(request => request.id === id)  //request é uma variável interada dentro do vetor

productions.splice(orderIndex,1);

return response.status(204).send();

})

app.patch('/order/:id', checkId, requestMethod, (require, response) => {

const {id} = require.params;
const {order, clienteName, price, status} = require.body;


const changeOrder = {

id,
order,
clienteName,
price,
status

}


const orderIndex = productions.findIndex(request => request.id === id)

productions[orderIndex] = changeOrder; // acesso o vetor -productions- acesso o index -orderIndex- e atirbuo a changeOrder

  return response.json(changeOrder);

})

app.listen(port, () => {

console.log('😠 active server on port 3000');

})
