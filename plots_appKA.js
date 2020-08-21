function buildMetadata(sample) {
  d3.json("samples.json").then((sampledata) => {
    // MetaData Table 
    var metaData = Object.values(sampledata.metadata);
    // var wfreq = sampledata.metadata[key].wfreq;
    // console.log(wfreq)
    var dropdownMenu = d3.select("#selDataset");
    var ID = dropdownMenu.property("value");
    var tbody = d3.select("#sample-metadata");
    var trow;
    // filter metaData to identify the index that matches ID (returns list of 1 object)
    var filteredMeta = metaData.filter(x => x.id == ID)
    // console.log(filteredMeta)
    var metaResult = filteredMeta[0];

    // clear table from previous entry
    tbody.html("");   
    // Loop through metaResult array and print key/value metadata in table
    Object.entries(metaResult).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
      trow = tbody.append("tr");
      trow.append("td").text(`${key}: ${value}`);
          });

  });
}

function buildCharts(sample) {
  d3.json("samples.json").then((sampledata) => {
    var labels = Object.values(sampledata.names);
    var keys = Object.keys(sampledata.names);
    var result = {};
    keys.forEach((key, i) => result[key] = labels[i]);
    // console.log(result);
    var dropdownMenu = d3.select("#selDataset");
    var ID = dropdownMenu.property("value");
    var key = Object.keys(result).find(key => result[key] === ID);
    var samples = Object.values(sampledata.samples);
    var otu_id = sampledata.samples[key].otu_ids.slice(0,10).map(x=> `OTU ${x}`);
    var sample_values = sampledata.samples[key].sample_values.slice(0,10).reverse();
    // console.log(sample_values);
    var otu_labels = sampledata.samples[key].otu_labels.slice(0,10);
    // console.log(otu_labels);
  
    // Horizontal Bar Chart
    var trace = {
        x: sample_values,
        y: otu_id,
        text: otu_labels,
        type:"bar",
        orientation: "h",
    };
    var data = [trace];
    var layout = {
    };
    Plotly.newPlot("bar", data, layout);

    // bubble chart
    var trace1 = {
        // x: otu_id,
        y: sample_values,
        mode: 'markers',
        marker: {
          size: sample_values,
        },
        text: otu_labels
    };
    var data1 = [trace1];
    var layout1 = {
        xaxis: { title: "OTU ID"},
        };
    Plotly.newPlot('bubble', data1, layout1);
  });
}

function init() {
d3.json("samples.json").then((sampledata) => {  
  // creating {} of keys that will be used as a reference
  var labels = Object.values(sampledata.names);
  var keys = Object.keys(sampledata.names);
  
  // creating {} of keys that will point to each data value
  var result = {};
    keys.forEach((key, i) => result[key] = labels[i]);

  // Create dropdown selector containing OTU IDs
  var selector = document.getElementById("selDataset");
      // Add options to the dropdown list
      for (var i = 0; i<labels.length; i++){
          var option = document.createElement("OPTION");
        // Set the "text" of the ID in the HTML
          option.innerHTML = labels[i];
        // Set the "value" of the ID in the HTML
          option.value = labels[i]; 
        // Add the Option element to DropDownList in HTML
        selector.options.add(option); 
      };

  // Use the list of sample names to populate the select options
  d3.selectAll("#selDataset").on("change", optionChanged);
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu option to a variable
  var ID = dropdownMenu.property("value");
  var key = Object.keys(result).find(key => result[key] === ID);
  var samples = Object.values(sampledata.samples);
  var otu_id = sampledata.samples[key].otu_ids.slice(0,10).map(x=> `OTU ${x}`);
  var sample_values = sampledata.samples[key].sample_values.slice(0,10).reverse();
  var otu_labels = sampledata.samples[key].otu_labels.slice(0,10);

  // Use the first sample from the list to build the initial plots
  var firstSample = labels[0];
  buildCharts(labels);
  buildMetadata(labels);
    });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected 
  // The function call is in the HTML file as <select id="selDataset" onchange="optionChanged(this.value)"></select>
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();