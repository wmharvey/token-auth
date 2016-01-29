var gulp = require('gulp');
var jshint = require('gulp-jshint');
require('jshint-stylish');
var mocha = require('gulp-mocha');

gulp.task('run-tests', ['lint'], function() {
  gulp.src(['test/*.js'], { read: false })
    .pipe(mocha());
});

gulp.task('watch-files', function() {
  gulp.watch(['./*.js', '**/*.*', '!node_modules'], ['run-tests']);
});

gulp.task('lint', function() {
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['run-tests']);
gulp.task('test', ['run-tests', 'watch-files']);
