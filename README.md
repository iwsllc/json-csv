# @iwsio/json-csv-node

For more information on [json-csv-node itself, checkout the readme](./package/README.md).

## Dev Setup
Here's how to setup and run the samples locally. 

```bash
# install everything for all workspaces (Recommended: Node 18)
npm i

# build the library
npm run build

# run the samples individually
npm start -w samples

# run the tests with current runtime
npm test
npm run test -w test-runner

# for older versions of node <= 14, cd to the test-runner directory
cd test-runner && npm test
```