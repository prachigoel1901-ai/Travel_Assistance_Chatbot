//Selection
let tourist = document.querySelector("#t1");
let local = document.querySelector("#l1");
if (tourist && local) {
  tourist.addEventListener("click", () => {
    localStorage.setItem("Type", "tourist");
    window.location.href = "chatbot.html";
  });
  local.addEventListener("click", () => {
    localStorage.setItem("Type", "local");
    window.location.href = "chatbot.html";
  });
}
// Auto scroll to bottom
function scroll() {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  });
}
// Welcome message
let chatbot = document.querySelector("#t2");
if (chatbot) {
  chatbot.classList.add("chatbot-heading");
  const type = localStorage.getItem("Type");
  if (type === "tourist") {
    chatbot.innerText = "Hey there, welcome! Looks like you're a tourist😄! Which city are you exploring today? I’ll help you find the best of it!";
  } else if (type === "local") {
    chatbot.innerText = "Hi Welcome! Nice to meet a local😉! Could you tell me which city you’re living in so I can suggest some hidden gems nearby?";
  }
}

// Send button for city
const sendBtn = document.getElementById("sendBtn");
let City = "";
if (sendBtn) {
  sendBtn.addEventListener("click", async () => {
    const input = document.getElementById("userInput").value.trim();
    const chatArea = document.querySelector("section");
    if (input !== "") {
      const Usermsg = document.createElement("div");
      Usermsg.className = "Userreply";
      Usermsg.innerText = input;
      chatArea.appendChild(Usermsg);
      document.getElementById("userInput").value = "";
      if (!City) {
        City = input.toLowerCase();
      }
      sendBtn.style.display = "none";
      userInput.style.display = "none";
      await delay(1000);
      const userType = localStorage.getItem("Type");
      let interests = [];
      if (userType === "tourist") {
        interests = ["Monuments", "Temples", "Historical Sites", "Food Streets", "Markets", "Amusement/Theme Parks", "Art and Culture"];
      } else if (userType === "local") {
        interests = ["Cafes", "Amusement/Theme Parks", "Markets", "Hidden Gems", "Food Streets", "Movie Theatres", "Live Events", "Shopping malls"];
      }
      const botReply = document.createElement("div");
      botReply.className = "Botreply";
      const question = document.createElement("p");
      question.innerText = "Great !! What would you like to explore?";
      botReply.appendChild(question);
      interests.forEach(item => {
        const button = document.createElement("button");
        button.className = "optionBtn";
        button.innerText = item;
        button.addEventListener("click", async () => {
          showUserSelection(item);
          await Findplace(City, item);
        });
        botReply.appendChild(button);
      });
      chatArea.appendChild(botReply);
    }
  });
}

function showUserSelection(interest) {
  const chatArea = document.querySelector("section");
  const selection = document.createElement("div");
  selection.className = "Interestreply";
  selection.innerText = `Great!! Let me find some interesting ${interest} in ${City} for you.....`;
  chatArea.appendChild(selection);
  scroll();
}

function showUser(a) {
  const chatArea = document.querySelector("section");
  const selection = document.createElement("div");
  selection.className = "reply";
  selection.innerText = ` ${a}`;
  chatArea.appendChild(selection);
  scroll();
}

function showmode(a) {
  const chatArea = document.querySelector("section");
  const selection = document.createElement("div");
  selection.className = "modereply";
  selection.innerText = ` ${a}`;
  chatArea.appendChild(selection);
  scroll();
}

