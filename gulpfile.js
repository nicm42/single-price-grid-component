// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const tailwindcss = require("tailwindcss");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

// File paths
const files = { 
    htmlPath: './*.html',
    scssPath: './src/**/*.scss',
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass().on('error', sass.logError)) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer({ grid: 'autoplace' }), cssnano(), tailwindcss() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('./') // put final CSS in dist folder
    );
}

function watchTask() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    watch([files.scssPath],
        series(
            parallel(scssTask),
        )
    ).on('change', browserSync.reload);    
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    parallel(scssTask), 
    watchTask
);

//So we can just run these, if we want to
exports.scssTask = scssTask;
exports.watch = watchTask;