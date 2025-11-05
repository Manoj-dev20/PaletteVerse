// Sample conversation data
const conversations = {
  "Emily Chen": [
    {
      author: "Emily Chen",
      initials: "EC",
      text: "Hi! I'd love to discuss the details of my custom artwork request.",
      timestamp: "10:30 AM",
      isUser: false,
    },
    {
      author: "You",
      initials: "A",
      text: "Hello! I'd be happy to help. What specific style are you looking for?",
      timestamp: "10:31 AM",
      isUser: true,
    },
    {
      author: "Emily Chen",
      initials: "EC",
      text: "I'm thinking something abstract with bold colors. Can you share some examples?",
      timestamp: "10:32 AM",
      isUser: false,
    },
    {
      author: "You",
      initials: "A",
      text: "I'll prepare some sketches and share them with you shortly.",
      timestamp: "10:33 AM",
      isUser: true,
      attachment: "sketch_examples.pdf",
    },
  ],
  "David Kim": [
    {
      author: "David Kim",
      initials: "DK",
      text: "Could you please review the final version?",
      timestamp: "5h ago",
      isUser: false,
    },
    {
      author: "You",
      initials: "A",
      text: "Of course! Let me take a look at the latest draft.",
      timestamp: "4h ago",
      isUser: true,
    },
    {
      author: "David Kim",
      initials: "DK",
      text: "Great! Looking forward to your feedback.",
      timestamp: "3h ago",
      isUser: false,
    },
  ],
  "Lisa Anderson": [
    {
      author: "Lisa Anderson",
      initials: "LA",
      text: "Perfect! Thank you for the wonderful work.",
      timestamp: "1d ago",
      isUser: false,
    },
    {
      author: "You",
      initials: "A",
      text: "You're welcome! It was a pleasure working with you.",
      timestamp: "1d ago",
      isUser: true,
    },
  ],
  "Ryan Foster": [
    {
      author: "Ryan Foster",
      initials: "RF",
      text: "Looking forward to reference images.",
      timestamp: "2d ago",
      isUser: false,
    },
    {
      author: "You",
      initials: "A",
      text: "I'll send them over by tomorrow!",
      timestamp: "2d ago",
      isUser: true,
    },
  ],
  "Sarah Mitchell": [
    {
      author: "Sarah Mitchell",
      initials: "SM",
      text: "Hi! I'd love to discuss the details of my canvas painting request.",
      timestamp: "10:30 AM",
      isUser: false,
    },
    {
      author: "You",
      initials: "A",
      text: "Hello! I'd be happy to help. What specific style are you looking for?",
      timestamp: "10:31 AM",
      isUser: true,
    },
  ],
  "James Parker": [
    {
      author: "James Parker",
      initials: "JP",
      text: "Looking forward to the digital portrait illustration.",
      timestamp: "10:30 AM",
      isUser: false,
    },
    {
      author: "You",
      initials: "A",
      text: "I'll start working on it right away!",
      timestamp: "10:31 AM",
      isUser: true,
    },
  ],
  "Michael Rodriguez": [
    {
      author: "Michael Rodriguez",
      initials: "MR",
      text: "Excited about the watercolor landscape project!",
      timestamp: "10:30 AM",
      isUser: false,
    },
    {
      author: "You",
      initials: "A",
      text: "Great! Let's discuss your vision.",
      timestamp: "10:31 AM",
      isUser: true,
    },
  ],
}

const requestCards = [
  {
    id: 1,
    name: "Sarah Mitchell",
    initials: "SM",
    artType: "Abstract Canvas Painting",
    price: "1450",
    date: "Nov 15, 2025",
  },
  {
    id: 2,
    name: "James Parker",
    initials: "JP",
    artType: "Digital Portrait Illustration",
    price: "1120",
    date: "Nov 20, 2025",
  },
  {
    id: 3,
    name: "Emily Chen",
    initials: "EC",
    artType: "Custom Digital Artwork",
    price: "2350",
    date: "Nov 25, 2025",
  },
  {
    id: 4,
    name: "Michael Rodriguez",
    initials: "MR",
    artType: "Watercolor Landscape",
    price: "3860",
    date: "Dec 1, 2025",
  },
]

