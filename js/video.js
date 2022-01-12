var video = document.getElementById('videobanner')

video.addEventListener('ended', (e) => {
    let activesource = document.querySelector('#videobanner source.active')
    var nextsource = document.querySelector("#videobanner source.active + source") || document
        .querySelector("#videobanner source:first-child");

    activesource.className = "";
    nextsource.className = "active";

    video.src = nextsource.src;
    video.play();
});