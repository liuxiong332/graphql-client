import {
  runQuery,
} from '../src/queryRunner';

import gql from '../src/gql';

import mockNetworkInterface from './mocks/mockNetworkInterface';

import {
  GraphqlError,
} from '../src/graphqlError';

import {
  assert,
} from 'chai';

describe('queryRunner', () => {
  it('properly roundtrips through a Redux store', () => {
    const query = gql`
      query people {
        allPeople(first: 1) {
          people {
            name
          }
        }
      }
    `;

    const data = {
      allPeople: {
        people: [
          {
            name: 'Luke Skywalker',
          },
        ],
      },
    };

    const networkInterface = mockNetworkInterface({
      request: { query },
      result: { data },
    });

    return runQuery({
      query,
      networkInterface,
      store: {},
    }).then(({result}) => {
      assert.deepEqual(result, data);
    });
  });

  it('runs multiple root queries', () => {
    const query = gql`
      query people {
        allPeople(first: 1) {
          people {
            name
          }
        }
        person(id: "1") {
          name
        }
      }
    `;

    const data = {
      allPeople: {
        people: [
          {
            name: 'Luke Skywalker',
          },
        ],
      },
      person: {
        name: 'Luke Skywalker',
      },
    };

    const networkInterface = mockNetworkInterface({
      request: { query },
      result: { data },
    });

    return runQuery({
      query,
      networkInterface,
      store: {},
    }).then(({ result }) => {
      assert.deepEqual(result, data);
    });
  });

  it('properly roundtrips with variables', () => {
    const query = gql`
      query people($firstArg: Int) {
        allPeople(first: $firstArg) {
          people {
            name
          }
        }
      }
    `;

    const variables = {
      firstArg: 1,
    };

    const data = {
      allPeople: {
        people: [
          {
            name: 'Luke Skywalker',
          },
        ],
      },
    };

    const networkInterface = mockNetworkInterface({
      request: { query, variables },
      result: { data },
    });

    return runQuery({
      networkInterface,
      store: {},
      query,
      variables,
    }).then(({ result }) => {
      assert.deepEqual(result, data);
    });
  });

  it('handles GraphQL errors', () => {
    const query = gql`
      query people {
        allPeople(first: 1) {
          people {
            name
          }
        }
      }
    `;

    const networkInterface = mockNetworkInterface(
      {
        request: { query },
        result: {
          errors: [
            {
              name: 'Name',
              message: 'This is an error message.',
            },
          ],
        },
      }
    );

    runQuery({
      networkInterface,
      store: {},
      query,
    }).catch((err: GraphqlError) => {
      assert.equal(err.errors[0].message, 'This is an error message.');
    });
  });
});
