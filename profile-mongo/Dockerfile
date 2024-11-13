FROM mongo

COPY replica-init.js /docker-entrypoint-initdb.d/replica-init.js

CMD ["mongod", "--replSet", "rs0", "--bind_ip_all"]