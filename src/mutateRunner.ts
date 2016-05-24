import {
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
  GraphqlError,
} from './graphqlError';

import {
  IdGetter,
} from './data/extensions';

import { print } from 'graphql/language/printer';

import {
  writeSelectionSetToStore,
} from './data/writeToStore';

export interface MutateOptions {
  mutation: Document;
  variables?: Object;
  networkInterface: NetworkInterface;
  store: Object;
  dataIdFromObject?: IdGetter;
}

export function runMutate({
  mutation,
  variables,
  networkInterface,
  store,
  dataIdFromObject,
}: MutateOptions): Promise<{result: any}> {
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
        dataIdFromObject,
      });
      return { result: result.data };
    }
  });
}
