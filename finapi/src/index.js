const express = require('express');
const { send } = require('express/lib/response');
const { v4: uuidV4 } = require('uuid') 

const app = express();
//Midleware
app.use(express.json());

const customers = []
/**
 * cpf = string
 * name = string
 * id = uuid
 * statement = []
 */
app.get('/account', (request, response) => {
    response.send(customers)
})

app.post('/account', (request, response) => {

    const {cpf, name} = request.body;
    const id = uuidV4();

    customers.push({
        cpf,
        name,
        id,
        statement: []
    })

    return response.status(201).send()
});

app.listen(3000, () => {
    console.log('Server running on port 3000')
})