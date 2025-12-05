# Etapa de construcción
FROM node:20 AS build

WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

RUN rm -rf package-lock.json


RUN npm install 

COPY . .
RUN npm run build --prod

# Etapa de ejecución con Nginx
FROM nginx:alpine

# Nota: Verifica si tu build genera 'dist/' o 'dist/nombre-proyecto/'
COPY --from=build /app/dist/ /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]