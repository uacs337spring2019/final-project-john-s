/**
Author: John Stockey
Course: CSc 337
Section: 1

Creates an image of a mug and visually changes in response to actions performed
by the user interacting with the page.
**/
"use strict";

(function() {
    // Global variables.
    // Coffee draw position constants.
    const COFFEE_X = 152;
    const COFFEE_Y = 70;
    const COFFEE_WIDTH = 80;
    // Height for changing based on how much is drunk.
    let coffeeHeight = 50;
    // Coffee's color.
    let coffeeColor = [0,0,0];
    // Coffee's sweetness and creaminess.
    let sugarContent = 0;
    let creamerContent = 0;

    window.onload = function() {
        // Initial user input behaviour.
        let roast = document.getElementsByName("roast");

        for (let i = 0; i < roast.length; i++) {
            roast[i].onclick = validateRoast;
        }

        // Coffee combination get and updates.
        getCombinations();
        setInterval(getCombinations, 20000);
    };


    /**
    Draws the mug filled with the current coffee state.
    **/
    function drawMug() {
        let canvas = document.getElementById("maincanvas");
        let context = canvas.getContext("2d");
        document.getElementById("dynamictext").innerHTML = "";

        context.fillStyle = "rgb(" + coffeeColor[0] + ", " + coffeeColor[1] + ", " +
            coffeeColor[2] + ")";
        // Mug drawing.
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (coffeeHeight > 25) {
            context.beginPath();
            context.ellipse(COFFEE_X, COFFEE_Y, COFFEE_WIDTH, coffeeHeight, 0, Math.PI, 0);
            context.ellipse(COFFEE_X, COFFEE_Y, COFFEE_WIDTH, 32, 0, 0, Math.PI);
            context.fill();
        }
    }

    /**
    Enables a button used to submit a roast type and defines its onclick behaviour.
    Button is enables when a member of the 'roast' name is clicked.
    **/
    function validateRoast() {
        let fillMug = document.getElementById("fillmug");

        // Enable 'fill mug' button.
        if (fillMug.disabled) {
            fillMug.disabled = false;
            fillMug.onclick = pourCoffee;
        }
    }

    /**
    Draws a representation of coffee in a mug onto the canvas.
    **/
    function pourCoffee() {
        let roast = document.getElementsByName("roast");
        coffeeHeight = 50;
        sugarContent = 0;
        creamerContent = 0;
        updateCreamAndSugar();

        // Logic to see the color of the coffee to be filled.
        for (let i = 0; i < roast.length; i++) {
            if (roast[i].checked && roast[i].value === "light") {
                coffeeColor[0] = 162;
                coffeeColor[1] = 114;
                coffeeColor[2] = 80;
            } else if (roast[i].checked && roast[i].value === "medium") {
                coffeeColor[0] = 111;
                coffeeColor[1] = 78;
                coffeeColor[2] = 55;
            } else if (roast[i].checked && roast[i].value === "dark") {
                coffeeColor[0] = 60;
                coffeeColor[1] = 42;
                coffeeColor[2] = 30;
            } else if (roast[i].checked && roast[i].value === "night") {
                coffeeColor[0] = 0;
                coffeeColor[1] = 0;
                coffeeColor[2] = 0;
            }
        }

        // Render the coffee and enable drink options.
        drawMug();
        enableDrinkOptions();
    }

    /**
    Enables various options that allows the user to drink and modify their coffee.
    **/
    function enableDrinkOptions() {
        // Enable the 'take a sip' button.
        let drink = document.getElementById("drink");
        drink.disabled = false;
        drink.onclick = drinkCoffee;

        // Enable 'cream','sugar', 'submit' buttons.
        let cream = document.getElementById("addcream");
        let sugar = document.getElementById("addsugar");
        let post = document.getElementById("submitcombination");

        cream.disabled = false;
        cream.onclick = addCream;

        sugar.disabled = false;
        sugar.onclick = addSugar;

        post.disabled = false;
        post.onclick = postCoffee;
    }

    /**
    Modifies the height of the coffee and renders the new coffee height.
    **/
    function drinkCoffee() {
        let text = document.getElementById("dynamictext");
        let description = "";

        // Lower height of coffee.
        if (coffeeHeight > 25) {
            coffeeHeight -= 5;
            drawMug();

            // Build description based on current coffee conditions.
            description += decideCreaminess();
            description += decideSweetness();
            description += decideTaste();

            // Add the description to the dynamictext.
            text.innerHTML = description;
        } else {
            text.innerHTML = "Nothing left to drink";
        }
    }

    /**
    Creaminess determination logic.
    **/
    function decideCreaminess() {
        let description = "";

        if (creamerContent >= 3 && creamerContent <= 10) {
            description = "Mmm, nice and creamy. ";
        } else if (creamerContent > 10) {
            description = "Nothing like a cup of half-and-half in the morning. ";
        }

        return description;
    }

    /**
    Sweetness determination logic.
    **/
    function decideSweetness() {
        let description = "";

        if (sugarContent >= 2 && sugarContent <= 5) {
            description = "A robust sweetness. ";
        } else if (sugarContent > 5 && sugarContent <= 10) {
            description = "Pretty sweet. ";
        } else if (sugarContent > 10) {
            description = "I can taste the sugar. ";
        }

        return description;
    }

    /**
    Overall coffee taste determination logic.
    **/
    function decideTaste() {
        let description = "";

        if (coffeeColor[0] === 0) {
            description = "Tastes like the bittersweet night.";
        } else if (sugarContent > 10 || creamerContent > 10) {
            description = "Tastes a little overbearing.";
        } else {
            description = "Tastes like coffee.";
        }

        return description;
    }

    /**
    Lightens the color of the coffee and renders the new coffee appearance.
    'Night' coffee displays special text and is unchanged.
    **/
    function addCream() {
        let text = document.getElementById("dynamictext");
        let choiceText = "";

        if (coffeeColor[0] !== 0 && coffeeHeight > 25) {
            coffeeColor[0] += 10;
            coffeeColor[1] += 10;
            coffeeColor[2] += 10;
            creamerContent += 1;

            // Increase amount if less than 50.
            if (coffeeHeight < 50) {
                coffeeHeight += 5;
            }

            // Render the new mug.
            drawMug();
        } else if (coffeeColor[0] === 0 && coffeeHeight > 25) { // Special 'night' coffee case.
            let choice = Math.floor(Math.random() * 3);

            // Logic for which text to be diplayed.
            if (choice === 0) {
                choiceText = "Night is eternal";
            } else if (choice === 1) {
                choiceText = "This creamer is almost as dark as my soul";
            } else {
                choiceText = "You can't change who I am!";
            }
        }
        // Either change text to a random set, or reset it to nothing.
        text.innerHTML = choiceText;
        // Update display.
        updateCreamAndSugar();
    }

    /**
    Adjusts a global variable that keeps track of the coffee's sweetness.
    **/
    function addSugar() {
        document.getElementById("dynamictext").innerHTML = "";
        if (coffeeHeight > 25) {
            sugarContent += 1;
            updateCreamAndSugar();
        }
    }

    /**
    Update cream and sugar display on page.
    **/
    function updateCreamAndSugar() {
        // Update cream count on page.
        document.getElementById("creamercount").innerHTML = "Cream: " + creamerContent;
        // Update sugar count on page.
        document.getElementById("sugarcount").innerHTML = "Sugar: " + sugarContent;
    }

    /**
    Acquires given name and current coffee state. Posts it to coffee_service.js.
    **/
    function postCoffee() {
        let name = document.getElementById("coffeetitle");
        let combo = {};
        let text = document.getElementById("dynamictext");

        // Build JSON.
        combo["name"] = name.value;
        combo["color"] = coffeeColor;
        combo["sugar"] = sugarContent;
        combo["cream"] = creamerContent;

        // Conditional for adding a post.
        if (name.value !== "") {
            // Clear name.
            name.value = "";
            let url = "https://coffeemakerservice.herokuapp.com:process.env.PORT/";
            // Build the fetchOptions to be used.
            let fetchOptions = {
                method : 'POST',
                headers : {
                    'Accept': 'application/json',
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(combo)
            };
            // Attempt to post the message.
            fetch(url, fetchOptions)
                .then(checkStatus)
                .then(function(responseText) {
                    text.innerHTML = responseText;
    		})
    		.catch(function(error) {
    			text.innerHTML = error;
    		});
        }
    }

    /**
    Clears out the existing combinations and adds in all posted/stored combos.
    **/
    function getCombinations() {
        let url = "https://coffeemakerservice.herokuapp.com:process.env.PORT/";
        let postSection = document.getElementById("postsection");
        // Empty out postsection.
        document.getElementById("postsection").innerHTML = "";

        // Set up postsection.
        fetch(url)
            .then(checkStatus)
            .then(function(responseText) {
                let json = JSON.parse(responseText);
                let posts = json["combos"];

                // Build and add post divs using posts content.
                for (let i = 0; i < posts.length; i++) {
                    let postDiv = document.createElement("div");
                    let name = document.createElement("h3");
                    let cream = document.createElement("p");
                    let sugar = document.createElement("p");
                    let tryButton = document.createElement("button");

                    // Cream, sugar, and color variables.
                    let creamAmount = parseInt(posts[i]["cream"]);
                    let sugarAmount = parseInt(posts[i]["sugar"]);
                    let colorList = posts[i]["color"].split(",");
                    let color = [];
                     color[0] = parseInt(colorList[0]);
                     color[1] = parseInt(colorList[1]);
                     color[2] = parseInt(colorList[2]);

                    // HTML and CSS setup.
                    postDiv.className = "post";
                    name.innerHTML = posts[i]["name"];
                    cream.innerHTML = "Creaminess: " + creamAmount;
                    sugar.innerHTML = "Sweetness: " + sugarAmount;
                    tryButton.innerHTML = "Try it";

                    // tryButton click behaviour.
                    tryButton.type = "button";
                    tryButton.onclick = function() {
                        coffeeColor = color;
                        creamerContent = creamAmount;
                        sugarContent = sugarAmount;
                        coffeeHeight = 50;
                        drawMug();
                        enableDrinkOptions();
                        updateCreamAndSugar();
                    };

                    // Append objects.
                    postDiv.appendChild(name);
                    postDiv.appendChild(cream);
                    postDiv.appendChild(sugar);
                    postDiv.appendChild(tryButton);
                    postSection.appendChild(postDiv);
                }
            });
    }

    /**
    Returns the response text if the status is in the 200s,
    otherwise rejects the promise with a message including the status.
    **/
    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response.text();
        } else {
            return Promise.reject(new Error(response.text()));
        }
    }
})();
