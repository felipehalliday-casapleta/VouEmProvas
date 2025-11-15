# ----------------------------------------------------
# 1) BUILDER IMAGE
#    Compila o frontend e o backend
# ----------------------------------------------------
FROM node:20 AS builder

WORKDIR /app

# Copia os manifestos primeiro para aproveitar cache
COPY package.json package-lock.json ./

# Instala dependências
RUN npm install

# Copia todo o projeto
COPY . .

# Compila frontend (Vite) + backend (esbuild)
RUN npm run build


# ----------------------------------------------------
# 2) RUNTIME IMAGE
#    Leve, otimizada e pronta para Cloud Run
# ----------------------------------------------------
FROM node:20-slim AS runner

WORKDIR /app

# Copia apenas o necessário da build anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Instala apenas PROD dependencies para ficar leve
RUN npm install --omit=dev

# Requerido pelo Cloud Run
ENV NODE_ENV=production
ENV TZ=America/Sao_Paulo

# Porta obrigatória do Cloud Run
ENV PORT=8080

# Exponha a porta
EXPOSE 8080

# Inicia o servidor (Express + estáticos do dist)
CMD ["node", "dist/index.js"]
