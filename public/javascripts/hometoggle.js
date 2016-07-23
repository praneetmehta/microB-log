jQuery(document).ready(function() {
    var id;
    $('.toggle').click(function() {
        id = $(this).attr('id');
        id = id.substring(6);
        if ($('#' + id).attr('readonly')) {
            $('#' + id).attr('readonly', false);
            $('#' + id).focus();
        } else {
            $('#' + id).attr('readonly', true);
        }
    });

});
