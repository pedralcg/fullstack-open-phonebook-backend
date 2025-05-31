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
app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
  // Pasa cualquier error (ej. conexión DB) al middleware de errores
  .catch(error => next(error));
})



//* Obtener una entrada individual por ID
app.get('/api/persons/:id', (request, response, next) => {
    // Accede al parámetro 'id' de la URL y conviértelo a número
    const id = request.params.id;

    // Usa findById para buscar en la base de datos
    Person.findById(id)
      .then(person => {
        if (person) {
          response.json(person); // Si se encuentra, envía los datos como JSON
        } else {
          // Si no se encuentra, envía un código de estado 404 (Not Found)
          response.status(404).end();
        }
      })
      // Pasa cualquier error (incluido CastError) al middleware de errores
      .catch(error => next(error));
})


//* Eliminar una entrada por ID (DELETE)
app.delete('/api/persons/:id', (request, response, next) => {
    // Accede al parámetro 'id' de la URL y conviértelo a número
    const id = request.params.id;

    Person.findByIdAndDelete(id)
    // 'result' es el documento eliminado, o null si no se encontró
    .then(result => {
      // 204 No Content para eliminación exitosa (o si no se encontró)
      response.status(204).end();
    })
    .catch(error => next(error)); // Pasa el error al middleware de errores
});


//* Actualizar una entrada existente (PUT)
app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const body = request.body;

  // Creamos un objeto con los campos que queremos actualizar
  const person = {
    name: body.name,
    number: body.number,
  };

  // findByIdAndUpdate(id, datos_a_actualizar, opciones)
  // { new: true }: Asegura que la promesa devuelva el documento *actualizado*
  // { runValidators: true }: Ejecuta las validaciones del esquema (ej. minlength, required)
  // { context: 'query' }: Necesario en algunos casos para que runValidators funcione con 'unique'
  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      // Si updatedPerson es null, significa que no se encontró ninguna persona con ese ID
      if (updatedPerson) {
        // Envía la persona actualizada como respuesta
        response.json(updatedPerson);
      } else {
        // Si no se encontró, envía un 404 Not Found
        response.status(404).end();
      }
    })
    .catch(error => next(error)); // Pasa cualquier error al middleware de errores
});


//* Añadir una nueva entrada (POST)
app.post('/api/persons', (request, response, post) => {
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


//* Ruta /info
app.get('/info', (request, response, next) => {
  // Obtiene la hora actual de la solicitud
  const requestTime = new Date();

  // Usa countDocuments para obtener el número real de entradas de la base de datos
  Person.countDocuments({})
    .then(count => {
      const infoHtml = `
        <p>Phonebook has info for ${count} people</p>
        <p>${requestTime}</p>
      `;
      response.send(infoHtml);
    })
    .catch(error => next(error)); // Pasa cualquier error de base de datos al middleware de errores
});

// Middleware unknownEndpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


//! Middleware de manejo de errores
const errorHandler = (error, request, response, next) => {
  // Loguea el mensaje de error para depuración en la consola del servidor
  console.error(error.message);

  if (error.name === 'CastError') {
    // Si el error es un CastError (ID malformado)
    return response.status(400).send({ error: 'malformatted id' });
  }

  next(error);
};

// ¡Este debe ser el último middleware cargado!
app.use(errorHandler);


//* Define el puerto en el que la aplicación escuchará las peticiones
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})