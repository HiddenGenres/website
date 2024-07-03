d3.json("./data/dots.json").then((data) => {
    const svg = d3.select("#plot");
    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    svg.attr("width", width).attr("height", height);

    const xScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.x))
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.y))
        .range([height, 0]);

    const textGroup = svg.append("g");

    function updateFontSize(transform) {
        const fontSize = 20 / transform.k;
        textGroup.selectAll("text").attr("font-size", `${fontSize}px`);
    }

    textGroup
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => xScale(d.x))
        .attr("y", (d) => yScale(d.y))
        .text((d) => d["genre-name"])
        .attr("font-size", "20px")
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("cursor", "pointer")
        .on("mouseover", function (event, d) {
            const currentFontSize = parseFloat(
                d3.select(this).attr("font-size")
            );
            d3.select(this)
                .attr("font-size", `${currentFontSize * 1.33}px`)
                .attr("font-weight", "bold");
            d3.select("#genre-display").text(d["genre-name"]);
        })
        .on("mouseout", function () {
            const currentFontSize = parseFloat(
                d3.select(this).attr("font-size")
            );
            d3.select(this)
                .attr("font-size", `${currentFontSize / 1.33}px`)
                .attr("font-weight", "normal");
            d3.select("#genre-display").text("");
        });

    const zoom = d3
        .zoom()
        .scaleExtent([10, 10])
        .on("zoom", (event) => {
            textGroup.attr("transform", event.transform);
            updateFontSize(event.transform);
        });

    svg.call(zoom);

    const randomPoint = data[Math.floor(Math.random() * data.length)];

    const initialScale = 10;
    const translateX = width / 2 - xScale(randomPoint.x) * initialScale;
    const translateY = height / 2 - yScale(randomPoint.y) * initialScale;

    const initialTransform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(initialScale);
    svg.call(zoom.transform, initialTransform);
    updateFontSize(initialTransform);

    let angle = 0;
    const radius = 100;
    const centerX = width / 2;
    const centerY = height / 2;

    let userPanned = false;

    function drift() {
        if (userPanned) return; // Stop drifting if the user has panned
        angle += 0.01;
        const dx = radius * Math.cos(angle);
        const dy = radius * Math.sin(angle);
        const currentTransform = d3.zoomTransform(svg.node());
        const newTransform = currentTransform.translate(dx, dy);

        textGroup
            .transition()
            .duration(400)
            .ease(d3.easeLinear)
            .attr("transform", newTransform)
            .on("end", drift);

        updateFontSize(newTransform);
    }

    drift();

    svg.on("mousedown touchstart", () => {
        userPanned = true;
        svg.on(".zoom", null);
        textGroup.interrupt();
    });
});
