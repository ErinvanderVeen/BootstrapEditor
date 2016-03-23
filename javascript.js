var selectedBlock;

$(document).ready(function() {
    // Allow all sortable rows to be sortable       
    $(".sortable").sortable();
    // Disallow selection
    $(".sortable").disableSelection();

    $(document).bind("contextmenu", function (e) {
        // Don't allow the browsers to handle the right-click
        e.preventDefault();

        // Get the block
        selectedBlock = $(e.target);

        // Reset the dropdown menu
        $(".custom-menu input[type='checkbox']").prop('checked', false);

        // Load the properties of the block
        // Get classes of the block
        var classList = selectedBlock.attr("class") != null ? selectedBlock.attr("class").split(" ") : null;
        // Prepare Regex (gets size of block)
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

    // If a button is pressed which needs to hide the custom menu
    $(".custom-menu input.hide-menu").click(function(){
        if($(this).attr("data-action") == "apply") {
            // Get classes of the block
            var classList = selectedBlock.attr("class") != null ? selectedBlock.attr("class").split(" ") : null;
            // Grab the part that must (not yet) change
            classRegex = /col-..-\d+/;
            var offsetRegex = /col-..-offset-\d+/
            $.each(classList, function(index, item) {
                if (classRegex.test(item)) {
                    // Remove previous class
                    selectedBlock.removeClass(item);
                    // Change class to new size and version
                    $(".custom-menu input[type='checkbox']:checked").each(function(index, item) {
                        selectedBlock.addClass("col-" + item.value + "-" + $(".custom-menu #size").val());
                    });
                } else if (offsetRegex.test(item)) {
                    // Remove if offset class
                    selectedBlock.removeClass(item);
                }
            });
            // Add all offset classes
            var newOffset = $(".custom-menu #offset").val();
            if (newOffset > 0) {
                selectedBlock.addClass("col-xs-offset-" + newOffset);
                selectedBlock.addClass("col-sm-offset-" + newOffset);
                selectedBlock.addClass("col-md-offset-" + newOffset);
                selectedBlock.addClass("col-lg-offset-" + newOffset);
            }
        }
        // If delete button is pressed
        else if ($(this).attr("data-action") == "delete") {
            selectedBlock.remove();
        }

        // Hide it AFTER the action was triggered
        $(".custom-menu").hide(100);
    });

});

