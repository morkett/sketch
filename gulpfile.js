var gulp = require('gulp');

var sass = require('gulp-sass');

var autoprefixer = require('gulp-autoprefixer');

var babel = require('gulp-babel');

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({browsers: ['last 3 versions']}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('babel', () => {
  return gulp.src('app/js/**/*.js')
        .pipe(babel({
          presets: ['es2015']
        }))
        .pipe(gulp.dest('dist'));
});

var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  });
});

gulp.task('watch', ['browserSync','sass'], function (){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  // reload browser when HTML or JS files changed
  gulp.watch('app/**/*html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

var useref = require('gulp-useref');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');

gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(useref())

    .pipe(gulpIf('*.js', babel({ presets: ['es2015']})))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
});

var imagemin = require('gulp-imagemin');

var cache = require('gulp-cache');

gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced: true
  })))
  .pipe(gulp.dest('dist/images'));
});

var del = require('del');

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('cache:clear', function (callback) {
  return cache.clearAll(callback);
});

gulp.task('default', function (callback) {
  runSequence(['sass', 'browserSync','watch'],
    callback
  );
});


var runSequence = require('run-sequence');

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images'],
    callback
  );
});
