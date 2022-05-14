const express = require('express');
const req = require('express/lib/request');
const { send } = require('express/lib/response');
const { v4: uuidV4 } = require('uuid') 

const app = express();
//Midleware
app.use(express.json());

const customers = []

//Middleware

function verifyIfExistAccountCPF(request, response, next) {
    const { cpf } = request.headers;
  

    const customer = customers.find(customer => {customer.cpf === cpf});
    
    if(!customer){
        return response.status(400).json({
            error: "Customer not found"
        })
    }

    request.customer = customer;

    return next();
}

function getBalance(statement) {
   const balance = statement.reduce((acc, operation) => {
        if(operation.type === 'credit'){
            return acc + operation.amount
        }else{
            return acc-operation.amount;
        }
    }, 0);
    return balance;
}


app.get('/statement', verifyIfExistAccountCPF,(request, response) => {

    
    const {customer} = request;
    
    return response.json(customer.statement)
    
})

app.get('/statement/date', (request, resposne)=> {
    const { customers } = request;
    const { date } = request.query;

    const dateFormat = new Date(date + "00:00");

    const statement = customers.statement.filter((statement)=> {
        statement.created_at.toDateString() === new Date(dateFormat).toDateString();
    })

    return resposne.json(customers.statement)
})


app.post('/withdraw', verifyIfExistAccountCPF, (request, response) => {
    const { aount } = request.body;
    
    const customer = request.customer;

    const balance = getBalance(customer.statement);

    if(balance < amount){
        return response.status(400).json({
            error: "Insufficient founds"
        })
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.post('/deposit', verifyIfExistAccountCPF,(request, response) => {
    
    const { description, amount } = request.body;

    const { customer } = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "Credit"
    }
    
    customer.statement.push(statementOperation);

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

app.put('/account', (request, response) => {
    const { name } = request.body;
    const { customer } = request;

    customer.name = name;

    return response.status(200).send();
});

app.get('/account', verifyIfExistAccountCPF,(request,response) => {
    const { customer } = request;
    return response.json(customer);
});

app.delete('/account/', verifyIfExistAccountCPF, (request, response) => {
    const { customer } = request;

    customers.splice(customer, 1);

    return response.status(200).json(customers);

});

app.get('/balance', verifyIfExistAccountCPF,(request, response) => {
    const { customer } = request;

    const balance = getBalance(customer.statement);

    return response.json(balance);
});

app.listen(3000, () => {
    console.log('Server running on port 3000')
})