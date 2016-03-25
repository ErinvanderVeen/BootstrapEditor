var selectedColumn;
var viewports = ["xs", "sm", "md", "lg"];

$(document).ready(function() {

    /*---[Add our own functions to jQuery]---*/
    // These function are only defined for our specific div object

    // Set the width of the column
    jQuery.fn.setWidth = function (width, viewport) {
        var column = $(this[0]);
        var classList = column.attr("class") != null ? column.attr("class").split(" ") : null;
        $.each(classList, function(index, item) {
            if ((match = /col-..-\d+/.exec(item)) != null) {
                column.removeClass(item);
            }
            for (var i = viewports.indexOf(viewport); i < viewports.length; i++) {
                column.addClass("col-" + viewports[i] + "-" + width);
            }

        });
    }

    // Get the width of the column
    jQuery.fn.getWidth = function () {
        var column = $(this[0]);
        var classList = column.attr("class") != null ? column.attr("class").split(" ") : null;
        var width = 0, viewport = "lg";
        $.each(classList, function(index, item) {
            if ((match = /col-(..)-(\d+)/.exec(item)) != null) {
                viewport = match[1];
                width = match[2];
                return true;
            }
        });
        return [viewport, width];
    }

    // Set the offset of the column
    jQuery.fn.setOffset = function (offset) {
        var column = $(this[0]);
        var classList = column.attr("class") != null ? column.attr("class").split(" ") : null;
        $.each(classList, function(index, item) {
            if (/col-xs-offset-\d+/.test(item)) {
                column.removeClass(item);
            }
        });
        column.addClass("col-xs-offset-" + offset);
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

    $(".custom-menu input[type='checkbox']").change(function() {
        if ($(this).is(":checked")) {
            for (var i = viewports.indexOf($(this).val()); i < viewports.length; i++) {
                $(".custom-menu input[value='" + viewports[i] + "']").prop('checked', true);
            }
        } else {
            for (var i = viewports.indexOf($(this).val()); i >= 0; i--) {
                $(".custom-menu input[value='" + viewports[i] + "']").prop('checked', false);
            }
        }
    });

    $(document).bind("contextmenu", function (e) {
        // Don't allow the browsers to handle the right-click
        e.preventDefault();

        // Get the column
        selectedColumn = $(e.target);

        // Reset the checkboxes
        $(".custom-menu input[type='checkbox']").prop('checked', false);

        var viewport = selectedColumn.getWidth()[0];
        for (var i = viewports.indexOf(viewport); i < viewports.length; i++) {
            $(".custom-menu input[value='" + viewports[i] + "']").prop('checked', true);
        }

        // Load to current values
        $(".custom-menu #size").val(selectedColumn.getWidth()[1]);
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
            var viewport = $(".custom-menu input[type='checkbox']:checked").first().val();
            selectedColumn.setWidth($(".custom-menu #size").val(), viewport);
            selectedColumn.setOffset($(".custom-menu #offset").val());

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

