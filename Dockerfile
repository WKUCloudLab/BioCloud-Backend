FROM node:8.15-jessie
EXPOSE 3001
ADD . /code
RUN git clone https://github.com/WKUCloudLab/BioCloud-Frontend.git
WORKDIR /BioCloud-Frontend
RUN npm install --package-lock-only
RUN npm run build
WORKDIR dist
COPY bio-cloud /code/sqlize/BioCloudSQLize
WORKDIR /code/sqlize
RUN npm install
WORKDIR BioCloudSQLize
RUN npm install
CMD npm start

