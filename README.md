## AlertApp: Seguridad Vecinal

### Descripción

AlertApp es una aplicación de alertas de seguridad desarrollada en React Native. Permite a los usuarios reportar incidentes de seguridad en tiempo real, visualizar alertas cercanas y responder a ellas, facilitando la comunicación en barrios y comunidades.

## DER - Base de datos

erDiagram
    USERS {
        string id PK
        string name
        string email UNIQUE
        string password
        string phoneNumber
        string profilePicture
    }

    NEIGHBORS {
        string id PK
        string userId FK
        string address
        string cityId FK
    }

    ALERTS {
        string id PK
        string title
        string description
        int level
        datetime createdAt
        string userId FK
        string groupId FK
    }

    MESSAGES {
        string id PK
        string alertId FK
        string userId FK
        string content
        datetime sentAt
    }

    GROUPS {
        string id PK
        string name
        string description
    }

    CITIES {
        string id PK
        string name
        string provinceId FK
    }

    PROVINCES {
        string id PK
        string name
        string countryId FK
    }

    COUNTRIES {
        string id PK
        string name
    }

    USERS ||--o{ NEIGHBORS : "has"
    USERS ||--o{ ALERTS : "creates"
    USERS ||--o{ MESSAGES : "writes"
    NEIGHBORS }o--|| CITIES : "located in"
    CITIES }o--|| PROVINCES : "belongs to"
    PROVINCES }o--|| COUNTRIES : "belongs to"
    ALERTS }o--|| GROUPS : "belongs to"
    MESSAGES }o--|| ALERTS : "related to"


### Tecnologías Utilizadas

#### Frontend

- React Native: Desarrollo móvil multiplataforma para Android e iOS.

- Socket.io: Comunicación en tiempo real.

- Axios: Manejo de peticiones HTTP al backend.

- React Navigation: Navegación dentro de la app.

- React Native Elements: Componentes UI modernos.

#### Backend

- Node.js: Entorno de ejecución de JavaScript en el servidor.

- Express.js: Framework ligero para la creación de APIs.

- Prisma: ORM para gestionar la base de datos de manera eficiente.

- MongoDB: Base de datos NoSQL utilizada para el almacenamiento de alertas y respuestas.

- Socket.io: Implementación de comunicación en tiempo real.

#### Servicios Cloud

- Firebase:

    * Firestore: Base de datos NoSQL en la nube para almacenar alertas y respuestas en tiempo real.

    * Authentication: Manejo de usuarios mediante email y redes sociales.

    * Cloud Functions: Lógica de backend para automatizar ciertas acciones.

## Funcionalidades

📍 Registro y autenticación de usuarios (Firebase Authentication)

🚨 Creación de alertas con título, descripción, nivel de alerta y ubicación.

💬 Respuestas en tiempo real a las alertas.

📌 Diferenciación de alertas propias y de otros usuarios.

🆘 Botón de pánico flotante para generar una alerta rápida.

📅 Ordenamiento de alertas por fecha y nivel de importancia.

### Instalación y Configuración

#### Requisitos previos

- Tener instalado Node.js y npm.

- Tener configurado el entorno de desarrollo de React Native.

- Tener una cuenta en Firebase y configurar Firestore y Authentication.

#### Instalación

1. Clonar el repositorio.

`git clone https://github.com/MarcosGual/alertapp.git` 
###
`cd alertapp`

2. Instalar dependencias de cada uno de los directorios (backend y frontend) con el comando:

`npm install`

3. Configurar Firebase (crear y completar el archivo .env con las credenciales).

#### Ejecución

##### Para ejecutar frontend en Android

`expo start --android`

##### Para ejecutar backend

`npm run dev`

### Licencia

Este proyecto está bajo la licencia MIT.
