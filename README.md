# @iwsio/json-csv-node
# @iwsio/json-csv-core

Checkout the readme for [more information on json-csv-node](./packages/json-csv-node/README.md).
Checkout the readme for [more information on json-csv-core](./packages/json-csv-core/README.md).

## Dev Setup

```bash
# install everything for all workspaces (Recommended: Node 20)
npm i

# build the packages
npm run build

# run the samples individually
npm start -w samples

# run the tests with current runtime
npm test
npm run test -w test-runner

# for older versions of node <= 14, cd to the test-runner directory
cd test-runner && npm test
```