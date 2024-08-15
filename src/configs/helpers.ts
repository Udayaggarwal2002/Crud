const isWindowPresent = () => {
  if (typeof window !== 'undefined') {
    return true
  } else {
    return false
  }
}

export { isWindowPresent }
