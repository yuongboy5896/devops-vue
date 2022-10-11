#FROM node:16.14.0-alpine3.14 as build-stage
 
#WORKDIR /app
#COPY node_modules node_modules

FROM 192.168.48.36/devops/devops-vue-node_modules:dev  as build-stage 
COPY . .
RUN npm run build


# production stage
#FROM harbor.thpyun.com/common/openresty:latest
FROM nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html/