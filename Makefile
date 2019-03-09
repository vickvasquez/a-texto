
BIN_DIRECTORY = ./node_modules/.bin/

test-api: # Run tests
	$(BIN_DIRECTORY)mocha -r esm api/test
server-dev: #Init api server
	$(BIN_DIRECTORY)nodemon -r esm api/server