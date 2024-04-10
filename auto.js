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
            while (retry_times < retry_times_limit && document.getElementsByClassName("vjs-control-bar").length != document.getElementsByClassName("sd-icon-new-play").length) {
                console.log("retrying " + (retry_times + 1) + "/" + retry_times_limit);
                chaps.children[0].children[2].children[0].click();
                await sleep(rand_range(1000, 2000));
                chaps.children[i].children[j].children[0].click();
                await sleep(rand_range(5000, 8000));
                retry_times++;
            }
            if (document.getElementsByClassName("vjs-control-bar").length == 0) {
                continue;
            }
            console.log("caught video player");

            let play_buttons = document.getElementsByClassName("vjs-big-play-button");
            let progress_holder = document.getElementsByClassName("vjs-progress-holder");

            for (k = 0; k < play_buttons.length; k++) {
                console.log("trying to play video " + (k + 1) + "/" + play_buttons.length + " in section");
                let progress = progress_holder[k].getAttribute("aria-valuenow");
                if (progress > 95.0) {
                    continue;
                }
                play_buttons[k].click();
                let play_retry_times = 0;
                let play_retry_times_limit = 5;
                retry_times = 0;
                retry_times_limit = 6;
                while (progress_holder[k].getAttribute("aria-valuenow") == progress) {
                    await sleep(1000);
                    console.log("waiting for start " + (play_retry_times + 1) + "/" + play_retry_times_limit);
                    play_retry_times++;
                    if (play_retry_times > play_retry_times_limit) {
                        console.log("retrying " + (retry_times + 1) + "/" + retry_times_limit);
                        chaps.children[0].children[2].children[0].click();
                        await sleep(rand_range(1000, 2000));
                        chaps.children[i].children[j].children[0].click();
                        await sleep(rand_range(3000, 5000));

                        play_buttons = document.getElementsByClassName("vjs-big-play-button");
                        progress_holder = document.getElementsByClassName("vjs-progress-holder");

                        play_buttons[k].click();
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
                while (play_buttons[0] == null || progress_holder[k].getAttribute("aria-valuenow") != progress || progress < 100.0 || isNaN(progress)) {
                    if (document.getElementsByClassName("video-error")[0] != null || play_buttons[0] == null || (progress_holder[k].getAttribute("aria-valuenow") == progress && progress < 100.0 && Array.from(document.getElementsByClassName("practice-box")).filter(element => window.getComputedStyle(element).display != "none")[0] != undefined)) {
                        await sleep(rand_range(20000, 30000));
                        if (!(document.getElementsByClassName("video-error")[0] != null || play_buttons[0] == null || (progress_holder[k].getAttribute("aria-valuenow") == progress && progress < 100.0 && Array.from(document.getElementsByClassName("practice-box")).filter(element => window.getComputedStyle(element).display != "none")[0] == undefined))) {
                            continue;
                        }
                        console.log("video stopped and unfinished.retrying " + (retry_times + 1) + "/" + retry_times_limit);
                        chaps.children[0].children[2].children[0].click();
                        await sleep(rand_range(1000, 2000));
                        chaps.children[i].children[j].children[0].click();
                        await sleep(rand_range(3000, 5000));

                        play_buttons = document.getElementsByClassName("vjs-big-play-button");
                        progress_holder = document.getElementsByClassName("vjs-progress-holder");

                        if (play_buttons[0] == null) continue;

                        play_buttons[k].click();
                        retry_times++;
                        play_retry_times = 0;
                    }
                    if (retry_times > retry_times_limit) {
                        break;
                    }

                    progress = progress_holder[k].getAttribute("aria-valuenow");
                    await sleep(rand_range(15000, 20000));
                    if (Array.from(document.getElementsByClassName("practice-box")).filter(element => window.getComputedStyle(element).display != "none")[0] != undefined) console.log("%cquestion", "background-color:red;color:black;font-size:30px;");
                    else
                    console.log("video playing");
                }
            }
        }
        section_begin = 2;
    }
}

main();