var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');

gulp.task('clean-lib', function(){
  return del(['lib']);
});

gulp.task('es5',['clean-lib'], function(){
    return gulp.src(['src/*.js','example/*.js'])
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('lib'));
});

gulp.task('default', ['es5'], function() {
  gulp.watch('src/*.js', function() {
    gulp.run('es5');
  });
  gulp.watch('example/*.js', function() {
    gulp.run('es5');
  });
});
