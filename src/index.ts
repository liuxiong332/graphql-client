import {
  NetworkInterface,
  createNetworkInterface,
} from './networkInterface';

import {
  GraphQLResult,
  Document,
} from 'graphql';

import {
  readQueryFromStore,
  readFragmentFromStore,
} from './data/readFromStore';

import {
  IdGetter,
} from './data/extensions';

import {
  QueryOptions,
  QueryResultInfo,
  runQuery,
} from './queryRunner';

import {
  runMutate
} from './mutateRunner';

import isUndefined = require('lodash.isundefined');

function objectAssign(dest: Object, source: Object): Object {
  for(let key in source) {
    dest[key] = source[key];
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
    store?: Object
  } = {}) {
    this.networkInterface = networkInterface ? networkInterface :
      createNetworkInterface('/graphql');
    this.store = store || {};
  }

  public query = (options: {
    query: Document,
    variables?: Object,
    forceFetch?: boolean
  }): Promise<QueryResultInfo> => {
    return runQuery(objectAssign({
      store: this.store,
      networkInterface: this.networkInterface
    }, options) as any);
  };

  public mutate = (options: {
    mutation: Document,
    variables?: Object,
  }): Promise<Object> => {
    return runMutate(objectAssign({
      store: this.store,
      networkInterface: this.networkInterface
    }, options) as any);
  };
}
