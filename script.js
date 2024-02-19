document.addEventListener("DOMContentLoaded", function () {
    // Set the launch date in EST
    var launchDate = new Date("Feb 20, 2024 20:20:20 GMT-0500").getTime();

    var countdownFunction = setInterval(function () {
        var now = new Date().getTime();

        // Calculate the difference between now and the launch date
        var distance = launchDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the countdown
        document.getElementById("countdown").innerHTML =
            "T - " +
            days +
            "d " +
            hours +
            "h " +
            minutes +
            "m " +
            seconds +
            "s ";

        // If the countdown is over, display a message
        if (distance < 0) {
            clearInterval(countdownFunction);
            document.getElementById("countdown").innerHTML = "EXPIRED";
        }
    }, 1000);
});
