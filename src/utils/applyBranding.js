export function applyBranding({ fontFamily, faviconUrl, title }) {
  if (title) document.title = title

  if (fontFamily) {
    document.documentElement.style.setProperty('--wc-font', fontFamily)
  }

  if (typeof document === 'undefined') return

  const ensureLink = (rel) => {
    let link = document.querySelector(`link[rel="${rel}"]`)
    if (!link) {
      link = document.createElement('link')
      link.setAttribute('rel', rel)
      document.head.appendChild(link)
    }
    return link
  }

  if (faviconUrl) {
    const linksToUpdate = [ensureLink('icon'), ensureLink('shortcut icon')]
    const ext = faviconUrl.split('.').pop()?.toLowerCase() || ''
    const mime =
      ext === 'svg'
        ? 'image/svg+xml'
        : ext === 'png'
        ? 'image/png'
        : ext === 'jpg' || ext === 'jpeg'
        ? 'image/jpeg'
        : undefined

    linksToUpdate.forEach((link) => {
      if (mime) link.setAttribute('type', mime)
      link.setAttribute('href', faviconUrl)
    })
  }
}
