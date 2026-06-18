$(document).ready(function(){
    //loads the navbar
    $("#navbar").load("components/navbar.html", function (){
        //Apply the user's saved preference otherwise, default to dark
        applyTheme(localStorage.getItem("theme") || "dark");
        //Toggles between dark and light mode
        $("#themeToggle").on("click", function() {
            //Checks if light mode is active
            const isLight=$("body").hasClass("light-mode");
            if (isLight){
                localStorage.setItem("theme","dark");
                applyTheme("dark")
            } else{
                localStorage.setItem("theme","light");
                applyTheme("light");
            }
        });
    });
    //loads the footer
    $("#footer").load("components/footer.html");
});
//applies the theme to the website 
function applyTheme(theme){
    if(theme==="light"){
        $("body").addClass("light-mode");
        $("#themeToggle").text("Dark Mode");
    } else{
        $("body").removeClass("light-mode");
        $("#themeToggle").text("Light Mode");
    }
}