document.addEventListener("DOMContentLoaded", function () {
    const audioPlayer = new Audio(); // Create a single audio player for all previews
    document
        .querySelector(".submit-btn")
        .addEventListener("click", function () {
            const playlistUrl = document.getElementById("playlist-url").value;

            // Immediately use placeholder data if no URL is provided
            if (!playlistUrl.trim()) {
                fetchData("./assets/placeholder.json")
                    .then((data) => populateData(data))
                    .catch((error) =>
                        console.error(
                            "Error processing the placeholder JSON data:",
                            error
                        )
                    );
                return;
            }

            const playlistId = extractPlaylistId(playlistUrl);

            if (!playlistId) {
                alert("Invalid Playlist URL. Using default data instead.");
                fetchData("./assets/placeholder.json")
                    .then((data) => populateData(data))
                    .catch((error) =>
                        console.error(
                            "Error processing the placeholder JSON data:",
                            error
                        )
                    );
                return;
            }

            // Placeholder for actual API call, not used in this context
            fetchData(
                `https://8f25mqvzg8.execute-api.us-east-2.amazonaws.com/bharxhav/curate?playlist=${playlistId}`
            )
                .then((data) => populateData(data))
                .catch((error) =>
                    console.error("Error fetching data from the API:", error)
                );
        });
});

function fetchData(url) {
    return fetch(url).then((response) => response.json()); // Directly parsing JSON without replacing 'NaN' as the placeholder should not contain invalid JSON
}

function populateData(data) {
    const explorer = document.querySelector(".explorer");
    explorer.innerHTML = `<p>Our search uncovered <strong style="font-size: 20px">${data.total_found}</strong> songs that you're likely to enjoy over the next five years. Below are the top 100. To preview a song, simply click on <img src="./assets/play-song.png" style="cursor: pointer; width: 24px; vertical-align: middle;"/>. Happy exploring!</p>`;

    data.songs.forEach((song) => {
        const songElement = document.createElement("div");
        songElement.innerHTML = `
            <h3>${
                song.name
            } <img src="./assets/play-song.png" alt="Play" style="cursor: pointer; width: 24px; vertical-align: middle;" data-preview="${
            song.preview_url || "#"
        }"></h3>
            <p><i>${song.genre.join(", ")}</i></p>
        `;
        explorer.appendChild(songElement);
    });

    explorer.querySelectorAll("img").forEach((img) => {
        img.addEventListener("click", function () {
            const previewUrl = this.getAttribute("data-preview");
            if (previewUrl && previewUrl !== "#") {
                audioPlayer.src = previewUrl;
                audioPlayer.play();
            }
        });
    });
}

function extractPlaylistId(url) {
    const regex = /open.spotify.com\/playlist\/([a-zA-Z0-9]+)(?=\?|$)/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
}
