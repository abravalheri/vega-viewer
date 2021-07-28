FROM mcr.microsoft.com/playwright:v1.10.0-focal

ENV YARN_CACHE_FOLDER="/cache/.yarn"

WORKDIR /staging
COPY package.json yarn.lock ./
RUN --mount=type=cache,id=yarn-cache,target=/cache/.yarn \
    yarn install --non-interactive --ignore-scripts && \
    npm install playwright

EXPOSE 8888
WORKDIR /code

RUN ln -s /staging/node_modules node_modules

ENTRYPOINT ["/usr/bin/yarn", "run"]
CMD ["start"]
