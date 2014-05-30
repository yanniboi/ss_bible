var Day = function (data) {
    this.title = data.title[0].value;
    this.nid = data.nid[0].value;
    this.body = data.body[0].value;
    this.day = data.field_day_number[0].value;
    this.youtube = data.field_youtube_id[0].value;

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

};





//HomeView.template = Handlebars.compile($("#home-tpl").html());
//HomeView.liTemplate = Handlebars.compile($("#employee-li-tpl").html());