var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

gulp.task("hello", function () {
    console.log("hello");
});

gulp.task("table-page", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['TScript/TablePage/Main/TablePage.ts'],
        cache: {},
        packageCache: {}
    })
    .plugin(tsify)
    .bundle()
    .pipe(source('tablePage.js'))
    .pipe(gulp.dest("public/scripts/"));
});

gulp.task("test-page", function () {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['TScript/TablePage/RealtimeRequests.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('testPage.js'))
        .pipe(gulp.dest("public/scripts/"));
});