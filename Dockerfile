# FROM node:20-alpine AS BASE

# FROM base AS deps
# WORKDIR /app
# COPY package.json yarn.lock* package-lock.json* ./

# RUN npm install --frozen-lockfile

# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# ENV DATABASE_URL="postgresql://arkstokuser:arkstokpassword@localhost:5432/arkstokdb?schema=public"
# RUN npx prisma generate
# RUN npm run build

# FROM base AS runner
# WORKDIR /app

# ENV NODE_ENV production
# ENV PORT 3000

# COPY --from=builder /app/public ./public
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package.json ./package.json

# COPY --from=builder /app/src/generated/prisma ./src/generated/prisma

# EXPOSE 3000

# CMD ["npm","run" , "dev"]


FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock* package-lock.json* ./

COPY . .

RUN npx prisma generate

RUN npm install --frozen-lockfile

EXPOSE 3000

CMD ["npm", "run", "dev"]