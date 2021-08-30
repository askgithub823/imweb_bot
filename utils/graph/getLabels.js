module.exports = function (graphData, labelKey) {
  let labels = graphData.map(obj => obj[labelKey])
  return labels
}
