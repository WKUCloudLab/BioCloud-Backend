const express = require('express');
var app = express();
const router = express.Router();
const yaml = require('js-yaml');
const YAML = require('yamljs');
const fs = require('fs-extra');
const { exec } = require('child_process');
const util = require('util');

var es = require('event-stream');
var os = require('os');

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

router.get('/', isAuthenticated, function(req, res, next){
    if(!req.session.jobID) {res.send('No job selected')};
    
    var jobID = req.session.jobID;
    var userId = req.session.userId;

    // database info
    var DB_USER = process.env.DB_USER;
    var DB_PASS = process.env.DB_PASS;

    var mysql = require('mysql');
    var connection = require('../lib/dbconn');

    //jobId = 0;

    console.log(jobID);

    var sql = "SELECT name, path, filetype FROM files WHERE from_job = '"+jobID+"'";
    connection.query(sql, function (err, result) {
        if (err){
            console.log(err);
            res.send("Failed to find file: "+err);
        }

        /*
        result = [
            {
                name: 'pic.jpg',
                path: 'data/users/colin',
                filetype: 'jpg',
            },
        ];
        */

        console.log(JSON.stringify(result));

        var jobOutput;
        var fileName = result[0].name;
        var filePath = result[0].path;
        var fileType = result[0].filetype;

        console.log("Retreived Output File");
        console.log("File Name: "+ JSON.stringify(fileName));
        console.log("File Path: "+ JSON.stringify(filePath));
        console.log("File Type: "+ JSON.stringify(fileType));

        /*
            ===================== REPLACE FOR SERVER =======================
        */
        destPath = '/home/jamie/Desktop/Biocloud/webapp/public/images/';

        switch (fileType) {
            case 'html':
                console.log("File type is html, proceeding...");
                //fileType = 'html';
                fs.readFile(filePath, 'utf8', function(err, data) {
                    if (err) {
                        console.log("Error reading file: "+err);
                    }
                    console.log(data);
                    jobOutput = data;

                    renderView(res, jobOutput, fileType);
                });

                break;

            case 'png':
                console.log("File type is png, proceeding...");
                jobOutput = 'images/'+fileName;

                //read the image using fs and send the image content back in the response
                fs.readFile(filePath, function (err, content) {
                    if (err) {
                        res.writeHead(400, {'Content-type':'text/html'})
                        console.log(err);
                        jobOutput = null;                           
                    } 
                    else {
                        //specify the content type in the response will be an image
                        try{
                            destPath = destPath + fileName;
                            fs.copySync(filePath, destPath);
                            console.log("success!");
                            jobOutput = 'images/'+fileName;

                            renderView(res, jobOutput, 'img');
                        }
                        catch(err){
                            jobOutput = null;
                            console.error(err);
                        }
                    }
                });
                break;

            case 'jpg':
                console.log("File type is jpg, proceeding...");

                //read the image using fs and send the image content back in the response
                fs.readFile(filePath, function (err, content) {
                    if (err) {
                        res.writeHead(400, {'Content-type':'text/html'})
                        console.log(err);
                        jobOutput = null;
                        res.send("Failure to read path.");                           
                    } 
                    else {
                        //specify the content type in the response will be an image
                        try{
                            destPath = destPath + fileName;
                            console.log(destPath);
                            fs.copySync(filePath, destPath);
                            console.log("success!");
                            jobOutput = 'images/'+fileName;

                            renderView(res, jobOutput, 'img');
                        }
                        catch(err){
                            jobOutput = null;
                            console.error(err);
                        }
                    }
                });

            break;

            case 'txt':
                console.log("File type is txt, proceeding...");
                fs.readFile(filePath, 'utf8', function(err, data) {
                    if (err) {
                        console.log("Error reading file: "+err);
                    }
                    console.log(data)
                    jobOutput += data;

                    renderView(res, jobOutput, fileType);
                });
                
                break;

            default:
                console.log("Error, unacceptable file type");
                break;
        }
    });
});

function renderView(res, jobOutput, fileType) {
    res.render('viewpage', {
        title: 'View Job Page',
        jobOutput: jobOutput,
        fileType: fileType,
        isLoggedIn: true,
    });
}

module.exports = router;