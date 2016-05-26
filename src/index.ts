import {
  NetworkInterface,
  createNetworkInterface,
} from './networkInterface';

import {
  Document,
} from 'graphql';

import {
  QueryResultInfo,
  runQuery,
} from './queryRunner';

import {
  MutationResult,
  runMutation,
} from './mutationRunner';

function objectAssign(dest: Object, source: Object): Object {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      dest[key] = source[key];
    }
  }
  return dest;
}

import gql from './gql';

export {
  gql,
}

export default class GraphqlClient {
  public networkInterface: NetworkInterface;
  public store: Object;

  constructor({
    networkInterface,
    store,
  }: {
    networkInterface?: NetworkInterface,
    store?: Object,
  } = {}) {
    this.networkInterface = networkInterface ? networkInterface :
      createNetworkInterface('/graphql');
    this.store = store || {};
  }

  public query = (options: {
    query: Document,
    variables?: Object,
    forceFetch?: boolean,
  }): Promise<QueryResultInfo> => {
    return runQuery(objectAssign({
      store: this.store,
      networkInterface: this.networkInterface,
    }, options) as any);
  };

  public mutate = (options: {
    mutation: Document,
    variables?: Object,
  }): Promise<MutationResult> => {
    return runMutation(objectAssign({
      store: this.store,
      networkInterface: this.networkInterface,
    }, options) as any);
  };
}
