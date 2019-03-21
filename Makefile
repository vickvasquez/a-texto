
BIN_DIRECTORY = ./node_modules/.bin/

test-api: # Run tests
	NODE_ENV=test $(BIN_DIRECTORY)mocha -r esm api/test
start-server: #Init api server
	NODE_ENV=development $(BIN_DIRECTORY)nodemon --ignore frontend/ -r esm api/server
start-front: #Init api server
	NODE_ENV=development $(BIN_DIRECTORY)webpack-dev-server --watch --mode development --config frontend/webpack/webpack.dev.js --hot --progress --open
build:
	@docker-compose build
test-api-ci: #Run tests ci
	docker-compose up \
    --abort-on-container-exit \
    --exit-code-from api
test-down: #Run tests ci
	docker-compose down