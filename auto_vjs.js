function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

function rand_range(max, min) {
    return Math.floor(Math.random() * (max - min) + min);
}

async function reload_videos(retry_times_limit, i, j) {
    let retry_times = 0;
    console.log(document.getElementsByTagName('video').length,document.getElementsByClassName("sd-icon-new-play").length);
    while ((document.getElementsByTagName('video').length != document.getElementsByClassName("sd-icon-new-play").length) && (retry_times < retry_times_limit)) {
        console.log("retrying in func " + (retry_times + 1) + "/" + (retry_times_limit));
        chaps.children[0].children[2].children[0].click();
        await sleep(rand_range(1000, 2000));
        chaps.children[i].children[j].children[0].click();
        await sleep(rand_range(5000, 8000));
        retry_times++;
    }
}

var chaps = document.getElementsByClassName('sr-catalog')[0];

Array.from(chaps.children).forEach(element => {
    if (element.classList.contains('hide-status')) {
        element.children[0].click();
    }
});

async function main() {

    var chaps_begin = Number(prompt("start from chap __(1-" + chaps.children.length + ")", "")) - 1;

    //chaps.children[chaps_begin].children[0].click();

    await sleep(rand_range(1000, 2000));

    var section_begin = Number(prompt("start from section __(1-" + Number(chaps.children[chaps_begin].children.length - 2) + ")", "")) + 1; //fake section including title

    for (let i = chaps_begin; i < chaps.children.length; i++) {
        for (let j = section_begin; j < chaps.children[i].children.length; j++) {
            console.log("trying to play chap " + (i + 1) + " section " + (j - 1) + " (response in 8s)");
            await sleep(rand_range(4000, 8000));
            chaps.children[i].children[j].children[0].click();
            console.log("trying to catch video player (response in 10s)");
            await sleep(rand_range(7000, 10000));
            let retry_times = 0;
            let retry_times_limit = 2;

            await reload_videos(2, i, j);

            if (document.getElementsByClassName("sd-icon-new-play").length == 0) {
                continue;
            }
            console.log("caught video player");

            for (k = 0; k < document.getElementsByClassName("sd-icon-new-play").length; k++) {
                console.log("trying to play video " + (k + 1) + "/" + document.getElementsByClassName("sd-icon-new-play").length + " in section");

                let video_now = videojs(document.getElementsByTagName('video')[k]);

                let currentTime_now = video_now.currentTime();

                if (video_now.currentTime() > (video_now.duration() - 1)) {
                    continue;
                }
                video_now.play();
                await sleep(rand_range(3000, 6000));
                let play_retry_times = 0;
                let play_retry_times_limit = 5;
                retry_times = 0;
                retry_times_limit = 6;
                currentTime_now = video_now.currentTime();
                while (video_now.currentTime() == currentTime_now) {
                    await sleep(1000);
                    console.log("waiting for start " + (play_retry_times + 1) + "/" + play_retry_times_limit);
                    play_retry_times++;
                    if (play_retry_times > play_retry_times_limit) {
                        console.log("retrying " + (retry_times + 1) + "/" + retry_times_limit);
                        chaps.children[0].children[2].children[0].click();
                        await sleep(rand_range(1000, 2000));
                        chaps.children[i].children[j].children[0].click();
                        await sleep(rand_range(3000, 5000));

                        await reload_videos(2, i, j);

                        video_now = videojs(document.getElementsByTagName('video')[k]);

                        video_now.play();
                        retry_times++;
                        play_retry_times = 0;
                    }
                    if (retry_times > retry_times_limit) {
                        break;
                    }
                    await sleep(2000);
                }
                console.log("video started");
                retry_times = 0;
                retry_times_limit = 6;
                while (video_now.currentTime() < (video_now.duration() - 1)) {
                    currentTime_now = video_now.currentTime();
                    await sleep(rand_range(15000, 20000));

                    if ((video_now.paused() || video_now.currentTime() == currentTime_now) && (video_now.currentTime() < (video_now.duration() - 1))) {
                        console.log("video stopped and unfinished.retrying " + (retry_times + 1) + "/" + retry_times_limit);
                        chaps.children[0].children[2].children[0].click();
                        await sleep(rand_range(1000, 2000));
                        chaps.children[i].children[j].children[0].click();
                        await sleep(rand_range(3000, 5000));

                        await reload_videos(2, i, j);

                        await sleep(rand_range(3000, 6000));

                        video_now = videojs(document.getElementsByTagName('video')[k]);

                        video_now.play();
                        retry_times++;
                        play_retry_times = 0;
                    }
                    if (retry_times > retry_times_limit) {
                        break;
                    }

                    console.log("video playing");
                }
            }
        }
        section_begin = 2;
    }
}

main();