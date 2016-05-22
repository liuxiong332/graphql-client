import {
  SelectionSet,
  GraphQLError,
  GraphQLResult,
  Document,
} from 'graphql';

import {
  getMutationDefinition,
} from './queries/getFromAST';

import {
  NetworkInterface,
  Request,
} from './networkInterface';

import {
  GraphqlError
} from './graphqlError';

import { print } from 'graphql/language/printer';

import {
  writeSelectionSetToStore,
} from './data/writeToStore';

export interface MutateOptions {
  mutation: Document,
  variables?: Object,
  networkInterface: NetworkInterface,
  store: Object
}

export function runMutate({
  mutation,
  variables,
  networkInterface,
  store
}: MutateOptions): Promise<Object> {
  const mutationDef = getMutationDefinition(mutation);
  const mutationString = print(mutationDef);

  const request = {
    query: mutationString,
    variables,
  } as Request;

  return networkInterface.query(request).then((result) => {
    if (result.errors && result.errors.length > 0) {
      throw new GraphqlError(result.errors);
    } else {
      writeSelectionSetToStore({
        result: result.data,
        dataId: 'ROOT_MUTATION',
        selectionSet: mutationDef.selectionSet,
        variables: variables,
        store: store,
      });
      return { result: result.data };
    }
  });
}
