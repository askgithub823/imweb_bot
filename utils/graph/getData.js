module.exports = function (graphData, barKey) {
  let data = graphData.map(obj => obj[barKey])
  return data
}
