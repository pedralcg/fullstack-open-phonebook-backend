    // Importa el módulo express
    const express = require('express');
    // Crea una instancia de la aplicación express
    const app = express();

    // Datos codificados de la agenda telefónica
    let persons = [
      {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
      },
      {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
      },
      {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
      },
      {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
      }
    ];

    // Define una ruta para la raíz de la aplicación
    app.get('/', (request, response) => {
      response.send('<h1>Hello Phonebook Backend!</h1>');
    });

    // Define una ruta para obtener todas las entradas de la agenda telefónica
    app.get('/api/persons', (request, response) => {
      response.json(persons); // Envía los datos de 'persons' como JSON
    });

    // Define el puerto en el que la aplicación escuchará las peticiones
    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    