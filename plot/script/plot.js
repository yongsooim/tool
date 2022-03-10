
plot = document.getElementById('plot');

const globalData = [{ y:[1, 2, 4, 5, ], x:[0,1, 2.5] }]

Plotly.newPlot(plot, globalData, 
    { dragmode: "pan"}, 
    { scrollZoom: true, responsive: true })
