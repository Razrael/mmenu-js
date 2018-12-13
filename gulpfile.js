/*
	Tasks:

	$ gulp 					: Runs "css" and "js" tasks
	$ gulp watch			: Starts a watch on "css" and "js" tasks


	Flags:

	--o ../path/to 	: Sets the "output" directory to the specified directory
	--c ../path/to 	: Creates a "custom build" using _build.json and _variables.custom.scss from the specified directory


	Examples:

	$ gulp --c ../mmenu-custom --o ../my-custom-build
	$ gulp watch --c ../mmenu-custom --o ../my-custom-build



	Generate a _build.json by running:
	$ php bin/build.php ../path/to
*/


var gulp 			= require( 'gulp' ),
	sass 			= require( 'gulp-sass' ),
	autoprefixer 	= require( 'gulp-autoprefixer' ),
	cleancss		= require( 'gulp-clean-css' ),
	uglify 			= require( 'gulp-uglify' ),
	concat 			= require( 'gulp-concat' ),
	umd				= require( 'gulp-umd' ),
	typescript		= require( 'gulp-typescript' ),
	merge			= require( 'merge-stream' ),
	fs 				= require( 'fs' );


var inputDir 		= 'src',
	outputDir 		= 'dist',
	customDir 		= null,
	build 			='./' + inputDir + '/_build.json';



function concatUmdJS( files, name ) {
	var stream = gulp.src( files )
		.pipe( concat( name ) );

	if ( build.umd )
	{
		stream = stream.pipe( umd({
			dependencies: () => [ {
				name 	: 'jquery',
				global 	: 'jQuery',
				param 	: 'jQuery'
			} ],
			exports: () => 'Mmenu',
			namespace: () => 'Mmenu'
		}));
	}
	return stream.pipe( gulp.dest( outputDir ) );
}


function getOption( opt ) {
	var index = process.argv.indexOf( '--' + opt );
	if ( index > -1 )
	{
		opt = process.argv[ index + 1 ];
		return ( opt && opt.slice( 0, 2 ) != '--' ) ? opt : false;
	}
	return false;
}


function start( callback ) {

	var o = getOption( 'o' ),
		c = getOption( 'c' );

	//	Set output dir 
	if ( o )
	{
		outputDir = o;
	}

	//	Set custom dir
	if ( c )
	{
		customDir = c;

		//	Try custom _build.json file
		var b = './' + c + '/_build.json';
		fs.stat( b, ( err, stat ) => {
			if ( err == null )
			{
				build = require( b );
			}
			else
			{
				build = require( build );
			}
			callback();
		});
	}
	else
	{
		build = require( build );
		callback();
	}
}




/*
	$ gulp
*/

gulp.task( 'default', function() {
	start(function() {
		gulp.start( [ 'js', 'css' ] );
	});
});

gulp.task( 'watch', function() {
	start(function() {
		gulp.watch( inputDir + '/**/*.scss'		, [ 'css' ] );
		gulp.watch( inputDir + '/**/*.ts'		, [ 'js'  ] );
	});
});




/*
	$ gulp css
*/

gulp.task( 'css', [ 'css-concat' ] );


//	1)	Concatenate variables and mixins
gulp.task( 'css-variables', () => {

	var files  	= {
		variables: [ 
			inputDir + '/core/oncanvas/_variables.scss',	//	Oncanvas needs to be first
			inputDir + '/core/**/_variables.scss',
			inputDir + '/addons/**/_variables.scss',
			inputDir + '/extensions/**/_variables.scss',
			inputDir + '/wrappers/**/_variables.scss'
		],
		mixins: [
			inputDir + '/core/**/_mixins.scss',
			inputDir + '/addons/**/_mixins.scss',
			inputDir + '/extensions/**/_mixins.scss',
			inputDir + '/wrappers/**/_mixins.scss'
		]
	};

	if ( customDir )
	{
		//	With the globstar, the file does not need to excist
		files.variables.unshift( customDir + '/**/_variables.custom.scss' );
	}
	
	var mixins = gulp.src( files.mixins )
		.pipe( concat( '_mixins.scss' ) )
		.pipe( gulp.dest( inputDir ) );

	var variables = gulp.src( files.variables )
		.pipe( concat( '_variables.scss' ) )
		.pipe( gulp.dest( inputDir ) );

	return merge.apply( this, [ variables, mixins ] );
});

