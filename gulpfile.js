var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

gulp.task('clean-demo', function(){
  return del(['./demo']);
});

gulp.task('clean-lib', function(){
  return del(['./lib']);
});

gulp.task('build-lib',['clean-lib'], function(){
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

gulp.task('build-demo',['clean-demo', 'build-lib'], function(){
  gulp.src('./src/demo/*.html', {base: './src/demo'})
    .pipe(gulp.dest('./demo'));
  gulp.src('./src/demo/*.php', {base: './src/demo'})
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

gulp.task('default', ['build-demo'], function() {
  gulp.watch('src/*.js', function() {
    gulp.run('build-demo');
  });
  gulp.watch('src/demo/*', function() {
    gulp.run('build-demo');
  });
});
