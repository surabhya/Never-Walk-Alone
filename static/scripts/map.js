var app = angular.module('map-display',[]); 

app.directive('mapDisplay',function(){
	return{
		restrict:'E',
		templateUrl: '../../templates/map.html',
		controller: function($scope){
			$scope.getLocation = function(){
				$scope.changeVisibility(false); 
    			if (navigator.geolocation) {
        			navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError);
    			}else{ 
        			$scope.location.map = "Geolocation is not supported by this browser.";
    			}
   		 	}; 
			$scope.showPosition = function(position){
				$scope.location.info.lat = position.coords.latitude;
				$scope.location.info.lon =  position.coords.longitude;
				$scope.location.origin = new google.maps.LatLng($scope.location.info.lat, $scope.location.info.lon); 
				var radiusValue;
				if($scope.location.desiredDistance!=undefined){
					radiusValue=(1600*$scope.location.desiredDistance);
				}else if($scope.location.desiredWalktime!=undefined){
					radiusValue=(80*$scope.location.desiredWalktime);
				}
				else {
					radiusValue=1600; 
				}
				$scope.generateMap(14); 
				$scope.location.mark = new google.maps.Marker({
															position:$scope.location.origin,
															map:$scope.location.map,
															title:"You are here!", 
															icon:$scope.location.icon});				
				var request = {
					location: $scope.location.origin,
					radius: radiusValue,
					types: $scope.location.userSelection
				};
				var service = new google.maps.places.PlacesService($scope.location.map);
				service.nearbySearch(request, $scope.callback);
			}; 
			$scope.generateMap = function(zoomValue){
				var myOptions = {
					center:$scope.location.origin,
					zoom: zoomValue,
					mapTypeId:google.maps.MapTypeId.ROADMAP,
					mapTypeControl:true,
					navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
				}
				$scope.location.map = new google.maps.Map(document.getElementById("mapholder"), myOptions);
			};
			$scope.callback = function(results, status){
  				if (status == google.maps.places.PlacesServiceStatus.OK) {
   					for (var i = 0; i < results.length; i++) {
      					$scope.createMarker(results[i]);
    				}
  				}
  			}; 
  			$scope.createMarker = function(place){
				var placeLoc = place.geometry.location;
				var marker = new google.maps.Marker({
					map: $scope.location.map,
					position: place.geometry.location
				});
				google.maps.event.addListener(marker, 'mouseover', function() {
					$scope.location.infowindow.setContent(place.name);
					$scope.location.infowindow.open($scope.location.map, this);
				});
				google.maps.event.addListener(marker, 'click', function() {
					$scope.location.destination = new google.maps.LatLng(marker.position.A, marker.position.F); 	
					$scope.calcRoute(); 
				});
			}
			$scope.calcRoute = function (){
		  		var request = {
		      		origin:$scope.location.origin,
		      		destination:$scope.location.destination,
		      		travelMode: google.maps.TravelMode.WALKING
		 		};
			    $scope.location.directionsService.route(request, function(response, status) {
		    		if (status == google.maps.DirectionsStatus.OK) {
		    			$scope.location.directionsDisplay.setMap($scope.location.map);
		      			$scope.location.directionsDisplay.setDirections(response);
		      			$scope.$apply(function(){
							$scope.location.walkDistance = response.routes[0].legs[0].distance.text;
							$scope.location.walkTime = response.routes[0].legs[0].duration.text;		
						});
		  	  		}
		 	 	}); 
  			}
  			$scope.showError = function(error){
				switch(error.code) {
		        case error.PERMISSION_DENIED:
		           $scope.location.error = "User denied the request to acees current location."
		            break;
		        case error.POSITION_UNAVAILABLE:
		            $scope.location.error = "Location information is unavailable."
		            break;
		        case error.TIMEOUT:
		            $scope.location.error = "The request to get user location timed out."
		            break;
		        case error.UNKNOWN_ERROR:
		            $scope.location.error = "An unknown error occurred."
		            break;
		    	}
		    	$scope.$apply(function(){
					$scope.location.error = $scope.location.error;	
				});
			}
			$scope.changeVisibility = function(clearSelection){ 
				$scope.location.mapVisible = !$scope.location.mapVisible; 
				$scope.location.optionVisible = !$scope.location.optionVisible; 
				$scope.location.walkDistance = 'Select A Destination';
				$scope.location.walkTime = 'Select A Destination';  
				if(clearSelection){
					$scope.location.userSelection= []; 
					$scope.location.error = '';	
				}
			}
		}
	}
});