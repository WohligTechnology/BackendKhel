var uploadres = [];
var selectedData = [];
var abc = {};
var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog', 'angularFileUpload', 'ui.select', 'ngSanitize']);
window.uploadUrl = 'http://wohlig.com:81/uploadfile/uploadfile';
phonecatControllers.controller('home', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.content = "views/dashboard.html";
    TemplateService.list = 1;
    $scope.navigation = NavigationService.getnav();
    NavigationService.countUser(function(data, status) {
        $scope.user = data;
    });
});
phonecatControllers.controller('login', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    TemplateService.content = "views/login.html";
    TemplateService.list = 3;

    $scope.navigation = NavigationService.getnav();
    $.jStorage.flush();
    $scope.isValidLogin = 1;
    $scope.login = {};
    $scope.verifylogin = function() {
        if ($scope.login.email && $scope.login.password) {
            NavigationService.adminLogin($scope.login, function(data, status) {
                if (data.value == "false") {
                    $scope.isValidLogin = 0;
                } else {
                    $scope.isValidLogin = 1;
                    $.jStorage.set("adminuser", data);
                    $location.url("/home");
                }
            })
        } else {
            $scope.isValidLogin = 0;
        }

    }
});
phonecatControllers.controller('headerctrl', function($scope, TemplateService, $location, $routeParams, NavigationService) {
    $scope.template = TemplateService;
    //  if (!$.jStorage.get("adminuser")) {
    //    $location.url("/login");
    //
    //  }
});

phonecatControllers.controller('createorder', function($scope, TemplateService, NavigationService, ngDialog, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Orders");
    TemplateService.title = $scope.menutitle;
    TemplateService.list = 2;
    TemplateService.content = "views/createorder.html";
    $scope.navigation = NavigationService.getnav();

    $scope.order = {};

    $scope.submitForm = function() {
        NavigationService.saveOrder($scope.order, function(data, status) {
            $location.url("/order");
        });
    };


    $scope.order.tag = [];
    $scope.ismatch = function(data, select) {
        abc.select = select;
        _.each(data, function(n, key) {
            if (typeof n == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(n),
                    category: $scope.artwork.type
                };
                NavigationService.saveTag(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, n);
                select.selected.push(item);
                $scope.order.tag = select.selected;
            }
        });
    }

    $scope.refreshOrder = function(search) {
        $scope.tag = [];
        if (search) {
            NavigationService.findArtMedium(search, $scope.order.tag, function(data, status) {
                $scope.tag = data;
            });
        }
    };

    $scope.GalleryStructure = [{
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }, {
        "name": "image",
        "type": "image"
    }, {
        "name": "name",
        "type": "text",
        "validation": [
            "required",
            "minlength",
            "min=5"
        ]
    }];

    $scope.persons = [{
        "id": 1,
        "name": "first option"
    }, {
        "id": 2,
        "name": "first option"
    }, {
        "id": 3,
        "name": "first option"
    }, {
        "id": 4,
        "name": "first option"
    }, {
        "id": 5,
        "name": "first option"
    }];

    NavigationService.getUser(function(data, status) {
        $scope.persons = data;
    });

});