async function Findplace(city, interest) {
  // Wait for 2 seconds to simulate typing
  await delay(2000);

  try {
    // Send request to backend with city and interest
    const response = await fetch(`http://localhost:3000/place?city=${city}&interest=${interest}`);
    const data = await response.json();
    const chatArea = document.querySelector("section");
    const results = document.createElement("div");
    results.className = "Botreply";
    // data jo aati hai vo array ki form mein aati hai

    if (data.length > 0) {
      data.forEach(place => {
        const placeCard = document.createElement("div");
        placeCard.className = "placeCard";
        placeCard.innerHTML = `
          <h3>${place.name}</h3>
          <div class="box">
            <img src="${place.image_url}" alt="${place.name}" class="place-image" />
            <p>${place.description}</p>
          </div>
          <a href="${place.booking_link}" target="_blank" class="place-link">More Details</a>
        `;
        results.appendChild(placeCard);
      });
    } 
    else {
      results.innerText = "Oops! No places found for your selection.";
    }

    chatArea.appendChild(results);
    scroll();   
    reply();    

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function reply() {
  const replyarea = document.querySelector("section");
  const reply = document.createElement("div");
  reply.className = "chatreply";
  reply.innerText = "Would you like to explore something else in this city?";
  const yes = document.createElement("button");
  yes.className = "optionBtn";
  yes.innerText = "Yes";
  const no = document.createElement("button");
  no.className = "optionBtn";
  no.innerText = "No";
  const booking = document.createElement("button");
  booking.className = "optionBtn";
  booking.innerText = "Booking";
  yes.addEventListener("click", async () => {
    showUser("yes");
    await delay(1000);
    const userType = localStorage.getItem("Type");
    let interests = [];
    if (userType === "tourist") {
      interests = ["Monuments", "Temples", "Historical Sites", "Food Streets", "Markets", "Amusement/Theme Parks", "Art and Culture"];
    } else {
      interests = ["Cafes", "Amusement/Theme Parks", "Markets", "Hidden Gems", "Food Streets", "Movie Theatres", "Live Events", "Shopping malls"];
    }
    const newOptions = document.createElement("div");
    newOptions.className = "Botreply";
    const question = document.createElement("p");
    question.innerText = "Great!! What would you like to explore further?";
    newOptions.appendChild(question);
    interests.forEach(item => {
      const btn = document.createElement("button");
      btn.className = "optionBtn";
      btn.innerText = item;
      btn.addEventListener("click", async () => {
        await showUserSelection(item);
        Findplace(City, item);
      });
      newOptions.appendChild(btn);
    });
    replyarea.appendChild(newOptions);
    scroll();
  });
  no.addEventListener("click", async() => {
    showUser("No");
   await delay(1000);
    const byemsg = document.createElement("p");
    byemsg.innerText = "Thanks for chatting 😊! I hope it helped you. Have a great day!";
    reply.appendChild(byemsg);
    const feedback = document.createElement("div");
    feedback.className = "feedback";
    feedback.innerText = "Would you like to give feedback?";
    reply.appendChild(feedback);
    const yesbtn = document.createElement("button");
    yesbtn.className = "optionBtn";
    yesbtn.innerText = "Yes, I would love to!";
    feedback.appendChild(yesbtn);
    
    yesbtn.addEventListener("click",async () => {
      showUser("yes i would love too ");
      await delay(1000);
      window.location.href = "feedback.html";
    });
    const nofeedbtn = document.createElement("button");
    nofeedbtn.className = "optionBtn";
    nofeedbtn.innerText = "No, I can't";
    feedback.appendChild(nofeedbtn);
    nofeedbtn.addEventListener("click", () => {
      const finalreply = document.createElement("div");
      finalreply.className = "finalreply";
      finalreply.innerText = "No worries! Thank you again for using our application.";
      reply.appendChild(finalreply);
      scroll();
    });
  });
  booking.addEventListener("click", async () => {
    showUser("booking");
    await bookingoption();
  });
  reply.appendChild(yes);
  reply.appendChild(no);
  reply.appendChild(booking);
  replyarea.appendChild(reply);
  scroll();
}

async function bookingoption() {
  await delay(1000);
  const chatArea = document.querySelector("section");
  const bookingDiv = document.createElement("div");
  bookingDiv.className = "Botreply";
  const heading = document.createElement("p");
  heading.innerText = "Awesome! Here are some travel options to this city:";
  bookingDiv.appendChild(heading);
  const modes = ["Train", "Flight", "Bus", "Cab"];
  modes.forEach(mode => {
    const btn = document.createElement("button");
    btn.className = "optionBtn";
    btn.innerText = mode;
    btn.addEventListener("click", async() => {
      showmode(mode);
      await delay(1000);
      showBookingLink(mode, City);
    });
    bookingDiv.appendChild(btn);
  });
  const metroInfo = document.createElement("p");
  metroInfo.innerHTML = `<strong>🚇 For metro route:</strong> Please check <a href="https://www.google.com/maps" target="_blank">Google Maps</a> or your city metro app.`;
  bookingDiv.appendChild(metroInfo);
  chatArea.appendChild(bookingDiv);
  scroll();
}

function showBookingLink(mode, city) {
  const chatArea = document.querySelector("section");
  const info = document.createElement("div");
  info.className = "Botreply";
  let link = "#";
  switch (mode) {
    case "Train":
      link = `https://www.irctc.co.in/nget/train-search`;
      break;
    case "Flight":
      link = `https://www.makemytrip.com/flights/`;
      break;
    case "Bus":
      link = `https://www.redbus.in/`;
      break;
    case "Cab":
      link = `https://www.uber.com/in/en/`;
      break;
  }
  window.open(link, '_blank');
  reply();
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
