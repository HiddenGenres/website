// Then, add this D3.js code
d3.json("./data/dots.json").then((data) => {
    const svg = d3.select("#plot");
    const width = document.getElementById("plot-container").offsetWidth;
    const height = document.getElementById("plot-container").offsetHeight;

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

    // Create a group for the points
    const pointsGroup = svg.append("g");

    // Create and add the points
    pointsGroup
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 3)
        .attr("fill", "black")
        .on("mouseover", function (event, d) {
            d3.select(this).attr("r", 5);
            d3.select("body")
                .append("div")
                .attr("id", "genre-display")
                .text(d.genre);
        })
        .on("mouseout", function () {
            d3.select(this).attr("r", 3);
            d3.select("#genre-display").remove();
        });

    // Set up zoom and pan behavior
    const zoom = d3
        .zoom()
        .scaleExtent([1, 10])
        .on("zoom", (event) => {
            pointsGroup.attr("transform", event.transform);
        });

    svg.call(zoom);

    // Initial zoom (adjust the scale factor as needed)
    const initialScale = 5;
    svg.call(zoom.transform, d3.zoomIdentity.scale(initialScale));
});
