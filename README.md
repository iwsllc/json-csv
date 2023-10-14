# @iwsio/json-csv-node & @iwsio/json-csv-core

 - [@iwsio/json-csv-node README](./packages/json-csv-node/README.md). [![Push to main - @iwsio/json-csv-node](https://github.com/iwsllc/json-csv/actions/workflows/push-node.yml/badge.svg)](https://github.com/iwsllc/json-csv/actions/workflows/push-node.yml)
 - [@iwsio/json-csv-core  README](./packages/json-csv-core/README.md). [![Push to main - @iwsio/json-csv-core](https://github.com/iwsllc/json-csv/actions/workflows/push-core.yml/badge.svg)](https://github.com/iwsllc/json-csv/actions/workflows/push-core.yml)
 - [@json-csv (LEGACY) README](https://github.com/iwsllc/json-csv/tree/json-csv#json-csv) [![Push to json-csv (legacy)](https://github.com/iwsllc/json-csv/actions/workflows/push-json-csv.yml/badge.svg)](https://github.com/iwsllc/json-csv/actions/workflows/push-json-csv.yml)
   
## Dev Setup

```bash
# install everything for all workspaces (Recommended: Node 20)
npm i

# build the packages
npm run build

# run the samples
npm start -w samples

# run the tests with current runtime
npm test

# for older versions of node <= 12, cd to the test-runner directory
cd test-runner && npm test
```
