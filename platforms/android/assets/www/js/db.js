$('#reposHome').bind('pageinit', function(event) {
    var db = window.openDatabase("readingdb","0.1","DatabaseForReadings", 1000);
    db.transaction(createDb, txError, txCreateSuccess);
});

function createDb(tx) {
    //Create table for days.
    tx.executeSql("DROP TABLE IF EXISTS days");
    tx.executeSql("CREATE TABLE days(title,day,date,youtube,body)");
    
    /*
    tx.executeSql("INSERT INTO days (day,date,youtube,body) VALUES (1,1394650272,'IjjXEIcbPYA','Hello little ones')");
    tx.executeSql("INSERT INTO days (day,date,youtube,body) VALUES(2,1394736672,'s0vpQ2DyTKY','Not long now')");
    tx.executeSql("INSERT INTO days (day,date,youtube,body) VALUES(3,1394823072,'McfqjEnZLfM','Happy Easter')");
    tx.executeSql("INSERT INTO days (day,date,youtube,body) VALUES(4,1394909472,'0cF-HhunrBI','This one is great')");
    */
    
    //Create table for readings
    tx.executeSql("DROP TABLE IF EXISTS readings");
    tx.executeSql("CREATE TABLE readings(day,reading)");
    
    tx.executeSql("INSERT INTO readings (day,reading) VALUES(1,'1 Kings')");
    tx.executeSql("INSERT INTO readings (day,reading) VALUES(1,'2 Kings')");
    tx.executeSql("INSERT INTO readings (day,reading) VALUES(2,'Gallations')");
    tx.executeSql("INSERT INTO readings (day,reading) VALUES(3,'Corinthians')");
    tx.executeSql("INSERT INTO readings (day,reading) VALUES(3,'John')");
    tx.executeSql("INSERT INTO readings (day,reading) VALUES(3,'Proverbs')");
}

function clearDb(tx) {
    tx.executeSql("DROP TABLE IF EXISTS days");
    tx.executeSql("CREATE TABLE days(title,day,date,youtube,body)");
}

function loadDaysDb(tx) {
    tx.executeSql("SELECT * FROM days",[],txSuccessLoadDays);
}

function loadDayDb(tx, day) {
    tx.executeSql("SELECT * FROM days where day = ?", [day], txSuccessLoadDay);
}


function txSuccessLoadDays(tx,results) {
    console.log("Read success");
    
    if (results.rows.length) {
        var len = results.rows.length;
        var repo;
        for (var i=0; i < len; i = i + 1) {
            repo = results.rows.item(i);
            $("#savedItems").append("<li><a href='repo-detail.html?day=" + repo.day + "'>"
            + "<h4>" + repo.title + "</h4>"
            + "<p>" + repo.body + "</p></a></li>");
        };
        $('#savedItems').listview('refresh');
    }
    else {
        if (navigator.notification)
            navigator.notification.alert("You haven't saved any favorites yet.", alertDismissed);
        else
            alert("You haven't saved any favorites yet.");
    }
}

function txSuccessLoadDay(tx,results) {
    console.log("Read success");
    
    if (results.rows.length) {
        var day = new Day();
        day.setFromDb(results.rows.item(0));
        
        $('#pageTitle').html("Day " + day.day);
        var date = new Date(day.date*1000);
        $('#title').html(day.title);
        $('#date').html(date.toUTCString());
        $('#body').html(day.body);
        $('#youtube').attr('src', "http://www.youtube.com/embed/" + day.youtube + "?wmode=opaque");
        //var button = $('#video-show');
        //var event = day.showVideo();
        $('#video-show').click(day.showVideo);
        $('#video-download').click(day.downloadVideo);

        //$('#repoName').html("<a href='" + repo.homepage + "'>" + repo.name + "</a>");
        //$('#description').text(repo.description);
        //$('#avatar').attr('src', repo.owner.avatar_url);
    }
}

function txError(error) {
    console.log(error);
    console.log("Database error: " + error);
}

function txCreateSuccess() {
    console.log("Successfully created DB");
}

function saveFave() {
    db = window.openDatabase("readingdb","0.1","Database for Readings", 1000);
    db.transaction(saveFaveDb, txError, txSuccessFave);
}

function saveFaveDb(tx) {
    var owner = getUrlVars().owner;
    var name = getUrlVars().name;
        
    tx.executeSql("INSERT INTO repos(user,name) VALUES (?, ?)",[owner,name]);
}

function txSuccessFave() {
    console.log("Save success");
        
    disableSaveButton();
}

function checkFave() {
    db.transaction(checkFaveDb, txError);
}

function checkFaveDb(tx) {
    var owner = getUrlVars().owner;
    var name = getUrlVars().name;
    
    tx.executeSql("SELECT * FROM repos WHERE user = ? AND name = ?",[owner,name],txSuccessCheckFave);
}

function txSuccessCheckFave(tx,results) {
    console.log("Read success");
    //console.log(results);
    
    if (results.rows.length)
        disableSaveButton();
}

function txSuccess() {
    console.log("Success");
}

function txDaySaveSuccess() {
    console.log("Day Success");
}