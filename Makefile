default: test


node_modules: package.json
	npm install

.PHONY: test
test: node_modules
	./node_modules/.bin/mocha \
	 	$(shell find . -path ./node_modules -prune -o -name '*_test.js' -type f)

.PHONY: test-min
test-min: node_modules
	./node_modules/.bin/mocha \
		bin/db_init_test.js \
		test/index_test.js \
		store/project_test.js

.PHONY: watch
watch:
	./node_modules/.bin/supervisor index.js

