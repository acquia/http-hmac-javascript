const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const del = require('del');

gulp.task('clean-demo', () => {
  del(['./demo']);
});

gulp.task('clean-lib', () => {
  del(['./lib']);
});

gulp.task('build-lib',['clean-lib'], () => {
  gulp.src(['./src/hmac.js'])
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
  gulp.src('./src/demo/*.html')
    .pipe(gulp.dest('./demo'));
  gulp.src('./src/demo/*.php')
    .pipe(gulp.dest('./demo'));
  gulp.src(['./src/hmac.js', './src/demo/get.js'])
    .pipe(concat('get.app.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./demo'));
  gulp.src(['./src/hmac.js', './src/demo/post.js'])
    .pipe(concat('post.app.js'))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./demo'));
});

gulp.task('default', ['build-demo'], () => {
  gulp.watch('src/*.js', () => {
    gulp.run('build-demo');
  });
  gulp.watch('src/demo/*', () => {
    gulp.run('build-demo');
  });
});
