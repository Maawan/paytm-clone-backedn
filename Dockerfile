FROM node:18 as builder

WORKDIR /

COPY package*.json .
RUN npm install

COPY src/ src/
COPY /.env .

FROM node:18 as runner
WORKDIR /

COPY --from=builder /package*.json .
COPY --from=builder /node_modules node_modules
COPY --from=builder /src /src



CMD ["npm","start"]