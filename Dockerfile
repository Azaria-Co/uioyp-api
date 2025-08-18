FROM node:18

# Instalar netcat-openbsd (nc) para esperar MySQL
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

EXPOSE 3000

CMD ["sh", "/usr/src/init/entrypoint.sh"]