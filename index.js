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


// Eliminar una entrada por ID (DELETE)
app.delete('/api/persons/:id', (request, response) => {
    // Accede al parámetro 'id' de la URL y conviértelo a número
    const id = request.params.id;

    Person.findByIdAndDelete(id)
    // 'result' es el documento eliminado, o null si no se encontró
    .then(result => {
      // 204 No Content para eliminación exitosa (o si no se encontró)
      response.status(204).end();
    })
    .catch(error => {
      console.error(error.message); // Loguea el mensaje de error para depuración
    });
});

//* Añadir una nueva entrada (POST)
app.post('/api/persons', (request, response) => {
  // Accede al cuerpo de la solicitud (ya parseado por express.json())
  const body = request.body;

  //* Validación 1: Comprobar si falta el nombre o el número
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name missing'
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'Number or number missing'
    });
  }

  //! IGNORADO PARA EJERCICIO 3.14
  // //* Validación 2: Comprobar si el nombre ya existe (insensible a mayúsculas/minúsculas)
  // const nameExists = persons.some(person =>
  //   person.name.toLowerCase() === body.name.toLowerCase()
  // );

  // if (nameExists) {
  //   return response.status(400).json({
  //     error: 'Name must be unique'
  //   });
  // }



  // Crear instancia del modelo Person
  const person = new Person({
    name: body.name,
    number: body.number
  });

  // Guardar la nueva persona en la base de datos
  person.save()
    .then(savedPerson => {
      // Enviar la respuesta con la persona recién guardada
      response.status(201).json(savedPerson); // 201 Created para una creación exitosa
    })
    .catch(error => next(error)); // Pasa cualquier error de guardado al middleware de errores
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