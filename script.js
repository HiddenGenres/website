// Load the data
d3.json("./data/dots.json").then((data) => {
    const svg = d3.select("#plot");
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    svg.attr("width", width).attr("height", height);

    // Create scales
    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.x))
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.y))
        .range([height, 0]);

    // Create a group for the text elements
    const textGroup = svg.append("g");

    // Create and add the text elements
    textGroup
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => xScale(d.x))
        .attr("y", (d) => yScale(d.y))
        .text((d) => d["genre-name"]) // Changed from d.name to d["genre-name"]
        .attr("font-size", "12px")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .attr("font-size", "16px")
                .attr("font-weight", "bold");
            d3.select("#genre-display").text(d["genre-name"]); // Changed here as well
        })
        .on("mouseout", function () {
            d3.select(this)
                .attr("font-size", "12px")
                .attr("font-weight", "normal");
            d3.select("#genre-display").text("");
        });

    // Set up zoom and pan behavior
    const zoom = d3
        .zoom()
        .scaleExtent([1, 10])
        .on("zoom", (event) => {
            textGroup.attr("transform", event.transform);
        });

    svg.call(zoom);

    // Initial zoom (adjust the scale factor as needed)
    const initialScale = 5;
    svg.call(zoom.transform, d3.zoomIdentity.scale(initialScale));
});
