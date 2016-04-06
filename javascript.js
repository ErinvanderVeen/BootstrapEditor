var selectedColumn;
var viewports = ["xs", "sm", "md", "lg"];

function applyChanges() {
    var viewport = $(".custom-menu input[type='checkbox']:checked").first().val();
    selectedColumn.setWidth($(".custom-menu #size").val(), viewport);
    selectedColumn.setOffset($(".custom-menu #offset").val());
}

$(document).ready(function() {

    /*---[Add our own functions to jQuery]---*/
    // These function are only defined for our specific div object

    // Set the width of the column
    jQuery.fn.setWidth = function (width, viewport) {
        var column = $(this[0]);
        var classList = column.attr("class") != null ? column.attr("class").split(" ") : null;
        $.each(classList, function(index, item) {
            // Remove all old classes
            if ((match = /col-..-\d+/.exec(item)) != null) {
                column.removeClass(item);
            }
        });
        // Load only the lg if no viewports are selected
        var i = viewports.indexOf(viewport);
        if(i == -1) {
            $(".custom-menu input[value='lg']").prop('checked', true);
            i = viewports.length-1;
        }
        // Add all new classes
        for ( ; i < viewports.length; i++) {
            column.addClass("col-" + viewports[i] + "-" + width);
        }
    }

    // Get the width of the column
    jQuery.fn.getWidth = function () {
        var column = $(this[0]);
        var classList = column.attr("class") != null ? column.attr("class").split(" ") : null;
        // Default values
        var width = 0, viewport = "lg";
        $.each(classList, function(index, item) {
            // Capture the values we need
            if ((match = /col-(..)-(\d+)/.exec(item)) != null) {
                viewport = viewports.indexOf(match[1]) < viewports.indexOf(viewport) ? match[1] : viewport;
                width = match[2];
            }
        });
        // Return a tuple (array)
        return [viewport, width];
    }

    // Set the offset of the column
    jQuery.fn.setOffset = function (offset) {
        var column = $(this[0]);
        var classList = column.attr("class") != null ? column.attr("class").split(" ") : null;
        // Remove all old classes
        $.each(classList, function(index, item) {
            if (/col-xs-offset-\d+/.test(item)) {
                column.removeClass(item);
            }
        });
        // We need only add 1 class since all higher viewports default to lower offset
        column.addClass("col-xs-offset-" + offset);
    }

    // Get the offset of the column
    jQuery.fn.getOffset = function () {
        var column = $(this[0]);
        var classList = column.attr("class") != null ? column.attr("class").split(" ") : null;
        var offset = 0;
        // Find the offset and capture it
        $.each(classList, function(index, item) {
            if ((match = /col-..-offset-(\d+)/.exec(item)) != null) {
                offset = match[1];
                // There should only be 1 offset class. We can return true to exit the loop
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

    // Check / uncheck all checkboxes under/above the clicked one to
    // make it obvious that sizes for higher viewports
    // are inherited from lower ones.
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
        // Apply changes
        applyChanges();
    });

    $(".custom-menu select").change(function() {
        // Apply changes
        applyChanges();
    });

    $(".row div").bind("contextmenu", function (e) {
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
            $(".custom-menu").finish().toggle(100).css({
                left: e.pageX + "px",
                top: e.pageY + "px"
            });
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

        // If the auto update did not work, the user can still apply
        if($(this).attr("data-action") == "apply") {
            applyChanges();
        }
        // If delete button is pressed
        // This part is rather a mess because there are 3 possible situations:
        // The selectedColumn has only a left neighbour
        // Only a right neighbour
        // Or both a left and a right neighbour
        else if ($(this).attr("data-action") == "delete") {
            // Calculate the gap that would be created upon deletion
            var gap = parseInt(selectedColumn.getWidth()[1]) + parseInt(selectedColumn.getOffset());
            var divs = selectedColumn.parent().children();
            var index = divs.index(selectedColumn);

            // Case 1
            if (index == 0 && index != divs.length){
                $(divs[1]).setWidth(gap + parseInt($(divs[1]).getWidth()[1]), $(divs[1]).getWidth()[0]);
            }
            // Case 2
            else if (index != 0 && index == divs.length-1) {
                $(divs[index-1]).setWidth(gap + parseInt($(divs[index-1]).getWidth()[1]), $(divs[index-1]).getWidth()[0]);
            }
            // Case 3
            else if (index != 0 && index != divs.length-1) {
                $(divs[index-1]).setWidth(Math.floor(gap/2) + parseInt($(divs[index-1]).getWidth()[1]), $(divs[index-1]).getWidth()[0]);
                $(divs[index+1]).setWidth(Math.ceil(gap/2) + parseInt($(divs[index+1]).getWidth()[1]), $(divs[index+1]).getWidth()[0]);
            }
            // Finally remove the collumn
            selectedColumn.remove();
        }

        // Hide it AFTER the action was triggered
        $(".custom-menu").hide(100);
    });

});

