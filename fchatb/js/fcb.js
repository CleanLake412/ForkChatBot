
function openFCB(containerID) {

    let modal = $('#' + containerID),
        overlay = $('.md-overlay')[0];

    // Q&A テキストを解析して分岐データを生成する。
    let jsonData = parseChatForksText(forkText1);

    /**
     * ボットの質問リストからボタンリストを作成する
     *
     * @param options 質問リスト
     * @return {string}
     */
    function createOptionList(options) {
        let optionList = '';
        options.forEach(function (item) {
            optionList += `<button class="msg-option">` + item.title + `</button>`;
        })

        return optionList;
    }

    let childData = undefined;
    let hasChild = false;

    /**
     * ボットの質問を作成する
     *
     * @param selected ユーザーが選択した項目
     * @return {string|string[]}
     */
    function createBotQuestion(selected = '') {
        if (selected == '') {
            childData = jsonData.children;
            hasChild = Array.isArray(childData) && childData.length > 0;
            return `<div class="bot-msg new-msg">
                        <div class="display-flex">
                            <div class="avatar"></div>
                            <div class="display-flex">
                                <div class="lead-triangle-left"></div>
                                <div class="msg-brd">
                                    <p>` + jsonData.instruction + `</p>` + createOptionList(jsonData.children) + `
                                </div>
                            </div>
                        </div>
                    </div>`;
        } else {
            let node;
            childData.forEach(function (item) {
                if (item.title == selected) {
                    node = item;
                }
            });

            hasChild = Array.isArray(node.children) && node.children.length > 0;
            if (hasChild) {
                childData = node.children;
                hasChild = Array.isArray(childData) && childData.length > 0;
                return [
                    `<div class="customer-msg new-msg">
                        <div class="display-flex justify-content-flex-end">
                            <div class="display-flex">
                                <div class="msg-brd">
                                    <p>` + node.title + `</p>
                                </div>
                                <div class="lead-triangle-right"></div>
                            </div>
                            <!-- <img class="avatar" src="https://placeimg.com/64/64/2"> -->
                        </div>
                    </div>`,
                    `<div class="bot-msg new-msg">
                        <div class="display-flex">
                            <div class="avatar"></div>
                            <div class="display-flex">
                                <div class="lead-triangle-left"></div>
                                <div class="msg-brd">
                                    <p>` + node.instruction.replaceAll('\n', '<br>') + `</p>` + createOptionList(node.children) + `
                                </div>
                            </div>
                        </div>
                    </div>`
                ];
            } else {
                return [
                    `<div class="customer-msg new-msg">
                        <div class="display-flex justify-content-flex-end">
                            <div class="display-flex">
                                <div class="msg-brd">
                                    <p>` + node.title + `</p>
                                </div>
                                <div class="lead-triangle-right"></div>
                            </div>
                            <!-- <img class="avatar" src="https://placeimg.com/64/64/2"> -->
                        </div>
                    </div>`,
                    `<div class="bot-msg new-msg">
                        <div class="display-flex">
                            <div class="avatar"></div>
                            <div class="display-flex">
                                <div class="lead-triangle-left"></div>
                                <div class="msg-brd">
                                    <p>` + node.instruction.replaceAll('\n', '<br>') + `</p>
                                    <br>
                                    <button class="msg-option md-refresh">もう一度最初から選択する</button><br>
                                    <button class="msg-option md-close">閉じる</button>
                                </div>
                            </div>
                        </div>
                    </div>`
                ];
            }
        }
    }

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    /**
     * Synchronized sleep
     *
     * @param ms
     * @return {Promise<unknown>}
     */
    const sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * ユーザーが答えを選択した時の動作
     *
     * @param option
     * @return {Promise<void>}
     */
    async function selectOption(option) {
        disableAllOptions();
        let botQuestion = createBotQuestion(option);

        if (Array.isArray(botQuestion)) {
            await asyncForEach(botQuestion, async function (question) {
                await sleep(500);
                $('.modal-bottom-chatbot-wrap', modal).html($('.modal-bottom-chatbot-wrap', modal).html().replaceAll('new-msg', '') + question);
                $('.md-content-box', modal).scrollTop($('.modal-bottom-chatbot-wrap', modal)[0].scrollHeight);
            });
        } else {
            await sleep(500);
            $('.modal-bottom-chatbot-wrap', modal).html($('.modal-bottom-chatbot-wrap', modal).html().replaceAll('new-msg', '') + botQuestion);
            $('.md-content-box', modal).scrollTop($('.modal-bottom-chatbot-wrap', modal)[0].scrollHeight);
        }

        let options = $('button.msg-option:not(.disabled):not(.md-refresh):not(.md-close)', modal);
        if (options) {
            options.each(function () {
                $(this).click(function (ev) {
                    selectOption(ev.target.innerText);
                });
            });
        }

        // 「もう一度最初から選択する」ボタンのハンドラー
        if ($('.md-refresh:not(.disabled)', modal).length > 0) {
            $('.md-refresh:not(.disabled)', modal)[0].addEventListener('click', async function (ev) {
                disableAllOptions();
                let botQuestion = [
                    `<div class="customer-msg new-msg">
                        <div class="display-flex justify-content-flex-end">
                            <div class="display-flex">
                                <div class="msg-brd">
                                    <p>もう一度最初から選択する</p>
                                </div>
                                <div class="lead-triangle-right"></div>
                            </div>
                            <!-- <img class="avatar" src="https://placeimg.com/64/64/2"> -->
                        </div>
                    </div>`,
                    createBotQuestion()
                ];

                // $('.modal-bottom-chatbot-wrap').html($('.modal-bottom-chatbot-wrap').html().replaceAll('new-msg', '') + createBotQuestion());
                await asyncForEach(botQuestion, async function (question) {
                    await sleep(500);
                    $('.modal-bottom-chatbot-wrap', modal).html($('.modal-bottom-chatbot-wrap', modal).html().replaceAll('new-msg', '') + question);
                    $('.md-content-box', modal).scrollTop($('.modal-bottom-chatbot-wrap', modal)[0].scrollHeight);
                });

                let options = $('button.msg-option:not(.disabled)', modal);
                if (options) {
                    options.each(function () {
                        $(this).click(function (ev) {
                            selectOption(ev.target.innerText);
                        });
                    });
                }
            });
        }

        // 「閉じる」ボタンの動作
        if ($('.md-close:not(.disabled)', modal).length > 0) {
            $('.md-close:not(.disabled)', modal)[0].addEventListener('click', function (ev) {
                ev.stopPropagation();
                removeModal();
            });
        }
    }

    function removeModal() {
        modal.removeClass('md-show');
    }

    function disableAllOptions() {
        $(".msg-option", modal).addClass("disabled");
        $(".msg-option.disabled", modal).prop('disabled', true);
    }

    // ダイアログを表示する。
    modal.addClass('md-show');
    overlay.removeEventListener('click', removeModal);
    overlay.addEventListener('click', removeModal);

    // 500ms 後、ダイアログを表示する
    $('.modal-bottom-chatbot-wrap', modal).html('');
    setTimeout(function () {
        $('.modal-bottom-chatbot-wrap', modal).html(createBotQuestion());
        let options = $('button.msg-option', modal);
        if (options) {
            options.each(function () {
                $(this).click(function (ev) {
                    selectOption(ev.target.innerText);
                });
            });
        }
    }, 500);

    // ✕ ボタンの処理
    $('.md-content h3 > span', modal)[0].addEventListener('click', function (ev) {
        ev.stopPropagation();
        removeModal();
    });
}
