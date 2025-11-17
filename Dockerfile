# Usar Node 20 Alpine (leve e rápido)
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json antes (cache eficiente)
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Variáveis de ambiente necessárias para produção
ENV NODE_ENV=production
ENV PORT=8080

# Copiar projeto (exceto dotfiles — Cloud Build costuma ignorar)
COPY . .

# Copiar .env.production explicitamente para garantir que o Vite leia
COPY .env.production .env.production

# Build do frontend + backend
RUN npm run build

# Expor a porta do servidor Express
EXPOSE 8080

# Comando final
CMD ["npm", "start"]
