# Base image pinned to Debian Buster
FROM python:3.8-buster

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Debian Buster has reached EOL: switch mirrors to archive.debian.org and disable valid-until checks
RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list \
    && sed -i 's|security.debian.org/debian-security|archive.debian.org/debian-security|g' /etc/apt/sources.list \
    && sed -i '/buster-updates/d' /etc/apt/sources.list \
    && echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until

# Install system dependencies, gnupg for keys, and build essentials
RUN apt-get -y update && apt-get install -y --allow-unauthenticated \
    curl \
    nano \
    wget \
    nginx \
    git \
    gnupg \
    gnupg2 \
    build-essential

# Install Node.js (v16.x) and Yarn for React development runtime
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g yarn

# Mongo 4.4 installation
RUN ln -s /bin/echo /bin/systemctl
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.4 main" | tee /etc/apt/sources.list.d/mongodb-org-4.4.list
RUN apt-get -y update \
    && apt-get install -y mongodb-org

# Upgrade pip to <24.1 (pip>=24.1 strictly enforces PEP 440 and rejects legacy celery==5.0.5 metadata)
RUN python -m pip install --upgrade "pip<24.1" setuptools wheel

ENV ENV_TYPE staging
ENV MONGO_HOST mongo
ENV MONGO_PORT 27017

ENV PYTHONPATH=$PYTHONPATH:/src/

# Copy Python requirements and install
COPY src/requirements.txt .
RUN pip install -r requirements.txt
