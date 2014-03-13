$('#reposHome').bind('pageinit', function(event) {
    //loadRepos();
    loadDays();
});

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
    db.transaction(loadDaysDb, txError, txSuccess);
});

function loadPanelDb(tx) {
    tx.executeSql("SELECT * FROM days",[],txSuccessLoadPanel);
}

function txSuccessLoadPanel(tx,results) {
    console.log("Read success");
    
    if (results.rows.length) {
        var len = results.rows.length;
        var repo;
        for (var i=0; i < len; i = i + 1) {
            repo = results.rows.item(i);
            console.log(repo);
            $("#allRepos").append("<li><a href='repo-detail.html?day=" + repo.day + "'>"
            + "<h4>Day " + repo.day + " - " + repo.date + "</h4>"
            + "<p>" + repo.body + "</p></a></li>");
        };
        $('#allRepos').listview('refresh');
        $("[data-role='panel']").panel().enhanceWithin();
    }
}

function loadDays() {
    var db = window.openDatabase("readingdb","0.1","DatabaseForReadings", 1000);
    db.transaction(loadPanelDb, txError, txSuccess);
}


function loadRepos() {
    $.ajax("https://api.github.com/legacy/repos/search/javascript").done(function(data) {
        var i, repo;
        $.each(data.repositories, function (i, repo) {
            $("#allRepos").append("<li><a href='repo-detail.html?owner=" + repo.username + "&name=" + repo.name + "'>"
            + "<h4>" + repo.name + "</h4>"
            + "<p>" + repo.username + "</p></a></li>");
        });
        $('#allRepos').listview('refresh');
        $("[data-role='panel']").panel().enhanceWithin();
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