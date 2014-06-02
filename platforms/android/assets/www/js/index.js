$('#reposHome').bind('pageinit', function (event) {
    //loadRepos();
    loadDays();
    console.log("prelistener");
    document.addEventListener('deviceready', registerPushNotification, false);
});

function registerPushNotification () {
    console.log("prepush");
    var pushNotification = window.plugins.pushNotification;
    pushNotification.register(app.successHandler, app.errorHandler, {"senderID" : "980621160609", "ecb" : "app.onNotificationGCM"});
}

function successHandler (result) {
    console.log('Callback Success! Result = ' + result)
}

function errorHandler (error) {
    console.log("push fail");
}

function onNotificationGCM (e) {
    console.log("notify");
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                console.log("Regid " + e.regid);
                window.open('mailto:yan@yanniboi.com?subject=register&body=' + e.regid);
            }
        break;

        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = '+e.message+' msgcnt = '+e.msgcnt);
        break;

        case 'error':
          alert('GCM error = '+e.msg);
        break;

        default:
          alert('An unknown GCM event has occurred');
          break;
    }
}

function alertDismissed() {
    $.mobile.changePage("index.html");
}

function disableSaveButton() {
    // change the button text and style
    var ctx = $("#saveBtn").closest(".ui-btn");
    $('span.ui-btn-text',ctx).text("Saved").closest(".ui-btn-inner").addClass("ui-btn-up-b");
    
    $("#saveBtn").unbind("click", saveFave);
}

$('#favesHome').live('pageshow', function(event) {
    var db = window.openDatabase("readingdb","0.1","DatabaseForReadings", 1000);
    db.transaction(loadDaysDb, txError  , txSuccess);
});

function loadPanelDb(tx) {
    tx.executeSql("SELECT * FROM days",[],txSuccessLoadPanel);
}

function txSuccessLoadPanel(tx,results) {
    var panel = $("#allRepos");
    panel.html('');
    
    if (results.rows.length) {

        var len = results.rows.length;
        var repo;
        for (var i=0; i < len; i = i + 1) {
            repo = results.rows.item(i);
            panel.append("<li><a href='repo-detail.html?day=" + repo.day + "'>"
            + "<h4>" + repo.title + "</h4>"
            + "<p>" + repo.body + "</p></a></li>");
        };
        panel.listview('refresh');
        $("[data-role='panel']").panel().enhanceWithin();
    }
}

function loadDays() {
    var db = window.openDatabase("readingdb","0.1","DatabaseForReadings", 1000);
    db.transaction(loadPanelDb, txError, txSuccess);
}


function loadRepos() {
    $.ajax({
            url: "http://bible.soulsurvivor.com/rest/views/days",
            headers : {"Accept" : "application/json"}
        }).done(function(data) {
        var i, repo;
        $.each(data, function (i, repo) {
            var day = new Day();
            day.setFromDrupal(repo);
            day.save();
        });
    });
}

$('#reposDetail').live('pageshow', function(event) {
    var day = getUrlVars().day;
    loadDayDetail(day);
    //checkFave();
    //$("#saveBtn").bind("click", saveFave);
});

function loadDayDetail(day) {
    //Get from sql
    var db = window.openDatabase("readingdb","0.1","DatabaseForReadings", 1000);
    db.transaction(function(tx){ loadDayDb(tx, day) }, txError, txSuccess);
    //Build page
    
}


function getUrlVars() {
    var vars = [], hash;    
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function clearDatabase() {
    var db = window.openDatabase("readingdb","0.1","DatabaseForReadings", 1000);
    db.transaction(clearDb, txError, txCreateSuccess);
}

function refreshDatabase() {
    var db = window.openDatabase("readingdb","0.1","DatabaseForReadings", 1000);
    //db.transaction(createDb, txError, txCreateSuccess);
    loadRepos();
}

$('#db-delete').click(clearDatabase);
$('#db-refresh').click(refreshDatabase);
$('#browser').click(loadDays);