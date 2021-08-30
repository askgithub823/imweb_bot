const getLabels = require('./getLabels')
const getData = require('./getData')
const generateColor = require('../randomColor')

module.exports = function (graphData) {
  let keys = Object.keys(graphData[0])
  let labelKey = keys.slice(2, 3)[0]
  let barKeys = keys.slice(3)
  let nBars = barKeys.length
  let labels = getLabels(graphData, labelKey)
  let datasets = []
  for (let [index, barKey] of barKeys.entries()) {
    datasets = [
      ...datasets,
      {
        label: barKey,
        backgroundColor: generateColor(),
        borderWidth: 1,
        borderColor: '#000000',
        data: getData(graphData, barKey)
      }
    ]
  }
  return {
    labels,
    datasets
  }
}
