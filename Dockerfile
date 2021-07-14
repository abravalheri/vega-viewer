# syntax=docker/dockerfile:1.2
FROM mcr.microsoft.com/playwright:focal

ENV YARN_CACHE_FOLDER="/cache/.yarn"

WORKDIR /staging
COPY package.json yarn.lock ./
RUN --mount=type=cache,id=yarn-cache,target=/cache/.yarn \
    yarn install --ignore-scripts

EXPOSE 8888
WORKDIR /code

RUN ln -s /staging/node_modules node_modules

COPY *.json *.mjs ./

ENTRYPOINT ["/usr/bin/yarn", "run"]
CMD ["start"]
