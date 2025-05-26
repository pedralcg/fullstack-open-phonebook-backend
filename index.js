// Importa el módulo express
const express = require('express');
// Crea una instancia de la aplicación express
const app = express();

    //! Configuración para leer datos JSON en el cuerpo de las solicitudes
    app.use(express.json());

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


//! NUEVA RUTA: Obtener una entrada individual por ID
app.get('/api/persons/:id', (request, response) => {
    // Accede al parámetro 'id' de la URL y conviértelo a número
    const id = Number(request.params.id);

    // Busca la persona con el id correspondiente en el array 'persons'
    const person = persons.find(p => p.id === id);

    // Comprueba si se encontró la persona
    if (person) {
        response.json(person); // Si se encuentra, envía los datos como JSON
    } else {
        // Si no se encuentra, envía un código de estado 404 (Not Found)
        // y termina la respuesta sin cuerpo (end()).
        response.status(404).end();
    }
    });


//! NUEVA RUTA: Eliminar una entrada por ID (DELETE)
app.delete('/api/persons/:id', (request, response) => {
    // Accede al parámetro 'id' de la URL y conviértelo a número
    const id = Number(request.params.id);

    // Filtra el array 'persons' para crear un nuevo array sin la persona con el ID dado.
    persons = persons.filter(person => person.id !== id);

    // El código 204 indica que la solicitud fue exitosa pero no hay contenido que devolver.
    response.status(204).end();
    });


//! NUEVA RUTA: Añadir una nueva entrada (POST)
app.post('/api/persons', (request, response) => {
  // Accede al cuerpo de la solicitud (ya parseado por express.json())
  const body = request.body;

  // Genera un nuevo ID aleatorio
  const generateId = () => {
    const min = 10;
    const max = 1000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Crea el nuevo objeto persona
  const person = {
    id: generateId(), // Asigna el ID generado
    name: body.name,
    number: body.number
  };

  // Añade la nueva persona al array 'persons'
  persons = persons.concat(person);

  // Responde con la nueva persona creada y el código de estado 201 (Created)
  response.status(201).json(person);
});


//! NUEVA RUTA: /info
app.get('/info', (request, response) => {
  const numberOfEntries = persons.length; // Obtiene el número de entradas
  const requestTime = new Date(); // Obtiene la hora actual de la solicitud

  // Construye la respuesta HTML
    const infoHtml = `
        <p>Phonebook has info for ${numberOfEntries} people</p>
        <p>${requestTime}</p>
    `;
  response.send(infoHtml); // Envía la respuesta HTML
});


    // Define el puerto en el que la aplicación escuchará las peticiones
    const PORT = 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    