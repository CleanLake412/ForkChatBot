
function openFCB(isPerspective) {

    var modal = $('#modal-1'),
        close = $('.md-close'),
        overlay = $('.md-overlay')[0];

    var jsonData = parseChatForksText(forkText1);

    function createOptionList(data) {
        var optionList = '';
        data.forEach(function (item) {
            optionList += `<button class="msg-option">` + item.title + `</button>`;
        })

        return optionList;
    }

    var childData = undefined;
    var hasChild = false;
    function createBotQuestion(selected = '') {
        if (selected == '') {
            childData = jsonData.children;
            hasChild = Array.isArray(childData) && childData.length > 0;
            return `<div class="bot-msg new-msg" style="padding: 10px;">
                        <div class="display-flex">
                            <img class="avatar" src="./assets/image/icon-chat-qw.png">
                            <div class="display-flex">
                                <div class="lead-triangle-left"></div>
                                <div class="msg-brd">
                                    <p>` + jsonData.instruction + `</p>` + createOptionList(jsonData.children) + `
                                </div>
                            </div>
                        </div>
                    </div>`;
        } else {
            var data;
            childData.forEach(function (item) {
                if (item.title == selected) {
                    data = item;
                }
            });

            hasChild = Array.isArray(data.children) && data.children.length > 0;
            if (hasChild) {
                childData = data.children;
                hasChild = Array.isArray(childData) && childData.length > 0;
                return [`<div class="customer-msg new-msg">
                            <div class="display-flex justify-content-flex-end">
                                <div class="display-flex">
                                    <div class="msg-brd">
                                        <p>` + data.title + `</p>
                                    </div>
                                    <div class="lead-triangle-right"></div>
                                </div>
                                <!-- <img class="avatar" src="https://placeimg.com/64/64/2"> -->
                            </div>
                        </div>`,
                        `<div class="bot-msg new-msg" style="padding: 10px;">
                            <div class="display-flex">
                                <img class="avatar" src="./assets/image/icon-chat-qw.png">
                                <div class="display-flex">
                                    <div class="lead-triangle-left"></div>
                                    <div class="msg-brd">
                                        <p>` + data.instruction.replaceAll('\n', '<br>') + `</p>` + createOptionList(data.children) + `
                                    </div>
                                </div>
                            </div>
                        </div>`];
            } else {
                return [`<div class="customer-msg new-msg">
                            <div class="display-flex justify-content-flex-end">
                                <div class="display-flex">
                                    <div class="msg-brd">
                                        <p>` + data.title + `</p>
                                    </div>
                                    <div class="lead-triangle-right"></div>
                                </div>
                                <!-- <img class="avatar" src="https://placeimg.com/64/64/2"> -->
                            </div>
                        </div>`,
                        `<div class="bot-msg new-msg" style="padding: 10px;">
                            <div class="display-flex">
                                <img class="avatar" src="./assets/image/icon-chat-qw.png">
                                <div class="display-flex">
                                    <div class="lead-triangle-left"></div>
                                    <div class="msg-brd">
                                        <p>` + data.instruction.replaceAll('\n', '<br>') + `</p>
                                    </div>
                                </div>
                            </div>
                        </div>`,
                        `<div class="bottom-button-area">
                            <button class="md-refresh">もう一度最初から選択する</button>
                            <button class="md-close">閉じる</button>
                        </div>`];
            }
        }
    }

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    const sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async function selectOption(option) {
        disableAllOptions();
        var botQuestion = createBotQuestion(option);

        if (Array.isArray(botQuestion)) {
            await asyncForEach(botQuestion, async function (question) {
                await sleep(500);
                $('.md-modal .md-content > div').html($('.md-modal .md-content > div').html().replaceAll('new-msg', '') + question);
                $('.md-modal .md-content > div').scrollTop($('.md-modal .md-content > div')[0].scrollHeight);
            });
        } else {
            await sleep(500);
            $('.md-modal .md-content > div').html($('.md-modal .md-content > div').html().replaceAll('new-msg', '') + botQuestion);
            $('.md-modal .md-content > div').scrollTop($('.md-modal .md-content > div')[0].scrollHeight);
        }

        var options = $('button.msg-option:not(.disabled)');
        if (options) {
            options.each(function () {
                $(this).click(function (ev) {
                    selectOption(ev.target.innerText);
                });
            });
        }

        refresh = $('.md-refresh');
        if (refresh[0]) {
            refresh[0].addEventListener('click', function (ev) {
                var n = $('.md-modal .md-content > div').html().indexOf(`<div class="bottom-button-area">`);
                $('.md-modal .md-content > div').html($('.md-modal .md-content > div').html().substring(0, n).replaceAll('new-msg', '') + createBotQuestion());
                var options = $('button.msg-option');
                if (options) {
                    options.each(function () {
                        $(this).click(function (ev) {
                            selectOption(ev.target.innerText);
                        });
                    });
                }

                $('.md-modal .md-content > div').scrollTop($('.md-modal .md-content > div')[0].scrollHeight);
            });
        }

        close = $('.md-close');
        if (close[0]) {
            close[0].addEventListener('click', function (ev) {
                ev.stopPropagation();
                removeModalHandler();
            });
        }
    }

    function removeModal(hasPerspective) {
        modal.removeClass('md-show');

        if (hasPerspective) {
            $(document.documentElement).removeClass('md-perspective');
        }
    }

    function removeModalHandler() {
        removeModal(isPerspective);
    }

    modal.addClass('md-show');
    overlay.removeEventListener('click', removeModalHandler);
    overlay.addEventListener('click', removeModalHandler);

    function disableAllOptions() {
        $(".msg-option").addClass("disabled");
        $(".msg-option.disabled").prop('disabled', true);
    }

    if (isPerspective) {
        setTimeout(function () {
            $(document.documentElement).addClass('md-perspective');
        }, 25);
    }

    $('.md-modal .md-content > div').html(createBotQuestion());
    var options = $('button.msg-option');
    if (options) {
        options.each(function () {
            $(this).click(function (ev) {
                selectOption(ev.target.innerText);
            });
        });
    }

    $('.md-content h3 > span')[0].addEventListener('click', function (ev) {
        ev.stopPropagation();
        removeModalHandler();
    });
}