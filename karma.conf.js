// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox'],
            },
        },
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-mocha-reporter'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma'),
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser,
        },
        coverageReporter: {
            reporters: [
              {
                type: 'html',
                subdir: 'src',
              },
              {
                type: 'clover',
                subdir: '.',
                file: 'clover.xml',
              },
            ]
        },
        reporters: ['progress', 'kjhtml', 'mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: false,
        mochaReporter: {
            output: 'minimal'
        },
    });
};
