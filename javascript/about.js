$(document).ready(function(){
    $(".team-card").hover(
        function(){
        $(this).addClass("active-card");

        },
        function(){
            $(this).removeClass("active-card");
        }
    );
});