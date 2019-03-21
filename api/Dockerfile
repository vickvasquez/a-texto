FROM node:10.15.0

COPY ./package*.json /var/lib/app/
COPY . /var/lib/app/
COPY ./scripts/*.sh /home/docker/

WORKDIR /var/lib/app

RUN chmod -R +x /home/docker/*.sh && npm i --silent

EXPOSE 3000
ENTRYPOINT [ "/home/docker/startup-api.sh" ]