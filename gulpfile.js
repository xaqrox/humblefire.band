var gulp = require('gulp');
var pug = require('gulp-pug');
var serve = require('gulp-serve');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var browserSync = require('browser-sync');
var typogr = require('typogr');

var path = {
  src: {
    pug: 'src/index.pug',
    sass: 'src/scss/**/*.scss',
    babel: 'src/js/**/*.js',
    img: 'src/img/**/*.*',
  },
  watch: {
    pug: '{src/index.pug,src/inc/*}',
    sass: 'src/scss/**/*.scss',
    babel: 'src/js/**/*.js',
    img: 'src/img/**/*.*',
  },
  dist(glob) {
    return glob ? `docs/${glob}` : 'docs';
  },
};

function logError(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('pug', function () {
  return gulp.src(path.src.pug)
    .pipe(pug({
      filters: {
        typogr: typogr.typogrify,
      },
    }))
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

gulp.task('img', function () {
  return gulp.src(path.src.img)
    .pipe(gulp.dest(path.dist('img')));
});

var buildTasks = ['pug', 'sass', 'babel', 'img'];

gulp.task('build', buildTasks);

var watchTasks = buildTasks.map(function (task) {
  var watchTask = `watch:${task}`;
  gulp.task(watchTask, function () {
    gulp.watch(path.watch[task], [task]);
  });
  return watchTask;
});

gulp.task('watch', watchTasks);

gulp.task('serve', ['build', 'watch'], function () {
  const dist = path.dist();
  browserSync.init({
    server: dist,
  });
  gulp.watch(dist).on('change', browserSync.reload);
});

gulp.task('default', ['build']);
