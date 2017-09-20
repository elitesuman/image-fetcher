var fs = require('fs');
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');
var url = require('url');
var async = require('async');
var download = require('image-downloader');
var type = ['jpeg', 'jpg', 'png', 'gif', 'jpe', 'jps', 'jpc', 'pdp', 'tiff', 'pwc'];
var Spinner = require('cli-spinner').Spinner;
var spinner = new Spinner('processing..please be patient.it might take some time..Images is being parsed %s');


 function fetchImages(uri, dest, extension, callback){
    request(uri, function (error, response, body) {
        if(error){
            console.log('error:', error);
            var error = "url or website URL is not correct";
            var status = null;
            callback(error, status) // Print the error if one occurred 
        }
  else{
  var $ = cheerio.load(body);
  var images = $('img');
  var links = $('a');
  var alreadyVisitedListOfLinks = [];
    async.waterfall([
    function(done){
    var listOfLinks = [];
    for(var i=0; i<links.length; i++){
    var ele = $(links[i]).attr('href');
    if(listOfLinks.indexOf(ele) == -1){
        if(ele.length > uri.length){
        var e = ele.slice(0, uri.length);
        var insert = ele.slice(uri.length);
        if(e == uri){
            listOfLinks.push(insert);
        }
        else{
        var start = ele.slice(0, 4);
            if(start == uri.slice(0, 4)){
            }
            else{
        listOfLinks.push(ele);
                    }
                }
    }
        else{
            var start = ele.slice(0, 4);
            if(start == uri.slice(0, 4)){
            }
            else{
        listOfLinks.push(ele);
                    }
                }
        }
    }
    done(null, listOfLinks);
    },
    function(listOfLinks, done){

        spinner.setSpinnerString('|/-\\');
        spinner.start();
        var listOfNewLinks =[];
        listOfNewLinks = listOfLinks;
        var inc = listOfNewLinks.length;
        var process = function(x){
            if(x < inc){
            request(url.resolve(uri, listOfNewLinks[x]) , function (error, response, Newbody) {
                if(Newbody){
                var $ = cheerio.load(Newbody);
                var link = $('a');
                for(var k=0; k<link.length; k++){
                    var elem = $(link[k]).attr('href');
                    if(elem){
                        if(listOfNewLinks.indexOf(elem) == -1){

                            if(elem.length > uri.length){
                            var e = elem.slice(0, uri.length);
                            var insert = elem.slice(uri.length);
                            if(e == uri){
                            listOfNewLinks.push(insert);
                                }
                            else{
                            var start = elem.slice(0, 4);
                            if(start == elem.slice(0, 4)){
                                }
                            else{
                            listOfNewLinks.push(elem);
                        }
                    }
                }
            }
            }
        }
    }
            process(x + 1);
            });
        }
        else{
            done(null, listOfNewLinks);
        }
        }
        
            process(0);
        
    },
    function(listOfNewLinks, done){
        spinner.stop();
        var pro = function(x){
            if(x < listOfNewLinks.length){
                console.log(listOfNewLinks.length);
                console.log(x);
                console.log(listOfNewLinks[x]);
                console.log(url.resolve(uri, listOfNewLinks[x]));
            request(url.resolve(uri, listOfNewLinks[x]) , function (error, response, Newestbody) {
                console.log("gone");
            if(Newestbody){
            var $ = cheerio.load(Newestbody);
            var images = $('img');
            var inc = 0;
            async.waterfall([
                function(done){
                    if(images.length > 0){
            for(var l=0; l<images.length; l++){
                console.log($(images[l]).attr('src'));
                if($(images[l]).attr('src') && $(images[l]).attr('src') != ''){
            var s = ($(images[l]).attr('src')).toString();
            var ext = s.substr(s.lastIndexOf('.') + 1).toLowerCase();
             var e = extension.toLowerCase();
                if(e == ext || e == 'all'){
            if(type.indexOf(ext) != -1){
                if(s.slice(0, uri.length) == uri){
            download.image({url: s, dest: path.join(dest)})
            .then(({ filename, image }) => {
            console.log('File saved to', filename);
            inc++;
            pass(inc);
            }).catch((err) => {
            var error = "your destination is not correct..please enter valid location to save the files..";
            var status = null;
            callback(error, status);
            inc++;
            pass(inc);
            });
        }
        else{
             download.image({url: url.resolve(uri, s), dest: path.join(dest)})
            .then(({ filename, image }) => {
            console.log('File saved to', filename);
            inc++;
            pass(inc);
            }).catch((err) => {
            var error = "your destination is not correct..please enter valid location to save the files..";
            var status = null;
            callback(error, status);
            inc++;
            pass(inc);
            });
                }
            }
            else{
                inc++;
                pass(inc);
            }
        }
    }
    else{
        inc++;
        pass(inc);
    }
}
}
else{
    done(null);
}

function pass(inc){
    console.log("called");
    console.log(inc);
    console.log(images.length);
        if(inc == images.length){
        console.log("gone");
        done(null);
    }
}
},
function(done){
            pro(x + 1);
        }
            ]);

        }
        else{
            pro(x + 1);
        }
            });
        }
        else{
            var error = null;
            var status = "successfully saved image";
            callback(error, status);
        }
    }

        pro(0);
    }
]);
}
});
}

exports.fetchImages = fetchImages;