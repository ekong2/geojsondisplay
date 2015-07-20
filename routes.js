module.exports = function(app) {
	var request = require('request');

	var housing = 
	[{'id': 0,'street': '545 2nd Pl','status': 'pending','price': 299727,'bedrooms': 4,'bathrooms': 1,'sq_ft': 1608,'lat': 33.36944420834164,'lng': -112.11971469843907},
	{'id': 1,'street': '320 Blake St','status': 'active','price': 123081,'bedrooms': 5,'bathrooms': 3,'sq_ft': 3125,'lat': 33.476759305937215,'lng': -112.11512153436901},
	{'id': 2,'street': '740 2nd Pl','status': 'pending','price': 172219,'bedrooms': 5,'bathrooms': 2,'sq_ft': 1208,'lat': 33.468811357715914,'lng': -112.22879647183072},
	{'id': 3,'street': '533 8th Rd','status': 'pending','price': 277683,'bedrooms': 5,'bathrooms': 2,'sq_ft': 1431,'lat': 33.58858496101036,'lng': -112.08779982484374},
	{'id': 4,'street': '557 4th Cir','status': 'sold','price': 284196,'bedrooms': 4,'bathrooms': 2,'sq_ft': 3173,'lat': 33.51415333566995,'lng': -112.28351948295969},
	{'id': 5,'street': '466 8th Dv','status': 'sold','price': 115253,'bedrooms': 5,'bathrooms': 2,'sq_ft': 2890,'lat': 33.45057358654926,'lng': -112.09392248468063}];

	// //One time request for .csv file, create dictionary from file
	// request('https://s3.amazonaws.com/opendoor-problems/listings.csv', function (error, response, body) {
	//   if (!error && response.statusCode == 200) {
	//     var allLines = body.split(/\r\n|\n/);

	//     //Get all the keys
	//     var keys = allLines[0].split(',');

	//     //Go through all lines and construct the nested dictionary
	// 	for (var i = 1; i < allLines.length - 1; i++){
	// 		var values = allLines[i].split(',');
	// 		var currentHouse = {};
	// 		//Populate all key value pairs for the current house
	// 		for (var j = 0; j < keys.length; j++){
	// 			var key = keys[j];
	// 			var value = values[j];
	// 			currentHouse[key] = value;
	// 		}
	// 		//Add current house to dictionary
	// 		housing.push(currentHouse);
	// 	}
	//   }
	// });

  //Construction of filtered set
	var constructFilteredSet = function(params){
		var results = [];
		for (var i = 0; i < housing.length; i++){
			if (allConditionsSatisfied(housing[i], params)){
				results.push(housing[i]);
			}
		}
		return results;
	}

  //Helper method to check whether an object satisfies given conditions
	var allConditionsSatisfied = function(house, params){
		var satisfied = true;
		for (key in params){
			if (satisfied === false){
				break;
			}

			if (key === 'min_price'){
				satisfied = satisfied && house.price >= params[key];
			} else if (key === 'max_price'){
				satisfied = satisfied && house.price <= params[key];
			} else if (key === 'min_bathrooms'){
				satisfied = satisfied && house.bathrooms >= params[key];
			} else if (key === 'max_bathrooms'){
				satisfied = satisfied && house.bathrooms <= params[key];
			} else if (key === 'min_bedrooms'){
				satisfied = satisfied && house.bedrooms >= params[key];
			} else if (key === 'max_bedrooms'){
				satisfied = satisfied && house.bedrooms <= params[key];
			} else {
				satisfied = false;
			}
		}
		return satisfied;
	}

  //Helper method to convert into valid geoJSON
	var decodeToGeoJSON = function(array){
		var geoJSONResults = {};
		geoJSONResults.type = "FeatureCollection";
		geoJSONResults.features = [];
		for (var i = 0; i < array.length; i++){
			var house = array[i];
			var obj = {};
			obj.type = "Feature";
			obj.geometry = {
				"type" : "Point",
				"coordinates" : [house.lat, house.lng]
			};
			obj.properties = {
				"id": house.id,
				"price": house.price,
				"street": house.street,
				"bedrooms": house.bedrooms,
				"bathrooms": house.bathrooms,
				"sq_ft": house.sq_ft
			};
			geoJSONResults.features.push(obj);
		}
		return geoJSONResults;
	}


	app.get('/', function(req, res){
		res.render('index');
	});

	app.get('/listings', function(req,res){
		console.log(req.query);
		var filteredSet = constructFilteredSet(req.query);
		console.log('There are %d elements that match this criteria', filteredSet.length);
		var results = decodeToGeoJSON(filteredSet);
		res.json(results);
	});

	app.get('/*', function(req,res){
		res.redirect('/');
	});
};
