# \<vega-widget>

| **[UNDER DEVELOPMENT]** HTML custom element for displaying Vega/Vega-Lite visualisations


## Installation

```bash
yarn add vega-widget
# OR
npm install vega-widget
```

## Usage

You will need to import `vega-widget` JavaScript into your HTML to be able to
use the custom element:

```html
<script type="module">
  import 'vega-widget/vega-widget.js';
</script>
```

Once you do that, you are free to use our declarative API:

```html
<vega-widget spec="https://..."></vega-widget>
```

### Parameters

`<vega-widget>` is a wrapper around the [`vega-embed`](https://github.com/vega/vega-embed) library.
This means that it also accepts the same [parameters](https://github.com/vega/vega-embed#api-reference),
as well as two extra ones (marked with `*` in the table bellow).
Some of these arguments can be defined as attributes directly in the `<vega-widget>` tag,
others can be defined via a child `<script>` that marked with a custom `data-*` attribute, as indicated in the table bellow:

| Parameter  | Attribute | Script tag marking | Description |
| ---------- | --------- | ------------------ | ----------- |
| spec       | spec      | data-vega-spec     | [Vega or Vega-Lite](https://vega.github.io/vega-lite/docs/spec.html) JSON specification |
| options    | ---       | data-embed-options | [options for `vega-embed`](https://github.com/vega/vega-embed#options) |
| data `*`   | data      | data-named-values  | When `spec` uses [named data sources](https://vega.github.io/vega-lite/docs/data.html#named), `data` will be used to populate the data values |
| stream `*` | stream    | ---                | URL that will be used to listen to [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) |

Example:

```html
<vega-widget spec="https://localhost:8888/my-vega-lite-chart.json"
             stream="https://localhost:8888/realtime-changes">

  <!-- `data` parameter, assumes `spec.data` is defined as {"name": "points"} -->
  <script data-named-values type="application/json">
    {
      "points": [
        {"x": 0, "y": 0},
        {"x": 1, "y": 1},
        {"x": 2, "y": 4},
        {"x": 3, "y": 9},
      ]
    }
  </script>

  <!-- `options` parameter -->
  <script data-embed-options type="application/json">
    {"theme": "quartz", "actions": false}
  </script>
</vega-widget>
```

When defined as an attribute, the given parameter should necessarily correspond
to a URL from which the equivalent JSON payload can be downloaded (*it is an*
**error** *to assign a serialised JSON object to `<vega-widget>` attributes*).
On the other hand, when defined via a child script tags, the given parameter should necessarily
correspond to a JavaScript object (*it is an* **error** *to use URLs with the script tags*)

Please notice child `<script>` tags with parameters will be interpreted as *pure
JSON objects*, even if they don't explicit set the `type="application/json"`.
To provide full-blown JavaScript objects (that might even contain functions as
properties, which is very useful specially for the `options` parameter), you
can specify a function identifier as the value of the `data-*` attribute.
This function should be globally defined, expect no arguments and return the
corresponding JavaScript object.
This means that the previous example could also be written as:

```html
<vega-widget spec="https://localhost:8888/my-vega-lite-chart.json"
             stream="https://localhost:8888/realtime-changes">

  <!-- `data` parameter, assumes `spec.data` is defined as {"name": "points"} -->
  <script data-named-values type="application/json">
    {
      "points": [
        {"x": 0, "y": 0},
        {"x": 1, "y": 1},
        {"x": 2, "y": 4},
        {"x": 3, "y": 9},
      ]
    }
  </script>

  <!-- `options` parameter -->
  <script data-embed-options="getOptions">
    function getOptions() {
      return {"theme": "quartz", "actions": false};
    }
  </script>
</vega-widget>
```


### Dynamically Changing the Visualisation

`<vega-widget>` provides the following method for changing the embedded visualisation:

| Method      | Argument type  | Description |
| ----------- | -------------- | ----------- |
| change      | `DataChange`   | Dynamically add or remove points to/from the chart (wrapper around [`view.change`](https://vega.github.io/vega/docs/api/view/#view_change)) |
| rerender    | `Rerender`     | Redraw the chart, possibly changing `spec` and other parameters |

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

  data?: string | DataItem[],
  // ^ New values for named data sources in `spec` (data itself or URL to download it)

  options?: EmbedOptions,
  // ^ New options for vega-embed
}
```

### Server-Sent Events

As previously mentioned, it is possible to remotely drive changes in the visualisation,
via [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events).
Each server-sent event should correspond invoking either methods in the
previous section: `change` or `rerender`.

The server should send events including payloads that respect the following
interface:

```typescript
type SsePayload = (
  {event: "change", details: DataChange} |
  {event: "rerender", details: Rerender}
)
```

Please notice that the payload should be a strict JSON object, therefore
serialised functions cannot be used.


## Making Changes & Contributing

`vega-widget` development was bootstrap using [open-wc](https://github.com/open-wc/open-wc) 
tools and recommendations, please check their docs for more information.

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

If you customize the configuration a lot, you can consider moving them to individual files.

### Local Demo with `web-dev-server`
```bash
yarn start
```
To run a local development server that serves the basic demo located in `demo/index.html`
