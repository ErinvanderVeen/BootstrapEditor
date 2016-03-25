var selectedColumn;

$(document).ready(function() {

    /*---[Add our own functions to jQuery]---*/
    // These function are only defined for our specific div object

    // Set the width of the column
    jQuery.fn.setWidth = function (width) {
        var column = $(this[0]);
        var classList = column.attr("class") != null ? column.attr("class").split(" ") : null;
        $.each(classList, function(index, item) {
            if ((match = /(col-..-)\d+/.exec(item)) != null) {
                // Replace class with new width
                column.switchClass(item, match[1] + width);
            }
        });
    }

    // Get the width of the column
    jQuery.fn.getWidth = function () {
        var column = $(this[0]);
        var classList = column.attr("class") != null ? column.attr("class").split(" ") : null;
        var width = 0;
        $.each(classList, function(index, item) {
            if ((match = /col-..-(\d+)/.exec(item)) != null) {
                width = match[1];
                return true;
            }
        });
        return width;
    }

    // Set the offset of the column
    jQuery.fn.setOffset = function (offset) {
        var column = $(this[0]);
        var classList = column.attr("class") != null ? column.attr("class").split(" ") : null;
        $.each(classList, function(index, item) {
            if (/col-xs-offset-\d+/.test(item)) {
                column.switchClass(item, "col-xs-offset-" + offset);
            }
        });
    }

    // Get the offset of the column
    jQuery.fn.getOffset = function () {
        var column = $(this[0]);
        var classList = column.attr("class") != null ? column.attr("class").split(" ") : null;
        var offset = 0;
        $.each(classList, function(index, item) {
            if ((match = /col-..-offset-(\d+)/.exec(item)) != null) {
                offset = match[1];
                return true;
            }
        });
        return offset;
    }
    /*---[End of our custom functions]---*/
    
    // Allow all sortable rows to be sortable       
    $(".sortable").sortable();
    // Disallow selection
    $(".sortable").disableSelection();

    $(document).bind("contextmenu", function (e) {
        // Don't allow the browsers to handle the right-click
        e.preventDefault();

        // Get the column
        selectedColumn = $(e.target);

        // Reset the checkboxes
        $(".custom-menu input[type='checkbox']").prop('checked', false);

        // Load to current values
        $(".custom-menu #size").val(selectedColumn.getWidth());
        $(".custom-menu #offset").val(selectedColumn.getOffset());

        // Make the right-click-menu appear iff a column was clicked
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

    // If a button is pressed which needs to hide the custom menu
    $(".custom-menu input.hide-menu").click(function(){

        if($(this).attr("data-action") == "apply") {
            selectedColumn.setWidth($(".custom-menu #size").val());
            selectedColumn.setOffset($(".custom-menu #offset").val());
            console.log($(".custom-menu #offset").val());
        }
        // If delete button is pressed
        else if ($(this).attr("data-action") == "delete") {

            //var gap = $(".custom-menu #offset").val() + $(".custom-menu #size").val();
            selectedColumn.remove();
        }

        // Hide it AFTER the action was triggered
        $(".custom-menu").hide(100);
    });

});

