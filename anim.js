const mainImage = document.getElementById("mainImage")
var ANIM_PLAYING = false

const animations = {
  // base = rtl 0
  tailLTR: {
    displayTime: 126,
    frames: ["ltr0", "ltr1", "ltr2"],
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
    displayTime: 90,
    frames: ["handRTL1", "handRTL2"],
  },
  chestLTR: {
    displayTime: 90,
    frames: ["handLTR1", "handLTR2"],
  },
}

const defaultFrameTimeMs = 250
var lastImage = "base"
var lastTailPos = "RTL"

function changeFrame(src) {
  mainImage.src = `img/${src}.png`
}

function playAnimation(anim) {
  ANIM_PLAYING = true
  lastImage = new URL(mainImage.src).pathname.match(/\/([^/]+)\./)[1]
  // Immediately show first frame.
  changeFrame(anim.frames[0])
  if (anim.frames.length == 1) {
    setTimeout(() => {
      changeFrame(anim.end || lastImage)
      ANIM_PLAYING = false
      }, anim.displayTime)
    return
  }
  // Queue remaining frames
  let idx = 1
  const iv = setInterval(() => {
    // Final frame display time has lapsed
    if (idx == anim.frames.length) {
      changeFrame(anim.end || lastImage)
      clearInterval(iv)
      ANIM_PLAYING = false
      return
    }
    changeFrame(anim.frames[idx])
    idx++
  }, anim.displayTime)
}

// Attach event listeners
document.addEventListener("click", (e) => {
  if (e.target.className != "hotspot") return
  if (ANIM_PLAYING) return

  var animName = e.target.id
  var doGrab = true
  var grabStart = 60
  var grabLen = 400

  if (animName.startsWith("thigh")) {
    animName = `thighs${lastTailPos}`
    grabLen = 1100
    grabStart = 0
  } else if (animName == "chest") {
    animName = `${animName}${lastTailPos}`
    doGrab = false
  }
  playAnimation(animations[animName])
  if (doGrab) {
    game = document.getElementById("game")
    setTimeout(() => game.classList.add("clicked"), grabStart)
    setTimeout(() => game.classList.remove("clicked"), grabLen)
  }

  if (animName == "tailLTR") {
    e.target.style.pointerEvents = "none"
    document.getElementById("tailRTL").style.pointerEvents = "unset"
    lastTailPos = "RTL"
  } else if (animName == "tailRTL") {
    e.target.style.pointerEvents = "none"
    document.getElementById("tailLTR").style.pointerEvents = "unset"
    lastTailPos = "LTR"
  }
})

document.getElementById("tailLTR").style.pointerEvents = "none"
