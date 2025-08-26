export function applyBranding({ fontFamily, faviconUrl, title }) {
  if (title) document.title = title

  if (fontFamily) {
    document.documentElement.style.setProperty('--wc-font', fontFamily)
  }

  if (faviconUrl) {
    let link = document.querySelector('link[rel="icon"]')
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', 'icon')
      document.head.appendChild(link)
    }
    link.setAttribute('href', faviconUrl)
  }
}
