// ====================
// 共通
// ====================

const today =
    new Date().toISOString().split("T")[0];


// ====================
// 連続ログイン
// ====================

const lastLogin =
    localStorage.getItem("lastLogin");

let streak =
    Number(localStorage.getItem("streak")) || 0;


// 初回ログイン
if (lastLogin === null) {

    streak = 1;

}

// 前回ログインが昨日か確認
else if (lastLogin !== today) {

    const lastDate =
        new Date(lastLogin);

    const todayDate =
        new Date(today);

    const difference =
        (todayDate - lastDate)
        / (1000 * 60 * 60 * 24);


    if (difference === 1) {

        streak++;

    } else {

        streak = 1;

    }
}


localStorage.setItem(
    "lastLogin",
    today
);

localStorage.setItem(
    "streak",
    streak
);


document.getElementById(
    "streak"
).textContent = streak;


// ====================
// 応援メッセージ
// ====================

const streakMessages = [

	{ min: 0,  message: "🌱 千里の道も一歩から。今日という一日を、大切に始めよう。" },
	{ min: 2,  message: "🌿 継続は力なり。小さな積み重ねが、未来の自分をつくる。" },
	{ min: 3,  message: "☀️ 三日坊主を越えた先に、新しい自分が待っている。" },
	{ min: 7,  message: "🌸 日進月歩。一週間前の自分より、少しずつ前へ。" },
	{ min: 14, message: "🍀 塵も積もれば山となる。何気ない日々が、大きな力に変わる。" },
	{ min: 30, message: "🌷 有言実行。続けてきた日々が、あなたの自信になる。" },
	{ min: 60, message: "✨ 不撓不屈。歩みを止めなかった日々は、決して無駄にはならない。" }

];


function updateStreakMessage() {

    let current =
        streakMessages[0];


    for (
        let i = 0;
        i < streakMessages.length;
        i++
    ) {

        if (
            streak >=
            streakMessages[i].min
        ) {

            current =
                streakMessages[i];

        }

    }


    document.getElementById(
        "streakMessage"
    ).textContent =
        current.message;

}


updateStreakMessage();


// ====================
// 連続ログイン称号
// ====================

const streakTitles = [

    { min: 0,  name: "🌱 希望の芽" },
    { min: 3,  name: "🌿 日々精進" },
    { min: 7,  name: "🌸 継続は力なり" },
    { min: 14, name: "🍀 日進月歩" },
    { min: 30, name: "🌻 努力の結晶" },
    { min: 60, name: "✨ 不撓不屈" }

];


const streakTitleEl =
    document.getElementById(
        "streakTitle"
    );

const streakDaysEl =
    document.getElementById(
        "streakDays"
    );

const streakProgressFill =
    document.getElementById(
        "streakProgressFill"
    );

const streakNextEl =
    document.getElementById(
        "streakNext"
    );


function updateStreakTitleDisplay() {

    streakDaysEl.textContent =
        streak;


    // 現在の称号（条件を満たす最後のものを探す）
    let current =
        streakTitles[0];

    let next =
        null;


    for (
        let i = 0;
        i < streakTitles.length;
        i++
    ) {

        if (
            streak >=
            streakTitles[i].min
        ) {

            current =
                streakTitles[i];

            next =
                streakTitles[i + 1] ||
                null;

        }

    }


    streakTitleEl.textContent =
        current.name;


    if (next) {

        const range =
            next.min - current.min;

        const progress =
            streak - current.min;

        const percent =
            Math.min(
                100,
                Math.round(
                    (progress / range) * 100
                )
            );

        streakProgressFill.style.width =
            `${percent}%`;

        streakNextEl.textContent =
            `次の称号「${next.name}」まであと ${next.min - streak}日`;

    } else {

        streakProgressFill.style.width =
            "100%";

        streakNextEl.textContent =
            "最高称号に到達しました！";

    }

}


updateStreakTitleDisplay();


// ====================
// デイリーミッション
// ====================

const defaultMissions = [

    {
        id: "add",
        icon: "📝",
        name: "メモを1個追加する",
        reward: 10
    },

    {
        id: "view",
        icon: "👀",
        name: "メモを確認する",
        reward: 10
    },

    {
        id: "event",
        icon: "📅",
        name: "予定を1個確認する",
        reward: 10
    },

    {
        id: "edit",
        icon: "✏️",
        name: "メモを1個編集する",
        reward: 10
    },

    {
        id: "delete",
        icon: "🗑️",
        name: "メモを1個削除する",
        reward: 10
    },

    {
        id: "calendar",
        icon: "📆",
        name: "カレンダーを確認する",
        reward: 10
    }
];


// 削除した「最初から入っているミッション」のID
let deletedDefaultMissionIds =
    JSON.parse(
        localStorage.getItem(
            "deletedDefaultMissionIds"
        )
    ) || [];

function saveDeletedDefaultMissionIds() {

    localStorage.setItem(
        "deletedDefaultMissionIds",
        JSON.stringify(deletedDefaultMissionIds)
    );

}

// 実際に使う組み込みミッション（削除したものは除く）
let missions =
    defaultMissions.filter(
        m => !deletedDefaultMissionIds.includes(m.id)
    );


