$(document).ready(function() {
    // Allow all sortable rows to be sortable       
    $(".sortable").sortable();
    // Disallow selection
    $(".sortable").disableSelection();

    $(document).bind("contextmenu", function (e) {
        // Don't allow the browsers to handle the right-click
        e.preventDefault();

        // Make the right-click-menu appear iff a block was clicked
        if ($(e.target).parents(".row").length > 0) {
            $(".custom-menu").finish().toggle(100).css({
                left: e.pageX + "px",
                top: e.pageY + "px"
            });
        }
    });

    // Function to hide the menu
    $(document).bind("mousedown", function (e) {
        // If the menu itself was clicked
        if (!$(e.target).parents(".custom-menu").length > 0) {

            // Hide it
            $(".custom-menu").hide();
        }
    });

    // If the apply button is clicked
    $(".custom-menu input.hide-menu").click(function(){
        if($(this).attr("data-action") == "apply") {
            alert($("#size").val());
        }

        // Hide it AFTER the action was triggered
        $(".custom-menu").hide(100);
    });

});

