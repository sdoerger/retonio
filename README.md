<p align="center">
  <a href="https://npmjs.com/package/retonio" target="_blank" rel="noopener noreferrer">
    <img width="230" src="https://ik.imagekit.io/vrfrbvdn0j/sddev/Retonio.svg?updatedAt=1638883929199" alt="Retonio logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/retonio"><img src="https://badgen.net/npm/v/retonio" alt="npm package"></a>
</p>
<br/>

# Retonio
A simple store setup for Vue.
Probably the code, you would have written with Pinia, anyway.

- 📦 Wrapps a Pinia Store in one line
- 🔧 Customizeable
- ⏳ Loading States

[Pinia](https://pinia.esm.dev/) is a magical awesome Tool, to create Vue Stores simpler (expecially with TypeScript) and lighter then Vuex.

Retonio is a Tool on top, which return with just 2 arguments a whole store unit, to avoid repetition for standard cases (and slightly above).

In addition, it adds loading states, highly inspired by another amazing tool [VueUse](https://vueuse.org/).
By that you have can render the status of you API call in a vue component.

## Possbile coming Feature

- [] Add Types
- [] Rewrite in TypeScript
- [] Single File Store creation
- [] Simpler way to import
- [] Vue-Component for Loading

## Installation

```bash
npm install retonio
# or with yarn
yarn add retonio
```
## Presets
If you have not setup Pinia already, include it in the main.ts file [See official docs](https://pinia.esm.dev/getting-started.html#installation):

```js
import { createPinia } from 'pinia'
app.use(createPinia())
```

## Usage

### Create default a Store with Retonio

As with Pinia, create preferably each store in a single file (i. e. in src/store/moudles).
(apiAllRecepies is an imported axios function).
You need to pass Pinia via config and Id and api call as params

```js
// src/store/modules/allRecepies.ts
// LIBS
import { defineStore } from 'pinia';
import { retonio } from 'retonio';

// API
import { apiAllRecepies } from '@/api/allRecepies.api';

// ----------
// RETONIO
// ----------
export const useAllRecepies = retonio({
  id: 'AllRecepies',
  api: useAllRecepies,
  init: defineStore,
});
```

### Even easier with make command
### With make command

1. Create a `Makefile` (exactly that name, no extension) or add to your existing `Makefile` and add following:

```c
retonio:
	node node_modules/retonio/make-retonio.mjs ts false	$(filter-out $@,$(MAKECMDGOALS))
```

Just once and you are done.

1. From you terminal in you root dir type i. e.:
`make retonio AllRecepies recepies`
This will create `src/store/modules/recepies/AllRecepies.js` with same content of the file above.

Just `make retonio AllRecepies` will create `src/store/modules/AllRecepies.js`.

### With make npm script
Add to the package.json:
```json
"scripts": {
  "retonio": "node node_modules/retonio/make-retonio.mjs js true"
},
```
Run `npm run retonio` or click in vscode in npm scripts at `retonio` to achive the same as with make

If you prefer TypeScript, change in the `Makefile` js to ts at `node node_modules/retonio/make-retonio.mjs ts false` and in the `package.json` "node src/script/make-retonio.mjs ts true".
*There might be later a better way to configure it.*

This is highly inspired by [Laravel Artisan](https://laravel.com/docs/8.x/artisan).

### Add custom getter path, getter, action, error
In order to so, pass a config object (all items optional).
path as string and rest as export function.

```ts
// src/store/modules/allRecepies.ts
// LIBS
import { retonio } from 'retonio';

// API
import { apiAllRecepies } from '@/api/allRecepies.api';
etonio

// Example for custom action
export function testAction(response) {
  try {
    const recepies = apiCall(response);

    return recepies;
  } catch (error) {
    console.error(error);
    // alertStore.error({ error: error });
    // ALERT.error({ error: error, messageType });
    return null;
  }

  return response;
}

// ----------
// RETONIO
// ----------
export const useAllRecepies = retonio({
  id: 'AllRecepies',
  api: useAllRecepies,
  init: defineStore,
  action: testAction,
});
```

### This will create such a Pinia store

```ts
import { defineStore } from 'pinia'
// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useAllRecepies = defineStore('main', {
  // a function that returns a fresh state
  state: () => ({
    isFinished: true,
    isLoading: false, // Is ture, as long as it is loading
    error: false,
    response: { /* Response object */ },
  }),
  // optional getters
  getters: {
    getData(state) {
    // ...
    // RETURNS
    // Gets raw response (from state.response)
    // OR
    // Nested path if proviced by objet depth (i.e.: state.response.data.recepies)
    // OR
    // Return from optional getterHelper
    // ...
    }
  },
  // optional actions
  actions: {
    async fetchData(params = undefined): {
      // ...
      // Fetches response from API call

      // IF RESOLVED
      // Sets raw response (to state.response)
      // OR
      // Sets from optional actionHelper

      // IF REJECTED
      // Logs erroro with Pinia Id to console
      // OR
      // Executes optonal errorHelper
    },
  },
})
```

### Import store in Vue 3 component
Using setup script
(LoadingComponent might be added in the future)

```html
<!-- src/components/RecepieComponent.vue -->
<template>
  <!-- Component which hadles loadingState.isLoading to render a spinner -->
  <LoadingComponent :loadingState="loadingState" />

  <!-- Renders a List if it is not loading an has no errror -->
  <RecepieComponent v-if="!loadingState.isLoading && !loadingState.error && recepies" :itemsList="recepies" />
</template>

<script lang="ts" setup>
  // VUE
  import { computed } from 'vue';

  // STORE
  import { useAllRecepies } from '@/store/modules/allRecepies';
  const allRecepies = useAllRecepies();

  // --------------------------------------
  // GET DATA FROM STORE
  // --------------------------------------
  allRecepies.fetchData(/* Optional params*/);
  // Get loading state
  const loadingState = computed(() => {
    if (allRecepies.$state) return allRecepies.$state;
    return false;
  });

  // Get data from getter
  const recepies = computed(() => {
    if (allRecepies.getData) return allRecepies.getData;
    return false;
  });
</script>
```

## Documentation

To learn more about Retonio, check [cooming soon]().

## License

[MIT](http://opensource.org/licenses/MIT)