// ユーザーが自分で追加したミッション
let customMissions =
    JSON.parse(
        localStorage.getItem(
            "customMissions"
        )
    ) || [];


function saveCustomMissions() {

    localStorage.setItem(
        "customMissions",
        JSON.stringify(customMissions)
    );

}


function generateMissionId() {

    return (
        "custom-" +
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 8)
    );

}


const missionList =
    document.getElementById(
        "missionList"
    );

const missionCount =
    document.getElementById(
        "missionCount"
    );

const missionTotal =
    document.getElementById(
        "missionTotal"
    );

const missionBonus =
    document.getElementById(
        "missionBonus"
    );


// 保存されているミッション
let dailyMissions =
    JSON.parse(
        localStorage.getItem(
            "dailyMissions"
        )
    );

const savedMissionDate =
    localStorage.getItem(
        "dailyMissionDate"
    );


// 日付が変わった（または初回）場合は、自分で選ぶまでミッション無し
const needsMissionSelection =
    savedMissionDate !== today ||
    !dailyMissions;

if (needsMissionSelection) {

    dailyMissions = [];

}


// ミッション表示
function displayMissions() {

    missionList.innerHTML = "";

    let completedCount = 0;


    dailyMissions.forEach(
        function(mission, index) {

            const div =
                document.createElement("div");

            div.className =
                "mission-item";


            if (mission.completed) {

                div.classList.add(
                    "completed"
                );

                completedCount++;

            }


            div.innerHTML = `

                <div class="mission-info">

                    <span class="mission-icon">
                        ${mission.icon}
                    </span>

                    <div>

                        <div class="mission-name">
                            ${mission.name}
                        </div>

                        <div class="mission-reward">
                            +${mission.reward}pt
                        </div>

                    </div>

                </div>

                <div class="mission-actions">

                    <button
                        class="mission-button"
                        ${mission.completed
                            ? "disabled"
                            : ""}>

                        ${
                            mission.completed
                            ? "✅ 完了"
                            : "達成する"
                        }

                    </button>

                    ${
                        mission.custom
                        ? '<button class="mission-delete-button" title="このミッションを削除">🗑️</button>'
                        : ""
                    }

                </div>

            `;


            const button =
                div.querySelector(
                    ".mission-button"
                );


            button.addEventListener(
                "click",
                function() {

                    completeMission(index);

                }
            );


            if (mission.custom) {

                const deleteButton =
                    div.querySelector(
                        ".mission-delete-button"
                    );

                deleteButton.addEventListener(
                    "click",
                    function() {

                        deleteCustomMission(
                            mission.id,
                            index
                        );

                    }
                );

            }


            missionList.appendChild(div);

        }
    );


    missionCount.textContent =
        completedCount;

    missionTotal.textContent =
        dailyMissions.length;


    if (
        dailyMissions.length > 0 &&
        completedCount === dailyMissions.length
    ) {

        missionBonus.textContent =
            "🎉 全ミッション達成！ ボーナス +20pt";


        // ボーナスは1日1回だけ加算
        const bonusAwardedDate =
            localStorage.getItem(
                "bonusAwardedDate"
            );

        if (bonusAwardedDate !== today) {

            addPoints(20);

            localStorage.setItem(
                "bonusAwardedDate",
                today
            );

        }

    } else {

        missionBonus.textContent =
            `あと ${dailyMissions.length - completedCount} 個！`;

    }

}


// カスタムミッションを削除（今日のリストと保存済みミッション一覧の両方から）
function deleteCustomMission(missionId, index) {

    const result =
        confirm(
            "このミッションを削除しますか？"
        );

    if (!result) {
        return;
    }


    dailyMissions.splice(
        index,
        1
    );

    localStorage.setItem(
        "dailyMissions",
        JSON.stringify(dailyMissions)
    );


    customMissions =
        customMissions.filter(
            m => m.id !== missionId
        );

    saveCustomMissions();


    displayMissions();

}


// ミッション達成
function completeMission(index) {

    dailyMissions[index].completed =
        true;


    localStorage.setItem(
        "dailyMissions",
        JSON.stringify(
            dailyMissions
        )
    );


    addPoints(
        dailyMissions[index].reward
    );


    displayMissions();

}


// ====================
// 称号
// ====================

const titles = [

    { min: 0,   name: "🌱 記録のはじまり" },
    { min: 50,  name: "📝 記録の習慣" },
    { min: 150, name: "🌿 記録の積み重ね" },
    { min: 300, name: "🌸 記録の匠" },
    { min: 500, name: "✨ 思い出の宝箱" }

];


const currentTitleEl =
    document.getElementById(
        "currentTitle"
    );

const totalPointsEl =
    document.getElementById(
        "totalPoints"
    );

const titleProgressFill =
    document.getElementById(
        "titleProgressFill"
    );

const titleNextEl =
    document.getElementById(
        "titleNext"
    );


let totalPoints =
    Number(
        localStorage.getItem(
            "totalPoints"
        )
    ) || 0;


// ポイントを加算して表示を更新
function addPoints(amount) {

    totalPoints += amount;

    localStorage.setItem(
        "totalPoints",
        totalPoints
    );

    updateTitleDisplay();

}


