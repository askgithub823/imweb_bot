FROM node:10-alpine
RUN apk update && \
    apk upgrade
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN npm install
ENV PORT=80
EXPOSE 80
CMD ["npm", "start"]
