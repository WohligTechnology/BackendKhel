var uploadres = [];
var selectedData = [];
var abc = {};
var phonecatControllers = angular.module('phonecatControllers', ['templateservicemod', 'navigationservice', 'ngDialog', 'angularFileUpload', 'ui.select', 'ngSanitize']);
window.uploadUrl = 'http://130.211.164.146:81/uploadfile/uploadfile';
phonecatControllers.controller('home', function($scope, TemplateService, NavigationService, $routeParams, $location) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive("Dashboard");
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = "";
    TemplateService.content = "views/dashboard.html";
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    NavigationService.countUser(function(data, status) {
        $scope.user = data;
    });
    NavigationService.countregUser(function(data, status) {
        $scope.users = data;
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
        console.log($scope.login);
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
            console.log("blank login");
            $scope.isValidLogin = 0;
        }
    }
});
phonecatControllers.controller('headerctrl', function($scope, TemplateService, $location, $routeParams, NavigationService) {
    $scope.template = TemplateService;
    if (!$.jStorage.get("adminuser")) {
        $location.url("/login");
    }
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

    NavigationService.countregUser(function(data, status) {
        $scope.user.regno = data + 1;
    });

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

    $scope.submitForm = function() {
        if ($scope.isValidEmail == 1) {
            console.log($scope.user);
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
    //editUser
});
//editUser Controller
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
    $scope.team.pincode = [];
    $scope.team.player = [];
    $scope.team.pointslogs = [];
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
        "name": "Area",
        "type": "text"
    }, {
        "name": "Pincode",
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
    $scope.folder.image = [];
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
                        $scope.notification.image = imagejstupld.files[0].fd;
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

    var imagejstupld = "";
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
                        $scope.notification.image = imagejstupld.files[0].fd;
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
        NavigationService.editNotification($scope.notification, function(data, status) {
            $location.url('/notification');
        });
    };
    //editNotification
});
//editNotification Controller
//videogallery Controller
phonecatControllers.controller('VideogalleryCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Videogallery');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/videogallery.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.videogallery = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedVideogallery($scope.pagedata, function(data, status) {
            $scope.videogallery = data;
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
        NavigationService.deleteVideogallery(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deletevideogallery', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'VideogalleryCtrl',
                closeByDocument: false
            });
        }
        //End Sponsors
});
//videogallery Controller
//createvideogallery Controller
phonecatControllers.controller('createVideogalleryCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Videogallery');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createvideogallery.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.videogallery = {};
    $scope.submitForm = function() {
        NavigationService.saveVideogallery($scope.videogallery, function(data, status) {
            $location.url('/videogallery');
        });
    };
    //createSponsors
});
//createvideogallery Controller
//editvideogallery Controller
phonecatControllers.controller('editVideogalleryCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Videogallery');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editvideogallery.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.videogallery = {};
    NavigationService.getOneVideogallery($routeParams.id, function(data, status) {
        $scope.videogallery = data; //Add More Array
    });
    $scope.submitForm = function() {
        $scope.videogallery._id = $routeParams.id;
        NavigationService.saveVideogallery($scope.videogallery, function(data, status) {
            $location.url('/videogallery');
        });
    };
    //editSponsors
});
//editvideogallery Controller
//Schedule Controller
phonecatControllers.controller('ScheduleCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Schedule');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/schedule.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.schedule = [];
    $scope.pagedata = {};
    $scope.pagedata.page = 1;
    $scope.pagedata.limit = '20';
    $scope.pagedata.search = '';
    $scope.number = 100;
    $scope.reload = function(pagedata) {
        $scope.pagedata = pagedata;
        NavigationService.findLimitedSchedule($scope.pagedata, function(data, status) {
            $scope.schedule = data;
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
        NavigationService.deleteSchedule(function(data, status) {
            ngDialog.close();
            window.location.reload();
        });
    }
    $scope.deletefun = function(id) {
            $.jStorage.set('deleteschedule', id);
            ngDialog.open({
                template: 'views/delete.html',
                closeByEscape: false,
                controller: 'ScheduleCtrl',
                closeByDocument: false
            });
        }
        //End Sponsors
});
//Schedule Controller
//createSchedule Controller
phonecatControllers.controller('createScheduleCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Schedule');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/createschedule.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.schedule = {};

    $scope.addEvent = function (crdv) {
        if (!crdv.events) {
            crdv.events = [{
                "time": "",
                "event": "",
                "category": "",
                "court":""
                }];
        } else {
            crdv.events.push({
                "time": "",
                "event": "",
                "category": "",
                "court":""
            });
        }
    };
    $scope.removeEvent = function (i, dev) {
        dev.splice(i, 1);
    };

    $scope.submitForm = function() {
        NavigationService.saveSchedule($scope.schedule, function(data, status) {
            $location.url('/schedule');
        });
    };
    //createSponsors
});
//createSchedule Controller
//editSchedule Controller
phonecatControllers.controller('editScheduleCtrl', function($scope, TemplateService, NavigationService, $routeParams, $location, ngDialog) {
    $scope.template = TemplateService;
    $scope.menutitle = NavigationService.makeactive('Schedule');
    TemplateService.title = $scope.menutitle;
    TemplateService.submenu = '';
    TemplateService.content = 'views/editschedule.html';
    TemplateService.list = 2;
    $scope.navigation = NavigationService.getnav();
    $scope.schedule = {};
    NavigationService.getOneSchedule($routeParams.id, function(data, status) {
        $scope.schedule = data; //Add More Array
    });

    $scope.addEvent = function (crdv) {
        if (!crdv.events) {
            crdv.events = [{
                "time": "",
                "event": "",
                "category": "",
                "court":""
                }];
        } else {
            crdv.events.push({
                "time": "",
                "event": "",
                "category": "",
                "court":""
            });
        }
    };
    $scope.removeEvent = function (i, dev) {
        dev.splice(i, 1);
    };

    $scope.submitForm = function() {
        $scope.schedule._id = $routeParams.id;
        NavigationService.saveSchedule($scope.schedule, function(data, status) {
            $location.url('/schedule');
        });
    };
    //editSponsors
});
//editSchedule Controller
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
//Add New Controller