// 称号表示を更新
function updateTitleDisplay() {

    totalPointsEl.textContent =
        totalPoints;


    // 現在の称号（条件を満たす最後のものを探す）
    let current =
        titles[0];

    let next =
        null;


    for (
        let i = 0;
        i < titles.length;
        i++
    ) {

        if (
            totalPoints >=
            titles[i].min
        ) {

            current =
                titles[i];

            next =
                titles[i + 1] ||
                null;

        }

    }


    currentTitleEl.textContent =
        current.name;


    if (next) {

        const range =
            next.min - current.min;

        const progress =
            totalPoints - current.min;

        const percent =
            Math.min(
                100,
                Math.round(
                    (progress / range) * 100
                )
            );

        titleProgressFill.style.width =
            `${percent}%`;

        titleNextEl.textContent =
            `次の称号「${next.name}」まであと ${next.min - totalPoints}pt`;

    } else {

        titleProgressFill.style.width =
            "100%";

        titleNextEl.textContent =
            "最高称号に到達しました！";

    }

}


updateTitleDisplay();


displayMissions();


// ====================
// 今日のミッションを選ぶ画面
// ====================

const missionPickerOverlay =
    document.getElementById(
        "missionPickerOverlay"
    );

const missionPickerList =
    document.getElementById(
        "missionPickerList"
    );

const missionPickerWarning =
    document.getElementById(
        "missionPickerWarning"
    );

const missionPickerConfirm =
    document.getElementById(
        "missionPickerConfirm"
    );

const missionPickerRandom =
    document.getElementById(
        "missionPickerRandom"
    );


// 1日に選べるミッションの上限
const MAX_DAILY_MISSIONS = 3;

const missionPickerCount =
    document.getElementById(
        "missionPickerCount"
    );


// 選択数を数えて、上限に達したら残りを選べなくする
function updateMissionPickerLimit() {

    const inputs =
        missionPickerList.querySelectorAll("input");

    const checkedCount =
        missionPickerList.querySelectorAll("input:checked").length;


    inputs.forEach(
        input => {

            const disable =
                !input.checked &&
                checkedCount >= MAX_DAILY_MISSIONS;

            input.disabled =
                disable;

            input.parentElement.classList.toggle(
                "disabled",
                disable
            );

        }
    );


    missionPickerCount.textContent =
        `選択中：${checkedCount} / ${MAX_DAILY_MISSIONS}`;

}


// ミッション一覧から選択画面の中身を作る
function buildMissionPicker() {

    missionPickerList.innerHTML = "";


    const candidates =
        [...missions, ...customMissions];


    candidates.forEach(
        (mission, index) => {

            const label =
                document.createElement(
                    "label"
                );

            label.className =
                "mission-picker-item";

            label.innerHTML = `
                <input type="checkbox" value="${index}">
                <span class="picker-icon">${mission.icon}</span>
                <span class="picker-name">${mission.name}</span>
                <span class="picker-reward">+${mission.reward}pt</span>
            `;

            label.querySelector("input").addEventListener(
                "change",
                updateMissionPickerLimit
            );

            missionPickerList.appendChild(
                label
            );

        }
    );

    updateMissionPickerLimit();

}


// 選んだミッションを今日のミッションとして確定
function confirmMissionSelection(selectedMissions) {

    dailyMissions =
        selectedMissions.map(
            mission => {

                return {
                    ...mission,
                    completed: false
                };

            }
        );


    localStorage.setItem(
        "dailyMissions",
        JSON.stringify(dailyMissions)
    );

    localStorage.setItem(
        "dailyMissionDate",
        today
    );


    missionPickerOverlay.hidden =
        true;


    displayMissions();

}


if (needsMissionSelection) {

    if ([...missions, ...customMissions].length === 0) {

        // 選べるミッションが無い日は、ミッション無しで始める
        confirmMissionSelection([]);

    } else {

        buildMissionPicker();

        missionPickerOverlay.hidden =
            false;

    }

}


missionPickerConfirm.addEventListener(
    "click",
    function() {

        const candidates =
            [...missions, ...customMissions];

        const checked =
            missionPickerList.querySelectorAll(
                "input:checked"
            );


        if (checked.length === 0) {

            missionPickerWarning.hidden =
                false;

            return;
        }


        missionPickerWarning.hidden =
            true;


        const selected =
            Array.from(checked)
                .slice(0, MAX_DAILY_MISSIONS)
                .map(
                    input => candidates[
                        Number(input.value)
                    ]
                );


        confirmMissionSelection(
            selected
        );

    }
);


missionPickerRandom.addEventListener(
    "click",
    function() {

        const shuffled =
            [...missions, ...customMissions].sort(
                () => Math.random() - 0.5
            );


        confirmMissionSelection(
            shuffled.slice(0, 3)
        );

    }
);


// ====================
// 自分でミッションを追加
// ====================

const customMissionInput =
    document.getElementById(
        "customMissionInput"
    );

const addCustomMissionButton =
    document.getElementById(
        "addCustomMission"
    );


