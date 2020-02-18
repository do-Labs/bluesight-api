# Services Dockerfile
FROM tiangolo/node-frontend:10 as build-stage
WORKDIR /api
COPY ./ /api/
RUN npm install

RUN node api 8000
