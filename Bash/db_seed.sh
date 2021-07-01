#!/bin/bash

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER user;
    CREATE DATABASE db;
    GRANT ALL PRIVILEGES ON DATABASE db TO user;
EOSQL

psql -U user -d db -f /docker-entrypoint-initdb.d/seed.sql