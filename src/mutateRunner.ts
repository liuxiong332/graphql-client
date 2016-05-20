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

import { print } from 'graphql/language/printer';

type QueryErrorInfo = {
  mutationId: string;
  networkError?: Error;
  graphQLErrors?: GraphQLError[];
}

export interface MutationObserver {
  onMutationInit: (options: { mutationId: string }) => void;
  onMutationResult: (options: {mutationId: string, result: Object}) => void;
  onMutationError: (options: QueryErrorInfo) => void;
}

export class MutateRunner {
  constructor({
    mutationId,
    mutation,
    variables,
    networkInterface,
    observer
  }: {
    mutationId: string,
    mutation: Document,
    variables?: Object,
    networkInterface: NetworkInterface,
    observer: MutationObserver
  }) {
    const mutationDef = getMutationDefinition(mutation);
    const mutationString = print(mutationDef);

    const request = {
      query: mutationString,
      variables,
    } as Request;

    observer.onMutationInit({ mutationId: mutationId });
    const {onMutationResult, onMutationError} = observer;

    networkInterface.query(request).then((result) => {
      if (result.errors && result.errors.length > 0) {
        onMutationError({ mutationId, graphQLErrors: result.errors });
      } else {
        onMutationResult({ mutationId, result: result.data });
      }
    }).catch((error: Error) {
      onMutationError({ mutationId, networkError: error });
    });
  }
}