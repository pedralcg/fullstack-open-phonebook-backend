# Phonebook Backend

Este repositorio contiene el código del backend de la aplicación Phonebook, desarrollado como parte del curso Full Stack Open. Este backend es responsable de gestionar las entradas de la agenda telefónica (obtener, añadir, eliminar, y próximamente actualizar), y de servir el frontend de React.

## Tecnologías Utilizadas

* **Node.js**: Entorno de ejecución de JavaScript.
* **Express.js**: Framework web para Node.js.
* **CORS**: Middleware para habilitar Cross-Origin Resource Sharing.
* **Morgan**: Middleware para el registro de solicitudes HTTP.

## Estructura del Proyecto

```bash
/
├── dist/                # Contiene la build del frontend de React (copiada desde el frontend)
├── request/             # Manejo de peticiones REST
├── index.js             # Archivo principal de la aplicación Express
├── package.json         # Define dependencias y scripts del proyecto
├── package-lock.json    # Gestiona las versiones de las dependencias
└── .gitignore           # Archivos y directorios a ignorar por Git
```

## Características

* **API RESTful**: Proporciona endpoints para interactuar con los datos de la agenda telefónica.
    * `GET /api/persons`: Obtiene todas las entradas de la agenda.
    * `GET /api/persons/:id`: Obtiene una entrada específica por su ID.
    * `POST /api/persons`: Añade una nueva entrada a la agenda.
    * `DELETE /api/persons/:id`: Elimina una entrada de la agenda.
    * `GET /info`: Muestra información sobre la agenda telefónica (número de entradas y fecha/hora de la solicitud).
* **Servicio de Frontend**: Sirve los archivos estáticos de la aplicación React (frontend) desde la carpeta `dist/`.
* **Validaciones Básicas**: Implementa validaciones para asegurar que los nombres y números no estén vacíos y que los nombres sean únicos.

## Cómo Ejecutar en Local

1.  **Clonar el Repositorio:**
    ```bash
    git clone <URL_DE_ESTE_REPOSITORIO_BACKEND>
    cd fullstack-open-phonebook-backend
    ```
2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
3.  **Ejecutar el Backend:**
    ```bash
    npm run dev
    ```
    El servidor se ejecutará en `http://localhost:3001` (o el puerto configurado).

### Notas sobre el Frontend Local:

Para que la aplicación funcione completamente en local, también necesitarás ejecutar el frontend de React. Asegúrate de que el frontend esté configurado para comunicarse con `http://localhost:3001/api/persons` (o la URL de tu backend local).

## Despliegue

Este backend está diseñado para ser desplegado de forma independiente y, en producción, también sirve el frontend compilado.

### Scripts de Despliegue

Se han configurado scripts de npm para automatizar el proceso de despliegue:

* `npm run build:ui`: Compila la aplicación React (frontend) y copia su `dist` a la raíz de este directorio de backend. Esto es crucial para que el backend pueda servir el frontend.
* `npm run deploy:full`: Ejecuta `build:ui`, añade los cambios a Git, crea un commit con la fecha y hora actual, y sube los cambios a GitHub, lo que activa el despliegue automático en Render.

    **Ejemplo de uso:**
    ```bash
    npm run deploy:full
    ```

## Aplicación en Línea

La aplicación Phonebook (frontend y backend combinados) está desplegada y accesible en la siguiente URL:

**[https://fullstack-open-phonebook-backend-sd2k.onrender.com/](https://fullstack-open-phonebook-backend-sd2k.onrender.com/)**

**Notas Importantes sobre la Versión Desplegada:**

* **Persistencia de Datos**: Debido a que este backend utiliza un array en memoria para almacenar los datos, **la información añadida o modificada no es persistente** y se restablecerá a los datos iniciales codificados (`Arto Hellas`, `Ada Lovelace`, `Dan Abramov`, `Mary Poppendieck`) cada vez que el servidor se reinicie. En el plan gratuito de Render, los servicios se reinician con frecuencia después de períodos de inactividad.
* **Funcionalidad PUT/Actualización (Ejercicio 3.9)**: Actualmente, la funcionalidad de actualización de números de teléfono (`PUT`) **no está implementada en este backend** según los requisitos del ejercicio 3.9 del curso. Si se intenta una actualización desde el frontend, el backend responderá con un error `404 Not Found`. Esta funcionalidad se implementará en ejercicios posteriores.
* **Errores 400 (Bad Request)**: Si al añadir una persona, el nombre o el número están vacíos, o el nombre ya existe en la agenda (sin reiniciar el servidor), el backend devolverá un error `400 Bad Request`. Este es el comportamiento esperado de las validaciones implementadas.

---