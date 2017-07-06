var gulp = require('gulp');
var pug = require('gulp-pug');
var serve = require('gulp-serve');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');

var path = {
  src: {
    pug: 'src/index.pug',
    sass: 'src/scss/**/*.scss',
    babel: 'src/js/**/*.js',
  },
  dist(glob) {
    return glob ? `dist/${glob}` : 'dist';
  },
};

function logError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('pug', function () {
  return gulp.src(path.src.pug)
    .pipe(pug())
    .on('error', logError)
    .pipe(gulp.dest(path.dist()))
    .pipe(browserSync.stream());
});

gulp.task('sass', function () {
  return gulp.src(path.src.sass)
    .pipe(sass())
    .on('error', logError)
    .pipe(gulp.dest(path.dist('css')))
    .pipe(browserSync.stream());
});

gulp.task('babel', function () {
  return gulp.src(path.src.babel)
    .pipe(babel({
      presets: ['es2015'],
    }))
    .on('error', logError)
    .pipe(gulp.dest(path.dist('js')))
    .pipe(browserSync.stream());
});

var buildTasks = ['pug', 'sass', 'babel'];

gulp.task('build', buildTasks);

var watchTasks = buildTasks.map(function (task) {
  var watchTask = `watch:${task}`;
  gulp.task(watchTask, function () {
    gulp.watch(path.src[task], [task]);
  });
  return watchTask;
});

gulp.task('watch', watchTasks);

gulp.task('serve', ['watch'], function () {
  browserSync.init({
    server: './dist',
  });
  gulp.watch(path.dist()).on('change', browserSync.reload);
});

gulp.task('default', ['build']);
