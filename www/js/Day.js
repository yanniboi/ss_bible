var Day = function () {
    
    this.setFromDrupal = function (data) {
        this.title = data.title[0].value;
        this.nid = data.nid[0].value;
        this.body = data.body[0].value;
        this.day = data.field_day_number[0].value;
        this.youtube = data.field_youtube_id[0].value;
    };
    
    this.setFromDb = function (data) {
        this.title = data.title;
        //this.nid = data.nid;
        this.body = data.body;
        this.date = data.date;
        this.day = data.day;
        this.youtube = data.youtube;
    };

    this.initialize = function (values) {
        // Define a div wrapper for the view. The div wrapper is used to attach events.
        //this.el = $('<div/>');
        //this.el.on('keyup', '.search-key', this.findByName);
    };

    this.save = function () {
        var db = window.openDatabase("readingdb", "0.1", "DatabaseForReadings", 1000);
        var values = this;

        db.transaction(function (tx) {
            tx.executeSql("SELECT * FROM days where day = ?",
                [values.day],
                function (tx, results) {
                    if (results.rows.length === 0) {
                        tx.executeSql(
                            "INSERT INTO days (title,day,date,youtube,body) VALUES (?,?, ?, ?, ?)",
                            [values.title, values.day, '1394650272', values.youtube, values.body]
                        );
                    }
                });
        });
    };
    
    this.showVideo = function () {
        var fileUrl = "file:///storage/emulated/0/small.mp4";
        
        var divVid = document.getElementById("video");
        var vidVid = document.createElement("video");
        var sourceVid = document.createElement("source");
        vidVid.setAttribute("class", "video-js vjs-default-skin");
        vidVid.setAttribute("preload", "auto");
        vidVid.setAttribute("controls", "true");
        vidVid.setAttribute("poster", "img/preview.jpg");
        vidVid.setAttribute("data-setup", "{}");
        sourceVid.setAttribute("src", fileUrl);
        sourceVid.setAttribute("type", "video/mp4");
        vidVid.appendChild(sourceVid);
        divVid.appendChild(vidVid);
    };
    
    this.downloadVideo = function () {
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT,
            0,
            function onFileSystemSuccess(fileSystem) {
                fileSystem.root.getFile(
                    "dummy.html",
                    {create: true, exclusive: false},
                    function gotFileEntry(fileEntry) {
                        console.log("Full path:" + fileEntry.fullPath);
                        var sPath = fileEntry.fullPath.replace("dummy.html", "");
                        var fileTransfer = new FileTransfer();
                        fileEntry.remove();

                        fileTransfer.download(
                            "http://techslides.com/demos/sample-videos/small.mp4",
                            fileSystem.root.toURL() + "small.mp4",
                            function (theFile) {
                                console.log("download complete: " + theFile.toURI());
                                showLink(theFile.toURI());
                            },
                            function (error) {
                                console.log("download error source " + error.source);
                                console.log("download error target " + error.target);
                                console.log("upload error code: " + error.code);
                            }
                        );
                    },
                    fail
                );
            },
            fail
        );
    };

};

function fail(evt) {
    console.log(evt.target.error.code);
}


//HomeView.template = Handlebars.compile($("#home-tpl").html());
//HomeView.liTemplate = Handlebars.compile($("#employee-li-tpl").html());