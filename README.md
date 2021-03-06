# \<vega-viewer>

> HTML custom element for displaying Vega/Vega-Lite visualisations

**[UNDER DEVELOPMENT]**

*Disclaimer*: `vega-viewer` is not officially developed or maintained by the
[Vega organization]. It is only a third-party library that builds on top of
[`vega`], [`vega-lite`] and [`vega-embed`].


## Installation

```bash
yarn add vega-viewer
# OR
npm install vega-viewer
```

## Usage

You will need to import `vega-viewer` JavaScript into your HTML to be able to
use the custom element:

```html
<script type="module">
  import 'vega-viewer/vega-viewer.js';
</script>
```

Once you do that, you are free to use our declarative API:

```html
<vega-viewer spec="https://..."></vega-viewer>
```

### Parameters

`<vega-viewer>` is a wrapper around the [`vega-embed`] library.
This means that it also accepts the same [parameters], as well as two extra
ones introduced by `<vega-viewer>`: `data` and `remote-control`.

| Parameter        | Description                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| `spec`           | [vega or] [vega-lite JSON specification]                                                      |
| `options`        | [options for `vega-embed`]                                                                    |
| `data`           | When `spec` uses [named data sources], `data` will be used to populate it via [`view.insert`] |
| `remote-control` | Data stream with instructions to modify the visualization                                     |

There are two main ways to define these parameters: via HTML attributes in the
`<vega-viwer>` element or with nested `<script>` tags marked with some
specific `data-*` HTML attributes. Some of the parameters can be specified both
ways (although with slightly different behaviour), and other can be specified
in only one way.

The following parameters can be defined as attributes directly in the custom
element:

| Parameter        | `<vega-viwer>` attribute | Behaviour                                                             |
| --------------   | ------------------------ | --------------------------------------------------------------------- |
| `spec`           | `spec`                   | URL from where to download the JSON specification                     |
| `data`           | `data-load`              | `data-load` specifies the URL from where to download the data. An additional `data-name` can also specify which of the [named data sources] is being populated (`data-name="data"` by default) |
| `remote-control` | `remote-control`         | URL that will be used to listen to [server-sent events]               |

The following parameters can be defined as contents of nested `<script>` tags

| Parameter        | child `<script>` attribute | Behaviour                                                      |
| ---------------- | ---------------------------|--------------------------------------------------------------- |
| `spec`           | `data-vega-spec`           | The content of the `<script>` tag will be used as JSON spec    |
| `options`        | `data-embed-options`       | The content of the `<script>` tag will be used as JSON config  |
| `data`           | `data-values`              | The content of the `<script>` tag will be used as data values. An additional `data-name` can also specify which of the [named data sources] is being populated (`data-name="data"` by default) |


Example:

```html
<vega-viewer spec="https://localhost:8888/my-vega-lite-chart.json"
             remote-control="https://localhost:8888/realtime-changes">

  <!-- `data` parameter, assumes `spec.data` is defined as {"name": "points"} -->
  <script data-values data-name="points" type="application/json">
    [
      {"x": 0, "y": 0},
      {"x": 1, "y": 1},
      {"x": 2, "y": 4},
      {"x": 3, "y": 9},
    ]
  </script>

  <!-- `options` parameter -->
  <script data-embed-options type="application/json">
    {"theme": "quartz", "actions": false}
  </script>
</vega-viewer>
```

Please notice that the value of child `<script>` tags will be interpreted as
[*pure JSON objects*] if they don't explicit set the `type="application/json"`.

If a full-blown JavaScript object is absolutely required (e.g., `options` might
need functions as properties), you can specify a function identifier as the
value of the `data-*` attribute. This function should be globally defined,
expect no arguments and return the corresponding JavaScript object.
This means that the previous example could also be written as:

```html
<vega-viewer spec="https://localhost:8888/my-vega-lite-chart.json"
             stream="https://localhost:8888/realtime-changes">

  <!-- `data` parameter, assumes `spec.data` is defined as {"name": "points"} -->
  <script data-values data-name="points" type="application/json">
    [
      {"x": 0, "y": 0},
      {"x": 1, "y": 1},
      {"x": 2, "y": 4},
      {"x": 3, "y": 9},
    ]
  </script>

  <!-- `options` parameter -->
  <script data-embed-options="getOptions">
    function getOptions() {
      return {"theme": "quartz", "actions": false};
    }
  </script>
</vega-viewer>
```


### Dynamically Changing the Visualisation

