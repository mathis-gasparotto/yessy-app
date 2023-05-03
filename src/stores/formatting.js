export default () => ({
  kebabCaseFormatting(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
  }
})