//User Controller
phonecatControllers.controller('UserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/user.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.User = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedUser($scope.pagedata, function(data, status) {
            $scope.user = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteUser(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleteuser', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'UserCtrl',
                closeByDocument: false
            });
        }
        //End User
});
//user Controller
//createUser Controller
phonecatControllers.controller('createUserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createuser.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.user = {};
    $scope.isValidEmail = 1;
    $scope.user.registrationdate = new Date();
    $scope.allsports = ["Bucket Ball", "Handminton", "Lagori", "Handball", "3 Legged Race", "4 Legged Race", "Triathalon", "Relay", "Skating Relay", "Tug of War"];

    //////////////////////////
    $scope.user.sports = [];
    $scope.user.quiz = [];
    $scope.user.aquatics = [];
    $scope.user.dance = [];
    $scope.user.volunteer = [];
    $scope.checked = [];
    $scope.sportsflag = "";

    $scope.divs = [{
        name: "div1",
        vlaue: false
    }, {
        name: "div2",
        value: false
    }, {
        name: "div3",
        value: false
    }, {
        name: "div4",
        value: false
    }];
    $scope.divmodel = {};
    $scope.divmodel.sports = false;
    $scope.divmodel.quiz = false;
    $scope.divmodel.aquatics = false;
    $scope.divmodel.dance = false;
    $scope.dancedisable = true;
    $scope.quizdisable = true;
    $scope.aquaticsdisable = true;
    $scope.sportsdisable = true;

    $scope.enableordisable = function(value) {
        checknow();
        var popindex = $scope.checked.indexOf(value);
        if (popindex == -1) {
            if ($scope.checked.length <= 1) {
                $scope.checked.push(value);
                if ($scope.checked.length == 2) {
                    _.each($scope.divs, function(n) {
                        var foundindex = $scope.checked.indexOf(n.name);
                        if (foundindex == -1) {
                            n.value = true;
                        } else {
                            n.value = false;
                        }
                    })
                }
            }
        } else {
            $scope.checked.splice(popindex, 1);
            _.each($scope.divs, function(n) {
                n.value = false;
            })
        }

        function checknow() {
            if (value == 'div1') {
                if ($scope.divmodel.quiz == false) {
                    $scope.quizdisable = true;
                    document.getElementById("quiz1").checked = false;
                    $scope.user.quiz = [];
                } else {
                    $scope.quizdisable = false;
                    document.getElementById("quiz1").checked = true;
                }
            }

            if (value == 'div2') {
                if ($scope.divmodel.aquatics == false) {
                    $scope.aquaticsdisable = true;
                    document.getElementById("aqua1").checked = false;
                    $scope.user.aquatics = []
                } else {
                    $scope.aquaticsdisable = false;
                }
            }

            if (value == 'div3') {
                if ($scope.divmodel.dance == false) {
                    $scope.dancedisable = true;
                    document.getElementById("dance1").checked = false;
                    document.getElementById("dance2").checked = false;
                    $scope.user.dance = [];
                } else {
                    $scope.dancedisable = false;
                }
            }

            if (value == 'div4') {
                if ($scope.divmodel.sports == false) {
                    $scope.sportsdisable = true;
                    for (var i = 0; i < $scope.allsports.length; i++) {
                        document.getElementById($scope.allsports[i] + i + "").checked = false;
                        $scope.user.sports = [];
                    }
                } else {
                    $scope.sportsdisable = false;
                }
            }
        }
    };

    //////////////////////////

    $scope.submitForm = function() {
        if ($scope.isValidEmail == 1) {
            NavigationService.saveUser($scope.user, function(data, status) {
                if (data.value == false && data.comment == "No such pincode") {
                    ngDialog.open({
                        template: 'views/pincode.html',
                        closeByEscape: false,
                        controller: 'createUserCtrl',
                        closeByDocument: false
                    });
                    $timeout(function() {
                        ngDialog.close();
                    }, 2500);
                } else if (data.value == true) {
                    $location.url('/user');
                }
            });
        }
    };
    $scope.email = function(myemail) {
        if (myemail) {
            NavigationService.getOneemail(myemail, function(data, status) {
                if (data.value == true) {
                    $scope.isValidEmail = 0;
                } else {
                    $scope.isValidEmail = 1;
                }
            });
        }
    }
    $scope.user.village = [];
    $scope.ismatchVillage = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveVillage(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.user.village = select.selected;
            }
        });
    }
    $scope.refreshVillage = function(search) {
        $scope.village = [];
        if (search) {
            NavigationService.findVillage(search, $scope.user.village, function(data, status) {
                if (data.value != false) {
                    $scope.village = data;
                }
            });
        }
    };
    $scope.user.area = [];
    $scope.ismatchArea = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveArea(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.user.area = select.selected;
            }
        });
    }
    $scope.refreshArea = function(search) {
        $scope.area = [];
        if (search) {
            NavigationService.findArea(search, $scope.user.area, function(data, status) {
                if (data.value != false) {
                    $scope.area = data;
                }
            });
        }
    };
    NavigationService.getTeam(function(data, status) {
        $scope.team = data;
    });
    NavigationService.getSports(function(data, status) {
        $scope.sport = data;
    });
    $scope.user.volunteers = [];
    $scope.ismatchVolunteers = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveVolunteers(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.user.volunteers = select.selected;
            }
        });
    }
    $scope.refreshVolunteers = function(search) {
        $scope.volunteers = [];
        if (search) {
            NavigationService.findVolunteers(search, $scope.user.volunteers, function(data, status) {
                if (data.value != false) {
                    $scope.volunteers = data;
                }
            });
        }
    };
    //createUser
});
//createUser Controller
//editUser Controller
phonecatControllers.controller('editUserCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('User');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/edituser.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.user = {};
    $scope.allsports = ["Bucket Ball", "Handminton", "Lagori", "Handball", "3 Legged Race", "4 Legged Race", "Triathalon", "Relay", "Skating Relay", "Tug of War"];

    $scope.divmodel = {};
    $scope.divmodel.sports = false;
    $scope.divmodel.quiz = false;
    $scope.divmodel.aquatics = false;
    $scope.divmodel.dance = false;
    $scope.dancedisable = true;
    $scope.quizdisable = true;
    $scope.aquaticsdisable = true;
    $scope.sportsdisable = true;

    $scope.user.sports = [];
    $scope.user.quiz = [];
    $scope.user.aquatics = [];
    $scope.user.dance = [];
    $scope.user.volunteer = [];
    $scope.checked = [];

    NavigationService.getOneUser($routeParams.id, function(data, status) {
        $scope.user = data; //Add More Array
        if (!data.village)
            $scope.user.village = [];
        if (!data.area)
            $scope.user.area = [];
        if (!data.volunteers)
            $scope.user.volunteers = [];
        $scope.user.dateofbirth = new Date($scope.user.dateofbirth);
        if ($scope.user.sports.length > 0) {
            $scope.divmodel.sports = true;
            $scope.sportsdisable = false;
        }
        if ($scope.user.quiz.length > 0) {
            $scope.divmodel.quiz = true;
            $scope.quizdisable = false;
        }
        if ($scope.user.dance.length > 0) {
            $scope.divmodel.dance = true;
            $scope.dancedisable = false;
        }
        if ($scope.user.aquatics.length > 0) {
            $scope.divmodel.aquatics = true;
            $scope.aquaticsdisable = false;
        }
        $scope.user.registrationdate = new Date($scope.user.registrationdate);
    });
    /////////////////////////////

    $scope.divs = [{
        name: "div1",
        vlaue: false
    }, {
        name: "div2",
        value: false
    }, {
        name: "div3",
        value: false
    }, {
        name: "div4",
        value: false
    }];

    $scope.enableordisable = function(value) {
        checknow();
        var popindex = $scope.checked.indexOf(value);
        if (popindex == -1) {
            if ($scope.checked.length <= 1) {
                $scope.checked.push(value);
                if ($scope.checked.length == 2) {
                    _.each($scope.divs, function(n) {
                        var foundindex = $scope.checked.indexOf(n.name);
                        if (foundindex == -1) {
                            n.value = true;
                        } else {
                            n.value = false;
                        }
                    })
                }
            }
        } else {
            $scope.checked.splice(popindex, 1);
            _.each($scope.divs, function(n) {
                n.value = false;
            })
        }

        function checknow() {
            if (value == 'div1') {
                if ($scope.divmodel.quiz == false) {
                    $scope.quizdisable = true;
                    document.getElementById("quiz1").checked = false;
                    $scope.user.quiz = [];
                } else {
                    $scope.quizdisable = false;
                    document.getElementById("quiz1").checked = true;
                }
            }

            if (value == 'div2') {
                if ($scope.divmodel.aquatics == false) {
                    $scope.aquaticsdisable = true;
                    document.getElementById("aqua1").checked = false;
                    $scope.user.aquatics = []
                } else {
                    $scope.aquaticsdisable = false;
                }
            }

            if (value == 'div3') {
                if ($scope.divmodel.dance == false) {
                    $scope.dancedisable = true;
                    document.getElementById("dance1").checked = false;
                    document.getElementById("dance2").checked = false;
                    $scope.user.dance = [];
                } else {
                    $scope.dancedisable = false;
                }
            }

            if (value == 'div4') {
                if ($scope.divmodel.sports == false) {
                    $scope.sportsdisable = true;
                    for (var i = 0; i < $scope.allsports.length; i++) {
                        document.getElementById($scope.allsports[i] + i + "").checked = false;
                        $scope.user.sports = [];
                    }
                } else {
                    $scope.sportsdisable = false;
                }
            }
        }
    };
    /////////////////////////////
    $scope.submitForm = function() {
        NavigationService.saveUser($scope.user, function(data, status) {
            if (data.value == false && data.comment == "No such pincode") {
                ngDialog.open({
                    template: 'views/pincode.html',
                    closeByEscape: false,
                    controller: 'createUserCtrl',
                    closeByDocument: false
                });
                $timeout(function() {
                    ngDialog.close();
                }, 2500);
            } else if (data.value == true) {
                $location.url('/user');
            }
        });
    };
    $scope.user.village = [];
    $scope.ismatchVillage = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveVillage(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.user.village = select.selected;
            }
        });
    }
    $scope.refreshVillage = function(search) {
        $scope.village = [];
        if (search) {
            NavigationService.findVillage(search, $scope.user.village, function(data, status) {
                if (data.value != false) {
                    $scope.village = data;
                }
            });
        }
    };
    $scope.user.area = [];
    $scope.ismatchArea = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveArea(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.user.area = select.selected;
            }
        });
    }
    $scope.refreshArea = function(search) {
        $scope.area = [];
        if (search) {
            NavigationService.findArea(search, $scope.user.area, function(data, status) {
                if (data.value != false) {
                    $scope.area = data;
                }
            });
        }
    };
    NavigationService.getTeam(function(data, status) {
        $scope.team = data;
    });
    NavigationService.getSports(function(data, status) {
        $scope.sport = data;
    });
    $scope.user.volunteers = [];
    $scope.ismatchVolunteers = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveVolunteers(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.user.volunteers = select.selected;
            }
        });
    }
    $scope.refreshVolunteers = function(search) {
        $scope.volunteers = [];
        if (search) {
            NavigationService.findVolunteers(search, $scope.user.volunteers, function(data, status) {
                if (data.value != false) {
                    $scope.volunteers = data;
                }
            });
        }
    };
    //editUser
});
//editUser Controller
//Articles Controller
phonecatControllers.controller('ArticlesCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Articles');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/articles.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Articles = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedArticles($scope.pagedata, function(data, status) {
            $scope.articles = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteArticles(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletearticles', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'ArticlesCtrl',
                closeByDocument: false
            });
        }
        //End Articles
});
//articles Controller
//createArticles Controller
phonecatControllers.controller('createArticlesCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Articles');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createarticles.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.articles = {};
    $scope.submitForm = function() {
        NavigationService.saveArticles($scope.articles, function(data, status) {
            $location.url('/articles');
        });
    };
    //createArticles
});
//createArticles Controller
//editArticles Controller
phonecatControllers.controller('editArticlesCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Articles');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editarticles.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.articles = {};
    NavigationService.getOneArticles($routeParams.id, function(data, status) {
        $scope.articles = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.articles._id = $routeParams.id;
        NavigationService.saveArticles($scope.articles, function(data, status) {
            $location.url('/articles');
        });
    };
    //editArticles
});
//editArticles Controller
//Team Controller
phonecatControllers.controller('TeamCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Team');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/team.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Team = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedTeam($scope.pagedata, function(data, status) {
            $scope.team = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteTeam(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleteteam', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'TeamCtrl',
                closeByDocument: false
            });
        }
        //End Team
});
//team Controller
//createTeam Controller
phonecatControllers.controller('createTeamCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Team');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createteam.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.team = {};
    $scope.submitForm = function() {
        NavigationService.saveTeam($scope.team, function(data, status) {
            $location.url('/team');
        });
    };

    $scope.allsports = [];

    NavigationService.getSports(function(data, status) {
        $scope.allsports = data;
        if (data.value || data.value == false) {
            $scope.allsports = [];
        }

        $scope.PlayerStructure = [{
            "name": "Name",
            "type": "text"
        }, {
            "name": "Sport",
            "type": "select",
            "options": $scope.allsports
        }, {
            "name": "SubSport",
            "type": "select"
        }, {
            "name": "IsStar",
            "type": "select",
            "options": [{
                "_id": "yes",
                "name": "Yes"
            }, {
                "_id": "no",
                "name": "No"
            }]
        }, {
            "name": "Order",
            "type": "text"
        }];

    });

    $scope.team.pincode = [];
    $scope.PincodeStructure = [{
        "name": "Area",
        "type": "text"
    }, {
        "name": "Pincode",
        "type": "number"
    }];

    $scope.team.player = [];

    $scope.team.pointslogs = [];
    $scope.PointsLogsStructure = [{
        "name": "ScheduledMatch",
        "type": "text"
    }, {
        "name": "User",
        "type": "text"
    }, {
        "name": "Timestamp",
        "type": "date"
    }];
    //createTeam
});
//createTeam Controller
//editTeam Controller
phonecatControllers.controller('editTeamCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Team');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editteam.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.team = {};
    NavigationService.getOneTeam($routeParams.id, function(data, status) {
        $scope.team = data;
        if (!$scope.team.pincode) {
            $scope.team.pincode = [];
        }
        if (!$scope.team.player) {
            $scope.team.player = [];
        }
        if (!$scope.team.pointslogs) {
            $scope.team.pointslogs = [];
        } //Add More Array
    });
    $scope.submitForm = function() {
        $scope.team._id = $routeParams.id;
        NavigationService.saveTeam($scope.team, function(data, status) {
            $location.url('/team');
        });
    };
    $scope.PincodeStructure = [{
        "name": "area",
        "type": "text"
    }, {
        "name": "pincode",
        "type": "text"
    }];
    $scope.PlayerStructure = [{
        "name": "Name",
        "type": "text"
    }, {
        "name": "Sport",
        "type": "select"
    }, {
        "name": "SubSport",
        "type": "select"
    }, {
        "name": "IsStar",
        "type": "select"
    }, {
        "name": "Order",
        "type": "text"
    }];
    $scope.PointsLogsStructure = [{
        "name": "ScheduledMatch",
        "type": "text"
    }, {
        "name": "User",
        "type": "text"
    }, {
        "name": "Timestamp",
        "type": "date"
    }];
    //editTeam
});
//editTeam Controller
//Sports Controller
phonecatControllers.controller('SportsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Sports');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/sports.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Sports = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedSports($scope.pagedata, function(data, status) {
            $scope.sports = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteSports(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletesports', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'SportsCtrl',
                closeByDocument: false
            });
        }
        //End Sports
});
//sports Controller
//createSports Controller
phonecatControllers.controller('createSportsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Sports');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createsports.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sports = {};
    $scope.submitForm = function() {
        NavigationService.saveSports($scope.sports, function(data, status) {
            $location.url('/sports');
        });
    };
    $scope.sports.subsports = [];
    $scope.ismatchSubSports = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveSubSports(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.sports.subsports = select.selected;
            }
        });
    }
    $scope.refreshSubSports = function(search) {
        $scope.subsports = [];
        if (search) {
            NavigationService.findSubSports(search, $scope.sports.subsports, function(data, status) {
                if (data.value != false) {
                    $scope.subsports = data;
                }
            });
        }
    };
    $scope.sports.schedule = [];
    $scope.ScheduleStructure = [{
        "name": "Team1",
        "type": "text"
    }, {
        "name": "Team2",
        "type": "text"
    }, {
        "name": "Venue",
        "type": "text"
    }, {
        "name": "Result",
        "type": "text"
    }, {
        "name": "Level",
        "type": "text"
    }, {
        "name": "SubSport",
        "type": "text"
    }, {
        "name": "Timestamp",
        "type": "date"
    }];
    //createSports
});
//createSports Controller
//editSports Controller
phonecatControllers.controller('editSportsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Sports');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editsports.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sports = {};
    NavigationService.getOneSports($routeParams.id, function(data, status) {
        $scope.sports = data;
        if (!$scope.sports.schedule) {
            $scope.sports.schedule = [];
        } //Add More Array
    });
    $scope.submitForm = function() {
        $scope.sports._id = $routeParams.id;
        NavigationService.saveSports($scope.sports, function(data, status) {
            $location.url('/sports');
        });
    };
    $scope.sports.subsports = [];
    $scope.ismatchSubSports = function(data, select) {
        _.each(data, function(l, key) {
            if (typeof l == 'string') {
                var item = {
                    _id: _.now(),
                    name: _.capitalize(l)
                };
                NavigationService.saveSubSports(item, function(data, status) {
                    if (data.value == true) {
                        item._id = data.id;
                    }
                });
                select.selected = _.without(select.selected, l);
                select.selected.push(item);
                $scope.sports.subsports = select.selected;
            }
        });
    }
    $scope.refreshSubSports = function(search) {
        $scope.subsports = [];
        if (search) {
            NavigationService.findSubSports(search, $scope.sports.subsports, function(data, status) {
                if (data.value != false) {
                    $scope.subsports = data;
                }
            });
        }
    };
    $scope.ScheduleStructure = [{
        "name": "Team1",
        "type": "text"
    }, {
        "name": "Team2",
        "type": "text"
    }, {
        "name": "Venue",
        "type": "text"
    }, {
        "name": "Result",
        "type": "text"
    }, {
        "name": "Level",
        "type": "text"
    }, {
        "name": "SubSport",
        "type": "text"
    }, {
        "name": "Timestamp",
        "type": "date"
    }];
    //editSports
});
//editSports Controller
//News Controller
phonecatControllers.controller('NewsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('News');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/news.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.News = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedNews($scope.pagedata, function(data, status) {
            $scope.news = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteNews(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletenews', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'NewsCtrl',
                closeByDocument: false
            });
        }
        //End News
});
//news Controller
//createNews Controller
phonecatControllers.controller('createNewsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('News');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createnews.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.news = {};
    $scope.submitForm = function() {
        NavigationService.saveNews($scope.news, function(data, status) {
            $location.url('/news');
        });
    };
    NavigationService.getTeam(function(data, status) {
        $scope.team = data;
    });
    //createNews
});
//createNews Controller
//editNews Controller
phonecatControllers.controller('editNewsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('News');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editnews.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.news = {};
    NavigationService.getOneNews($routeParams.id, function(data, status) {
        $scope.news = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.news._id = $routeParams.id;
        NavigationService.saveNews($scope.news, function(data, status) {
            $location.url('/news');
        });
    };
    NavigationService.getTeam(function(data, status) {
        $scope.team = data;
    });
    //editNews
});
//editNews Controller
//Slider Controller
phonecatControllers.controller('SliderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Slider');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/slider.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.slider = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedSlider($scope.pagedata, function(data, status) {
            $scope.slider = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteSlider(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleteslider', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'SliderCtrl',
                closeByDocument: false
            });
        }
        //End Slider
});
//slider Controller
//createSlider Controller
phonecatControllers.controller('createSliderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Slider');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createslider.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.slider = {};

    $scope.removeimage = function(i) {
        $scope.slider.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.slider.image = [];
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i);
            }
        }
    };

    $scope.start = function(index) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: uploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.slider.image.push(imagejstupld.files[0].fd);
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };

    $scope.submitForm = function() {
        NavigationService.saveSlider($scope.slider, function(data, status) {
            $location.url('/slider');
        });
    };
    //createSlider
});
//createSlider Controller
//editSlider Controller
phonecatControllers.controller('editSliderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Slider');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editslider.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.slider = {};

    $scope.removeimage = function(i) {
        $scope.slider.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i);
            }
        }
    };

    $scope.start = function(index) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: uploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.slider.image.push(imagejstupld.files[0].fd);
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };

    NavigationService.getOneSlider($routeParams.id, function(data, status) {
        $scope.slider = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.slider._id = $routeParams.id;
        NavigationService.saveSlider($scope.slider, function(data, status) {
            $location.url('/slider');
        });
    };
    //editSlider
});
//editSlider Controller
//Folder Controller
phonecatControllers.controller('FolderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Folder');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/folder.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.folder = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedFolder($scope.pagedata, function(data, status) {
            $scope.folder = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteFolder(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
        $.jStorage.set('deletefolder', id);
        ngDialog.open({
            template: 'views/delete.html',
            closeByEscape: false,
            controller: 'FolderCtrl',
            closeByDocument: false
        });
    }
});
//folder Controller
//createFolder Controller
phonecatControllers.controller('createFolderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Folder');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createfolder.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.folder = {};

    $scope.removeimage = function(i) {
        $scope.folder.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.folder.image = [];
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i);
            }
        }
    };

    $scope.start = function(index) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: uploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.folder.image.push(imagejstupld.files[0].fd);
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };

    $scope.submitForm = function() {
        NavigationService.saveFolder($scope.folder, function(data, status) {
            $location.url('/folder');
        });
    };
    //createSlider
});
//createFolder Controller
//editFolder Controller
phonecatControllers.controller('editFolderCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Folder');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editfolder.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.folder = {};

    $scope.removeimage = function(i) {
        $scope.folder.image.splice(i, 1);
    };

    var imagejstupld = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        console.log($files);
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i);
            }
        }
    };

    $scope.start = function(index) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        console.log($scope.howToSend = 1);
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: uploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    imagejstupld = response.data;
                    if (imagejstupld != "") {
                        $scope.folder.image.push(imagejstupld.files[0].fd);
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };

    NavigationService.getOneFolder($routeParams.id, function(data, status) {
        $scope.folder = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.folder._id = $routeParams.id;
        NavigationService.saveFolder($scope.folder, function(data, status) {
            $location.url('/folder');
        });
    };
    //editSlider
});
//editFolder Controller
//Notification Controller
phonecatControllers.controller('NotificationCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Notification');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/notification.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Notification = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedNotification($scope.pagedata, function(data, status) {
            $scope.notification = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteNotification(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletenotification', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'NotificationCtrl',
                closeByDocument: false
            });
        }
        //End Notification
});
//notification Controller
//createNotification Controller
phonecatControllers.controller('createNotificationCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Notification');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createnotification.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.notification = {};

    $scope.removeimage = function(i) {
        $scope.notification.image = "";
    };

    var uploadedimage = "";
    $scope.notification.image = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files, whichone) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i, whichone);
            }
        }
    };

    $scope.start = function(index, whichone) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: uploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    uploadedimage = response.data;
                    if (uploadedimage != "") {
                        $scope.notification.image = uploadedimage.files[0].fd;
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };

    $scope.submitForm = function() {
        NavigationService.saveNotification($scope.notification, function(data, status) {
            $location.url('/notification');
        });
    };
    //createNotification
});
//createNotification Controller
//editNotification Controller
phonecatControllers.controller('editNotificationCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog, $upload, $timeout) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Notification');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editnotification.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.notification = {};

    $scope.removeimage = function(i) {
        $scope.notification.image = "";
    };

    var uploadedimage = "";
    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
    $scope.uploadRightAway = true;
    $scope.changeAngularVersion = function() {
        window.location.hash = $scope.angularVersion;
        window.location.reload(true);
    };
    $scope.hasUploader = function(index) {
        return $scope.upload[index] != null;
    };
    $scope.abort = function(index) {
        $scope.upload[index].abort();
        $scope.upload[index] = null;
    };
    $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ?
        window.location.hash.substring(2) : window.location.hash.substring(1)) : '1.2.20';
    $scope.onFileSelect = function($files, whichone) {
        $scope.selectedFiles = [];
        $scope.progress = [];
        if ($scope.upload && $scope.upload.length > 0) {
            for (var i = 0; i < $scope.upload.length; i++) {
                if ($scope.upload[i] != null) {
                    $scope.upload[i].abort();
                }
            }
        }
        $scope.upload = [];
        $scope.uploadResult = uploadres;
        $scope.selectedFiles = $files;
        $scope.dataUrls = [];
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
                var fileReader = new FileReader();
                fileReader.readAsDataURL($files[i]);
                var loadFile = function(fileReader, index) {
                    fileReader.onload = function(e) {
                        $timeout(function() {
                            $scope.dataUrls[index] = e.target.result;
                        });
                    }
                }(fileReader, i);
            }
            $scope.progress[i] = -1;
            if ($scope.uploadRightAway) {
                $scope.start(i, whichone);
            }
        }
    };

    $scope.start = function(index, whichone) {
        $scope.progress[index] = 0;
        $scope.errorMsg = null;
        if ($scope.howToSend == 1) {
            $scope.upload[index] = $upload.upload({
                url: uploadUrl,
                method: $scope.httpMethod,
                headers: {
                    'Content-Type': 'Content-Type'
                },
                data: {
                    myModel: $scope.myModel
                },
                file: $scope.selectedFiles[index],
                fileFormDataName: 'file'
            });
            $scope.upload[index].then(function(response) {
                $timeout(function() {
                    $scope.uploadResult.push(response.data);
                    uploadedimage = response.data;
                    if (uploadedimage != "") {
                        $scope.notification.image = uploadedimage.files[0].fd;
                    }
                });
            }, function(response) {
                if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
            }, function(evt) {
                $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            $scope.upload[index].xhr(function(xhr) {});
        } else {
            var fileReader = new FileReader();
            fileReader.onload = function(e) {
                $scope.upload[index] = $upload.http({
                    url: uploadUrl,
                    headers: {
                        'Content-Type': $scope.selectedFiles[index].type
                    },
                    data: e.target.result
                }).then(function(response) {
                    $scope.uploadResult.push(response.data);
                }, function(response) {
                    if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
                }, function(evt) {
                    $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            }
            fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
        }
    };

    $scope.dragOverClass = function($event) {
        var items = $event.dataTransfer.items;
        var hasFile = false;
        if (items != null) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].kind == 'file') {
                    hasFile = true;
                    break;
                }
            }
        } else {
            hasFile = true;
        }
        return hasFile ? "dragover" : "dragover-err";
    };

    NavigationService.getOneNotification($routeParams.id, function(data, status) {
        $scope.notification = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.notification._id = $routeParams.id;
        NavigationService.saveNotification($scope.notification, function(data, status) {
            $location.url('/notification');
        });
    };
    //editNotification
});
//editNotification Controller
//Sponsors Controller
phonecatControllers.controller('SponsorsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Sponsors');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/sponsors.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Sponsors = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedSponsors($scope.pagedata, function(data, status) {
            $scope.sponsors = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteSponsors(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletesponsors', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'SponsorsCtrl',
                closeByDocument: false
            });
        }
        //End Sponsors
});
//sponsors Controller
//createSponsors Controller
phonecatControllers.controller('createSponsorsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Sponsors');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createsponsors.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sponsors = {};
    $scope.submitForm = function() {
        NavigationService.saveSponsors($scope.sponsors, function(data, status) {
            $location.url('/sponsors');
        });
    };
    //createSponsors
});
//createSponsors Controller
//editSponsors Controller
phonecatControllers.controller('editSponsorsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Sponsors');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editsponsors.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.sponsors = {};
    NavigationService.getOneSponsors($routeParams.id, function(data, status) {
        $scope.sponsors = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.sponsors._id = $routeParams.id;
        NavigationService.saveSponsors($scope.sponsors, function(data, status) {
            $location.url('/sponsors');
        });
    };
    //editSponsors
});
//editSponsors Controller
//Ads Controller
phonecatControllers.controller('AdsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Ads');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/ads.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.Ads = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedAds($scope.pagedata, function(data, status) {
            $scope.ads = data;
            $scope.pages = [];
            var newclass = '';
            for (var i = 1; i <= data.totalpages; i++) {
                if (pagedata.page == i) {
                    newclass = 'active';
                } else {
                    newclass = '';
                }
                $scope.pages.push({
                    pageno: i,
                    class: newclass
                });
            }
        });
    }
    $scope.reload($scope.pagedata);
    $scope.confDelete = function() {
        NavigationService.deleteAds(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleteads', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'AdsCtrl',
                closeByDocument: false
            });
        }
        //End Ads
});
//ads Controller
//createAds Controller
phonecatControllers.controller('createAdsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Ads');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createads.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.ads = {};
    $scope.submitForm = function() {
        NavigationService.saveAds($scope.ads, function(data, status) {
            $location.url('/ads');
        });
    };
    //createAds
});
//createAds Controller
//editAds Controller
phonecatControllers.controller('editAdsCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Ads');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editads.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.ads = {};
    NavigationService.getOneAds($routeParams.id, function(data, status) {
        $scope.ads = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.ads._id = $routeParams.id;
        NavigationService.saveAds($scope.ads, function(data, status) {
            $location.url('/ads');
        });
    };
    //editAds
});
//editAds Controller
//Add New Controller
