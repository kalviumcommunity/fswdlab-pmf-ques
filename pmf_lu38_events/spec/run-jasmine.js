const Jasmine = require('jasmine');
const JasmineReporters = require('jasmine-reporters');

const jasmine = new Jasmine();
jasmine.loadConfigFile('spec/support/jasmine.json');

const junitReporter = new JasmineReporters.JUnitXmlReporter({
  savePath: './test-results',
  consolidate: true,
});
jasmine.env.addReporter(junitReporter);

jasmine.exitOnCompletion = false;
jasmine.execute()
  .then(function (result) {
    console.log('Tests completed. Overall status:', result.overallStatus);
    process.exitCode = 0;
  })
  .catch(function (error) {
    console.error('An unexpected error occurred:', error);
    process.exitCode = 1;
  });
