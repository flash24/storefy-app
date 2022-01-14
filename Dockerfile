FROM node:14

RUN apt-get update && \
    apt-get install -y openjdk-8-jdk && \
    apt-get install -y ant && \
    apt-get clean;

WORKDIR /app

COPY . .

RUN npm install -g serverless
RUN npm install

RUN sls dynamodb install
# RUN sls dynamodb start

# CMD ["sls","dynamodb", "install"]
EXPOSE 3000
CMD ["npm","start"]