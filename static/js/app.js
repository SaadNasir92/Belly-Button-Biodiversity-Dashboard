function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metaData = data.metadata

    // Filter the metadata for the object with the desired sample number
    let currentSample = metaData.find(obj => obj.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html('');

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(currentSample).forEach(([key, value]) => {
      panel.append('p').text(`${key}: ${value}`);
      });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
  let sampleData = data.samples

    // Filter the samples for the object with the desired sample number
  let currentSample = sampleData.find(obj => obj.id == sample);


    // Get the otu_ids, otu_labels, and sample_values
  let otu_ids = currentSample.otu_ids;
  let otu_labels = currentSample.otu_labels;
  let sample_values = currentSample.sample_values;


    // Build a Bubble Chart
  var trace1 = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: 'Viridis'
    }
  }
  var trace1Data = [trace1]

  var layout = {
    title: 'Bacteria Cultures Per Sample',
    showlegend: false,
    height: 500,
    width: 1500
  };

  
    // Render the Bubble Chart
  Plotly.newPlot("bubble", trace1Data, layout);
  
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
  let str_otu_ids = otu_ids.map((x) => `OTU ${x}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
  let sortedIndices = [...Array(sample_values.length).keys()]
  .sort((a, b) => sample_values[b] - sample_values[a])
  .slice(0, 10);

  let top_otu_ids = sortedIndices.map(i => str_otu_ids[i]);
  let top_otu_labels = sortedIndices.map(i => otu_labels[i]);
  let top_sample_values = sortedIndices.map(i => sample_values[i]);

  var trace2 = [{
    type: 'bar',
    x: top_sample_values.reverse(),
    y: top_otu_ids.reverse(),
    orientation: 'h',
    text: top_otu_labels.reverse()
  }];
  var layout2 = {
    title: 'Top 10 Bacteria Cultures Found',
    showlegend: false,
    height: 600,
    width: 800,
    xaxis: {
      title: 'Number of Bacteria'
    },
  };
    // Render the Bar Chart

  Plotly.newPlot('bar', trace2, layout2);

})};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let nameData = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropDown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    nameData.forEach((name_) => {
      dropDown.append('option').text(name_).property('value', name_);
    });
    
    // Get the first sample from the list
    firstSample = nameData[0];

    // Build charts and metadata panel with the first sample
    buildPage(firstSample);
  });
};

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildPage(newSample)
};

function buildPage(sample) {
  buildMetadata(sample);
  buildCharts(sample);
};

// Initialize the dashboard
init();
