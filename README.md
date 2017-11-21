# Vue Data Tablee

<table border="0">
  <tr>
    <td>
      <a href="https://standardjs.com" title="JavaScript Style Guide">
        <img
          src="https://img.shields.io/badge/code_style-standard-brightgreen.svg"
          alt="JavaScript Style Guide"
        />
      </a>
    </td>
  </tr>
</table>

Yeap, another Vue table component. This one is based on [vue-good-table][0], a
simple and pretty table component.

## Install

Install from npm.

```sh
npm install vue-data-tablee
```

With `Vue.use` function declare vue-data-tablee components.

```js
// Using ES2015 modules syntax
import Vue from 'vue'
import DataTablee from 'vue-data-tablee'

// Using CommonJS modules
var Vue = require('vue')
var DataTablee = require('vue-data-tablee')

Vue.use(DataTablee)
```

You can also import just components you need, without installing globally.

```vue
<script>
import { DataTable } from 'vue-data-tablee'

export default {
  components: { DataTable }
}
</script>
```

## License

Released under [MIT license][1].

[0]: https://github.com/xaksis/vue-good-table
[1]: ./LICENSE.md
