import gql from '../src/gql';

import {
  runMutation,
} from '../src/mutationRunner';

import {
  getIdField,
} from '../src/data/extensions';

import mockNetworkInterface from './mocks/mockNetworkInterface';

import {
  assert,
} from 'chai';

describe('mutationRunner', () => {
  it('runs a mutation', () => {
    const mutation = gql`
      mutation makeListPrivate {
        makeListPrivate(id: "5")
      }
    `;

    const data = {
      makeListPrivate: true,
    };

    const networkInterface = mockNetworkInterface(
      {
        request: { query: mutation },
        result: { data },
      }
    );

    return runMutation({
      networkInterface,
      store: {},
      mutation,
    }).then(({result}) => {
      assert.deepEqual(result, data);
    });
  });

  it('runs a mutation with variables', () => {
    const mutation = gql`
      mutation makeListPrivate($listId: ID!) {
        makeListPrivate(id: $listId)
      }
    `;

    const variables = {
      listId: '1',
    };

    const data = {
      makeListPrivate: true,
    };

    const networkInterface = mockNetworkInterface(
      {
        request: { query: mutation, variables },
        result: { data },
      }
    );

    return runMutation({
      networkInterface,
      store: {},
      mutation,
      variables,
    }).then(({result}) => {
      assert.deepEqual(result, data);
    });
  });

  it('runs a mutation and puts the result in the store', () => {
    const mutation = gql`
      mutation makeListPrivate {
        makeListPrivate(id: "5") {
          id,
          isPrivate,
        }
      }
    `;

    const data = {
      makeListPrivate: {
        id: '5',
        isPrivate: true,
      },
    };

    const networkInterface = mockNetworkInterface(
      {
        request: { query: mutation },
        result: { data },
      }
    );

    const store = {};

    return runMutation({
      networkInterface,
      store,
      mutation,
      dataIdFromObject: getIdField,
    }).then(({result}) => {
      assert.deepEqual(result, data);
      assert.deepEqual(store['5'], { id: '5', isPrivate: true });
    });
  });

});
