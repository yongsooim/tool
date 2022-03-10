
plot = document.getElementById('plot');

const globalData = [{}]

Plotly.newPlot(
    plot, 
    globalData, 
    { dragmode: "pan"}, 
    { scrollZoom: true, responsive: true }
)
