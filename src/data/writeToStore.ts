import isArray = require('lodash.isarray');
import isNull = require('lodash.isnull');
import isUndefined = require('lodash.isundefined');
import assign = require('lodash.assign');

import {
  getQueryDefinition,
  getFragmentDefinition,
} from '../queries/getFromAST';

import {
  storeKeyNameFromField,
  resultKeyNameFromField,
  isField,
  isInlineFragment,
} from './storeUtils';

import {
  OperationDefinition,
  SelectionSet,
  FragmentDefinition,
  Field,
  Document,
} from 'graphql';

import {
  IdGetter,
} from './extensions';

// import {
//   printAST,
// } from './debug';

/**
 * Convert a nested GraphQL result into a normalized store, where each object from the schema
 * appears exactly once.
 * @param  {Object} result Arbitrary nested JSON, returned from the GraphQL server
 * @param  {String} [fragment] The GraphQL fragment used to fetch the data in result
 * @param  {SelectionSet} [selectionSet] The parsed selection set for the subtree of the query this
 *                                       result represents
 * @param  {Object} [store] The store to merge into
 * @return {Object} The resulting store
 */
export function writeFragmentToStore({
  result,
  fragment,
  store = {},
  variables,
  dataIdFromObject,
}: {
  result: Object,
  fragment: Document,
  store?: Object,
  variables?: Object,
  dataIdFromObject?: IdGetter,
}): Object {
  // Argument validation
  if (!fragment) {
    throw new Error('Must pass fragment.');
  }

  const parsedFragment: FragmentDefinition = getFragmentDefinition(fragment);
  const selectionSet: SelectionSet = parsedFragment.selectionSet;

  if (!result['id']) {
    throw new Error('Result must have id when writing fragment to store.');
  }

  return writeSelectionSetToStore({
    dataId: result['id'],
    result,
    selectionSet,
    store,
    variables,
    dataIdFromObject,
  });
}

export function writeQueryToStore({
  result,
  query,
  store = {},
  variables,
  dataIdFromObject,
}: {
  result: Object,
  query: Document,
  store?: Object,
  variables?: Object,
  dataIdFromObject?: IdGetter,
}): Object {
  const queryDefinition: OperationDefinition = getQueryDefinition(query);

  return writeSelectionSetToStore({
    dataId: 'ROOT_QUERY',
    result,
    selectionSet: queryDefinition.selectionSet,
    store,
    variables,
    dataIdFromObject,
  });
}

export function writeSelectionSetToStore({
  result,
  dataId,
  selectionSet,
  store = {},
  variables,
  dataIdFromObject,
}: {
  dataId: string,
  result: any,
  selectionSet: SelectionSet,
  store?: Object,
  variables: Object,
  dataIdFromObject?: IdGetter,
}): Object {
  selectionSet.selections.forEach((selection) => {
    if (isField(selection)) {
      const resultFieldKey: string = resultKeyNameFromField(selection);
      const value: any = result[resultFieldKey];

      if (isUndefined(value)) {
        throw new Error(`Can't find field ${resultFieldKey} on result object ${dataId}.`);
      }

      writeFieldToStore({
        dataId,
        value,
        variables,
        store,
        field: selection,
        dataIdFromObject,
      });
    } else if (isInlineFragment(selection)) {
      // XXX what to do if this tries to write the same fields? Also, type conditions...
      writeSelectionSetToStore({
        result,
        selectionSet: selection.selectionSet,
        store,
        variables,
        dataId,
        dataIdFromObject,
      });
    } else {
      throw new Error('Non-inline fragments not supported.');
    }
  });

  return store;
}

function writeFieldToStore({
  field,
  value,
  variables,
  store,
  dataId,
  dataIdFromObject,
}: {
  field: Field,
  value: any,
  variables: {},
  store: Object,
  dataId: string,
  dataIdFromObject?: IdGetter,
}) {
  let storeValue;

  const storeFieldName: string = storeKeyNameFromField(field, variables);

  // If it's a scalar, just store it in the store
  if (!field.selectionSet || isNull(value)) {
    storeValue = value;
  } else if (isArray(value)) {
    // this is an array with sub-objects
    const thisIdList: Array<string> = [];

    value.forEach((item, index) => {
      if (isNull(item)) {
        thisIdList.push(null);
      } else {
        let itemDataId = (dataIdFromObject && dataIdFromObject(item))
          || `${dataId}.${storeFieldName}.${index}`;

        thisIdList.push(itemDataId);

        writeSelectionSetToStore({
          dataId: itemDataId,
          result: item,
          store,
          selectionSet: field.selectionSet,
          variables,
          dataIdFromObject,
        });
      }
    });

    storeValue = thisIdList;
  } else {
    // It's an object
    let valueDataId = (dataIdFromObject && dataIdFromObject(value))
      || `${dataId}.${storeFieldName}`;

    writeSelectionSetToStore({
      dataId: valueDataId,
      result: value,
      store,
      selectionSet: field.selectionSet,
      variables,
      dataIdFromObject,
    });

    storeValue = valueDataId;
  }

  const newStoreObj = assign(store[dataId] || {}, {
    [storeFieldName]: storeValue,
  });

  store[dataId] = newStoreObj;
}
