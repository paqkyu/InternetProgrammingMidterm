const quoteElement = $("#quote");
const authorElement = $("#author");
const buttonElement = $("#new-quote");
//Retrieves a random quote from an external API displays the quote and author.
//ASYNC- waits for data from somewhere else (API)
async function fetchquote() {
    const url = "https://dummyjson.com/quotes/random";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const result = await response.json();
        quoteElement.text(result.quote);
        authorElement.text(result.author);
        console.log(result);
    } catch (error) {
        console.error("Error fetching quote:", error);
    }
}
buttonElement.on("click", fetchquote); //fetches new quote when button is clicked
fetchquote(); //loads the initial quote