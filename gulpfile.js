const {src, dest, series, watch,} = require('gulp')
const sass = require('gulp-sass')
//const plumber = require('gulp-plumber')
//
const sourcemaps = require('gulp-sourcemaps')
const include = require('gulp-file-include')
const del = require('del')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify');
//const minify = require('gulp-minify-css');
const cleanCSS = require('gulp-clean-css')
const rename = require('gulp-rename')
const csso = require('gulp-csso')

const htmlmin = require('gulp-htmlmin')
const image = require('gulp-image')
const imagemin = require('imagemin')
const imageminJpegRecompress = ('imagemin-jpeg-recompress')
const imageminPngquant = require('imagemin-pngquant')
const imageminJpegtran = require('imagemin-jpegtran')
const autoprefixer = require('autoprefixer')
const postcss = require('gulp-postcss')
const browserSync = require('browser-sync').create()

    


function html() {
    return src('src/**.html')
        .pipe(include({
            prefix: '@@'
        }))
        
        .pipe(dest('dist'))
}

function scss() {
    return src('src/scss/**.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(csso())
        .pipe(concat('index.css'))
        .pipe(postcss([ autoprefixer(
            { grid: 'autoplace' }
        ) ]))
        .pipe(sourcemaps.write('.'))
        .pipe(cleanCSS())
        .pipe(rename('index.min.css')) 
        .pipe(dest('dist')) 
}
function images() {
    return src('src/img/**/*.{png,jpg,svg}')
        .pipe(image())
        .pipe(dest('dist/img'))
  
}
function scripts() {
    return src('src/js/**.js')
       
        .pipe(dest('dist/js'))
 
}
 function css() {
  return src('src/scss/**.css')
         .pipe(dest('dist'))
 
 }


 function clear() {
     return del('dist')
 }
 
 function serve() {
    browserSync.init({
        server: './dist'
    })

    watch('src/scss/**/*.scss', series(scss)).on('change', browserSync.reload)
    
    watch('src/**/*.html', series(html)).on('change', browserSync.reload)
    
    watch('src/js/**.js', series(scripts)).on('change', browserSync.reload)
   
    watch('src/scss/**.css', series(css)).on('change', browserSync.reload)
    watch('src/img/**/*.{png,jpg,svg}', series(images)).on('change', browserSync.reload)
    // watch('img/**/*.{svg}', series('svg')).on('change', browserSync.reload)
}

 

  

exports.images = images
exports.build = series(clear, scss, html)
exports.serve = series(scss, html, images, css, scripts, serve)
exports.clear = clear

