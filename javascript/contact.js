$(document).ready(function (){
    $("#contactForm").on("submit", function (event) {
        event.preventDefault(); //Prevents the page from refreshing after form is submitted

        //receive and trim input values
        const name=$("#contactName").val().trim();
        const email=$("#contactEmail").val().trim();
        const message=$("#contactMessage").val().trim();

        if (name.length > 50){
            alert("Name cannot exceed 50 characters");
            return;
        }
        if (message.length > 250){
            alert("Name cannot exceed 250 characters");
            return;
        }
        if (email.length > 50){
            alert("Email cannot exceed 50 characters");
            return;
        }

        if(name===""||email===""||message==="") {
            alert("Fill all fields");
            return;
        }

        $("#confirmationText").html(`Thank you, <strong> ${name}</strong> for your message.`);
    
        //Creates and displays the pop up
    const modal =new bootstrap.Modal($("#confirmationModal"));
    modal.show();

    $("#contactForm")[0].reset();
    });
});