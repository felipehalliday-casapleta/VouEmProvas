# Usar Node 20
FROM node:20-alpine

# Criar diretório de trabalho
WORKDIR /app

# Copiar pacotes
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Definir variáveis ANTES do build
ENV NODE_ENV=production
ENV PORT=8080

# Copiar todo o restante
COPY . .

# Build do frontend/backend
RUN npm run build

# Expor porta
EXPOSE 8080

# Comando final
CMD ["npm", "start"]
