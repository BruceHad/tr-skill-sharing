var del = require('del');
var gulp = require('gulp');
var rename = require('gulp-rename');
var run = require('run-sequence');
var path = require('path');
// var fs = require('fs');
var sass = require('gulp-sass');
var webpack = require('webpack-stream');

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

gulp.task('js', function() {
    // Run js through babel and export to dist
    return gulp.src('src/javascripts/script.js')
        .pipe(webpack())
        .pipe(rename('script.js'))
        .pipe(gulp.dest('./public/javascripts/'));
});

gulp.task('build', ['clean'], function(){
    run('css', 'js')
});

gulp.task('default', ['clean', 'build'], function() {
    gulp.watch('./src/stylesheets/*.scss', ['css']);
    gulp.watch('./src/javascripts/*.js', ['js']);
});
