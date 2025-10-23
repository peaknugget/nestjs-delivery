#!/bin/bash

docker buildx build --platform linux/amd64,linux/arm64 -t test/fc-nestjs-gateway:latest -f ./apps/gateway/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t test/fc-nestjs-notification:latest -f ./apps/notification/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t test/fc-nestjs-order:latest -f ./apps/order/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t test/fc-nestjs-payment:latest -f ./apps/payment/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t test/fc-nestjs-product:latest -f ./apps/product/Dockerfile --target production .
docker buildx build --platform linux/amd64,linux/arm64 -t test/fc-nestjs-user:latest -f ./apps/user/Dockerfile --target production .

docker push test/fc-nestjs-gateway:latest
docker push test/fc-nestjs-notification:latest
docker push test/fc-nestjs-order:latest
docker push test/fc-nestjs-payment:latest
docker push test/fc-nestjs-product:latest
docker push test/fc-nestjs-user:latest