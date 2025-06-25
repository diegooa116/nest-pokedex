# Use the official Node.js image as the base image
FROM node:22-alpine

# Set the working directory inside the container
RUN mkdir -p /var/www/pokedex
WORKDIR /var/www/pokedex

# Copiar el directorio y su contenido
COPY . ./var/www/pokedex
COPY package.json tsconfig.json tsconfig.build.json /var/www/pokedex/

# Instalar las dependencias
RUN npm install --prod
RUN npm build

# Dar permiso para ejecutar la applicación
RUN adduser --disabled-password pokeuser
RUN chown -R pokeuser:pokeuser /var/www/pokedex
USER pokeuser

# Limpiar el cache
RUN npm cache clean --force

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/main"]