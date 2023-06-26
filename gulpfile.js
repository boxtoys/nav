const gulp = require('gulp')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')

function minify() {
  return gulp.src('web/index.html')
    .pipe(htmlmin({
      minifyJS: true,
      minifyCSS: true,
      removeComments: true,
      collapseWhitespace: true
    }))
    .pipe(rename('index.min.html'))
    .pipe(gulp.dest('web'))
}

module.exports = { minify }
