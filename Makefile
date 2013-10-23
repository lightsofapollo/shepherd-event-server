default: test


node_modules: package.json
	npm install

.PHONY: test-full
test-full: test
	./node_modules/.bin/mocha test/routes/track_test.js

.PHONY: test
test: node_modules
	./node_modules/.bin/mocha \
		test/bin/db_init_test.js \
		test/index_test.js \
		test/lib/store/project_test.js \
		test/support/bz_test.js \
		test/support/pull_request_test.js

.PHONY: watch
watch:
	./node_modules/.bin/supervisor index.js

