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
    
    if (sender === "ai") {
        // Create wrapper for AI message
        const messageWrapper = document.createElement("div");
        messageWrapper.className = "ai-message-wrapper";
        
        // Create message div
        const aiMessage = document.createElement("div");
        aiMessage.className = "ai-message";
        
        // Add loading animation initially
        aiMessage.innerHTML = `
            <div class="loading">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        `;
        
        // Create publish button
        const publishButton = document.createElement("button");
        publishButton.className = "publish-button";
        publishButton.style.cssText = `
            color: white;
            background: linear-gradient(135deg, #6e8efb, #4a6cf7);
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            margin-top: 12px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(74, 108, 247, 0.2);
            display: inline-flex;
            align-items: center;
            gap: 8px;
        `;
        publishButton.innerHTML = '<i class="fas fa-edit"></i> Publish as Blog';
        publishButton.onmouseover = () => {
            publishButton.style.transform = 'translateY(-2px)';
            publishButton.style.boxShadow = '0 6px 20px rgba(74, 108, 247, 0.3)';
        };
        publishButton.onmouseout = () => {
            publishButton.style.transform = 'translateY(0)';
            publishButton.style.boxShadow = '0 4px 15px rgba(74, 108, 247, 0.2)';
        };
        publishButton.onclick = () => {
            localStorage.setItem('chatbotContent', message);
            window.location.href = '/blogGenie/new';
        };
        
        // Append message and button to wrapper
        messageWrapper.appendChild(aiMessage);
        messageWrapper.appendChild(publishButton);
        outputContainer.appendChild(messageWrapper);
        
        // Update message content after delay
        setTimeout(() => {
            aiMessage.innerHTML = marked.parse(message);
        }, 1500);
        
    } else {
        // User message
        msgDiv.className = "user-message";
        msgDiv.innerHTML = marked.parse(message);
        outputContainer.appendChild(msgDiv);
    }
    
    // Scroll to latest message
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