addCustomMissionButton.addEventListener(
    "click",
    function() {

        const text =
            customMissionInput.value.trim();


        if (text === "") {

            alert(
                "ミッションの内容を入力してください！"
            );

            return;
        }


        const newMission = {

            id: generateMissionId(),
            icon: "📌",
            name: text,
            reward: 10,
            custom: true

        };


        // 保存済みミッション一覧に追加（明日以降の抽選対象になる）
        customMissions.push(
            newMission
        );

        saveCustomMissions();


        customMissionInput.value =
            "";


        alert(
            "ミッションを追加しました！明日以降のミッションに登場します。"
        );

    }
);


customMissionInput.addEventListener(
    "keydown",
    function(e) {

        if (e.key === "Enter") {

            addCustomMissionButton.click();

        }

    }
);


// ====================
// メモ
// ====================

const memoInput =
    document.getElementById(
        "memoInput"
    );

const saveButton =
    document.getElementById(
        "saveButton"
    );

const memoList =
    document.getElementById(
        "memoList"
    );


let memos =
    JSON.parse(
        localStorage.getItem("memos")
    ) || [];


// メモ表示
function displayMemos() {

    memoList.innerHTML = "";


    memos.forEach(
        function(memo, index) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "memo-item";


            // 本文
            const text =
                document.createElement(
                    "p"
                );

            text.textContent =
                memo;


            div.appendChild(text);


            // ボタン
            const buttons =
                document.createElement(
                    "div"
                );

            buttons.className =
                "memo-buttons";


            // 編集
            const editButton =
                document.createElement(
                    "button"
                );

            editButton.textContent =
                "✏️ 編集";

            editButton.className =
                "edit-button";


            editButton.addEventListener(
                "click",
                function() {

                    const newMemo =
                        prompt(
                            "メモを変更してください",
                            memos[index]
                        );


                    if (
                        newMemo === null
                    ) {
                        return;
                    }


                    if (
                        newMemo.trim() === ""
                    ) {

                        alert(
                            "メモを空にすることはできません。"
                        );

                        return;
                    }


                    memos[index] =
                        newMemo.trim();


                    localStorage.setItem(
                        "memos",
                        JSON.stringify(memos)
                    );


                    displayMemos();

                }
            );


            // 削除
            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.textContent =
                "🗑️ 削除";

            deleteButton.className =
                "delete-button";


            deleteButton.addEventListener(
                "click",
                function() {

                    const result =
                        confirm(
                            "このメモを削除しますか？"
                        );


                    if (result) {

                        memos.splice(
                            index,
                            1
                        );


                        localStorage.setItem(
                            "memos",
                            JSON.stringify(memos)
                        );


                        displayMemos();

                    }

                }
            );


            buttons.appendChild(
                editButton
            );

            buttons.appendChild(
                deleteButton
            );


            div.appendChild(buttons);

            memoList.appendChild(div);

        }
    );

}


displayMemos();


// メモ保存
saveButton.addEventListener(
    "click",
    function() {

        const memo =
            memoInput.value.trim();


        if (memo === "") {

            alert(
                "メモを入力してください！"
            );

            return;
        }


        memos.push(memo);


        localStorage.setItem(
            "memos",
            JSON.stringify(memos)
        );


        memoInput.value = "";


        displayMemos();

    }
);


// ====================
// カレンダー
// ====================

const calendar =
    document.getElementById(
        "calendar"
    );

const monthTitle =
    document.getElementById(
        "monthTitle"
    );

const prevMonth =
    document.getElementById(
        "prevMonth"
    );

const nextMonth =
    document.getElementById(
        "nextMonth"
    );

const eventDate =
    document.getElementById(
        "eventDate"
    );

const eventText =
    document.getElementById(
        "eventText"
    );

const addEvent =
    document.getElementById(
        "addEvent"
    );

const upcomingEvents =
    document.getElementById(
        "upcomingEvents"
    );


// 表示中の月
let currentDate =
    new Date();


// 予定
let events =
    JSON.parse(
        localStorage.getItem("events")
    ) || [];


// 予定固有のID生成
function generateEventId() {

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2, 8)
    );

}


// 既存データにIDが無い場合は後付けする
let needsResave = false;

events.forEach(
    event => {

        if (!event.id) {

            event.id =
                generateEventId();

            needsResave = true;

        }

    }
);

if (needsResave) {

    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );

}


// 日付を YYYY-MM-DD にする
function getDateString(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


// カレンダー表示
function displayCalendar() {

    calendar.innerHTML = "";


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    monthTitle.textContent =
        `${year}年 ${month + 1}月`;


    // 月初の曜日
    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    // 月の日数
    const lastDate =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // 空白
    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );

        calendar.appendChild(
            empty
        );

    }


    // 日付
    for (
        let day = 1;
        day <= lastDate;
        day++
    ) {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "calendar-day";


        const date =
            new Date(
                year,
                month,
                day
            );


        const dateString =
            getDateString(date);


        // 今日
        if (
            dateString === today
        ) {

            div.classList.add(
                "today"
            );

        }


        div.innerHTML =
            `<strong>${day}</strong>`;


        // その日の予定
        const dayEvents =
            events.filter(
                event =>
                    event.date ===
                    dateString
            );


        if (
            dayEvents.length > 0
        ) {

            div.classList.add(
                "event-day"
            );


            dayEvents.forEach(
                event => {

                    const span =
                        document.createElement(
                            "span"
                        );

                    span.className =
                        "event-dot";


                    span.textContent =
                        "📌 " +
                        event.text;


                    div.appendChild(
                        span
                    );

                }
            );

        }


        // 日付をクリックしたら、その日の予定を設定する画面を開く
        div.addEventListener(
            "click",
            function() {

                openDayModal(dateString);

            }
        );


        calendar.appendChild(
            div
        );

    }

}


