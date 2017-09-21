# image-fetcher

This is a nodejs API/module for fetching all the images from a wesite. It will go through all the links present in the entire
website and will fetch the images.

## Installation

```js
npm install image-fetcher --save
var fetcher = require('image-fetcher');
```

## Usage

```js
//list of parameters

//url: url of the website from where you want to fetch the images. like("https://www.yoururl.com/").

//destination: location of your computer..where you want to save the images. like("E:/images/newfolder").

//type: type of images you want to fetch. like ('jpeg', 'jpg', 'png', 'gif', 'jpe', 'jps', 'jpc', 'pdp', 'tiff', 'pwc')
//and for all types enter "all"

//last one is callback function which takes two parameters..if your url or destination is incorrect you will get an error.
//and you will get the list of file name that are being saving if you entered correct url and destination.

fetcher.fetchImages(url, destination, type, function(error, data){ 
	if(error){
		//you will get error message here if url or destination is incorrect
	}
	else{
		//here you will get the file name thats being saved and after saving all images you will get "successfully saved images"
		console.log(data);
	}
});

//you can stop the image-fetcher whenever you want in the middle of downloading images..by stoping your server.
//IMPORTANT: It might take several minutes..so please be patient. B-)

```

## License

The code in this repository is licensed under the MIT License. License
text is available in the `LICENSE.txt` file.
