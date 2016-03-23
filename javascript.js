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
        var classRegex = /col-(..)-(\d+)/g;
        // Search for first class that has the size
        $.each(classList, function(index, item) {
            var match = classRegex.exec(item);
            if (match != null) {
                // Set the dropdown menu to that size
                $("#size").val(match[2]);

                // Check the boxes that need to be checked
                $("input[value='" + match[1] + "']").prop('checked', true);
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

    // If the apply button is clicked
    $(".custom-menu input.hide-menu").click(function(){
        if($(this).attr("data-action") == "apply") {
            // Get classes of the block
            var classList = selectedBlock.attr("class") != null ? selectedBlock.attr("class").split(" ") : null;
            // Grab the part that must (not yet) change
            var classRegex = /col-(..)-\d+/g;
            $.each(classList, function(index, item) {
                var match = classRegex.exec(item);
                if (match != null) {
                    selectedBlock.removeClass(item);
                    // Change class to new size.
                    selectedBlock.addClass("col-" + match[1] + "-" + $("#size").val());
                }
            });
        }

        // Hide it AFTER the action was triggered
        $(".custom-menu").hide(100);
    });

});

