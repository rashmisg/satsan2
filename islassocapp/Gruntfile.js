module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mocha: {
            options: {
                reporter: 'Spec'
            },
            test: {
                src: [ 'test/test.html' ]
            }
        },
        blanket_mocha: {
            options: {
                threshold: 0,
                globalThreshold: 50
            },
            test: {
                src: [ 'test/test.html' ]
            }
        },
        jshint: {
            options: {
                extract: 'auto'
            },
            all: [ 'resources/www/index.html', 'bin/**/*.js', 'www/js/**/*.js' ]
        }
    });

    grunt.registerTask('coverage_history', 'Task for keeping track of historic coverage data.', function() {
        // This task expects the cov.txt file to have been generated
        // by piping the output of grunt-blanket-mocha. Currently,
        // this is done as a part of the Coverage job in Jenkins. It
        // uses this to generate the historic coverage csv file
        // consumed by the Jenkins Plot Plugin
        var currentCoverageFile = './cov.txt',
            historicCoverageFile = './historic-coverage.csv';

        var currentCoverageData = grunt.file.read(currentCoverageFile, { encoding: 'utf8' });

        // Find the output of the Coverage of the form
        // PASS [ 50% = 50% ] : global (293 / 575)
        // PASS [100% = 50% ] : global (575 / 575)
        // Where the first percent is the actual, second is threshold
        var currentCoverageMatches = currentCoverageData.match(/\[ ?(\d+)% [>=<]/);
        var currentCoveragePercent = currentCoverageMatches[1];
        
        var outputString = 'Coverage\n' + currentCoveragePercent;

        grunt.file.write(historicCoverageFile, outputString, { encoding: 'utf8' });
    });

    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-blanket-mocha');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('test', [ 'mocha' ]);
    grunt.registerTask('coverage', [ 'blanket_mocha' ]);
};
