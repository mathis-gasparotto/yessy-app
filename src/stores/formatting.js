export default () => ({
  kebabCaseFormatting(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .toLowerCase()
  },
  camelCaseFormatting(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase() })
  },
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  capitalizeAll(str) {
    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase() })
  },
  dateTimeFormatToBDD(date) {
    let d = new Date(date)
    return `${d.getFullYear()}/${(d.getMonth() + 1)}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
  }
})
