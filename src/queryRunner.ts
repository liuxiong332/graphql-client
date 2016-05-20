import {
  SelectionSet,
  GraphQLError,
  GraphQLResult,
  Document,
} from 'graphql';

import {
  getQueryDefinition,
} from './queries/getFromAST';

import {
  NetworkInterface,
  Request,
} from './networkInterface';

import {
  diffSelectionSetAgainstStore,
} from './data/diffAgainstStore';


import {
  SelectionSetWithRoot,
} from './queries/store';

import {
  writeSelectionSetToStore,
} from './data/writeToStore';

import { print } from 'graphql/language/printer';

type QueryResultInfo = {
  queryId: string;
  result: any;
  fromCache?: boolean;
}

type QueryErrorInfo = {
  queryId: string;
  networkError?: Error;
  graphQLErrors?: GraphQLError[];
}

type QueryResultListener = (options: QueryResultInfo) => void

export interface QueryObserver {
  onQueryInit: (options: { queryId: string }) => void;
  onQueryResult: QueryResultListener;
  onQueryError: (options: QueryErrorInfo) => void;
}

export interface QueryOptions {
  query: Document;
  queryId: string,
  variables?: { [key: string]: any };
  forceFetch?: boolean;
  store: { [key: string]: any };
  networkInterface: NetworkInterface,
  observer: QueryObserver
}

export class QueryRunner {
  private store: Object;
  private variables?: Object;
  private result: Object;
  private observer: QueryObserver;
  private minimizedQuery: SelectionSetWithRoot;
  private minimizedQueryString: string;
  private queryId: string;

  constructor({
    query,
    queryId,
    variables,
    forceFetch,
    store,
    networkInterface,
    observer
  }: QueryOptions) {
    this.store = store;
    this.variables = variables;
    this.observer = observer;
    this.queryId = queryId;

    const queryDef = getQueryDefinition(query);
    const queryString = print(query);

    // Parse the query passed in -- this could also be done by a build plugin or tagged
    // template string
    const querySS = {
      id: 'ROOT_QUERY',
      typeName: 'Query',
      selectionSet: queryDef.selectionSet,
    } as SelectionSetWithRoot;

    // If we don't use diffing, then these will be the same as the original query
    this.minimizedQueryString = queryString;
    this.minimizedQuery = querySS;

    if (!forceFetch) {
      this.diffAgainstStore(querySS);
    }

    observer.onQueryInit({ queryId });

    if (this.minimizedQueryString) {
      this.fetchFromServer(this.minimizedQueryString);
    } else {
      observer.onQueryResult({ queryId, result: this.result });
    }
  }

  diffAgainstStore(querySS) {
    // If the developer has specified they want to use the existing data in the store for this
    // query, use the query diff algorithm to get as much of a result as we can, and identify
    // what data is missing from the store
    const { missingSelectionSets, result } = diffSelectionSetAgainstStore({
      selectionSet: querySS.selectionSet,
      store: this.store;
      throwOnMissingField: false,
      rootId: querySS.id,
      variables: this.variables,
    });

    this.result = result;

    if (missingSelectionSets && missingSelectionSets.length) {
      const diffedQueryDef = queryDefinition({
        missingSelectionSets,
        variableDefinitions: queryDef.variableDefinitions,
        name: queryDef.name,
      });

      this.minimizedQuery = {
        id: 'ROOT_QUERY',
        typeName: 'Query',
        selectionSet: diffedQueryDef.selectionSet,
      };

      this.minimizedQueryString = printQueryFromDefinition(diffedQueryDef);
    } else {
      this.minimizedQuery = null;
      this.minimizedQueryString = null;
    }
  }

  fetchFromServer(queryString: string) {
    const request: Request = {
      query: queryString,
      variables: this.variables,
    };

    const queryId = this.queryId;
    let {onQueryResult, onQueryError} = this.observer;

    this.networkInterface.query(request).then((result: GraphQLResult) => {

      let resultFromStore;
      // ensure result is combined with data already in store
      resultFromStore = readSelectionSetFromStore({
        store: this.getApolloState().data,
        rootId: querySS.id,
        selectionSet: querySS.selectionSet,
        variables,
        returnPartialData: returnPartialData,
      });

      if (result.errors && result.errors.length > 0) {
        onQueryError({ queryId, graphQLErrors: result.errors });
      } else {
        
        onQueryResult({ queryId, result: resultFromStore });  
      }
      
    }).catch((error: Error) => {
      onQueryError({ queryId, networkError: error });
    });
  },

  storeToStore(result) {
    const newState = writeSelectionSetToStore({
      result: result.data,
      dataId: this.minimizedQuery.id,
      selectionSet: this.minimizedQuery.selectionSet,
      variables: this.variables,
      store: this.store,
    });
  }
}
