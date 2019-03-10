
BIN_DIRECTORY = ./node_modules/.bin/

test-api: # Run tests
	NODE_ENV=test $(BIN_DIRECTORY)mocha -r esm api/test
server-dev: #Init api server
	NODE_ENV=development $(BIN_DIRECTORY)nodemon -r esm api/server