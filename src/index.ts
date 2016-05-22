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
  runMutate,
} from './mutateRunner';

function objectAssign(dest: Object, source: Object): Object {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      dest[key] = source[key];
    }
  }
  return dest;
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
  }): Promise<Object> => {
    return runMutate(objectAssign({
      store: this.store,
      networkInterface: this.networkInterface,
    }, options) as any);
  };
}
