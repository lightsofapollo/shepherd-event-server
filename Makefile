default: test


node_modules:
	npm install

.PHONY: test
test: node_modules
	./node_modules/.bin/mocha $(shell find test -name "*_test.js")

.PHONY: watch
watch:
	./node_modules/.bin/supervisor index.js

