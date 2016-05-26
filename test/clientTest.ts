import GraphqlClient, {
  gql,
} from '../src/index';

import mockNetworkInterface from './mocks/mockNetworkInterface';

import {
  assert,
} from 'chai';

describe('GraphqlClient', () => {
  it('properly query', () => {
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

    let client = new GraphqlClient({
      networkInterface,
      store: {},
    });
    return client.query({
      query,
    }).then(({result}) => {
      assert.deepEqual(result, data);
    });
  });

  it('properly mutate', () => {
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

    let client = new GraphqlClient({
      networkInterface,
      store: {},
    });

    return client.mutate({
      mutation,
    }).then(({result}) => {
      assert.deepEqual(result, data);
    });
  });
});