// 前の月
prevMonth.addEventListener(
    "click",
    function() {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        displayCalendar();

    }
);


// 次の月
nextMonth.addEventListener(
    "click",
    function() {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        displayCalendar();

    }
);


// ====================
// 予定追加
// ====================

addEvent.addEventListener(
    "click",
    function() {

        const date =
            eventDate.value;

        const text =
            eventText.value.trim();


        if (
            date === "" ||
            text === ""
        ) {

            alert(
                "日付と予定を入力してください！"
            );

            return;
        }


        events.push({

            id: generateEventId(),

            date: date,

            text: text

        });


        localStorage.setItem(
            "events",
            JSON.stringify(events)
        );


        eventDate.value = "";
        eventText.value = "";


        displayCalendar();
        displayUpcomingEvents();

    }
);


// ====================
// 近い予定
// ====================

function displayUpcomingEvents() {

    upcomingEvents.innerHTML = "";


    const now =
        new Date();

    now.setHours(
        0, 0, 0, 0
    );


    const upcoming =
        events
        .map(event => {

            const date =
                new Date(
                    event.date
                );

            date.setHours(
                0, 0, 0, 0
            );


            const diff =
                Math.round(
                    (
                        date - now
                    )
                    /
                    (
                        1000 *
                        60 *
                        60 *
                        24
                    )
                );


            return {
                ...event,
                diff: diff
            };

        })


        .filter(
            event =>
                event.diff >= 0
        )


        .sort(
            (a, b) =>
                a.diff - b.diff
        );


    if (
        upcoming.length === 0
    ) {

        upcomingEvents.innerHTML =
            '<p class="no-event">予定はありません</p>';

        return;

    }


    upcoming
        .slice(0, 5)
        .forEach(event => {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "event-item";


            let countdown;


            if (
                event.diff === 0
            ) {

                countdown =
                    "🔴 今日！";

                div.classList.add(
                    "event-today"
                );

            }

            else if (
                event.diff === 1
            ) {

                countdown =
                    "🟠 明日！";

                div.classList.add(
                    "event-tomorrow"
                );

            }

            else if (
                event.diff <= 3
            ) {

                countdown =
                    `🟡 あと${event.diff}日`;

                div.classList.add(
                    "event-soon"
                );

            }

            else {

                countdown =
                    `あと${event.diff}日`;

            }


            // 本文
            const info =
                document.createElement(
                    "div"
                );

            info.innerHTML = `
                <strong>${event.date}</strong>
                <br>
                ${event.text}
                <br>
                ${countdown}
            `;

            div.appendChild(info);


            // ボタン
            const buttons =
                document.createElement(
                    "div"
                );

            buttons.className =
                "memo-buttons";


            // 編集
            const editButton =
                document.createElement(
                    "button"
                );

            editButton.textContent =
                "✏️ 編集";

            editButton.className =
                "edit-button";


            editButton.addEventListener(
                "click",
                function() {

                    const targetIndex =
                        events.findIndex(
                            e => e.id === event.id
                        );

                    if (targetIndex === -1) {
                        return;
                    }


                    const newDate =
                        prompt(
                            "日付を変更してください（YYYY-MM-DD）",
                            events[targetIndex].date
                        );

                    if (newDate === null) {
                        return;
                    }

                    if (
                        !/^\d{4}-\d{2}-\d{2}$/.test(
                            newDate.trim()
                        )
                    ) {

                        alert(
                            "日付はYYYY-MM-DDの形式で入力してください。"
                        );

                        return;
                    }


                    const newText =
                        prompt(
                            "予定を変更してください",
                            events[targetIndex].text
                        );

                    if (newText === null) {
                        return;
                    }

                    if (
                        newText.trim() === ""
                    ) {

                        alert(
                            "予定を空にすることはできません。"
                        );

                        return;
                    }


                    events[targetIndex].date =
                        newDate.trim();

                    events[targetIndex].text =
                        newText.trim();


                    localStorage.setItem(
                        "events",
                        JSON.stringify(events)
                    );


                    displayCalendar();
                    displayUpcomingEvents();

                }
            );


            // 削除
            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.textContent =
                "🗑️ 削除";

            deleteButton.className =
                "delete-button";


            deleteButton.addEventListener(
                "click",
                function() {

                    const result =
                        confirm(
                            "この予定を削除しますか？"
                        );

                    if (!result) {
                        return;
                    }


                    const targetIndex =
                        events.findIndex(
                            e => e.id === event.id
                        );

                    if (targetIndex === -1) {
                        return;
                    }


                    events.splice(
                        targetIndex,
                        1
                    );


                    localStorage.setItem(
                        "events",
                        JSON.stringify(events)
                    );


                    displayCalendar();
                    displayUpcomingEvents();

                }
            );


            buttons.appendChild(
                editButton
            );

            buttons.appendChild(
                deleteButton
            );

            div.appendChild(buttons);


            upcomingEvents.appendChild(
                div
            );

        });

}


