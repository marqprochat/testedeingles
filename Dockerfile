# ============================================
# STAGE 1 - Build do Frontend (Vite + React)
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar TODAS as dependências (inclui devDependencies para o build)
RUN npm ci

# Copiar o restante do código
COPY . .

# Variáveis VITE_ precisam estar disponíveis no momento do build
ARG VITE_EMAIL_API_ENDPOINT
ARG VITE_PROFESSOR_EMAIL
ARG VITE_POST_TOKEN
ARG VITE_API_URL

ENV VITE_EMAIL_API_ENDPOINT=$VITE_EMAIL_API_ENDPOINT
ENV VITE_PROFESSOR_EMAIL=$VITE_PROFESSOR_EMAIL
ENV VITE_POST_TOKEN=$VITE_POST_TOKEN
ENV VITE_API_URL=$VITE_API_URL

# Build do frontend
RUN npm run build

# ============================================
# STAGE 2 - Servidor de Produção
# ============================================
FROM node:20-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários para produção
COPY package.json package-lock.json ./

# Instalar apenas dependências de produção
RUN npm ci --omit=dev

# Copiar o servidor
COPY server.js ./

# Copiar o frontend buildado do stage anterior
COPY --from=builder /app/dist ./dist

# Criar diretório de dados com permissões corretas
RUN mkdir -p /app/database && chown -R node:node /app/database

# Usar usuário não-root
USER node

# Porta padrão
EXPOSE 21090

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:21090/api/health || exit 1

CMD ["node", "server.js"]
