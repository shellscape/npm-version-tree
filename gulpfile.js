'use strict';

const eslint = require('gulp-eslint');
const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('lint', () => {
  const glob = [
    '**/*.js',
    '!dist/**/*.js',
    '!node_modules'
  ];

  return gulp.src(glob)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', ['lint'], () => {
  require('babel-core/register')();

  return gulp.src('test.js', { read: false })
    .pipe(mocha());
});

gulp.task('clean', ['test'], () => {
  let del = require('del');

  return del(['dist/']);
});

gulp.task('build', ['clean'], () => {
  let babel = require('gulp-babel');

  return gulp.src('index.js')
    .pipe(babel())
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', ['lint']);
