function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.select("#sample-metadata")
    // Use `.html("") to clear any existing metadata
        .html("");

    d3.json(`/metadata/${sample}`).then( (respMetadata) => {
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      
      for (let [key,value] of Object.entries(respMetadata) ){
         d3.select('#sample-metadata')
              .append('h6').text(`${key}: ${value}`); 
      }

      // BONUS: Build the Gauge Chart
      buildGauge(respMetadata.WFREQ);  
    })    
    
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  
  // @TODO: Build a Bubble Chart using the sample data
  d3.json('/names').then((mydata) => {
        var trace1 = {
          x: mydata["otu_ids"],
          y: mydata["sample_values"],
          text: mydata["otu_labels"],
          hovertemplate: '(%{x},%{y})<br>%{text}',
          mode: 'markers',
          marker: {
            color: mydata["otu_ids"],
            size: mydata["sample_values"]
          }
        };
        
        var data = [trace1];
        
        var layout = {
          showlegend: false,
          height: 600,
        };
        
        Plotly.purge('bubble');
        Plotly.newPlot('bubble', data, layout);

  // @TODO: Build a Pie Chart
  // first, we delete previous chart
  
        var dataToGraph = [{
          values: mydata["sample_values"],
          labels: mydata["otu_ids"],
          text: mydata["otu_labels"],
          textinfo: 'percent',
          hoverinfo: 'text',
          name: `sample ${sample}`,
          type: "pie",
        }];
      
        var layout = {
          margin: {
            l: 0,
            r: 0,
            b: -10,
            t: 0,
            pad: 1
          },
        };

        var config = {
          toImageButtonOptions: {
            format: 'svg', // one of png, svg, jpeg, webp
            filename: 'custom_image',
            height: 450,
            width: 450,
            scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
          },
          staticPlot: true // for to hide control bar
        };
        
        Plotly.purge('pie');
        Plotly.plot("pie", dataToGraph, layout, config);
  })
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  /* Primero ejecutamos el servidor flask de python
     una vez que la página web es lanzada, se carga el app.js, este ejecuta
     su método init() (ver última línea) y dentro del método init()
     ejecutamos la sentencia siguiente d3.json("/names"), obligando a llamar
     una rutina de flask que nos devuelve un json con los datos de los códigos
     de las muestras para llenar el combo box o select text de nuestra web */
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    
  });
}

function newSelection(newSample) {
  // Fetch new data each time a new sample is selected
  
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();






