//! Cargar variables de entorno
require('dotenv').config()

const express = require('express'); // Importa el módulo express
const app = express(); // Crea una instancia de la aplicación express
const morgan = require('morgan'); // Importa el módulo morgan
const cors = require('cors') // Importa el paquete cors

//* Importa el modelo Person desde el nuevo módulo
const Person = require('./models/person')

// Validar que la URL de MongoDB se ha cargado correctamente
const url = process.env.MONGODB_URI
if (!url) {
  console.error('Error: MONGODB_URI not found in .env file or environment variables.');
  console.error('Please make sure you have a .env file with MONGODB_URI=your_connection_string');
  process.exit(1);
}

//* Middleware para parsear el cuerpo JSON
app.use(express.json())
app.use(express.static('dist')) // Si tienes un frontend estático en 'dist'
app.use(cors()) // Habilita CORS si tu frontend está en un dominio diferente


// Custom token for morgan to log request body (useful for debugging)
morgan.token('body', (req, res) => JSON.stringify(req.body));

// Configura morgan para loguear requests, incluyendo el body para POST
app.use(morgan(':method :status :res[content-length] - :response-time ms :body'))



// Define una ruta para la raíz de la aplicación
app.get('/', (request, response) => {
    response.send('<h1>Hello Phonebook Backend!</h1>');
});

//* Obtener todas las entradas de la agenda telefónica
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})


//TODO: Obtener una entrada individual por ID
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


//TODO: Eliminar una entrada por ID (DELETE)
app.delete('/api/persons/:id', (request, response) => {
    // Accede al parámetro 'id' de la URL y conviértelo a número
    const id = Number(request.params.id);

    // Filtra el array 'persons' para crear un nuevo array sin la persona con el ID dado.
    persons = persons.filter(person => person.id !== id);

    // El código 204 indica que la solicitud fue exitosa pero no hay contenido que devolver.
    response.status(204).end();
    });


//TODO: Añadir una nueva entrada (POST)
app.post('/api/persons', (request, response) => {
  // Accede al cuerpo de la solicitud (ya parseado por express.json())
  const body = request.body;

  //* Validación 1: Comprobar si falta el nombre o el número
  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing'
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    });
  }

  //* Validación 2: Comprobar si el nombre ya existe (insensible a mayúsculas/minúsculas)
  const nameExists = persons.some(person =>
    person.name.toLowerCase() === body.name.toLowerCase()
  );

  if (nameExists) {
    return response.status(400).json({
      error: 'Name must be unique'
    });
  }

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


//TODO: /info
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


//* Define el puerto en el que la aplicación escuchará las peticiones
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})