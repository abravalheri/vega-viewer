# \<vega-widget>

This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation
```bash
yarn i vega-widget
```

## Usage
```html
<script type="module">
  import 'vega-widget/vega-widget.js';
</script>

<vega-widget></vega-widget>
```

## Development

`vega-widget` development uses `yarn` (version 1) as its main tool driver.
`yarn` can be executed directly from the development environment, however some
tasks can fail due to some required development packages that rely/build binary
extensions.
To facilitate this process, a `Dockerfile` is available at the root of the
project. This file is used by the `run` script to bootstrap a container ready
to run the test suite and most of the tasks described in `package.json`.
This means that instead of running `yarn run <TASK AND OPTIONS>`, you can also
execute `./run <TASK AND OPTIONS>`. Please notice however that not every file is
mounted inside the docker container with the `run` script, so if the task you
are running changes some files at the root of the repository, the changes might
not be reflected back on the file system of your hosting machine.

### Before you start

Make sure to install and properly setup [`husky`](https://typicode.github.io/husky)
as a git hook manager (please refer to the instructions in `husky`'s documentation).
This will ensure, in commit time, code consistency and minimal quality.

### Linting with ESLint, Prettier, and Types
To scan the project for linting errors, run
```bash
yarn run lint
```

You can lint with ESLint and Prettier individually as well
```bash
yarn run lint:eslint
```
```bash
yarn run lint:prettier
```

To automatically fix many linting errors, run
```bash
yarn run format
```

You can format using ESLint and Prettier individually as well
```bash
yarn run format:eslint
```
```bash
yarn run format:prettier
```

### Testing with Web Test Runner
To run the suite of Web Test Runner tests, run
```bash
yarn run test
```

To run the tests in watch mode (for &lt;abbr title=&#34;test driven development&#34;&gt;TDD&lt;/abbr&gt;, for example), run

```bash
yarn run test:watch
```

### Demoing with Storybook
To run a local instance of Storybook for your component, run
```bash
yarn run storybook
```

To build a production version of Storybook, run
```bash
yarn run storybook:build
```


### Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

### Local Demo with `web-dev-server`
```bash
yarn start
```
To run a local development server that serves the basic demo located in `demo/index.html`
