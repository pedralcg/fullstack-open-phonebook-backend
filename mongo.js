//! Cargar variables de entorno
require('dotenv').config()

//! Ojo! Añadir variable de entorno a Render cuando sea necesario: "Environment Variables"


const mongoose = require('mongoose')

// //! Método del ejercicio 3.12
// // 1. Validar la cantidad de argumentos
// // node mongo.js <password>
// // node mongo.js <password> <name> <number>
// if (process.argv.length < 3) {
//   console.log('Usage: node mongo.js <password>')
//   console.log('       node mongo.js <password> <name> <number>')
//   process.exit(1)
// }

// // 2. Obtener la contraseña de los argumentos
// const password = process.argv[2]

// // 3. Definir la URL de conexión a MongoDB Atlas
// // Asegúrate de reemplazar <tu_contraseña_real> con la contraseña de tu usuario 'pedralcg'
// const url =
//   `mongodb+srv://pedralcg:${password}@cluster0.a2ikdqk.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

//! Método variables de entorno propuesto @pedralcg
const url = process.env.MONGODB_URI

// Validar que la URL de MongoDB se ha cargado correctamente
if (!url) {
  console.error('Error: MONGODB_URI not found in .env file or environment variables.')
  console.error('Please make sure you have a .env file with MONGODB_URI=your_connection_string')
  process.exit(1)
}

// 4. Configurar Mongoose (strictQuery) y conectar
mongoose.set('strictQuery', false)
mongoose.connect(url)

// 5. Definir el esquema para una persona (Person)
// NB: Si llamas al modelo 'Person', Mongoose automáticamente lo llamará 'people' en la DB
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// 6. Definir el modelo 'Person'
const Person = mongoose.model('Person', personSchema)


// 7. Lógica condicional basada en la cantidad de argumentos

//* Escenario: Añadir una nueva persona
//! Método variables de entorno
if (process.argv.length === 4) {
  const name = process.argv[2]
  const number = process.argv[3]

  // //! Método ejercicio 3.12
  // if (process.argv.length === 5) {
  // const name = process.argv[3]
  // const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number,
  })

  person.save()
    //! error  'result' is defined but never used  no-unused-vars
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close() // Cierra la conexión después de guardar
    })
    .catch(error => {
      console.error('Error saving person:', error.message)
      mongoose.connection.close()
    })
}

//* Escenario: Listar todas las personas
//! Método variables de entorno
else if (process.argv.length === 2) {
// //! Método ejercicio 3.12
// else if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })
      mongoose.connection.close() // Cierra la conexión después de listar
    })
    .catch(error => {
      console.error('Error fetching persons:', error.message)
      mongoose.connection.close()
    })
}

