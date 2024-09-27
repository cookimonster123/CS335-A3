const home = document.getElementById("home");
const guestbook = document.getElementById("guestbook");
const nzsl = document.getElementById("nzsl");
const events = document.getElementById("events");
const registration = document.getElementById("registration");
const login = document.getElementById("login");
const loginInfo = document.getElementById("loginInfo");
const loginButton = document.getElementById("loginButton");
const commentButton = document.getElementById("commentButton");

const showHome = document.getElementById("menu1");
const showGuestbook = document.getElementById("menu2");
const showNzsl = document.getElementById("menu3");
const showEvents = document.getElementById("menu4");
const showRegistration = document.getElementById("menu5");
const showLogin = document.getElementById("menu6");
const logout = document.getElementById("menu7")

const displayHome = () => {
    home.style.display = "block";
    guestbook.style.display = "none";
    nzsl.style.display = "none";
    events.style.display = "none";
    registration.style.display = "none";
    login.style.display = "none";
}
const displayGuestbook = () => {
    home.style.display = "none";
    guestbook.style.display = "block";
    nzsl.style.display = "none";
    events.style.display = "none";
    registration.style.display = "none";
    login.style.display = "none";
}
const displayNzsl = () => {
    home.style.display = "none";
    guestbook.style.display = "none";
    nzsl.style.display = "flex";
    events.style.display = "none";
    registration.style.display = "none";
    login.style.display = "none";
}
const displayEvents = () => {
    home.style.display = "none";
    guestbook.style.display = "none";
    nzsl.style.display = "none";
    events.style.display = "block";
    registration.style.display = "none";
    login.style.display = "none";
}
const displayRegistration = () => {
    home.style.display = "none";
    guestbook.style.display = "none";
    nzsl.style.display = "none";
    events.style.display = "none";
    registration.style.display = "block";
    login.style.display = "none";
}
const displayLogin = () => {
    home.style.display = "none";
    guestbook.style.display = "none";
    nzsl.style.display = "none";
    events.style.display = "none";
    registration.style.display = "none";
    login.style.display = "block";
}

showHome.addEventListener("click", displayHome);
showGuestbook.addEventListener("click", displayGuestbook);
showNzsl.addEventListener("click", displayNzsl);
showEvents.addEventListener("click", displayEvents);
showRegistration.addEventListener("click",displayRegistration);
showLogin.addEventListener("click", displayLogin);

displayHome()


// log in
const f_login = async () => {
    const usernameLogin = document.getElementById("username_login").value;
    const passwordLogin = document.getElementById("password_login").value;

    const credentials = btoa(`${usernameLogin}:${passwordLogin}`);
    try {
        const authResponse = await fetch('https://cws.auckland.ac.nz/nzsl/api/TestAuth', {
            method: "GET",
            headers: {
                "Authorization": `Basic ${credentials}` // Basic Auth
            }
        });

        if (authResponse.ok) {
            document.getElementById("loginMsg").textContent = `Welcome, ${usernameLogin}`;
            localStorage.setItem('username', usernameLogin);
            localStorage.setItem('password', passwordLogin);
            localStorage.setItem('isLoggedIn', 'true'); // Store login state
            loginInfo.style.color = "black";
            document.getElementById("loginInfo").textContent = `Welcome, ${localStorage.getItem('username')}`;
        } else {
            document.getElementById("loginMsg").textContent = `Login Failed, Status Code: ${authResponse.status}`;
        }
    } catch (error) {
        document.getElementById("loginMsg").textContent = `Error occurred during login: ${error}`;
    }
} 
loginButton.addEventListener("click", f_login);


// log out
const f_logout = () => {
    if (localStorage.getItem('isLoggedIn') === 'false') {
        loginInfo.style.color = "red";
    } else {
        localStorage.setItem('isLoggedIn', 'false');
        document.getElementById("loginInfo").textContent = "Not Logged In";
        document.getElementById("loginMsg").textContent = "";
        // might need to clear username and password in localstorage too
    }
}
logout.addEventListener("click", f_logout)