// 最初に表示
displayCalendar();
displayUpcomingEvents();


// ====================
// 通知（今日・明日の予定）
// ====================

function getTomorrowString() {

    const date =
        new Date();

    date.setDate(
        date.getDate() + 1
    );

    return getDateString(date);

}


function notifyTodayTomorrowEvents() {

    // このブラウザが通知に対応しているか確認
    if (!("Notification" in window)) {
        return;
    }


    const tomorrowString =
        getTomorrowString();


    const targetEvents =
        events.filter(
            event =>
                event.date === today ||
                event.date === tomorrowString
        );


    if (targetEvents.length === 0) {
        return;
    }


    function showNotifications() {

        targetEvents.forEach(
            event => {

                const label =
                    event.date === today
                        ? "🔴 今日の予定"
                        : "🟠 明日の予定";


                new Notification(
                    label,
                    {
                        body: event.text,
                        icon: "📝"
                    }
                );

            }
        );

    }


    // すでに許可されている場合
    if (Notification.permission === "granted") {

        showNotifications();

    }

    // まだ確認していない場合は許可を求める
    else if (Notification.permission !== "denied") {

        Notification.requestPermission().then(
            function(permission) {

                if (permission === "granted") {
                    showNotifications();
                }

            }
        );

    }

    // "denied" の場合は何もしない（ブラウザ側でブロックされている）

}


notifyTodayTomorrowEvents();


// ====================
// テーマカラー
// ====================

const themeColorPicker =
    document.getElementById(
        "themeColorPicker"
    );

const themeSwatches =
    document.querySelectorAll(
        ".theme-swatch"
    );


// 共通: hexを rgb に変換
function hexToRgb(hex) {

    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };

}


function toHex(value) {

    return Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, "0");

}


// 人の目に感じる明るさ（0〜255）を計算
function getBrightness(hex) {

    const { r, g, b } =
        hexToRgb(hex);

    return (
        r * 0.299 +
        g * 0.587 +
        b * 0.114
    );

}


// 明るいバリエーションの色を計算（グラデーション用）
function getLighterColor(hex) {

    const { r, g, b } =
        hexToRgb(hex);

    const lighten = value =>
        Math.round(
            value + (255 - value) * 0.4
        );


    return (
        "#" +
        toHex(lighten(r)) +
        toHex(lighten(g)) +
        toHex(lighten(b))
    );

}


// 濃いバリエーションの色を計算（白系カラーでも文字として見えるように）
function getDarkerColor(hex, amount) {

    const { r, g, b } =
        hexToRgb(hex);

    const darken = value =>
        value * (1 - amount);


    return (
        "#" +
        toHex(darken(r)) +
        toHex(darken(g)) +
        toHex(darken(b))
    );

}


// テーマカラーの背景の上に乗せる文字色（白 or 濃いグレー）
function getOnThemeColor(hex) {

    return getBrightness(hex) > 170
        ? "#333333"
        : "#ffffff";

}


// 白いカード等の上でテーマカラーを文字色として使う時、
// カードの背景（ライト/ダーク）に対して読みにくい明るさなら自動調整する
function getReadableThemeColor(hex, isDark) {

    const brightness =
        getBrightness(hex);


    if (isDark) {

        // ダークモード：カード背景が暗いので、暗すぎる色は明るくする
        if (brightness < 90) {
            return getLighterColorAmount(hex, 0.6);
        }

        if (brightness < 140) {
            return getLighterColorAmount(hex, 0.3);
        }

        return hex;

    }


    // ライトモード：カード背景が明るいので、明るすぎる色は濃くする
    if (brightness > 210) {
        return getDarkerColor(hex, 0.65);
    }

    if (brightness > 170) {
        return getDarkerColor(hex, 0.35);
    }

    return hex;

}


function getLighterColorAmount(hex, amount) {

    const { r, g, b } =
        hexToRgb(hex);

    const lighten = value =>
        value + (255 - value) * amount;


    return (
        "#" +
        toHex(lighten(r)) +
        toHex(lighten(g)) +
        toHex(lighten(b))
    );

}


// 現在のテーマカラー・ダークモード状態を保持
let currentThemeColor = "#4a90e2";
let isDarkModeActive = false;


// テーマ関連の文字色を再計算して反映
function updateThemeTextColors() {

    document.documentElement.style.setProperty(
        "--theme-color-text",
        getReadableThemeColor(
            currentThemeColor,
            isDarkModeActive
        )
    );

}


// テーマカラーを適用
function applyThemeColor(color, save = true) {

    currentThemeColor = color;


    document.documentElement.style.setProperty(
        "--theme-color",
        color
    );

    document.documentElement.style.setProperty(
        "--theme-color-light",
        getLighterColor(color)
    );

    document.documentElement.style.setProperty(
        "--on-theme-color",
        getOnThemeColor(color)
    );

    updateThemeTextColors();


    themeColorPicker.value = color;


    themeSwatches.forEach(
        swatch => {

            swatch.classList.toggle(
                "selected",
                swatch.dataset.color.toLowerCase() ===
                    color.toLowerCase()
            );

        }
    );


    if (save) {

        localStorage.setItem(
            "themeColor",
            color
        );

    }

}