`<vega-viewer>` provides the following method for changing the embedded visualisation:

| Method      | Argument type  | Description |
| ----------- | -------------- | ----------- |
| change      | `DataChange`   | Dynamically add or remove points to/from the chart (wrapper around [`view.change`]) |
| rerender    | `Rerender`     | Redraw the chart, possibly changing `spec` and other parameters                     |

Both methods expect a single argument respecting the following interfaces:

```typescript
// type DataItem;
// ^ Data value item as defined in Vega API Data
// (equivalent of a row of tabular data)

type ItemsOrPredicate = DataItem[] | ((item: DataItem) => boolean);
//^ Used to select specific data items. It is either an array with the items
//  themselves, or a predicate function that returns `true` if the passed item
//  should be selected, or `false` otherwise

interface DataChange {
  // An object that respects the `DataChange` interface will be used to create
  // a `vega.changeset`. Please refer to `vega.view.change` documentation for
  // more details.

  target: string;
  // ^ name of the data source being modified

  insert?: DataItem[] | (() => DataItem[]);
  // ^ array of data elements to be added to the data source, or function to generate them

  remove?: ItemsOrPredicate;
  // ^ array of data elements to be removed or predicate function

  modify?: {
    // ^ replace the value for `field` in the selected `items` with the returned value of the `modifier` function
    items?: ItemsOrPredicate,
    field: string,
    modifier: (dataItem: DataItem) => string | number | boolean ,  // <- returns the new value for `field`
  };
}

// type VegaSpec;
// ^ Vega or Vega-Lite JSON specification

// type EmbedOptions;
// ^ JavaScript object as defined by vega-embed

interface Rerender {
  spec?: string | VegaSpec,
  // ^ New JSON object or URL with Vega/Vega-Lite spec

  data?: DataItem[],
  // ^ New values for named data sources in `spec`,
  //   dynamically added via view.insert

  options?: EmbedOptions,
  // ^ New options for vega-embed
}
```

### Remote Control

As previously mentioned, it is possible to remotely drive changes in the visualization,
via [server-sent events].
Each server-sent event should correspond invoking either methods in the
previous section: `change` or `rerender`.

The server should send events including payloads that respect the following
interface:

```typescript
type RemoteControl = (
  {event: "change", details: DataChange} |
  {event: "rerender", details: Rerender}
)
```

Please notice that the payload should be a strict JSON object, therefore
serialised functions cannot be used.

### Further Customisation

In the case any HTML/CSS customisation is required, a `<template>` tag can be
used as shown in the example bellow:

```html
<vega-viewer spec="https://localhost:8888/my-vega-lite-chart.json"
             stream="https://localhost:8888/realtime-changes">

  <template>
    <style>* { color: red };</style>
    <header>My chart</header>
    <div id="vega-embed"></div>
    <footer>rendered with Vega</footer>
  </template>

</vega-viewer>
```

A custom template is required to contain a HTML element matching the id
query selector: `#vega-embed`.
This element will be used to host the chart rendered by [`vega-embed`].


## Making Changes & Contributing

`vega-viewer` development was bootstrap using [`open-wc`] tools and
recommendations, please check their docs for more information.

`yarn` (version 1) is used main tool driver, and custom commands are defined

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

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

To run the tests in watch mode (for <abbr title="test driven development">TDD</abbr>, for example), run

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

If you customize the configuration a lot, you can consider moving them to individual files.

### Local Demo with `web-dev-server`
```bash
yarn start
```
To run a local development server that serves the basic demo located in `demo/index.html`


<!-- References -->
[Vega organisation]: https://github.com/vega
[`vega`]: https://vega.github.io/vega/docs
[`vega-lite`]: https://vega.github.io/vega-lite/docs
[`vega-embed`]: https://github.com/vega/vega-embed
[parameters]: https://github.com/vega/vega-embed#api-reference
[vega or]: https://vega.github.io/vega/docs/specification
[vega-lite JSON specification]: https://vega.github.io/vega-lite/docs/spec.html
[options for `vega-embed`]: https://github.com/vega/vega-embed#options
[`view.insert`]: https://vega.github.io/vega/docs/api/view/#view_insert
[`view.change`]: https://vega.github.io/vega/docs/api/view/#view_change
[*pure JSON objects*]: https://www.json.org
[named data sources]: https://vega.github.io/vega-lite/docs/data.html#named
[server-sent events]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
[`open-wc`]: https://github.com/open-wc/open-wc
