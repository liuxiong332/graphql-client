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
  queryDefinition,
  printQueryFromDefinition,
} from './queryPrinting';

import {
  NetworkInterface,
  Request,
} from './networkInterface';

import {
  diffSelectionSetAgainstStore,
} from './data/diffAgainstStore';

import {
  GraphqlError
} from './graphqlError';

import {
  readSelectionSetFromStore,
} from './data/readFromStore';

import {
  writeSelectionSetToStore,
} from './data/writeToStore';

import { print } from 'graphql/language/printer';

export interface QueryResultInfo {
  result: Object;
  fromCache?: boolean;
}

export interface QueryOptions {
  query: Document;
  variables?: { [key: string]: any };
  forceFetch?: boolean;
  store: { [key: string]: any };
  networkInterface: NetworkInterface
}

export function runQuery({
  query,
  variables,
  forceFetch,
  store,
  networkInterface,
}: QueryOptions): Promise<QueryResultInfo> {

  const queryDef = getQueryDefinition(query);
  const queryString = print(query);

  // Parse the query passed in -- this could also be done by a build plugin or tagged
  // template string
  const querySS = {
    id: 'ROOT_QUERY',
    typeName: 'Query',
    selectionSet: queryDef.selectionSet,
  };

  // If we don't use diffing, then these will be the same as the original query
  let minimizedQueryString = queryString;
  let minimizedQuery = querySS;
  let initialResult;

  function diffAgainstStore() {
    // If the developer has specified they want to use the existing data in the store for this
    // query, use the query diff algorithm to get as much of a result as we can, and identify
    // what data is missing from the store
    const { missingSelectionSets, result } = diffSelectionSetAgainstStore({
      selectionSet: querySS.selectionSet,
      store: store,
      throwOnMissingField: false,
      rootId: querySS.id,
      variables: variables,
    });

    initialResult = result;

    if (missingSelectionSets && missingSelectionSets.length) {
      const diffedQueryDef = queryDefinition({
        missingSelectionSets,
        variableDefinitions: queryDef.variableDefinitions,
        name: queryDef.name,
      });

      minimizedQuery = {
        id: 'ROOT_QUERY',
        typeName: 'Query',
        selectionSet: diffedQueryDef.selectionSet,
      };

      minimizedQueryString = printQueryFromDefinition(diffedQueryDef);
    } else {
      minimizedQuery = null;
      minimizedQueryString = null;
    }
  }

  function fetchFromServer(queryString: string) {
    const request: Request = {
      query: queryString,
      variables: variables,
    };

    return networkInterface.query(request).then((result: GraphQLResult) => {

      if (result.errors && result.errors.length > 0) {
        throw new GraphqlError(result.errors);
      } else {
        writeToStore(result);

        let resultFromStore = readSelectionSetFromStore({
          store: store,
          rootId: querySS.id,
          selectionSet: querySS.selectionSet,
          variables: variables,
          returnPartialData: false,
        });

        return {result: resultFromStore};
      }

    });
  }

  function writeToStore(result) {
    writeSelectionSetToStore({
      result: result.data,
      dataId: minimizedQuery.id,
      selectionSet: minimizedQuery.selectionSet,
      variables: variables,
      store: store,
    });
  }

  if (!forceFetch) {
    diffAgainstStore();
  }

  if (minimizedQueryString) {
    return fetchFromServer(minimizedQueryString);
  } else {
    return Promise.resolve({result: initialResult, fromCache: true});
  }
}