// スウォッチをクリックしたとき
themeSwatches.forEach(
    swatch => {

        swatch.addEventListener(
            "click",
            () => {

                applyThemeColor(
                    swatch.dataset.color
                );

            }
        );

    }
);


// カラーピッカーで自由に選んだとき
themeColorPicker.addEventListener(
    "input",
    () => {

        applyThemeColor(
            themeColorPicker.value
        );

    }
);


// 保存されているテーマカラーを読み込み
const savedThemeColor =
    localStorage.getItem("themeColor");

if (savedThemeColor) {

    applyThemeColor(
        savedThemeColor,
        false
    );

}


// ====================
// ダークモード
// ====================

const darkModeToggle =
    document.getElementById(
        "darkModeToggle"
    );


function applyDarkMode(isDark, save = true) {

    isDarkModeActive =
        isDark;

    document.documentElement.dataset.theme =
        isDark ? "dark" : "light";

    darkModeToggle.checked =
        isDark;

    updateThemeTextColors();


    if (save) {

        localStorage.setItem(
            "darkMode",
            isDark ? "1" : "0"
        );

    }

}


darkModeToggle.addEventListener(
    "change",
    () => {

        applyDarkMode(
            darkModeToggle.checked
        );

    }
);


// 保存されている設定を読み込み（なければ端末のダークモード設定に合わせる）
const savedDarkMode =
    localStorage.getItem("darkMode");

if (savedDarkMode === "1") {

    applyDarkMode(true, false);

} else if (savedDarkMode === "0") {

    applyDarkMode(false, false);

} else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
) {

    applyDarkMode(true, false);

}




// ====================
// 設定したミッションの確認・削除
// ====================

const missionManagerOverlay =
    document.getElementById("missionManagerOverlay");

const missionManagerList =
    document.getElementById("missionManagerList");

const openMissionManagerButton =
    document.getElementById("openMissionManager");

const missionManagerCloseButton =
    document.getElementById("missionManagerClose");


// 1行分の表示を作る（onDelete を渡したときだけ削除ボタンを付ける）
function createManagerItem(mission, onDelete) {

    const item =
        document.createElement("div");

    item.className =
        "manager-item";


    const icon =
        document.createElement("span");

    icon.className = "manager-icon";
    icon.textContent = mission.icon;


    const name =
        document.createElement("span");

    name.className = "manager-name";
    name.textContent = mission.name;


    const reward =
        document.createElement("span");

    reward.className = "manager-reward";
    reward.textContent = `+${mission.reward}pt`;


    item.appendChild(icon);
    item.appendChild(name);
    item.appendChild(reward);


    if (onDelete) {

        const deleteBtn =
            document.createElement("button");

        deleteBtn.textContent = "🗑️ 削除";

        deleteBtn.addEventListener(
            "click",
            onDelete
        );

        item.appendChild(deleteBtn);

    }

    return item;

}


function createManagerHeading(text) {

    const heading =
        document.createElement("h3");

    heading.className = "manager-heading";
    heading.textContent = text;

    return heading;

}


// 一覧を作り直す
function renderMissionManager() {

    missionManagerList.innerHTML = "";


    // 自分で追加したミッション
    missionManagerList.appendChild(
        createManagerHeading("✍️ 自分で追加したミッション")
    );

    if (customMissions.length === 0) {

        const empty =
            document.createElement("p");

        empty.className =
            "manager-empty";

        empty.textContent =
            "まだ自分で追加したミッションはありません";

        missionManagerList.appendChild(empty);

    } else {

        customMissions.forEach(
            mission => {

                missionManagerList.appendChild(
                    createManagerItem(
                        mission,
                        () => deleteCustomMissionById(mission.id)
                    )
                );

            }
        );

    }


    // 最初から入っているミッション（確認のみ）
    missionManagerList.appendChild(
        createManagerHeading("📦 最初から入っているミッション")
    );

    if (missions.length === 0) {

        const empty =
            document.createElement("p");

        empty.className =
            "manager-empty";

        empty.textContent =
            "最初から入っているミッションは全て削除されています";

        missionManagerList.appendChild(empty);

    }

    missions.forEach(
        mission => {

            missionManagerList.appendChild(
                createManagerItem(
                    mission,
                    () => deleteDefaultMissionById(mission.id)
                )
            );

        }
    );


    // 削除したものがあれば元に戻せるようにする
    if (deletedDefaultMissionIds.length > 0) {

        const restoreBtn =
            document.createElement("button");

        restoreBtn.className =
            "secondary-button manager-restore";

        restoreBtn.textContent =
            "↩️ 最初のミッションを元に戻す";

        restoreBtn.addEventListener(
            "click",
            restoreDefaultMissions
        );

        missionManagerList.appendChild(restoreBtn);

    }

}


// 今日のミッションから指定IDを取り除く
function removeFromTodayMissions(missionId) {

    const before =
        dailyMissions.length;

    dailyMissions =
        dailyMissions.filter(
            m => m.id !== missionId
        );

    if (dailyMissions.length !== before) {

        localStorage.setItem(
            "dailyMissions",
            JSON.stringify(dailyMissions)
        );

        displayMissions();

    }

}


