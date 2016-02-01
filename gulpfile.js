const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');

gulp.task('clean-demo', () => {
  return del(['./demo']);
});

gulp.task('clean-lib', () => {
  return del(['./lib']);
});

gulp.task('build-lib',['clean-lib'], () => {
  return gulp.src(['./src/hmac.js'])
    .pipe(concat('hmac.js'))
    .pipe(gulp.dest('./lib/es6'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./lib/es5'))
    .pipe(rename('hmac.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./lib/es5'));
});

gulp.task('build-demo',['clean-demo', 'build-lib'], () => {
  gulp.src(['./src/demo/*.html', './src/demo/*.php'])
    .pipe(gulp.dest('./demo'));
  gulp.src(['./lib/es6/hmac.js', './src/demo/get.js'])
    .pipe(concat('get.app.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./demo'));
  gulp.src(['./lib/es6/hmac.js', './src/demo/post.js'])
    .pipe(concat('post.app.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./demo'));
});

gulp.task('default', ['build-demo'], () => {
  gulp.watch(['src/*.js', 'src/demo/*'], () => {
    gulp.run('build-demo');
  });
});
