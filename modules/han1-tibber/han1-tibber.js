const {
  GraphQLClient
} = require('graphql-request')

function han1Tibber() {

}
han1Tibber.endpoint = 'https://api.tibber.com/v1-beta/gql';
han1Tibber.subEndPoint = 'wss://api.tibber.com/v1-beta/gql/subscriptions';
han1Tibber.apiKey = process.cfg.addons.han1Tibber.apiKey;
han1Tibber.options = {
  headers: {
    "Authorization": `Bearer ${han1Tibber.apiKey}`
  }
}

han1Tibber.graphQL = new GraphQLClient(han1Tibber.endpoint, han1Tibber.options)

han1Tibber.getPrice = function () {
  let query = `
      {
        viewer {
          homes {
            currentSubscription {
              priceInfo {
                current {
                  total
                  energy
                  tax
                  startsAt
                }
                today {
                  total
                  energy
                  tax
                  startsAt
                }
                tomorrow {
                  total
                  energy
                  tax
                  startsAt
                }
              }
            }
          }
        }
      }
`;

  return new Promise((res, rej) => {
    this.graphQL.request(query).then(data => res(data.viewer.homes[0].currentSubscription.priceInfo)).catch(e => rej(e));
  });
}

han1Tibber.getHome = function () {
  const query = ``;
  return new Promise((res, rej) => {
    this.graphQL.request(query).then(data => res(data)).catch(e => rej(e));
  });
}

module.exports = han1Tibber;
