const gulp = require('gulp');
const addsrc = require('gulp-add-src');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const qunit = require('gulp-qunit');
const rename = require('gulp-rename');
const stripDebug = require('gulp-strip-debug');
const uglify = require('gulp-uglify');
const del = require('del');

gulp.task('clean-demo', () => {
  return del(['./demo']);
});

gulp.task('clean-lib', () => {
  return del(['./lib']);
});

gulp.task('build-lib', gulp.series('clean-lib', () => {
  return gulp.src(['./src/hmac.js'])
  .pipe(stripDebug())
  .pipe(gulp.dest('./lib/es6'))
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('./lib/es5'))
  .pipe(rename('hmac.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./lib/es5'));
}));

gulp.task('test', gulp.series('build-lib', () => {
  return gulp.src('./qunit/hmac.html')
    .pipe(qunit());
}));

gulp.task('build-demo', gulp.series('clean-demo', 'build-lib', (done) => {
  gulp.src(['./src/demo/*.html', './src/demo/*.php'])
    .pipe(gulp.dest('./demo'));
  gulp.src(['./src/demo/get.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(addsrc.prepend(['./lib/es5/hmac.js', './node_modules/crypto-js/core.js', './node_modules/crypto-js/hmac.js', './node_modules/crypto-js/sha256.js', './node_modules/crypto-js/hmac-sha256.js', './node_modules/crypto-js/enc-base64.js']))
    .pipe(uglify())
    .pipe(concat('get.app.js'))
    .pipe(gulp.dest('./demo'));
  gulp.src(['./src/demo/post.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(addsrc.prepend(['./lib/es5/hmac.js', './node_modules/crypto-js/core.js', './node_modules/crypto-js/hmac.js', './node_modules/crypto-js/sha256.js', './node_modules/crypto-js/hmac-sha256.js', './node_modules/crypto-js/enc-base64.js']))
    .pipe(uglify())
    .pipe(concat('post.app.js'))
    .pipe(gulp.dest('./demo'));
  gulp.src(['./src/demo/ajax.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(addsrc.prepend(['./lib/es5/hmac.js', './node_modules/crypto-js/core.js', './node_modules/crypto-js/hmac.js', './node_modules/crypto-js/sha256.js', './node_modules/crypto-js/hmac-sha256.js', './node_modules/crypto-js/enc-base64.js', './node_modules/jquery/dist/jquery.js']))
    .pipe(uglify())
    .pipe(concat('ajax.app.js'))
    .pipe(gulp.dest('./demo'));
    done();
}));

gulp.task('default', gulp.series('build-demo', () => {
  gulp.watch(['src/*.js', 'src/demo/*'], () => {
    gulp.run('build-demo');
  });
}));
