# Usar Node 20
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar pacotes
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=8080

# Copiar todo o projeto (mas o Cloud Build pode ignorar dotfiles!)
COPY . .

# Garantir que o .env.production ENTRE no container
COPY .env.production .env.production

# Build do frontend/backend
RUN npm run build

# Expor porta
EXPOSE 8080

# Comando final
CMD ["npm", "start"]
