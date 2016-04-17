'use strict';

var myApp = angular.module('Main_App', ['ui.router','ngMaterial']);

myApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider,$urlRouterProvider,$httpProvider) {
        console.log("HI THERE.");
        $stateProvider
            .state('AppPage',{
                url: '/',
                views: {
                    'CoCGuide': {
                        templateUrl : 'UserInterface/CoCStrategyPage.html',
                        action : 'Main_App.CoC_Controller'
                    }
                }
            })

            $urlRouterProvider.when('','/');
    }
]);

myApp.controller('CoC_Controller', function($timeout, $scope, $http, $location, $rootScope, $window, $mdSidenav, $log, $sce) {

// _________ .____       _____    _________ ___ ___ ________  ____________________ .____       _____    _______    _________
// \_   ___ \|    |     /  _  \  /   _____//   |   \\_____  \ \_   _____/\_   ___ \|    |     /  _  \   \      \  /   _____/
// /    \  \/|    |    /  /_\  \ \_____  \/    ~    \/   |   \ |    __)  /    \  \/|    |    /  /_\  \  /   |   \ \_____  \ 
// \     \___|    |___/    |    \/        \    Y    /    |    \|     \   \     \___|    |___/    |    \/    |    \/        \
//  \______  /_______ \____|__  /_______  /\___|_  /\_______  /\___  /    \______  /_______ \____|__  /\____|__  /_______  /
//         \/        \/       \/        \/       \/         \/     \/            \/        \/       \/         \/        \/ 

    var alreadyLoaded = [];
    
    $scope.AOrD = "Attack";
    $scope.strategy = "strategy";
    $scope.base = "base";

    var userChoice= {
        'Attack': [{
          name: 'War'
        }, {
          name: 'Looting'
        },
        {
          name: 'Air'
        },
        {
          name: 'Hero'
        },
        {
          name: 'Trophy'
        }],
        'Defense': [{
          name: 'War'
        }, {
          name: 'Farming'
        },
        {
          name: 'Trophy'
        }]
    };

    $scope.baseLevels =
        [   "Town Hall 3", 
            "Town Hall 4",  
            "Town Hall 5", 
            "Town Hall 6", 
            "Town Hall 7", 
            "Town Hall 8", 
            "Town Hall 9", 
            "Town Hall 10",
            "Town Hall 11"
        ]

    var options = function(choice){
        if (choice=="") {
            return ""
        }
        if (choice == "Attack") {
            $scope.AOrD = "Attack";
            return userChoice.Attack
        } else {
            $scope.AOrD = "Defense";
            return userChoice.Defense
        }
        console.log("WTF AM I DOING HERE");
    };

    $scope.sort = function(name){
        $scope.baseOptions = options(name);
        console.log(name, "selected via radio-box");
    }

    $scope.assignStrategy = function(name) {
        $scope.strategy=name;
        console.log("strategy:",$scope.strategy);
    }

    $scope.assignBase = function(name) {
        $scope.base=name;
        console.log("strategy:",$scope.base);
    }

    $scope.removeTab = function (tab) {
      var index = $scope.CoCArticles.items.indexOf(tab);
      $scope.CoCArticles.items.splice(index, 1);
      $scope.loadArticles($scope.CoCArticles.items[index].url, $scope.CoCArticles.items[index].id);
    };

    $scope.loadArticles = function(myurl, itemId) {
        if (alreadyLoaded.indexOf(itemId) == 0) {
            console.log(itemId, "is loaded in",alreadyLoaded);
        } else if (alreadyLoaded.indexOf(itemId) == -1) {
            console.log("Article needed to be loaded.");
            $http.put('/GetURLInfo/', {'myURL':myurl}).success(function(response) {
                var doc = document.implementation.createHTMLDocument('');
                doc.open()
                doc.write(response);
                doc.close()

                // console.log("test:::", doc.getElementById('WikiaArticle'));

                var tab = document.getElementById(itemId);

                var p = document.createElement("p");
                p.appendChild(doc.getElementById('WikiaArticle'));

                // console.log(p);

                tab.appendChild(p);

                alreadyLoaded.push(itemId);
            }).error(function(response) {
                console.log("Error:",response)
            });
        }
    }

    $scope.submit = function(){ 
        console.log("IN COC CONTROLLER");
        var queryString = $scope.AOrD + "_" + $scope.base + "_" + $scope.strategy;
        console.log(queryString);
        $http.get('/GetCoCArticles/' + queryString).success(function(response) {
            // console.log("Success:", JSON.parse(response));
            $scope.CoCArticles=JSON.parse(response);
            console.log($scope.CoCArticles.items);
            $scope.loadArticles($scope.CoCArticles.items[0].url, $scope.CoCArticles.items[0].id);
        }).error(function(response) {
            console.log("Error:",response)
        });
        getYouTubeList();
    }


// _____.___.________   ____ ________.___.____ ________________________
// \__  |   |\_____  \ |    |   \__  |   |    |   \______   \_   _____/
//  /   |   | /   |   \|    |   //   |   |    |   /|    |  _/|    __)_ 
//  \____   |/    |    \    |  / \____   |    |  / |    |   \|        \
//  / ______|\_______  /______/  / ______|______/  |______  /_______  /
//  \/               \/          \/                       \/        \/ 

    // $scope.youtubeVids = 
    // [   {
    //         title:"Video One",
    //         url: 
    //     },{
    //         title:"Video Two",
    //         url: 
    //     }
    // ];

     function getYouTubeList() {  //Retrieves video ID of youtube video
        var request = new XMLHttpRequest();

        request.onreadystatechange = function() {
            if (request.readyState == 4)
                if (request.status == 200) {
                    var infodict = JSON.parse(request.responseText).items;
                    $scope.youtubeVids = infodict;
                    console.log(infodict);
                }
        }

        var clashQuery = ($scope.AOrD + "_" + $scope.base + "_" + $scope.strategy).split("_");
        var searchQuery = clashQuery.shift();
        while (clashQuery.length != 0) {
            searchQuery = searchQuery + "+" + clashQuery.shift();
        }

        var APIKey = "AIzaSyDXTw7iKOOCoKfcHPCRMQSf4_eWgyeTtt4";

        var targetURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + searchQuery + "&type=video&videoEmbeddable=true&maxResults=20&key="+APIKey;

        request.open('GET', targetURL, true);

        request.send(null);
    }    


    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl("http://www.youtube.com/embed/"+src);
    }


//   _________.___________  ___________ _______      _________   ____
//  /   _____/|   \______ \ \_   _____/ \      \    /  _  \   \ /   /
//  \_____  \ |   ||    |  \ |    __)_  /   |   \  /  /_\  \   Y   / 
//  /        \|   ||    `   \|        \/    |    \/    |    \     /  
// /_______  /|___/_______  /_______  /\____|__  /\____|__  /\___/   
//         \/             \/        \/         \/         \/       
        
    $scope.toggleLeft = buildDelayedToggler('left');

    function debounce(func, wait, context) {
      var timer;
      return function debounced() {
        var context = $scope,
            args = Array.prototype.slice.call(arguments);
        $timeout.cancel(timer);
        timer = $timeout(function() {
          timer = undefined;
          func.apply(context, args);
        }, wait || 10);
      };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
      return debounce(function() {
        // Component lookup should always be available since we are not using `ng-if`
        $mdSidenav(navID)
          .toggle()
      }, 200);
    }
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID).toggle()
      }
    }

    $scope.close = function () {
      $mdSidenav('left').close()
    }

});

    