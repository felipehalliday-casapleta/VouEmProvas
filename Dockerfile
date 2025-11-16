# Usar Node 20, que é o padrão recomendado para Cloud Run
FROM node:20-alpine

# Criar diretório de trabalho dentro do container
WORKDIR /app

# Copiar apenas pacotes primeiro (cache eficiente)
COPY package*.json ./

# Instalar dependências de produção
RUN npm ci

# Copiar todo o restante do projeto
COPY . .

# Rodar build do frontend e do backend
RUN npm run build

# Definir variáveis padrão
ENV NODE_ENV=production
ENV PORT=8080

# Expor a porta
EXPOSE 8080

# Comando de inicialização
CMD ["npm", "start"]
