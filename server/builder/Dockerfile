FROM ubuntu:focal

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_21.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs

RUN apt-get install git -y

WORKDIR /home/app

COPY exec.sh exec.sh
COPY script.js script.js
COPY package*.json .

RUN npm install

RUN chmod +x exec.sh
RUN chmod +x script.js

ENTRYPOINT [ "/home/app/exec.sh" ]