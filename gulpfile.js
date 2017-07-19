var gulp = require('gulp');

var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
});

gulp.task('watch', ['browserSync'], function (){
  // gulp.watch('app/scss/**/*.scss', ['sass']);
  // reload browser when HTML or JS files changed
  gulp.watch('app/**/*html', browserSync.reload);
  gulp.watch('app/**/*css', browserSync.reload);
  gulp.watch('app/**/*.js', browserSync.reload);
});

// sass + watch + sync with 'gulp' command only
gulp.task('default', function (callback) {
  runSequence(['browserSync', 'watch'],
    callback
  );
});

var runSequence = require('run-sequence');
