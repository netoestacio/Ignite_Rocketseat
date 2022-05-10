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

app.get('/statement', (request, response) => {
    const { cpf } = request.headers;
    console.log(cpf);

    const customer = customers.find(customer => {customer.cpf === cpf});
    if(!customer){
        return response.status(400).json({
            error: "Customer not found"
        })
    }

    return response.json(customer.statement)
})

app.post('/account', (request, response) => {

    const {cpf, name} = request.body;

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf)

    if(customerAlreadyExists){
        return response.status(400).json({
            error: "Customer Already Exists"
        })
    }

    customers.push({
        cpf,
        name,
        id: uuidV4(),
        statement: []
    })

    return response.status(201).send()
});

app.listen(3000, () => {
    console.log('Server running on port 3000')
})