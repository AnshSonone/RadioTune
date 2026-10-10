const rgbtoBase64 = (r, g, b) => {
    const gif  = `GIF89a\x01\x00\x01\x00\x80\x00\x00${String.fromCharCode(r, g, b)}\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;`;
    return typeof window === 'undefined'
    ? Buffer.from(gif, 'base64').toString('base64')
    : window.btoa(gif)
}

export const getBlurPlaceholder = (r, g, b) => {
    return `data:image/gif;base64,${rgbtoBase64(r, g, b)}`
}