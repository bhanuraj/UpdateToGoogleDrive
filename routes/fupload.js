const CLIENT_ID = '527812630770-2sr7oa2mgt2rdho2p32us4m5474t6qvi.apps.googleusercontent.com';
const CLIENT_SECRET = '5NLH5gJYeCXBuNXMK55-vpSD';
const REFRESH_TOKEN = '1/5oTVzf6soH0epIlVt61ixmWDdvfomFV0HICsUr8P-lo';
const ENDPOINT_OF_GDRIVE = 'https://www.googleapis.com/drive/v2';
const PARENT_FOLDER_ID = '0B7aIJHP3Wv7aNW9QS3M4N1BiUUE';

var GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;
var express = require('express');
var router = express.Router();
var async = require('async');
var request = require('request');
var fs = require('fs');

var busboy = require('connect-busboy'); //middleware for form/file upload
var path = require('path');     //used for file path
var fsextra = require('fs-extra'); 
router.post('/', function(req, res) {

        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
		 file.on('data', function(data) {
        //console.log('File [' + fieldname + '] got ' + data + ' bytes');
            async.waterfall([
  //-----------------------------
  // Obtain a new access token
  //-----------------------------
  function(callback) {
    var tokenProvider = new GoogleTokenProvider({
      'refresh_token': REFRESH_TOKEN,
      'client_id': CLIENT_ID,
      'client_secret': CLIENT_SECRET
    });
    tokenProvider.getToken(callback);
  },

  function(accessToken, callback) {
		
      //var buffer = new Buffer(100000000);
        //  file.pipe(buffer);
        request.post({
          'url': 'https://www.googleapis.com/upload/drive/v2/files',
          'qs': {
             //request module adds "boundary" and "Content-Length" automatically.
            'uploadType': 'multipart'

          },
          'headers' : {
            'Authorization': 'Bearer ' + accessToken
          },
          'multipart':  [
            {
              'Content-Type': 'application/json; charset=UTF-8',
              'body': JSON.stringify({
                 'title': filename,
                 'parents': [
                   {
                     'id': PARENT_FOLDER_ID
                   }
                 ]
               })
            },
            {
              'Content-Type': 'image/png',
              'body': data
            }
          ]
        }, callback);
        
      
  },

  //----------------------------
  // Parse the response
  //----------------------------
  function(response, body, callback) {
    var body = JSON.parse(body);
    callback(null, body);
  },

], function(err, results) {
  if (!err) {
    console.log(results);
  } else {
    console.error('---error');
    console.error(err);
  }
});
        }); 
		});
    });
	
	module.exports = router;