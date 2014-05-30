jQuery( document ).on( "pagecreate", function() {
    jQuery( document ).on( "swiperight", function() {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( jQuery( ".ui-page-active" ).jqmData( "panel" ) !== "open" ) {
            jQuery( "#externalpanel" ).panel( "open" );
        }
    });
});