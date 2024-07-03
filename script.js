// Load the data
d3.json("./data/dots.json").then((data) => {
    const svg = d3.select("#plot");
    const width = 400;
    const height = 400;

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

    // Create and add the points
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("r", 3)
        .attr("fill", "blue")
        .on("mouseover", function (event, d) {
            d3.select(this).attr("r", 5);
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", xScale(d.x) + 5)
                .attr("y", yScale(d.y) - 5)
                .text(d.genre);
        })
        .on("mouseout", function () {
            d3.select(this).attr("r", 3);
            svg.select("#tooltip").remove();
        });
});
