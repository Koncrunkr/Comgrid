var gulp = require("gulp");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");

gulp.task("hello", function () {
    console.log("hello");
});

gulp.task("table-page", function () {
    let gulp2 = browserify({
        basedir: '.',
        debug: false,
        entries: ['TScript/tablepage/main/TablePage.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('tablePage.js'))
        .pipe(gulp.dest("public/scripts/"));
    let gulp1 = browserify({
        basedir: '.',
        debug: false,
        entries: ['TScript/index.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('indexPage.js'))
        .pipe(gulp.dest("public/scripts/"));
    let gulp0 = browserify({
        basedir: '.',
        debug: false,
        entries: ['TScript/headerScript.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('header.js'))
        .pipe(gulp.dest("public/scripts/"));
    let gulp3 = browserify({
        basedir: '.',
        debug: true,
        entries: ['TScript/invite.ts'],
        cache: {},
        packageCache: {}
    })
        .plugin(tsify)
        .bundle()
        .pipe(source('invite.js'))
        .pipe(gulp.dest("public/scripts/"));
    return Promise.all([gulp0, gulp1, gulp2, gulp3]);
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