"use strict"

const MAIN_IMAGE = document.getElementById("mainImage")

const ANIMATIONS = {
  // base = rtl 0
  tailLTR: {
    displayTime: 126,
    frames: ["ltr1", "ltr2"],
    end: "base",
  },
  tailRTL: {
    displayTime: 126,
    frames: ["rtl1", "rtl2"],
    end: "ltr0",
  },
  thighsRTL: {
    displayTime: 1500,
    frames: ["blushRTL"],
  },
  thighsLTR: {
    displayTime: 1500,
    frames: ["blushLTR"],
  },
  chestRTL: {
    displayTime: 75,
    frames: ["handRTL1", "handRTL2"],
  },
  chestLTR: {
    displayTime: 75,
    frames: ["handLTR1", "handLTR2"],
  },
}

var ANIM_PLAYING = false
var LAST_IMAGE = "base"
var LAST_TAIL_POS = "RTL"

function changeFrame(src) {
  MAIN_IMAGE.src = `img/${src}.png`
}

function playAnimation(anim) {
  ANIM_PLAYING = true
  LAST_IMAGE = MAIN_IMAGE.src.match(/\/([^/]+)\..*$/)[1]
  // Immediately show first frame.
  changeFrame(anim.frames[0])
  if (anim.frames.length == 1) {
    setTimeout(() => {
      changeFrame(anim.end || LAST_IMAGE)
      ANIM_PLAYING = false
    }, anim.displayTime)
    return
  }
  // Queue remaining frames
  let idx = 1
  const iv = setInterval(() => {
    // Final frame display time has lapsed
    if (idx == anim.frames.length) {
      changeFrame(anim.end || LAST_IMAGE)
      clearInterval(iv)
      ANIM_PLAYING = false
      return
    }
    changeFrame(anim.frames[idx])
    idx++
  }, anim.displayTime)
}

// Preload images
const image_cache = []
for (const anim of Object.values(ANIMATIONS)) {
  for (const src of anim.frames) {
    const img = new Image()
    img.src = `img/${src}.png`
    image_cache.push(img)
  }
}


// Interaction
document.addEventListener("click", (e) => {
  if (e.target.className != "hotspot") return
  if (ANIM_PLAYING) return

  var animName = e.target.id
  var doGrab = true
  var grabStart = 20
  var grabLen = 400

  if (animName.startsWith("thigh")) {
    animName = `thighs${LAST_TAIL_POS}`
    grabLen = 1100
    grabStart = 0
  } else if (animName == "chest") {
    animName = `${animName}${LAST_TAIL_POS}`
    doGrab = false
  }
  playAnimation(ANIMATIONS[animName])
  if (doGrab) {
    const game = document.getElementById("game")
    setTimeout(() => game.classList.add("clicked"), grabStart)
    setTimeout(() => game.classList.remove("clicked"), grabLen)
  }

  if (animName == "tailLTR") {
    e.target.style.pointerEvents = "none"
    document.getElementById("tailRTL").style.pointerEvents = "unset"
    LAST_TAIL_POS = "RTL"
  } else if (animName == "tailRTL") {
    e.target.style.pointerEvents = "none"
    document.getElementById("tailLTR").style.pointerEvents = "unset"
    LAST_TAIL_POS = "LTR"
  }
})

// Defaults
document.getElementById("tailLTR").style.pointerEvents = "none"
