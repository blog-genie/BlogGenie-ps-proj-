import {
    GoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
  } from "@google/generative-ai";
  
  const API_KEY = "AIzaSyC2vt53PSYRBiYKi-spgJ3SgjVnGxqivLY"; // Replace with your gemini-api actual API key
  const genAI = new GoogleGenerativeAI(API_KEY);
  let chat;
  
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];
  
  async function sendMessage(prompt) {
    let model;
    clearGreeting(); // Clear the greeting after sending the message
  
    if (!chat) {
      chat = await genAI
        .getGenerativeModel({ model: "gemini-pro", safetySettings })
        .startChat({
          history: [],
          generationConfig: {
            maxOutputTokens: 4000, // maxOutputTokens Limit around 4096
          },
        });
    }
    model = chat;
    clearInputs(); //clear the input field immediately 
  
    try {
      const result = await model.sendMessage(prompt);
      const response = await result.response;
      if (response) {
        const text = await response.text();
        displayMessage(text, "ai");
      } else {
        displayMessage("This content is not safe for display based on current settings.", "ai");
      }
    } catch (error) {
      console.error("Error during message generation:", error);
      displayMessage("This content is not safe for display based on current settings or an internal error.", "ai");
    }
  }
  
  function displayMessage(message, sender) {
    const outputContainer = document.getElementById("output-container");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add(sender === "user" ? "user-message" : "ai-message");
  
    if (sender === "ai") {
      // Show loading animation for AI messages
      msgDiv.innerHTML =
        '<div class="loading">' +
        '<div class="loading-dot"></div>' +
        '<div class="loading-dot"></div>' +
        '<div class="loading-dot"></div>' +
        "</div>";
      outputContainer.appendChild(msgDiv);
  
      // Simulate processing delay
      setTimeout(() => {
        // Clear loading animation
        msgDiv.innerHTML = marked.parse(message);
        outputContainer.scrollTop = outputContainer.scrollHeight; // Scroll to bottom
      }, 1500);
    } else {
      msgDiv.innerHTML = marked.parse(message);
      outputContainer.appendChild(msgDiv);
    }
  
    // Ensure the latest message is visible
    outputContainer.scrollTop = outputContainer.scrollHeight;
  }
  
  function clearInputs() {
    document.getElementById("prompt-input").value = "";
  }
  
  document.getElementById("generate-btn").addEventListener("click", async () => {
    const prompt = document.getElementById("prompt-input").value;
    if (prompt.trim() !== "") {
      displayMessage(prompt, "user");
      await sendMessage(prompt);
    }
  });
  
  // Function to send msg by pressing Enter button 
  document.getElementById("prompt-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submission
      const prompt = this.value;
      if (prompt.trim() !== "") {
        displayMessage(prompt, "user");
        sendMessage(prompt);
      }
    }
  });
  
  function clearGreeting() {
    const outputField = document.getElementById("output-field");
    if (outputField) {
      outputField.style.display = "none"; // Hide the field completely
    }
  }
  
  var loader = document.getElementById("Loader");
  window.addEventListener("load", function () {
    loader.style.display = "none";
  });
  
  const historyList = document.getElementById('history-list');
  let searchHistory = [];
  
  // Load search history from local storage (if available)
  if (localStorage.getItem('searchHistory')) {
    searchHistory = JSON.parse(localStorage.getItem('searchHistory'));
    displayHistory();
  }
  
  // Function to add a search query to history
  function addSearch(query) {
    searchHistory.push(query);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    displayHistory();
  }
  
  // Function to display search history in the panel
  function displayHistory() {
    historyList.innerHTML = '';
    searchHistory.forEach((query, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = query;
      listItem.addEventListener('click', () => {
        // Handle click event (e.g., fill the search input with the selected query)
        document.getElementById('search-input').value = query;
      });
      historyList.appendChild(listItem);
    });
  }