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

    // Create an audio element
    const audio = new Audio();

    textGroup
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", (d) => xScale(d.x))
        .attr("y", (d) => yScale(d.y))
        .text((d) => d["genre-name"])
        .attr("font-size", "20px")
        .attr("fill", (d) => d.color)
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
        })
        .on("click", function (event, d) {
            // Stop any currently playing audio
            audio.pause();
            audio.currentTime = 0;

            // Set the new audio source and play
            audio.src = d.url;
            audio.play();
        });

    let userPanned = false;
    let inactivityTimer;
    let driftInterval;

    const zoom = d3
        .zoom()
        .scaleExtent([10, 10])
        .on("zoom", (event) => {
            userPanned = true;
            clearInterval(driftInterval);
            textGroup.attr("transform", event.transform);
            updateFontSize(event.transform);
            resetInactivityTimer();
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

    let t = 0;
    const a = 100; // horizontal radius of the infinity loop
    const b = 60; // vertical radius of the infinity loop
    const centerX = width / 2;
    const centerY = height / 2;

    function infinityDrift() {
        t += 0.01;
        const x = (a * Math.sin(t)) / (1 + Math.cos(t) * Math.cos(t));
        const y =
            (b * Math.sin(t) * Math.cos(t)) / (1 + Math.cos(t) * Math.cos(t));
        const currentTransform = d3.zoomTransform(svg.node());
        const newTransform = currentTransform.translate(x, y);

        textGroup
            .transition()
            .duration(400)
            .ease(d3.easeLinear)
            .attr("transform", newTransform);

        updateFontSize(newTransform);
    }

    function startDrift() {
        userPanned = false;
        clearInterval(driftInterval);
        driftInterval = setInterval(infinityDrift, 400);
    }

    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(startDrift, 30000); // 30 seconds
    }

    startDrift();

    svg.on("mousedown.drift touchstart.drift", () => {
        userPanned = true;
        clearInterval(driftInterval);
    });

    svg.on("mouseup.drift touchend.drift", () => {
        if (userPanned) {
            resetInactivityTimer();
        }
    });
});
