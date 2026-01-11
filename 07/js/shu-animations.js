// ============================================
// SHU-ANIMATIONS.JS - Animations video de Shu
// ============================================

const SHU_ANIMATIONS = {
  collection: "Shu",
  items: [
    {
      name: "very_small_bark",
      label: "Tres petit aboiement",
      minDecibels: 60,
      maxDecibels: 70,
      animation_webm: "https://assets.masco.dev/67ca56/shu-0aa2/very-small-bark-3627810e.webm",
      animation_mov: "https://assets.masco.dev/67ca56/shu-0aa2/very-small-bark-54728366.mov",
      video: "https://assets.masco.dev/67ca56/shu-0aa2/very-small-bark-34e44ce3.mp4",
      transparent_image: "https://assets.masco.dev/67ca56/shu-0aa2/very-small-bark-bc029ed7.png",
      image: "https://assets.masco.dev/67ca56/shu-0aa2/very-small-bark-d1cd7984.png"
    },
    {
      name: "bark_quietly",
      label: "Aboiement discret",
      minDecibels: 70,
      maxDecibels: 85,
      animation_webm: "https://assets.masco.dev/67ca56/shu-0aa2/bark-quitly-c34d41bc.webm",
      animation_mov: "https://assets.masco.dev/67ca56/shu-0aa2/bark-quitly-d3a7c645.mov",
      video: "https://assets.masco.dev/67ca56/shu-0aa2/bark-quitly-18c46b21.mp4",
      transparent_image: "https://assets.masco.dev/67ca56/shu-0aa2/bark-quitly-a4f96e19.png",
      image: "https://assets.masco.dev/67ca56/shu-0aa2/bark-quitly-68a0e312.png"
    },
    {
      name: "bark",
      label: "Aboiement normal",
      minDecibels: 85,
      maxDecibels: 100,
      animation_webm: "https://assets.masco.dev/67ca56/shu-0aa2/bark-261cc2d7.webm",
      animation_mov: "https://assets.masco.dev/67ca56/shu-0aa2/bark-5ebe41f9.mov",
      video: "https://assets.masco.dev/67ca56/shu-0aa2/bark-8b6e9e52.mp4",
      transparent_image: "https://assets.masco.dev/67ca56/shu-0aa2/bark-4ccfa5dc.png",
      image: "https://assets.masco.dev/67ca56/shu-0aa2/bark-9a6aa3a9.png"
    },
    {
      name: "bark_strongly",
      label: "Aboiement fort",
      minDecibels: 100,
      maxDecibels: 120,
      animation_webm: "https://assets.masco.dev/67ca56/shu-0aa2/bark-strongly-d3815b76.webm",
      animation_mov: "https://assets.masco.dev/67ca56/shu-0aa2/bark-strongly-d49ab41b.mov",
      video: "https://assets.masco.dev/67ca56/shu-0aa2/bark-strongly-172e15f1.mp4",
      transparent_image: "https://assets.masco.dev/67ca56/shu-0aa2/bark-strongly-036b6157.png",
      image: "https://assets.masco.dev/67ca56/shu-0aa2/bark-strongly-5adba8ff.png"
    },
    {
      name: "very_loud_bark",
      label: "SUPER aboiement!",
      minDecibels: 120,
      maxDecibels: 200,
      animation_webm: "https://assets.masco.dev/67ca56/shu-0aa2/very-very-loud-bark-b0c20945.webm",
      animation_mov: "https://assets.masco.dev/67ca56/shu-0aa2/very-very-loud-bark-ae9fcb4a.mov",
      video: "https://assets.masco.dev/67ca56/shu-0aa2/very-very-loud-bark-f20ddae9.mp4",
      transparent_image: "https://assets.masco.dev/67ca56/shu-0aa2/very-very-loud-bark-61ef4090.png",
      image: "https://assets.masco.dev/67ca56/shu-0aa2/very-very-loud-bark-72ea523a.png"
    }
  ],

  // Image par defaut (idle)
  defaultImage: "https://assets.masco.dev/67ca56/shu-0aa2/bark-quitly-68a0e312.png",

  // Obtenir l'animation en fonction de la puissance
  getAnimationByPower(decibels) {
    for (const item of this.items) {
      if (decibels >= item.minDecibels && decibels < item.maxDecibels) {
        return item;
      }
    }
    // Par defaut, le plus fort
    return this.items[this.items.length - 1];
  }
};
