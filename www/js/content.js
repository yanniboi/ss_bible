(function () {
    var app = angular.module('content', []);


    app.controller('HomeController', function () {
        this.content = content;
    });
    
    var content = 
        {
            header: {
                title: "Bible in One Year"
            },
            content: {
                title: "The Bible in One Year with Soul Survivor",
                description: "Share thoughts, reflections and questions as we journey together in reading the Bible In One Year"
            },
            footer: {},
            title: "Welcome"
        };
    
})();
