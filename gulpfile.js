const gulp = require('gulp')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')
const inlineSource = require('gulp-inline-source')
const autoprefixer = require('gulp-html-autoprefixer')

function minify() {
  return gulp.src('web/index.html')
    .pipe(inlineSource({
      compress: true
    }))
    .pipe(autoprefixer())
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
