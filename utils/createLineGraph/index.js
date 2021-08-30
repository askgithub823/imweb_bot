const ChartjsNode = require('chartjs-node')
const createFiles = require('../createFiles')
const formatData = require('../graph/formatData')

module.exports = async function (graphData)  {
  // console.log(graphData)
  try {
    let chartOptions = {
      type: 'line',
      data: formatData(graphData),
      options: {
          responsive: true,
          width: 700,
          height: 700,
          animation: false,
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          },
          tooltips: {
              mode: 'label'
          }
      },
      plugins: {
        beforeDraw: (chartInstance, easing) => {
          let { width, height } = chartInstance.config.options
          let ctx = chartInstance.chart.ctx
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, width, height)
        }
      }
    }
    let chartNode = new ChartjsNode(800, 800)
    let chart = await chartNode.drawChart(chartOptions)
    let imageBuffer = await chartNode.getImageBuffer('image/jpg')
    let fileMeta = {
      name: 'line-graph.jpg',
      content: imageBuffer,
      mimeType: 'image/jpg'
    }
    let files = createFiles([fileMeta])
    return files
  } catch (e) {
    console.log(e)
  }
}
