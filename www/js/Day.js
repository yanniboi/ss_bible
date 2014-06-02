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
        this.download = data.download;
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
                            "INSERT INTO days (title,day,date,youtube,body,download) VALUES (?,?, ?, ?, ?, ?)",
                            [values.title, values.day, '1394650272', values.youtube, values.body, 0]
                        );
                    }
                });
        });
    };
    
    this.hasFile = function (day) {
        
    
    };
    
    this.showVideo = function (day) {
        var fileUrl = "file:///storage/emulated/0/" + day.data + ".mp4";
        
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
        $(divVid).html(vidVid);
    };
    
    this.downloadVideo = function (day) {
        $('#download-progress').html("Download " + day.data + " Started");
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
                        
                        var progress = $('#download-progress');
                        progress.html('');
                        
                        fileTransfer.onprogress = function (progressEvent) {
                            if (progressEvent.lengthComputable) {
                                var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                                progress.html(perc + "% Downloaded...");
                            } else {
                                if (progress.html() === "") {
                                    progress.html("Downloading");
                                } else {
                                    progress.html().append(".");
                                }
                            }
                        };

                        fileTransfer.download(
                            "http://bible.soulsurvivor.com/sites/default/files/" + day.data + ".mp4",
                            //"http://techslides.com/demos/sample-videos/small.mp4",

                            fileSystem.root.toURL() + day.data + ".mp4",
                            function (theFile) {
                                $('#download-progress').html("Download Finished");
                                $('#video-show').css("display", "block");
                                $('#video-download').css("display", "none");
                                
                                var db = window.openDatabase("readingdb", "0.1", "DatabaseForReadings", 1000);
                                db.transaction(function (tx) {
                                    tx.executeSql(
                                        "UPDATE days SET download = 1 WHERE day = ? ;",
                                        [day.data],
                                        function (tx, results) {console.log("database download bool updated"); },
                                        function (tx, error) {console.log("database download bool failed! error - ") ;}
                                    );
                                });
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