const checkLoginStatus = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        document.getElementById("loginInfo").textContent = `Welcome, ${localStorage.getItem('username')}`;
    } else {
        document.getElementById("loginInfo").textContent = "Not Logged In";
    }
}
// Check login status when the page loads
window.onload = checkLoginStatus;


// NZSL
// Get the search bar and container elements
const searchBar = document.getElementById('searchBar');
const signsContainer = document.getElementById('signsContainer');

// Function to display signs
function displaySigns(signs) {
    // Clear the current signs
    signsContainer.innerHTML = '';

    // Loop through the signs and display them
    signs.forEach(sign => {
        // Fetch and display the image for each sign
        fetch('https://cws.auckland.ac.nz/nzsl/api/SignImage/' + sign.id)
            .then(response => response.blob())
            .then(imageBlob => {
                const imageUrl = URL.createObjectURL(imageBlob);
                const signDiv = document.createElement('div');
                signDiv.classList.add('signImage');

                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = sign.id;
                imgElement.width = 100;

                // Create a div for each sign and append it
                signDiv.innerHTML = `<strong>${sign.id}: ${sign.description}</strong>`;
                signDiv.appendChild(imgElement);
                signsContainer.appendChild(signDiv);
            })
            .catch(error => console.error('Error fetching sign image:', error));
    });
}

// searching
function searchSigns(searchTerm) {
    // Make a request to the search endpoint with the searchTerm
    fetch(`https://cws.auckland.ac.nz/nzsl/api/Signs/${searchTerm}`)
        .then(response => response.json())
        .then(signs => {
            displaySigns(signs); // Display the results
        })
        .catch(error => console.error('Error fetching search results:', error));
}

// Event listener for the search bar
searchBar.addEventListener('input', (event) => {
    const searchTerm = event.target.value.trim();

    // Only search if there's some input
    if (searchTerm.length > 0) {
        searchSigns(searchTerm);
    } else {
        // If the search bar is cleared, fetch all signs again
        fetch('https://cws.auckland.ac.nz/nzsl/api/AllSigns')
            .then(response => response.json())
            .then(signs => {
                displaySigns(signs);
            })
            .catch(error => console.error('Error fetching all signs:', error));
    }
});

// On page load, fetch and display all signs initially
fetch('https://cws.auckland.ac.nz/nzsl/api/AllSigns')
    .then(response => response.json())
    .then(signs => {
        displaySigns(signs);
    })
    .catch(error => console.error('Error fetching all signs:', error));

    
// footer in home page
const dest = document.getElementById("homeFooter");
const fetchP = fetch('https://cws.auckland.ac.nz/nzsl/api/Version')
const streamP = fetchP.then((response) => response.text());
streamP.then(data => {dest.innerHTML = data});


// Parse the icalendar string
function parseIcal(icalString) {
    const lines = icalString.split(/\r?\n/); // Split the string into lines
    const event = {};

    lines.forEach(line => {
        const [key, value] = line.split(':', 2); // Split each line by the first colon
        switch (key) {
            case 'SUMMARY':
                event.summary = value;
                break;
            case 'DESCRIPTION':
                event.description = value;
                break;
            case 'DTSTART':
                event.startDate = value;
                break;
            case 'DTEND':
                event.endDate = value;
                break;
            case 'LOCATION':
                event.location = value;
                break;
            case 'TZID':
                event.timezone = value;
                break;
        }
    });

    return event;
}


