var gulp = require('gulp');
var browserSync = require('browser-sync');

var reload      = browserSync.reload;

var paths = {
  html:['index.html'],
  css:['css/style.css'],
  script:['js/index.js']
};


gulp.watch(paths.css, function(){
  console.log('seen css changes');
});
gulp.watch(paths.script, function(){
  console.log('seen javascript changes');
});

gulp.task('html', function(){
  gulp.src(paths.html)
  .pipe(reload({stream:true}));
});

gulp.task('watcher',function(){
    gulp.watch(paths.css , ['html'] );
    gulp.watch(paths.script , ['html'] );
});


gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: "./"
    },
    port: 8080,
    open: true,
    notify: false
  });
});

gulp.watch(paths.html, ['html']);

gulp.task('default', ['watcher', 'browserSync']);
