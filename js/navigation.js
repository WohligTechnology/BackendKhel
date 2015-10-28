// var adminurl = "http://localhost:1337/";
var adminurl = "http://130.211.164.146:81/";
// var adminurl = "http://192.168.2.22:1337/";
var adminlogin = {
    "username": "admin@admin.com",
    "password": "admin123"
};
var navigationservice = angular.module('navigationservice', [])

.factory('NavigationService', function($http) {
    var navigation = [{
            name: "Dashboard",
            classis: "active",
            link: "#/home",
            subnav: []
        }, {
            name: 'User',
            active: '',
            link: '#/user',
            subnav: []
        }, {
            name: 'Team',
            active: '',
            link: '#/team',
            subnav: []
        }, {
            name: 'Schedule',
            active: '',
            link: '#/schedule',
            subnav: []
        }, {
            name: 'Notification',
            active: '',
            link: '#/notification',
            subnav: []
        }, {
            name: 'Slider',
            active: '',
            link: '#/slider',
            subnav: []
        }, {
            name: 'Video Gallery',
            active: '',
            link: '#/videogallery',
            subnav: []
        }, {
            name: 'Folder',
            active: '',
            link: '#/folder',
            subnav: []
        }, //Add New Left

    ];

    return {
        makeactive: function(menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "active";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },
        getnav: function() {
            return navigation;
        },
        adminLogin: function(data, callback) {
            $http({
                url: adminurl + "loginuser/adminlogin",
                method: "POST",
                data: {
                    "email": data.email,
                    "password": data.password
                }
            }).success(callback);
        },
        countUser: function(callback) {
            $http.get(adminurl + "loginuser/countusers").success(callback);
        },
        countregUser: function(callback) {
            $http.get(adminurl + "user/countregno").success(callback);
        },
        setUser: function(data) {
            $.jStorage.set("user", data);
        },
        getUser: function() {
            $.jStorage.get("user");
        },
        getOneUser: function(id, callback) {
            $http({
                url: adminurl + 'user/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        getOneemail: function(email, callback) {
            $http({
                url: adminurl + 'user/searchmail',
                method: 'POST',
                data: {
                    'email': email
                }
            }).success(callback);
        },
        findLimitedUser: function(user, callback) {
            $http({
                url: adminurl + 'user/findlimited',
                method: 'POST',
                data: {
                    'search': user.search,
                    'pagesize': parseInt(user.limit),
                    'pagenumber': parseInt(user.page)
                }
            }).success(callback);
        },
        deleteUser: function(callback) {
            $http({
                url: adminurl + 'user/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteuser')
                }
            }).success(callback);
        },
        saveUser: function(data, callback) {
            $http({
                url: adminurl + 'user/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        saveVillage: function(data, callback) {
            $http({
                url: adminurl + 'village/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findVillage: function(data, village, callback) {
            $http({
                url: adminurl + 'village/find',
                method: 'POST',
                data: {
                    search: data,
                    village: village
                }
            }).success(callback);
        },
        getTeam: function(callback) {
            $http({
                url: adminurl + 'team/find',
                method: 'POST',
                data: {}
            }).success(callback);
        },
        getOneTeam: function(id, callback) {
            $http({
                url: adminurl + 'team/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedTeam: function(team, callback) {
            $http({
                url: adminurl + 'team/findlimited',
                method: 'POST',
                data: {
                    'search': team.search,
                    'pagesize': parseInt(team.limit),
                    'pagenumber': parseInt(team.page)
                }
            }).success(callback);
        },
        deleteTeam: function(callback) {
            $http({
                url: adminurl + 'team/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteteam')
                }
            }).success(callback);
        },
        saveTeam: function(data, callback) {
            $http({
                url: adminurl + 'team/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneSlider: function(id, callback) {
            $http({
                url: adminurl + 'slider/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedSlider: function(slider, callback) {
            $http({
                url: adminurl + 'slider/findlimited',
                method: 'POST',
                data: {
                    'search': slider.search,
                    'pagesize': parseInt(slider.limit),
                    'pagenumber': parseInt(slider.page)
                }
            }).success(callback);
        },
        deleteSlider: function(callback) {
            $http({
                url: adminurl + 'slider/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteslider')
                }
            }).success(callback);
        },
        saveSlider: function(data, callback) {
            $http({
                url: adminurl + 'slider/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneFolder: function(id, callback) {
            $http({
                url: adminurl + 'folder/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedFolder: function(slider, callback) {
            $http({
                url: adminurl + 'folder/findlimited',
                method: 'POST',
                data: {
                    'search': slider.search,
                    'pagesize': parseInt(slider.limit),
                    'pagenumber': parseInt(slider.page)
                }
            }).success(callback);
        },
        deleteFolder: function(callback) {
            $http({
                url: adminurl + 'folder/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletefolder')
                }
            }).success(callback);
        },
        saveFolder: function(data, callback) {
            $http({
                url: adminurl + 'folder/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneNotification: function(id, callback) {
            $http({
                url: adminurl + 'notification/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedNotification: function(notification, callback) {
            $http({
                url: adminurl + 'notification/findlimited',
                method: 'POST',
                data: {
                    'search': notification.search,
                    'pagesize': parseInt(notification.limit),
                    'pagenumber': parseInt(notification.page)
                }
            }).success(callback);
        },
        deleteNotification: function(callback) {
            $http({
                url: adminurl + 'notification/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletenotification')
                }
            }).success(callback);
        },
        saveNotification: function(data, callback) {
            $http({
                url: adminurl + 'notification/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        editNotification: function(data, callback) {
            $http({
                url: adminurl + 'notification/editnot',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneVideogallery: function(id, callback) {
            $http({
                url: adminurl + 'videogallery/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedVideogallery: function(videogallery, callback) {
            $http({
                url: adminurl + 'videogallery/findlimited',
                method: 'POST',
                data: {
                    'search': videogallery.search,
                    'pagesize': parseInt(videogallery.limit),
                    'pagenumber': parseInt(videogallery.page)
                }
            }).success(callback);
        },
        deleteVideogallery: function(callback) {
            $http({
                url: adminurl + 'videogallery/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletevideogallery')
                }
            }).success(callback);
        },
        saveVideogallery: function(data, callback) {
            $http({
                url: adminurl + 'videogallery/save',
                method: 'POST',
                data: data
            }).success(callback);
        }, //Add New Service
    }
})
