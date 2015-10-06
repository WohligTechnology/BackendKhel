var uploadres = [];
var selectedData = [];
var abc = {};
var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog', 'angularFileUpload', 'ui.select', 'ngSanitize']);
window.uploadUrl = 'http://192.168.2.22:1337/user/uploadfile';
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
                    document.getElementById("aqua1").checked = true;
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

    $scope.pushorpopsports = function(value) {
        if ($scope.divmodel.sports != false) {
            var popindex = $scope.user.sports.indexOf(value);
            if (popindex == -1)
                $scope.user.sports.push(value);
            else
                $scope.user.sports.splice(popindex, 1);
        }
    }

    $scope.pushorpopquiz = function(value) {
        var popindex = $scope.user.quiz.indexOf(value);
        if (popindex == -1)
            $scope.user.quiz.push(value);
        else {
            $scope.user.quiz.splice(popindex, 1);
        }
    }

    $scope.pushorpopaqua = function(value) {
        var popindex = $scope.user.aquatics.indexOf(value);
        if (popindex == -1)
            $scope.user.aquatics.push(value);
        else
            $scope.user.aquatics.splice(popindex, 1);
    }

    $scope.pushorpopdance = function(value) {
        var popindex = $scope.user.dance.indexOf(value);
        if (popindex == -1)
            $scope.user.dance.push(value);
        else
            $scope.user.dance.splice(popindex, 1);
    }

    $scope.pushorpopvolun = function(value) {
        var popindex = $scope.user.volunteer.indexOf(value);
        if (popindex == -1)
            $scope.user.volunteer.push(value);
        else
            $scope.user.volunteer.splice(popindex, 1);
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
    NavigationService.getOneUser($routeParams.id, function(data, status) {
        console.log(data);
        $scope.user = data; //Add More Array
        if (!data.village)
            $scope.user.village = [];
        if (!data.area)
            $scope.user.area = [];
        if (!data.volunteers)
            $scope.user.volunteers = [];
        $scope.user.dateofbirth = new Date($scope.user.dateofbirth);
        $scope.user.registrationdate = new Date($scope.user.registrationdate);
        $scope.user.sports = [null,"Handminton", "Lagori", "Handball"];
    });
    /////////////////////////////
    $scope.user.sports = [];
    $scope.user.quiz = [];
    $scope.user.aquatics = [];
    $scope.user.dance = [];
    $scope.user.volunteer = [];
    $scope.checked = [];

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
                    document.getElementById("aqua1").checked = true;
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

    $scope.pushorpopsports = function(value) {
        if ($scope.divmodel.sports != false) {
            var popindex = $scope.user.sports.indexOf(value);
            if (popindex == -1)
                $scope.user.sports.push(value);
            else
                $scope.user.sports.splice(popindex, 1);
        }
    }

    $scope.pushorpopquiz = function(value) {
        var popindex = $scope.user.quiz.indexOf(value);
        if (popindex == -1)
            $scope.user.quiz.push(value);
        else {
            $scope.user.quiz.splice(popindex, 1);
        }
    }

    $scope.pushorpopaqua = function(value) {
        var popindex = $scope.user.aquatics.indexOf(value);
        if (popindex == -1)
            $scope.user.aquatics.push(value);
        else
            $scope.user.aquatics.splice(popindex, 1);
    }

    $scope.pushorpopdance = function(value) {
        var popindex = $scope.user.dance.indexOf(value);
        if (popindex == -1)
            $scope.user.dance.push(value);
        else
            $scope.user.dance.splice(popindex, 1);
    }

    $scope.pushorpopvolun = function(value) {
        var popindex = $scope.user.volunteer.indexOf(value);
        if (popindex == -1)
            $scope.user.volunteer.push(value);
        else
            $scope.user.volunteer.splice(popindex, 1);
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
                controller: 'Articles',
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
                controller: 'Team',
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

    $scope.team.gallery = [];
    $scope.GalleryStructure = [{
        "name": "Name",
        "type": "text"
    }, {
        "name": "Type",
        "type": "select"
    }, {
        "name": "Url",
        "type": "text"
    }, {
        "name": "IsModerated",
        "type": "select"
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
        if (!$scope.team.gallery) {
            $scope.team.gallery = [];
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
        "name": "Area",
        "type": "text"
    }, {
        "name": "Pincode",
        "type": "text"
    }];
    $scope.GalleryStructure = [{
        "name": "Name",
        "type": "text"
    }, {
        "name": "Type",
        "type": "select"
    }, {
        "name": "Url",
        "type": "text"
    }, {
        "name": "IsModerated",
        "type": "select"
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
                controller: 'Sports',
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
                controller: 'News',
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
                controller: 'Notification',
                closeByDocument: false
            });
        }
        //End Notification
});
//notification Controller
//createNotification Controller
phonecatControllers.controller('createNotificationCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Notification');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createnotification.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.notification = {};
    $scope.submitForm = function() {
        NavigationService.saveNotification($scope.notification, function(data, status) {
            $location.url('/notification');
        });
    };
    //createNotification
});
//createNotification Controller
//editNotification Controller
phonecatControllers.controller('editNotificationCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Notification');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editnotification.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.notification = {};
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
                controller: 'Sponsors',
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
                controller: 'Ads',
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
