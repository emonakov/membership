module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            files: ['lib/**/*.js', 'modules/**/*.js']
        },
        watch: {
            files: ['lib/**/*.js', 'modules/**/*.js'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
};