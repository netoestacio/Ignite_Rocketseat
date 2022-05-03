const express = require('express');

const app = express();

app.use(express.json())
/**
 * Tipos de Parametros
 * 
 * Route Params => Identificar um recurso editar/deletar/buscar
 * Query Params => Paginaçao / Filtro
 * Body Params => Os objetos de inserçao / alteraçao
 * 
 */

app.get('/', (req, res) => {
    return res.json({
        message: "Hello World Ignite"
    });
})

app.post('/courses', (req, res) => {
    const body = req.body
    console.log(body)
    return res.json([
        "Curso 1","Curso 2","Curso 3","Curso 4"
    ])
})

app.put('/courses/:id', (req, res) => {
    const params = req.params;
    const query = req.query
    console.log(params);
    console.log('-----------');
    console.log(query);
    return res.json([
        "Curso 6","Curso 2","Curso 3","Curso 4"
    ])
})

app.patch('/courses', (req, res) => {
    return res.json([
        "Curso 6","Curso 7","Curso 3","Curso 4"
    ])
})

app.patch('/courses/:id', (req, res) => {
    return res.json([
        "Curso 7","Curso 3","Curso 4"
    ])
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
});