// 最初から入っているミッションを削除
function deleteDefaultMissionById(missionId) {

    if (!confirm("このミッションを削除しますか？\n（あとで元に戻すこともできます）")) {
        return;
    }

    deletedDefaultMissionIds.push(missionId);

    saveDeletedDefaultMissionIds();

    missions =
        defaultMissions.filter(
            m => !deletedDefaultMissionIds.includes(m.id)
        );

    removeFromTodayMissions(missionId);

    renderMissionManager();

}


// 削除した最初のミッションを全部元に戻す
function restoreDefaultMissions() {

    deletedDefaultMissionIds = [];

    saveDeletedDefaultMissionIds();

    missions = [...defaultMissions];

    renderMissionManager();

}


// IDを指定して削除（今日のミッションに入っていればそちらからも消す）
function deleteCustomMissionById(missionId) {

    if (!confirm("このミッションを削除しますか？")) {
        return;
    }


    customMissions =
        customMissions.filter(
            m => m.id !== missionId
        );

    saveCustomMissions();


    removeFromTodayMissions(missionId);

    renderMissionManager();

}


openMissionManagerButton.addEventListener(
    "click",
    function() {

        // 設定メニューは閉じてから画面を開く
        const panel =
            document.getElementById("menuPanel");

        const button =
            document.getElementById("menuButton");

        panel.classList.remove("open");

        button.setAttribute(
            "aria-expanded",
            "false"
        );


        renderMissionManager();

        missionManagerOverlay.hidden =
            false;

    }
);


missionManagerCloseButton.addEventListener(
    "click",
    function() {

        missionManagerOverlay.hidden =
            true;

    }
);


// 暗い部分をクリックしても閉じる
missionManagerOverlay.addEventListener(
    "click",
    function(e) {

        if (e.target === missionManagerOverlay) {

            missionManagerOverlay.hidden =
                true;

        }

    }
);



// ====================
// カレンダーから直接予定を設定
// ====================

const dayModalOverlay =
    document.getElementById("dayModalOverlay");

const dayModalTitle =
    document.getElementById("dayModalTitle");

const dayModalList =
    document.getElementById("dayModalList");

const dayModalInput =
    document.getElementById("dayModalInput");

const dayModalAdd =
    document.getElementById("dayModalAdd");

const dayModalClose =
    document.getElementById("dayModalClose");


// いま開いている日付（YYYY-MM-DD）
let selectedDayString = "";


function openDayModal(dateString) {

    selectedDayString =
        dateString;

    const [y, m, d] =
        dateString.split("-").map(Number);

    dayModalTitle.textContent =
        `📅 ${y}年${m}月${d}日の予定`;

    dayModalInput.value =
        "";

    renderDayModal();

    dayModalOverlay.hidden =
        false;

    dayModalInput.focus();

}


// その日の予定一覧を作り直す
function renderDayModal() {

    dayModalList.innerHTML = "";


    const dayEvents =
        events.filter(
            e => e.date === selectedDayString
        );


    if (dayEvents.length === 0) {

        const empty =
            document.createElement("p");

        empty.className =
            "manager-empty";

        empty.textContent =
            "この日の予定はまだありません";

        dayModalList.appendChild(empty);

        return;
    }


    dayEvents.forEach(
        event => {

            const item =
                document.createElement("div");

            item.className =
                "manager-item";


            const icon =
                document.createElement("span");

            icon.className = "manager-icon";
            icon.textContent = "📌";


            const name =
                document.createElement("span");

            name.className = "manager-name";
            name.textContent = event.text;


            const deleteBtn =
                document.createElement("button");

            deleteBtn.textContent = "🗑️ 削除";

            deleteBtn.addEventListener(
                "click",
                function() {

                    if (!confirm("この予定を削除しますか？")) {
                        return;
                    }

                    events =
                        events.filter(
                            e => e.id !== event.id
                        );

                    localStorage.setItem(
                        "events",
                        JSON.stringify(events)
                    );

                    displayCalendar();
                    displayUpcomingEvents();
                    renderDayModal();

                }
            );


            item.appendChild(icon);
            item.appendChild(name);
            item.appendChild(deleteBtn);

            dayModalList.appendChild(item);

        }
    );

}


// この日の予定を追加
dayModalAdd.addEventListener(
    "click",
    function() {

        const text =
            dayModalInput.value.trim();

        if (text === "") {

            alert("予定を入力してください！");

            return;
        }


        events.push({

            id: generateEventId(),

            date: selectedDayString,

            text: text

        });

        localStorage.setItem(
            "events",
            JSON.stringify(events)
        );


        dayModalInput.value = "";

        displayCalendar();
        displayUpcomingEvents();
        renderDayModal();

        dayModalInput.focus();

    }
);


dayModalInput.addEventListener(
    "keydown",
    function(e) {

        if (e.key === "Enter") {

            dayModalAdd.click();

        }

    }
);


dayModalClose.addEventListener(
    "click",
    function() {

        dayModalOverlay.hidden =
            true;

    }
);


// 暗い部分をクリックしても閉じる
dayModalOverlay.addEventListener(
    "click",
    function(e) {

        if (e.target === dayModalOverlay) {

            dayModalOverlay.hidden =
                true;

        }

    }
);