function openChatModal(name, initials, status) {
  const modal = document.getElementById("chatModal")
  const modalName = document.getElementById("modalName")
  const modalStatus = document.getElementById("modalStatus")
  const modalAvatar = document.getElementById("modalAvatar")
  const chatMessages = document.getElementById("chatMessages")

  // Set modal header
  modalName.textContent = name
  modalStatus.textContent = status
  modalAvatar.textContent = initials

  // Populate messages
  chatMessages.innerHTML = ""
  const messages = conversations[name] || []

  messages.forEach((msg) => {
    const messageGroup = document.createElement("div")
    messageGroup.className = `message-group ${msg.isUser ? "user" : ""}`

    const avatarDiv = document.createElement("div")
    avatarDiv.className = "avatar"
    avatarDiv.textContent = msg.initials

    const messageContent = document.createElement("div")

    const bubble = document.createElement("div")
    bubble.className = "message-bubble"
    bubble.textContent = msg.text

    const timeDiv = document.createElement("div")
    timeDiv.className = "message-time"
    timeDiv.textContent = msg.timestamp

    messageContent.appendChild(bubble)

    if (msg.attachment) {
      const attachment = document.createElement("div")
      attachment.className = "attachment"
      attachment.innerHTML = `📎 ${msg.attachment}`
      messageContent.appendChild(attachment)
    }

    messageContent.appendChild(timeDiv)

    messageGroup.appendChild(avatarDiv)
    messageGroup.appendChild(messageContent)
    chatMessages.appendChild(messageGroup)
  })

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight

  // Show modal
  modal.classList.add("open")
}

function closeChatModal() {
  const modal = document.getElementById("chatModal")
  modal.classList.remove("open")
}

function sendMessage() {
  const input = document.getElementById("messageInput")
  const message = input.value.trim()

  if (message) {
    const chatMessages = document.getElementById("chatMessages")

    // Add user message
    const messageGroup = document.createElement("div")
    messageGroup.className = "message-group user"

    const avatarDiv = document.createElement("div")
    avatarDiv.className = "avatar"
    avatarDiv.textContent = "A"

    const messageContent = document.createElement("div")

    const bubble = document.createElement("div")
    bubble.className = "message-bubble"
    bubble.textContent = message

    const timeDiv = document.createElement("div")
    timeDiv.className = "message-time"
    const now = new Date()
    timeDiv.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    messageContent.appendChild(bubble)
    messageContent.appendChild(timeDiv)

    messageGroup.appendChild(avatarDiv)
    messageGroup.appendChild(messageContent)
    chatMessages.appendChild(messageGroup)

    // Clear input
    input.value = ""

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
}

function toggleMarkCompleted() {
  const btn = document.querySelector(".btn-mark-completed")
  btn.classList.toggle("completed")
  btn.textContent = btn.classList.contains("completed") ? "✓ Completed" : "Mark as Completed"
}

document.addEventListener("DOMContentLoaded", () => {
  const requestCardsElements = document.querySelectorAll(".request-card")

  requestCardsElements.forEach((card, index) => {
    const acceptBtn = card.querySelector(".btn-accept")
    const rejectBtn = card.querySelector(".btn-reject")
    const artistName = card.querySelector(".artist-name").textContent

    acceptBtn.addEventListener("click", () => handleAccept(card, artistName, index))
    rejectBtn.addEventListener("click", () => handleReject(card, index))
  })

  const messageInput = document.getElementById("messageInput")
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  })
})

function handleAccept(cardElement, artistName, cardIndex) {
  // Add to messages section
  const messagesGrid = document.querySelector(".messages-grid")
  const newMessageCard = createMessageCard(artistName, requestCards[cardIndex].initials, "in progress")
  messagesGrid.appendChild(newMessageCard)

  // Remove from requests
  cardElement.style.transition = "opacity 0.3s ease-out"
  cardElement.style.opacity = "0"

  setTimeout(() => {
    cardElement.remove()
  }, 300)
}

function handleReject(cardElement, cardIndex) {
  cardElement.style.transition = "opacity 0.3s ease-out"
  cardElement.style.opacity = "0"

  setTimeout(() => {
    cardElement.remove()
  }, 300)
}

function createMessageCard(name, initials, status) {
  const card = document.createElement("div")
  card.className = "message-card"
  card.onclick = () => openChatModal(name, initials, status)

  card.innerHTML = `
    <div class="message-header">
      <div class="avatar">${initials}</div>
      <div>
        <h3 class="message-name">${name}</h3>
        <span class="status-badge ${status.toLowerCase()}">${status}</span>
      </div>
    </div>
    <p class="message-preview">Request accepted for ${getArtTypeName(name)}</p>
    <div class="message-meta">
      <span class="message-time">just now</span>
    </div>
  `

  return card
}

function getArtTypeName(artistName) {
  const card = requestCards.find((c) => c.name === artistName)
  return card ? card.artType : "artwork"
}
