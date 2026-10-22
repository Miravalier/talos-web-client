FROM alpine:3.24 AS openssh-env
WORKDIR /config
RUN apk --no-cache add openssh-server
RUN ssh-keygen -t ed25519 -q -f /config/id_ed25519 -C "" -N ""

FROM golang:1.27-alpine AS go-env
WORKDIR /go/src/github.com/miravalier/talos-web-client/
COPY . ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o app .

FROM node:26-alpine AS node-env
WORKDIR /usr/src/
COPY front ./front
WORKDIR /usr/src/front
RUN npm install
RUN npm run build

FROM alpine:3.24
WORKDIR /root/
COPY --from=go-env /go/src/github.com/miravalier/talos-web-client/app ./
COPY --from=node-env /usr/src/front ./front
COPY --from=openssh-env /config/* ./
ENTRYPOINT ["./app"]
