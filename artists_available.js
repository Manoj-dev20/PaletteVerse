const memberPageRoutes = {
  elena: "#",
  tobias: "/team/tobias-schmidt",
  amara: "/team/amara-chen",
  julian: "artist_profile.html",
  sofia: "/team/sofia-ivanova",
  miles: "/team/miles-carter",
}

const memberSocialLinks = {
  elena: {
    facebook: "https://facebook.com",
    instagram: "https://www.instagram.com/portraits.by.manoj?igsh=eW9ybXB2eDQ2cDhw",
    youtube: "https://youtube.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  tobias: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  amara: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  julian: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  sofia: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  miles: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
}

// Initialize member image click handlers
document.addEventListener("DOMContentLoaded", () => {
  const memberImages = document.querySelectorAll(".member-image")

  memberImages.forEach((image) => {
    image.addEventListener("click", (e) => {
      const memberId = image.getAttribute("data-member-id")
      const route = memberPageRoutes[memberId]

      if (route) {
        window.location.href = route
      }
    })
  })

  const socialLinks = document.querySelectorAll(".social-icon")
  socialLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()

      // Get the member ID from parent card
      const memberCard = link.closest(".team-member")
      const memberImage = memberCard.querySelector(".member-image")
      const memberId = memberImage.getAttribute("data-member-id")

      // Get the social platform from class
      const platform = link.classList.contains("facebook")
        ? "facebook"
        : link.classList.contains("instagram")
          ? "instagram"
          : link.classList.contains("youtube")
            ? "youtube"
            : link.classList.contains("twitter")
              ? "twitter"
              : link.classList.contains("linkedin")
                ? "linkedin"
                : null

      if (platform && memberSocialLinks[memberId] && memberSocialLinks[memberId][platform]) {
        window.open(memberSocialLinks[memberId][platform], "_blank")
      }
    })
  })
})

// Add smooth scroll and additional interactivity
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header")
  if (window.scrollY > 0) {
    header.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)"
  } else {
    header.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.05)"
  }
})
