var del = require('del');
var gulp = require('gulp');
// var rename = require('gulp-rename');
var run = require('run-sequence');
var path = require('path');
// var fs = require('fs');
var sass = require('gulp-sass');

gulp.task('clean', function() {
    del(['./public/stylesheets/*', './public/javascripts/*']);
});

gulp.task('css', function() {
    let bootstrapPath = path.join(__dirname,
        'node_modules/bootstrap-sass/assets/stylesheets/');
    gulp.src('./src/stylesheets/*.scss')
        .pipe(sass({
            includePaths: [bootstrapPath]
        }).on('error', sass.logError))
        .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('default', ['clean'], function() {
    run('css');
    gulp.watch('./src/stylesheets/*.scss', ['css']);
});
