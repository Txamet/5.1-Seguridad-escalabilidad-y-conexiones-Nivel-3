# Descripción


# Tecnologías utilizadas
- Node.js
- Typescript
- MySQL
- Prisma
- Swagger
- React
- Vite
- Jest

# Requisitos
- Node.js v20.14.0
- MySQL v8.0

# Instalación
### 1. Clonar el repositorio

Clona el repositorio localmente usando el siguiente comando:


`git clone https://github.com/Txamet/5.1-Seguridad-escalabilidad-y-conexiones-Nivel-3.git`


### 2. Navegar a la carpeta del nivel deseado
Una vez clonado el repositorio:

`cd 5.1-Seguridad-escalabilidad-y-conexiones-Nivel-3`

Ahora has de abrir dos terminales, una para el front-end y otra para el back-end:

- Para acceder al back-end:

   `cd back-end`

- Para acceder al front-end:

   `cd front-end\blog-app`

### 3. Instalar dependencias

En ambas carpetas instala todas las dependencias necesarias ejecutando el comando:

 `npm install`
 
### 4. Configurar variables de entorno
Crea un archivo `.env` en ambas carpetas.

Puedes copiar y pegar el contenido del archivo `env.example` y luego editarlo con los datos de tu base de datos `mySQL` y el puerto que prefieras usar.

# Ejecución
### 1. Back-end
Ejecuta el siguiente comando:
`npx tsc`

Y a continuación:
`npm run api`

### 2. Front-end
Ejecuta el siguiente comando:
`npm run dev`

### 3. App
1. Clicka en el enlace que te aparece en la terminal del front-end para que en tu navegador aparezca la app del blog. Ya puedes comprobar su funcionamiento.
2. Clicka en el enlace del back-end y en la ruta del navegador añade "/docs" para ver la documentación de la api.

# Testing
En la carpeta del back-end, y sin estar ejecutándose la api, ejecuta el siguiente comando:
`npm run test`
