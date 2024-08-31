FROM node:alpine

WORKDIR /app-backend

COPY  . /app-backend

RUN npm i -g pnpm && pnpm install

ENV PORT=3001
ENV NODE_ENV=development
ENV BACKEND_URL=http://localhost:3001
ENV FRONTEND_URL=http://localhost:3000
ENV DATABASE_URL=postgresql://postgres:postgres@postgres:5432/mydb?schema=public

EXPOSE 3001

CMD ["pnpm", "run", "start:migrate"]