//	2) 	Compile CSS
gulp.task( 'css-compile', [ 'css-variables' ], () => {

	var files = [	//	Without the globstar, all files would be put directly in the outputDir
		inputDir + '/**/core/@(' 		+ build.files.core.join( '|' ) 			+ ')/*.scss',
		inputDir + '/**/addons/@(' 		+ build.files.addons.join( '|' ) 		+ ')/*.scss',
		inputDir + '/**/extensions/@(' 	+ build.files.extensions.join( '|' ) 	+ ')/*.scss',
		inputDir + '/**/wrappers/@(' 	+ build.files.wrappers.join( '|' ) 		+ ')/*.scss'
	];

	return gulp.src( files )
		.pipe( sass().on( 'error', sass.logError ) )
		.pipe( autoprefixer( [ '> 5%', 'last 5 versions' ] ) )
		.pipe( cleancss() )
		.pipe( gulp.dest( outputDir ) );
});

//	3) 	Concatenate CSS
gulp.task( 'css-concat', [ 'css-compile' ], () => {

	//	Core
	var files = [
		outputDir + '/core/oncanvas/*.css',	//	Oncanvas needs to be first
		outputDir + '/core/**/*.css',
	];

	var core = gulp.src( files )
		.pipe( concat( 'jquery.mmenu.css' ) )
		.pipe( gulp.dest( outputDir ) );

	//	Add addons, extensions and wrappers
	files.push( outputDir + '/addons/**/*.css' );
	files.push( outputDir + '/extensions/**/*.css' );
	files.push( outputDir + '/wrappers/**/*.css' );

	var all = gulp.src( files )
		.pipe( concat( build.name + '.css' ) )
		.pipe( gulp.dest( outputDir ) );

	return merge.apply( this, [ core, all ] );
});





/*
	$ gulp js
*/

gulp.task( 'js', [ 'js-concat' ] );

//	1) 	Compile core + add-ons
gulp.task( 'js-compile', () => {

	var files = [	//	Without the globstar, all files would be put directly in the outputDir
		inputDir + '/**/core/@(' 		+ build.files.core.join( '|' ) 		+ ')/*.ts',
		inputDir + '/**/addons/@(' 		+ build.files.addons.join( '|' ) 	+ ')/*.ts',
		inputDir + '/**/wrappers/@(' 	+ build.files.wrappers.join( '|' ) 	+ ')/*.ts'
	];

	return gulp.src( files )
  		.pipe( typescript({
			"target": "es5"
  		}) )
		.pipe( uglify({ 
			output: {
				comments: "/^!/"
			}
		}) )
		.on('error', ( err ) => { console.log( err ) } )
		.pipe( gulp.dest( outputDir ) );
});

//	2)	Compile translations
gulp.task( 'js-translations', [ 'js-compile' ], () => {

	var streams = [];

	if ( build.files.translations.length < 1 )
	{
		return gulp.src([]);
	}

	for ( var t = 0; t < build.files.translations.length; t++ )
	{
		var lang = build.files.translations[ t ];
		var files = [
			outputDir + '/core/@(' 		+ build.files.core.join( '|' ) 		+ ')/translations/' + lang + '.js',
			outputDir + '/addons/@(' 	+ build.files.addons.join( '|' ) 	+ ')/translations/' + lang + '.js'
		];

		var stream = gulp.src( files )
			.pipe( concat( 'jquery.mmenu.' + lang + '.js' ) )
			.pipe( gulp.dest( outputDir + '/translations' ) );

		streams.push( stream );
	}

	return merge.apply( this, streams ); 
});

//	3) 	Concatenate JS
gulp.task( 'js-concat', [ 'js-translations' ], () => {

	//	Core
	var files = [
		outputDir + '/core/oncanvas/*.js',	//	Oncanvas needs to be first
		outputDir + '/core/**/*.js'
	];
	var core = concatUmdJS( files, 'jquery.mmenu.js' );

	//	Add addons, wrappers and translations
	files.push( outputDir + '/addons/**/[!_]*.js' );	//	Files that are NOT prefixed with an underscore need to be added first.
	files.push( outputDir + '/addons/**/[_]*.js' );		//	Files that ARE prefixed with an underscore can be added later.
	files.push( outputDir + '/wrappers/**/*.js' );
	files.push( outputDir + '/translations/**/*.js' );

	var all = concatUmdJS( files, build.name + '.js' );

	return merge.apply( this, [ core, all ] );
});
