var gulp = require("gulp"),
	less = require("gulp-less"),
	browserify = require("browserify"),
	browserSync = require("browser-sync").create(),
	babelify = require("babelify"),
	source = require("vinyl-source-stream");

var reload = browserSync.reload;

gulp.task("less",function(){
	gulp.src("src/less/index.less")
		.pipe(less())
		.pipe(gulp.dest("./css"))
		.pipe(reload({stream: true}));
});		

gulp.task("jsx", function() {
	browserify('src/main.js')
		.transform(babelify, {
			presets: ['es2015', 'react']
		})
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('js'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        files: "**",  
        server: {  
            baseDir: "./"  
        }  
    });
});

gulp.task('watch', ['browser-sync'], function () {
   gulp.watch("src/main.js",["jsx"]);
   gulp.watch("src/less/index.less",["less"]);
   gulp.watch("src/main.js").on('change', reload)
});

gulp.task("default", ["jsx"]);



