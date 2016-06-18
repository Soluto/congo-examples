var gulp = require('gulp');
var rimraf = require('rimraf');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var merge2 = require('merge2');

gulp.task('default', ["clean", "build-js"]);

gulp.task('clean', function(cb) {
    rimraf('./build', cb);
})

gulp.task('build-js', function(cb) {
    var stream = merge2();
    stream.add(gulp.src('./main.js')
                .pipe(browserify({insertGlobals : true, debug : !gulp.env.production }))
                .pipe(rename('bundle.js'))
                .pipe(gulp.dest('../app/src/main/assets/webview/build/')));
  stream.add(gulp.src('./main.html').pipe(gulp.dest('../app/src/main/assets/webview/')))

});
