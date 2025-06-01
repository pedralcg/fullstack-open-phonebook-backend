const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('Connecting to MongoDB')
// console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3, // Asegúrate de que el nombre tenga al menos 3 caracteres
    required: true,
    unique: true // Si quieres que los nombres sean únicos, como se ha discutido en ejercicios anteriores
  },
  number: {
    type: String,
    // La primera parte de la validación: longitud mínima de 8 caracteres
    minlength: 8,
    required: true,
    // Definimos el validador personalizado
    validate: {
      validator: function(v) {
        // Expresión regular para el formato:
        // ^\d{2,3}  -> Inicia con 2 o 3 dígitos
        // -         -> Seguido de un guion
        // \d+$      -> Seguido de uno o más dígitos hasta el final de la cadena
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!. 
                        A phone number must have 2 or 3 numbers in the first part,
                        followed by '-' and then numbers.`
    }
  }
})

// Transformamos el objeto _id a una propiedad 'id' en formato string y eliminamos __v
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)