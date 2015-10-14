// var adminurl = "http://localhost:1337/";
var adminurl = "http://119.18.48.125:81/";
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
            name: 'Articles',
            active: '',
            link: '#/articles',
            subnav: []
        }, {
            name: 'Team',
            active: '',
            link: '#/team',
            subnav: []
        }, {
            name: 'Sports',
            active: '',
            link: '#/sports',
            subnav: []
        }, {
            name: 'News',
            active: '',
            link: '#/news',
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
            name: 'Folder',
            active: '',
            link: '#/folder',
            subnav: []
        }, {
            name: 'Sponsors',
            active: '',
            link: '#/sponsors',
            subnav: []
        }, {
            name: 'Ads',
            active: '',
            link: '#/ads',
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
        adminLogin: function (data, callback) {
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
            $http.get(adminurl + "user/countusers").success(callback);
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
        saveArea: function(data, callback) {
            $http({
                url: adminurl + 'area/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findArea: function(data, area, callback) {
            $http({
                url: adminurl + 'area/find',
                method: 'POST',
                data: {
                    search: data,
                    area: area
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
        getSports: function(callback) {
            $http({
                url: adminurl + 'sports/find',
                method: 'POST',
                data: {}
            }).success(callback);
        },
        saveVolunteers: function(data, callback) {
            $http({
                url: adminurl + 'volunteers/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findVolunteers: function(data, volunteers, callback) {
            $http({
                url: adminurl + 'volunteers/find',
                method: 'POST',
                data: {
                    search: data,
                    volunteers: volunteers
                }
            }).success(callback);
        },
        getOneArticles: function(id, callback) {
            $http({
                url: adminurl + 'articles/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedArticles: function(articles, callback) {
            $http({
                url: adminurl + 'articles/findlimited',
                method: 'POST',
                data: {
                    'search': articles.search,
                    'pagesize': parseInt(articles.limit),
                    'pagenumber': parseInt(articles.page)
                }
            }).success(callback);
        },
        deleteArticles: function(callback) {
            $http({
                url: adminurl + 'articles/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletearticles')
                }
            }).success(callback);
        },
        saveArticles: function(data, callback) {
            $http({
                url: adminurl + 'articles/save',
                method: 'POST',
                data: data
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
        getOneSports: function(id, callback) {
            $http({
                url: adminurl + 'sports/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedSports: function(sports, callback) {
            $http({
                url: adminurl + 'sports/findlimited',
                method: 'POST',
                data: {
                    'search': sports.search,
                    'pagesize': parseInt(sports.limit),
                    'pagenumber': parseInt(sports.page)
                }
            }).success(callback);
        },
        deleteSports: function(callback) {
            $http({
                url: adminurl + 'sports/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletesports')
                }
            }).success(callback);
        },
        saveSports: function(data, callback) {
            $http({
                url: adminurl + 'sports/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        saveSubSports: function(data, callback) {
            $http({
                url: adminurl + 'subsports/save',
                method: 'POST',
                data: {
                    'name': data.name
                }
            }).success(callback);
        },
        findSubSports: function(data, subsports, callback) {
            $http({
                url: adminurl + 'subsports/find',
                method: 'POST',
                data: {
                    search: data,
                    subsports: subsports
                }
            }).success(callback);
        },
        getOneNews: function(id, callback) {
            $http({
                url: adminurl + 'news/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedNews: function(news, callback) {
            $http({
                url: adminurl + 'news/findlimited',
                method: 'POST',
                data: {
                    'search': news.search,
                    'pagesize': parseInt(news.limit),
                    'pagenumber': parseInt(news.page)
                }
            }).success(callback);
        },
        deleteNews: function(callback) {
            $http({
                url: adminurl + 'news/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletenews')
                }
            }).success(callback);
        },
        saveNews: function(data, callback) {
            $http({
                url: adminurl + 'news/save',
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
        getTeam: function(callback) {
            $http({
                url: adminurl + 'team/find',
                method: 'POST',
                data: {}
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
        getOneSponsors: function(id, callback) {
            $http({
                url: adminurl + 'sponsors/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedSponsors: function(sponsors, callback) {
            $http({
                url: adminurl + 'sponsors/findlimited',
                method: 'POST',
                data: {
                    'search': sponsors.search,
                    'pagesize': parseInt(sponsors.limit),
                    'pagenumber': parseInt(sponsors.page)
                }
            }).success(callback);
        },
        deleteSponsors: function(callback) {
            $http({
                url: adminurl + 'sponsors/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deletesponsors')
                }
            }).success(callback);
        },
        saveSponsors: function(data, callback) {
            $http({
                url: adminurl + 'sponsors/save',
                method: 'POST',
                data: data
            }).success(callback);
        },
        getOneAds: function(id, callback) {
            $http({
                url: adminurl + 'ads/findone',
                method: 'POST',
                data: {
                    '_id': id
                }
            }).success(callback);
        },
        findLimitedAds: function(ads, callback) {
            $http({
                url: adminurl + 'ads/findlimited',
                method: 'POST',
                data: {
                    'search': ads.search,
                    'pagesize': parseInt(ads.limit),
                    'pagenumber': parseInt(ads.page)
                }
            }).success(callback);
        },
        deleteAds: function(callback) {
            $http({
                url: adminurl + 'ads/delete',
                method: 'POST',
                data: {
                    '_id': $.jStorage.get('deleteads')
                }
            }).success(callback);
        },
        saveAds: function(data, callback) {
            $http({
                url: adminurl + 'ads/save',
                method: 'POST',
                data: data
            }).success(callback);
        }, //Add New Service

    }
})
