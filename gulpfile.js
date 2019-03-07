//gulp code based on tutorial
//from https://scotch.io/tutorials/automate-your-tasks-easily-with-gulp-js

const gulp = require('gulp');
const eslint = require('gulp-eslint');


//run gulp in command line to run, uses .eslintrc.js file in root of project 
//make sure gulp dev dependencies are installed
gulp.task('lint', () => {
    //ignore node_modules
    return gulp.src(['**/*.js','!node_modules/**,!','!public/scripts/bundle.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
 
gulp.task('default', ['lint'], function () {
    console.log("Lint successful! No errors found!");
});