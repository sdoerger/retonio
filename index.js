// VUE
import { defineStore } from "pinia";

// LIBS
import justSafeGet from "just-safe-get";

export class BaseState {
  //Indicates if the request has finished
  isFinished = undefined;
  //Indicates if the request is currently loading
  isLoading = undefined;
  //Indicates if the request was canceled
  error = undefined;
  // //Axios response data
  response = undefined;

  constructor(
    isFinished = false,
    isLoading = false,
    error = false,
    response = undefined
  ) {
    this.isFinished = isFinished || false;
    this.isLoading = isLoading || false;
    this.error = error || false;
    this.response = response || undefined;
  }
}

export class Retonio {
  storeId = undefined; // Pinia ID / AlertMapper
  apiCall = undefined; // Imported API call
  storeDepth = undefined; // Getter depth (default: 'response')
  getterHelper = undefined; // Optional getter code
  actionHelper = undefined; // Optional action code
  errorHelper = undefined; // Optional action code

  constructor(
    storeId, // Pinia ID / AlertMapper
    apiCall, // Imported API call
    config // Config param
  ) {
    // REQUIRED
    this.storeId = storeId;
    this.apiCall = apiCall;
    // Default store depth (state.response), which might be overwritten by config.
    this.storeDepth = "response";

    // OPTIONAL
    if (config) {
      if (config.path) this.storeDepth = config.path;
      if (config.getter) this.getterHelper = config.getter;
      if (config.action) this.actionHelper = config.action;
      if (config.error) this.errorHelper = config.error;
    }
  }

  // To executre pinia function
  pinia() {
    // Values from constructor needs to be stored here in vars, otherwise it cannot be accessed from pinia function
    const storeDepthToString = String(this.storeDepth);
    const apiCall = this.apiCall;
    const getterHelper = this.getterHelper;
    const actionHelper = this.actionHelper;
    const errorHelper = this.errorHelper;

    // ----------
    // PINIA
    // ----------
    // Default, to create new pinia store
    const useDefaultStore = defineStore({
      id: this.storeId,

      state: () => ({
        ...new BaseState(),
      }),

      getters: {
        getData(state) {
          // A getter helper can be passed as function, to alter the data in any ways
          if (getterHelper) {
            return getterHelper(state.response);
          } else {
            // Else, assign as is from API (with storeDepthToString)
            return justSafeGet(state, storeDepthToString);
          }
        },
      },

      actions: {
        async fetchData(params = undefined) {
          useDefaultStore().$state.isLoading = true;

          try {
            let response = await apiCall(params);

            // If action helper, return response of it. Needs to
            if (actionHelper) {
              response = await actionHelper(params);
            }

            if (response /*.status === 200 || response.status === 201)*/) {
              // Assign new BaseState Object with response to state
              useDefaultStore().$state = {
                ...new BaseState(),
                isFinished: true,
                response: response.data,
              };
            }
          } catch (error) {
            // handle api call error
            console.error(
              `ERROR from DefaultPinia at id="${useDefaultStore().$id}"`
            );
            // Assign new BaseState Object with error to state
            useDefaultStore().$state = {
              ...new BaseState(),
              isFinished: true,
              error: true,
            };

            // If error helper, exectute it
            if (error && errorHelper) {
              errorHelper(error, useDefaultStore().$id);
            }

            // alertStore.error({
            //   error: error,
            //   messageType: useDefaultStore().$id,
            // });
          }
        },
      },
    });

    return useDefaultStore;
  }
}

export function retonio(id, apiCall, config = undefined) {
  // ----------
  // PINIA FROM RETONIO
  // ----------
  return new Retonio(
    id, // Pinia ID / AlertMapper
    apiCall, // Imported API call,
    config // Optional Retonio configuration file
  ).pinia();
}
