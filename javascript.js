var selectedColumn;

$(document).ready(function() {
    // Allow all sortable rows to be sortable       
    $(".sortable").sortable();
    // Disallow selection
    $(".sortable").disableSelection();

    $(document).bind("contextmenu", function (e) {
        // Don't allow the browsers to handle the right-click
        e.preventDefault();

        // Get the column
        selectedColumn = $(e.target);

        // Reset the dropdown menu
        $(".custom-menu input[type='checkbox']").prop('checked', false);

        // Load the properties of the column
        // Get classes of the column
        var classList = selectedColumn.attr("class") != null ? selectedColumn.attr("class").split(" ") : null;
        // Prepare Regex (gets size of column)
        var classRegex = /col-(..)-(\d+)/;
        var offsetRegex = /col-..-offset-(\d+)/
        var match;
        $("#offset").val(0);
        // Search for first class that has the size
        $.each(classList, function(index, item) {
            if ((match = classRegex.exec(item)) != null) {
                // Set the dropdown menu to that size
                $("#size").val(match[2]);

                // Check the boxes that need to be checked
                $("input[value='" + match[1] + "']").prop('checked', true);
            } else if ((match = offsetRegex.exec(item)) != null) {
                $("#offset").val(match[1]);
            }
        });

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
        // Get classes of the column
        var classList = selectedColumn.attr("class") != null ? selectedColumn.attr("class").split(" ") : null;
        // Create regexes
        var classRegex = /col-..-(\d+)/;
        var offsetRegex = /col-..-offset-(\d+)/;

        if($(this).attr("data-action") == "apply") {
            $.each(classList, function(index, item) {
                if (classRegex.test(item)) {
                    // Remove previous class
                    selectedColumn.removeClass(item);
                    // Change class to new size and version
                    $(".custom-menu input[type='checkbox']:checked").each(function(index, item) {
                        selectedColumn.addClass("col-" + item.value + "-" + $(".custom-menu #size").val());
                    });
                } else if (offsetRegex.test(item)) {
                    // Remove if offset class
                    selectedColumn.removeClass(item);
                }
            });
            // Add all offset classes
            var newOffset = $(".custom-menu #offset").val();
            if (newOffset > 0) {
                selectedColumn.addClass("col-xs-offset-" + newOffset);
                selectedColumn.addClass("col-sm-offset-" + newOffset);
                selectedColumn.addClass("col-md-offset-" + newOffset);
                selectedColumn.addClass("col-lg-offset-" + newOffset);
            }
        }
        // If delete button is pressed
        else if ($(this).attr("data-action") == "delete") {
            var oldSize = 0;
            var oldOffset = 0;
            $.each(classList, function(index, item) {
                if ((match = classRegex.exec(item)) != null) {
                    // Get the size
                    oldSize = match[2];
                } else if ((match = offsetRegex.exec(item)) != null) {
                    // Get the offset
                    oldOffset = match[2];
                }
            });
            var gap = oldSize + oldOffset;
            var columnList = selectedColumn.parent().children();
            var index = columnList.index(selectedColumn);
            if (columnList.length >= 1) {
                if (index != 0 && index < columnList.length) {
                    
                }
            }
            selectedColumn.remove();
        }

        // Hide it AFTER the action was triggered
        $(".custom-menu").hide(100);
    });

});

