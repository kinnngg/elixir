var fs = require('fs');
var gutil = require('gulp-util');
var parsePath = require('parse-filepath');

/**
 * Build up the given src file(s), to be passed to Gulp.
 *
 * @param {string|array} src
 * @param {string}       baseDir
 * @param {string}       search
 */
var buildGulpSrc = function(src, baseDir, search) {
    if (src) {
        return prefixDirToFiles(baseDir, src);
    }

    return [baseDir + '/' + search];
};


/**
 * Prefix a directory path to an array of files.
 *
 * @param {string}       dir
 * @param {string|array} files
 */
var prefixDirToFiles = function(dir, files) {
    if ( ! Array.isArray(files)) files = [files];

    return files.map(function(file) {
        file = file.replace(dir, '');

        return [dir, file].join('/').replace('//', '/');
    });
};


/**
 * Log an action to the console for user feedback.
 *
 * @param {string} message
 * @param {mixed}  files
 */
var logTask = function(message, files) {
    var isFileList = Array.isArray(files);

    files = isFileList ? files : [files];

    gutil.log(gutil.colors.white(message + ':', files.join(', ')));

    if (isFileList) {
        assertFilesExist(files);
    }
};


/**
 * Log a missing file event to the console.
 *
 * @param {string} file
 */
var logMissingFile = function(file) {
    return gutil.log(gutil.colors.bgRed('File not found: ' + file));
};


/**
 * Assert that all files in an array exist.
 *
 * @param {array} files
 */
var assertFilesExist = function(files) {
    files.forEach(function(file) {
        // We're not interested in working with
        // paths that are regular expressions.
        if(/\*/.test(file)) return;

        fs.exists(file, function(found) {
            if ( ! found) {
                logMissingFile(file);
            }
        });
    });
};


/**
 * Parse a given file or directory into segments.
 *
 * @param {string} path
 */
var parse = function(path) {
    var segments = parsePath(path);

    return {
        name: segments.extname ? segments.basename : '',
        extension: segments.extname,
        baseDir: segments.extname ? segments.dirname : [segments.dirname, segments.basename].join('/')
    };
};


module.exports = {
    buildGulpSrc: buildGulpSrc,
    prefixDirToFiles: prefixDirToFiles,
    logTask: logTask,
    parse: parse
};
