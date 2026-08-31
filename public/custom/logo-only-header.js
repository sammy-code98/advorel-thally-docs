(() => {
  const style = document.createElement('style')
  style.dataset.dxGuideLogoOnly = 'true'
  style.textContent = `
    .thally-docs-brand > span {
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    }
  `
  document.head.appendChild(style)
})()
