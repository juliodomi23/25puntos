FROM node:20-alpine
WORKDIR /app
COPY package.json .
RUN npm install --omit=dev
COPY server.js index.html ./
# el estado vive aqui; en EasyPanel se monta un volumen en /data
ENV DATA_DIR=/data
VOLUME ["/data"]
EXPOSE 3070
CMD ["node", "server.js"]
