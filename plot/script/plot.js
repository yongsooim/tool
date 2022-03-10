
plot = document.getElementById('plot');

const globalData = [{ y:[1, 2, 4, 5, ] }]

Plotly.newPlot(plot, globalData, 
    {margin: {t : 10, l : 10, r : 10, b : 10} , dragmode: "pan"}, 
    { scrollZoom: true, responsive: true })