// fetch events
const sectionEvents = document.getElementById("events");
async function getEvents() {
    try {
        const response = await fetch("https://cws.auckland.ac.nz/nzsl/api/EventCount");
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        for(let i=0; i < data; i++) {
            const eventDiv = document.createElement('div'); // Create a div for every event
            eventDiv.classList.add('eventDiv');

            // Create a button for downloading the iCalendar object
            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download';

            const fetchedEvent = fetch("https://cws.auckland.ac.nz/nzsl/api/Event/" + i)
            .then((response) => {
                return response.text();  // response is a text
            })
            fetchedEvent.then(calendar => {
                const parsedEvent = parseIcal(calendar);

                let startStr = parsedEvent.startDate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z');
                let endStr = parsedEvent.endDate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z');

                // startDate and endDate in Date objects
                const startUtc = new Date(startStr);
                const endUtc = new Date(endStr);

                // NZ timezone
                const options = {
                    timeZone: 'Pacific/Auckland',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                };

                const nzStart = new Intl.DateTimeFormat('en-NZ', options).format(startUtc);
                const nzEnd = new Intl.DateTimeFormat('en-NZ', options).format(endUtc);

                eventDiv.innerHTML += `<p style="font-weight: bold">${parsedEvent.summary}</p>`;
                eventDiv.innerHTML += `<p>Description: ${parsedEvent.description}</p>`;
                eventDiv.innerHTML += `<p>Start: ${nzStart}</p>`;
                eventDiv.innerHTML += `<p>End: ${nzEnd}</p>`;
                eventDiv.innerHTML += `<p>Location: ${parsedEvent.location}</p>`;
                eventDiv.innerHTML += `<p>Timezone: ${parsedEvent.timezone}</p>`;
                eventDiv.innerHTML += `<br>`;

                // Create an anchor for downloading
                const link = document.createElement('a');
                const blob = new Blob([calendar], { type: 'text/calendar' }); // Create a Blob from the iCalendar data
                const url = URL.createObjectURL(blob); // Create a URL for the Blob

                link.href = url;
                link.download = `event_${i}.ics`; // Set the suggested download file name

                // Attach the download link to the button
                downloadButton.addEventListener('click', () => {
                    link.click(); // Trigger the download
                });
                eventDiv.appendChild(downloadButton);
            });

            sectionEvents.appendChild(eventDiv);
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}
getEvents();


// Register
const regButton = document.getElementById("regButton");
const register = async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const address = document.getElementById("address").value;
    const regContent = {
        username: username,
        password: password,
        address: address
    };
    try {
        const regResponse = await fetch('https://cws.auckland.ac.nz/nzsl/api/Register', {
            headers: {
                "Content-Type": 'application/json'
            },
            method: "POST",
            body: JSON.stringify(regContent)
        });

        if (regResponse.ok) {
            const regText = await regResponse.text();
            if (regText === "Username not available") {
                document.getElementById("regMsg").textContent = "Username already exists";
            }
            else if (regText === "Invalid username") {
                document.getElementById("regMsg").textContent = "Invalid username";
            }
             else {
                document.getElementById("regMsg").textContent = "Registration successful";
            }
        } else {
            const errorData = await regResponse.json();
            document.getElementById("regMsg").textContent = `Registration failed: ${errorData}`;
        }

    } catch (error) {
        document.getElementById("regMsg").textContent = `Error occurred: ${error}`;
    }
}
regButton.addEventListener("click", register);


// Post comment
const postComment = async() => {
    const commentText = document.getElementById("commentInput").value;
    if (localStorage.getItem("isLoggedIn") === "false") {
        document.getElementById("commentMsg").textContent = "You must be logged in to post comments.";
        displayLogin();
        loginInfo.style.color = "red";
        return;
    } 
    const username_comment = localStorage.getItem('username');
    const password_comment = localStorage.getItem('password');

    if (!commentText.trim()) {
        document.getElementById("commentMsg").textContent = 'Comment cannot be empty.';
        return;
    }
    const credentials = btoa(`${username_comment}:${password_comment}`);
    try {
        const commentResponse = await fetch(`https://cws.auckland.ac.nz/nzsl/api/Comment?comment=${commentText}`, {
            method: "POST",
            headers: {
                "Content-Type": 'text/plain',
                "Authorization": `Basic ${credentials}` // Basic Auth for posting the comment
            },
            body: commentText // Send the comment as a string
        });

        if (commentResponse.ok) {
            document.getElementById("commentMsg").textContent = 'Comment posted successfully';
            document.getElementById("commentInput").value = ''; // Clear the input field after posting
        } else {
            document.getElementById("commentMsg").textContent = 'Failed to post comment: ' + commentResponse.statusText;
        }

    } catch (error) {
        document.getElementById("commentMsg").textContent = 'Error occurred while posting comment: ' + error;
    }
}
commentButton.addEventListener("click", postComment);
