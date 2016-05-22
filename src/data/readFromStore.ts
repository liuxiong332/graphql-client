import {
  diffSelectionSetAgainstStore,
} from './diffAgainstStore';

import {
  SelectionSet,
  Document,
} from 'graphql';

import {
  getQueryDefinition,
  getFragmentDefinition,
} from '../queries/getFromAST';

// import {
//   printAST,
// } from './debug';

export function readQueryFromStore({
  store,
  query,
  variables,
}: {
  store: Object,
  query: Document,
  variables?: Object,
}): Object {
  const queryDef = getQueryDefinition(query);

  return readSelectionSetFromStore({
    store,
    rootId: 'ROOT_QUERY',
    selectionSet: queryDef.selectionSet,
    variables,
  });
}

export function readFragmentFromStore({
  store,
  fragment,
  rootId,
  variables,
}: {
  store: Object,
  fragment: Document,
  rootId: string,
  variables?: Object,
}): Object {
  const fragmentDef = getFragmentDefinition(fragment);

  return readSelectionSetFromStore({
    store,
    rootId,
    selectionSet: fragmentDef.selectionSet,
    variables,
  });
}

export function readSelectionSetFromStore({
  store,
  rootId,
  selectionSet,
  variables,
  returnPartialData = false,
}: {
  store: Object,
  rootId: string,
  selectionSet: SelectionSet,
  variables: Object,
  returnPartialData?: boolean,
}): Object {
  const {
    result,
  } = diffSelectionSetAgainstStore({
    selectionSet,
    rootId,
    store,
    throwOnMissingField: !returnPartialData,
    variables,
  });

  return result;
}
