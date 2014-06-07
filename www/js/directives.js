angular.module( 'bioy.directives', [] ).directive('videojs', function () {
    var linker = function (scope, element, attrs){
        attrs.type = attrs.type || "video/mp4";

        var width = window.innerWidth - 20;

        var setup = {
            'techOrder' : ['html5', 'flash'],
            'controls' : true,
            'preload' : 'auto',
            'autoplay' : true,
            'height' : 480,
            'width' : width
        };

        var videoid = attrs.videoid;
        attrs.id = "videojs" + videoid;
        element.attr('id', attrs.id);
        element.attr('poster', "http://www.hare-hill.co.uk/pics/bunnies/previous%20bunnies/Honey%20bunny.jpg");
        var player = _V_(attrs.id, setup, function(){
            var source =([{
                type:"video/mp4",
                src:"http://bible.soulsurvivor.com/sites/default/files/" + videoid + ".mp4"
                //src:"http://techslides.com/demos/sample-videos/small.mp4"
            }]);
            this.src({type : attrs.type, src: source });
        });
    }
    return {
        restrict : 'A',
        link : linker
    };
});