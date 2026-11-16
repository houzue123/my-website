// ====================
// 共通
// ====================

// 日付を YYYY-MM-DD にする（端末の時刻＝日本時間で計算）
function getDateString(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1).padStart(2, "0");

    const day =
        String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// "YYYY-MM-DD" を、その日の0時（端末の時刻）の Date にする
function parseDateString(dateString) {

    const [y, m, d] =
        dateString.split("-").map(Number);

    return new Date(y, m - 1, d);

}


// 2つの日付が何日離れているか
function daysBetween(fromString, toString) {

    return Math.round(
        (parseDateString(toString) - parseDateString(fromString)) /
        (1000 * 60 * 60 * 24)
    );

}


// 今日の日付
// ※ toISOString() は世界標準時なので、日本だと朝9時まで前日になってしまう
const today =
    getDateString(new Date());


// 画面下に少しだけお知らせを出す
const toast =
    document.getElementById("toast");

let toastTimer = null;

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(
            () => toast.classList.remove("show"),
            2500
        );

}


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

    if (daysBetween(lastLogin, today) === 1) {

        streak++;

    } else {

        streak = 1;

    }

}

// 同じ日だけど、何かの理由で0になっていた場合
else if (streak < 1) {

    streak = 1;

}


localStorage.setItem("lastLogin", today);
localStorage.setItem("streak", streak);


document.getElementById("streak").textContent =
    streak;


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

    streakMessages.forEach(
        item => {
            if (streak >= item.min) {
                current = item;
            }
        }
    );

    document.getElementById("streakMessage").textContent =
        current.message;

}


updateStreakMessage();


// ====================
// 称号の共通処理
// ====================

// list: [{ min, name }]、value: 今の値、unit: "日" や "pt"
function updateTitleArea(list, value, unit, titleEl, fillEl, nextEl) {

    // 条件を満たす最後の称号と、その次の称号を探す
    let current =
        list[0];

    let next =
        null;

    list.forEach(
        (item, i) => {
            if (value >= item.min) {
                current = item;
                next = list[i + 1] || null;
            }
        }
    );


    titleEl.textContent =
        current.name;


    if (next) {

        const range =
            next.min - current.min;

        const progress =
            value - current.min;

        const percent =
            Math.min(100, Math.round((progress / range) * 100));

        fillEl.style.width =
            `${percent}%`;

        nextEl.textContent =
            `次の称号「${next.name}」まであと ${next.min - value}${unit}`;

    } else {

        fillEl.style.width =
            "100%";

        nextEl.textContent =
            "最高称号に到達しました！";

    }

}


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


function updateStreakTitleDisplay() {

    document.getElementById("streakDays").textContent =
        streak;

    updateTitleArea(
        streakTitles,
        streak,
        "日",
        document.getElementById("streakTitle"),
        document.getElementById("streakProgressFill"),
        document.getElementById("streakNext")
    );

}


updateStreakTitleDisplay();


// ====================
// ポイント称号
// ====================

const titles = [

    { min: 0,   name: "🌱 記録のはじまり" },
    { min: 50,  name: "📝 記録の習慣" },
    { min: 150, name: "🌿 記録の積み重ね" },
    { min: 300, name: "🌸 記録の匠" },
    { min: 500, name: "✨ 思い出の宝箱" }

];


const currentTitleEl =
    document.getElementById("currentTitle");

const totalPointsEl =
    document.getElementById("totalPoints");

const titleProgressFill =
    document.getElementById("titleProgressFill");

const titleNextEl =
    document.getElementById("titleNext");


let totalPoints =
    Number(localStorage.getItem("totalPoints")) || 0;


// ポイントを加算して表示を更新
function addPoints(amount) {

    totalPoints += amount;

    localStorage.setItem("totalPoints", totalPoints);

    updateTitleDisplay();

}


// 称号表示を更新
function updateTitleDisplay() {

    totalPointsEl.textContent =
        totalPoints;

    updateTitleArea(
        titles,
        totalPoints,
        "pt",
        currentTitleEl,
        titleProgressFill,
        titleNextEl
    );

}


updateTitleDisplay();


// ====================
// デイリーミッション
// ====================

// 最初から入っているミッション
// → アプリが操作を見て「自動で達成」になる（hint は達成のしかた）
const defaultMissions = [

    { id: "add",      icon: "📝", name: "メモを1個追加する",   reward: 10, hint: "メモを保存すると達成" },
    { id: "view",     icon: "👀", name: "メモを確認する",       reward: 10, hint: "メモ一覧を見ると達成" },
    { id: "event",    icon: "📅", name: "予定を1個確認する",   reward: 10, hint: "予定のある日付をタップすると達成" },
    { id: "edit",     icon: "✏️", name: "メモを1個編集する",   reward: 10, hint: "メモを編集すると達成" },
    { id: "delete",   icon: "🗑️", name: "メモを1個削除する",   reward: 10, hint: "メモを削除すると達成" },
    { id: "calendar", icon: "📆", name: "カレンダーを確認する", reward: 10, hint: "月を切り替えるか日付をタップすると達成" }

];


// 1日に選べるミッションの上限
const MAX_DAILY_MISSIONS = 3;


// 削除した「最初から入っているミッション」のID
let deletedDefaultMissionIds =
    JSON.parse(localStorage.getItem("deletedDefaultMissionIds")) || [];

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
// → アプリには分からない行動なので「手動でチェック」
let customMissions =
    JSON.parse(localStorage.getItem("customMissions")) || [];

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
    document.getElementById("missionList");

const missionCount =
    document.getElementById("missionCount");

const missionTotal =
    document.getElementById("missionTotal");

const missionBonus =
    document.getElementById("missionBonus");


// 保存されている今日のミッション
let dailyMissions =
    JSON.parse(localStorage.getItem("dailyMissions"));

const savedMissionDate =
    localStorage.getItem("dailyMissionDate");


// 日付が変わった（または初回）場合は、自分で選ぶまでミッション無し
const needsMissionSelection =
    savedMissionDate !== today ||
    !Array.isArray(dailyMissions);

if (needsMissionSelection) {

    dailyMissions = [];

}


function saveDailyMissions() {

    localStorage.setItem(
        "dailyMissions",
        JSON.stringify(dailyMissions)
    );

}


// ミッション表示
// ※ 入力された文字は textContent で入れる（HTMLとして解釈されないように）
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

                div.classList.add("completed");

                completedCount++;

            }


            // 左側：アイコン・名前・ポイント
            const info =
                document.createElement("div");

            info.className =
                "mission-info";

            const icon =
                document.createElement("span");

            icon.className =
                "mission-icon";

            icon.textContent =
                mission.icon;

            const textBox =
                document.createElement("div");

            const name =
                document.createElement("div");

            name.className =
                "mission-name";

            name.textContent =
                mission.name;

            const reward =
                document.createElement("div");

            reward.className =
                "mission-reward";

            // 最初からのミッションは、達成のしかたも出す
            const original =
                defaultMissions.find(m => m.id === mission.id);

            reward.textContent =
                !mission.custom && !mission.completed && original
                    ? `+${mission.reward}pt ・ ${original.hint}`
                    : `+${mission.reward}pt`;

            textBox.appendChild(name);
            textBox.appendChild(reward);

            info.appendChild(icon);
            info.appendChild(textBox);


            // 右側：状態とボタン
            const actions =
                document.createElement("div");

            actions.className =
                "mission-actions";


            if (mission.completed) {

                const done =
                    document.createElement("span");

                done.className =
                    "mission-done";

                done.textContent =
                    "✅ 完了";

                actions.appendChild(done);

            } else if (mission.custom) {

                // 自分で追加したミッションだけ、手動で達成ボタン
                const button =
                    document.createElement("button");

                button.className =
                    "mission-button";

                button.textContent =
                    "達成する";

                button.addEventListener(
                    "click",
                    () => completeMission(index)
                );

                actions.appendChild(button);

            } else {

                const auto =
                    document.createElement("span");

                auto.className =
                    "mission-auto";

                auto.textContent =
                    "⏳ 自動で達成";

                actions.appendChild(auto);

            }


            if (mission.custom) {

                const deleteButton =
                    document.createElement("button");

                deleteButton.className =
                    "mission-delete-button";

                deleteButton.title =
                    "このミッションを削除";

                deleteButton.textContent =
                    "🗑️";

                deleteButton.addEventListener(
                    "click",
                    () => deleteCustomMission(mission.id, index)
                );

                actions.appendChild(deleteButton);

            }


            div.appendChild(info);
            div.appendChild(actions);

            missionList.appendChild(div);

        }
    );


    missionCount.textContent =
        completedCount;

    missionTotal.textContent =
        dailyMissions.length;


    updateMissionBonus(completedCount);

}


// 全達成ボーナス
function updateMissionBonus(completedCount) {

    const total =
        dailyMissions.length;


    if (total === 0) {

        missionBonus.textContent =
            "今日のミッションはありません";

        return;

    }


    if (completedCount < total) {

        missionBonus.textContent =
            `あと ${total - completedCount} 個！`;

        return;

    }


    // 選んだ時の数より少ない＝未達成のミッションを削除して「全達成」にした場合
    const target =
        Number(localStorage.getItem("dailyMissionTarget")) || total;

    if (completedCount < target) {

        missionBonus.textContent =
            "✅ 全部終わりました（途中でミッションを減らしたので、今日のボーナスはお休み）";

        return;

    }


    missionBonus.textContent =
        "🎉 全ミッション達成！ ボーナス +20pt";


    // ボーナスは1日1回だけ加算
    if (localStorage.getItem("bonusAwardedDate") !== today) {

        addPoints(20);

        localStorage.setItem("bonusAwardedDate", today);

        showToast("🎉 全ミッション達成！ ボーナス +20pt");

    }

}


// ミッション達成（手動・自動どちらもここを通る）
function completeMission(index) {

    const mission =
        dailyMissions[index];

    // すでに達成済みなら何もしない（ポイントの二重加算を防ぐ）
    if (!mission || mission.completed) {
        return;
    }


    mission.completed =
        true;

    saveDailyMissions();

    addPoints(mission.reward);

    showToast(`🎯 「${mission.name}」達成！ +${mission.reward}pt`);

    displayMissions();

}


// IDを指定して達成（操作に合わせて自動で呼ぶ用）
// 今日のミッションに入っていない、または達成済みなら何もしない
function completeMissionById(missionId) {

    const index =
        dailyMissions.findIndex(
            m => m.id === missionId && !m.completed
        );

    if (index !== -1) {

        completeMission(index);

    }

}


// カスタムミッションを削除（今日のリストと保存済みミッション一覧の両方から）
function deleteCustomMission(missionId, index) {

    if (!confirm("このミッションを削除しますか？")) {
        return;
    }


    dailyMissions.splice(index, 1);

    saveDailyMissions();


    customMissions =
        customMissions.filter(
            m => m.id !== missionId
        );

    saveCustomMissions();


    displayMissions();

}


displayMissions();


// ====================
// 今日のミッションを選ぶ画面
// ====================

const missionPickerOverlay =
    document.getElementById("missionPickerOverlay");

const missionPickerList =
    document.getElementById("missionPickerList");

const missionPickerWarning =
    document.getElementById("missionPickerWarning");

const missionPickerConfirm =
    document.getElementById("missionPickerConfirm");

const missionPickerRandom =
    document.getElementById("missionPickerRandom");

const missionPickerCount =
    document.getElementById("missionPickerCount");


// 選べるミッションの候補
function getMissionCandidates() {

    return [...missions, ...customMissions];

}


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


    getMissionCandidates().forEach(
        (mission, index) => {

            const label =
                document.createElement("label");

            label.className =
                "mission-picker-item";


            const input =
                document.createElement("input");

            input.type =
                "checkbox";

            input.value =
                index;

            input.addEventListener(
                "change",
                updateMissionPickerLimit
            );


            const icon =
                document.createElement("span");

            icon.className =
                "picker-icon";

            icon.textContent =
                mission.icon;


            const name =
                document.createElement("span");

            name.className =
                "picker-name";

            name.textContent =
                mission.custom
                    ? `${mission.name}（手動）`
                    : mission.name;


            const reward =
                document.createElement("span");

            reward.className =
                "picker-reward";

            reward.textContent =
                `+${mission.reward}pt`;


            label.appendChild(input);
            label.appendChild(icon);
            label.appendChild(name);
            label.appendChild(reward);

            missionPickerList.appendChild(label);

        }
    );


    missionPickerWarning.hidden =
        true;

    updateMissionPickerLimit();

}


// 選んだミッションを今日のミッションとして確定
function confirmMissionSelection(selectedMissions) {

    dailyMissions =
        selectedMissions.map(
            mission => ({
                id: mission.id,
                icon: mission.icon,
                name: mission.name,
                reward: mission.reward,
                custom: !!mission.custom,
                completed: false
            })
        );


    saveDailyMissions();

    localStorage.setItem("dailyMissionDate", today);

    // ボーナス判定用に、選んだ数を覚えておく
    localStorage.setItem("dailyMissionTarget", dailyMissions.length);


    missionPickerOverlay.hidden =
        true;


    displayMissions();


    // 「メモを確認する」を選んだ時点でメモ一覧が見えていれば達成
    if (dailyMissions.length > 0) {

        checkMemoViewMission();

    }

}


// ちゃんと偏りなく混ぜる（フィッシャー–イェーツのシャッフル）
function shuffle(array) {

    const result =
        [...array];

    for (let i = result.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] =
            [result[j], result[i]];

    }

    return result;

}


missionPickerConfirm.addEventListener(
    "click",
    function() {

        const candidates =
            getMissionCandidates();

        const checked =
            missionPickerList.querySelectorAll("input:checked");


        if (checked.length === 0) {

            missionPickerWarning.hidden =
                false;

            return;

        }


        const selected =
            Array.from(checked)
                .slice(0, MAX_DAILY_MISSIONS)
                .map(input => candidates[Number(input.value)]);


        confirmMissionSelection(selected);

    }
);


missionPickerRandom.addEventListener(
    "click",
    function() {

        confirmMissionSelection(
            shuffle(getMissionCandidates())
                .slice(0, MAX_DAILY_MISSIONS)
        );

    }
);


// ====================
// 自分でミッションを追加
// ====================

const customMissionInput =
    document.getElementById("customMissionInput");

const addCustomMissionButton =
    document.getElementById("addCustomMission");


addCustomMissionButton.addEventListener(
    "click",
    function() {

        const text =
            customMissionInput.value.trim();


        if (text === "") {

            alert("ミッションの内容を入力してください！");

            return;

        }


        // 保存済みミッション一覧に追加（明日以降の候補になる）
        customMissions.push({

            id: generateMissionId(),
            icon: "📌",
            name: text,
            reward: 10,
            custom: true

        });

        saveCustomMissions();


        customMissionInput.value =
            "";


        showToast("📌 ミッションを追加しました！明日以降の候補に出てきます");

    }
);


customMissionInput.addEventListener(
    "keydown",
    function(e) {

        // 日本語入力の変換確定の Enter では追加しない
        if (e.key === "Enter" && !e.isComposing) {

            addCustomMissionButton.click();

        }

    }
);


// ====================
// メモ
// ====================

const memoInput =
    document.getElementById("memoInput");

const saveButton =
    document.getElementById("saveButton");

const memoList =
    document.getElementById("memoList");


let memos =
    JSON.parse(localStorage.getItem("memos")) || [];


function saveMemos() {

    localStorage.setItem(
        "memos",
        JSON.stringify(memos)
    );

}


// メモ表示
function displayMemos() {

    memoList.innerHTML = "";


    memos.forEach(
        function(memo, index) {

            const div =
                document.createElement("div");

            div.className =
                "memo-item";


            // 本文
            const text =
                document.createElement("p");

            text.textContent =
                memo;

            div.appendChild(text);


            // ボタン
            const buttons =
                document.createElement("div");

            buttons.className =
                "memo-buttons";


            // 編集
            const editButton =
                document.createElement("button");

            editButton.textContent =
                "✏️ 編集";

            editButton.className =
                "edit-button";

            editButton.addEventListener(
                "click",
                function() {

                    const newMemo =
                        prompt("メモを変更してください", memos[index]);


                    if (newMemo === null) {
                        return;
                    }


                    if (newMemo.trim() === "") {

                        alert("メモを空にすることはできません。");

                        return;

                    }


                    memos[index] =
                        newMemo.trim();

                    saveMemos();

                    displayMemos();


                    completeMissionById("edit");

                }
            );


            // 削除
            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "🗑️ 削除";

            deleteButton.className =
                "delete-button";

            deleteButton.addEventListener(
                "click",
                function() {

                    if (!confirm("このメモを削除しますか？")) {
                        return;
                    }


                    memos.splice(index, 1);

                    saveMemos();

                    displayMemos();


                    completeMissionById("delete");

                }
            );


            buttons.appendChild(editButton);
            buttons.appendChild(deleteButton);

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

            alert("メモを入力してください！");

            return;

        }


        memos.push(memo);

        saveMemos();


        memoInput.value =
            "";

        displayMemos();


        completeMissionById("add");

    }
);


// 「メモを確認する」：メモ一覧が画面に見えたら達成
let memoListVisible = false;

function checkMemoViewMission() {

    if (
        memoListVisible &&
        memos.length > 0 &&
        missionPickerOverlay.hidden
    ) {

        completeMissionById("view");

    }

}

if ("IntersectionObserver" in window) {

    new IntersectionObserver(
        entries => {

            memoListVisible =
                entries[0].isIntersecting;

            checkMemoViewMission();

        }
    ).observe(memoList);

}


// ====================
// カレンダー
// ====================

const calendar =
    document.getElementById("calendar");

const monthTitle =
    document.getElementById("monthTitle");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");

const eventDate =
    document.getElementById("eventDate");

const eventText =
    document.getElementById("eventText");

const addEvent =
    document.getElementById("addEvent");

const upcomingEvents =
    document.getElementById("upcomingEvents");


// 表示中の月（日付を1日にしておくと、31日→翌月で月が飛ぶのを防げる）
let currentDate =
    new Date();

currentDate.setDate(1);


// 予定
let events =
    JSON.parse(localStorage.getItem("events")) || [];


function saveEvents() {

    localStorage.setItem(
        "events",
        JSON.stringify(events)
    );

}


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

    saveEvents();

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
        new Date(year, month, 1).getDay();

    // 月の日数
    const lastDate =
        new Date(year, month + 1, 0).getDate();


    // 空白
    for (let i = 0; i < firstDay; i++) {

        calendar.appendChild(
            document.createElement("div")
        );

    }


    // 日付
    for (let day = 1; day <= lastDate; day++) {

        const div =
            document.createElement("div");

        div.className =
            "calendar-day";


        const dateString =
            getDateString(new Date(year, month, day));


        // 今日
        if (dateString === today) {

            div.classList.add("today");

        }


        const dayNumber =
            document.createElement("strong");

        dayNumber.textContent =
            day;

        div.appendChild(dayNumber);


        // その日の予定
        const dayEvents =
            events.filter(
                event => event.date === dateString
            );


        if (dayEvents.length > 0) {

            div.classList.add("event-day");


            dayEvents.forEach(
                event => {

                    const span =
                        document.createElement("span");

                    span.className =
                        "event-dot";

                    span.textContent =
                        "📌 " + event.text;

                    div.appendChild(span);

                }
            );

        }


        // 日付をクリックしたら、その日の予定を設定する画面を開く
        div.addEventListener(
            "click",
            () => openDayModal(dateString)
        );


        calendar.appendChild(div);

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

        completeMissionById("calendar");

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

        completeMissionById("calendar");

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


        if (date === "" || text === "") {

            alert("日付と予定を入力してください！");

            return;

        }


        events.push({

            id: generateEventId(),
            date: date,
            text: text

        });

        saveEvents();


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


    const upcoming =
        events
            .map(
                event => ({
                    ...event,
                    diff: daysBetween(today, event.date)
                })
            )
            .filter(event => event.diff >= 0)
            .sort((a, b) => a.diff - b.diff);


    if (upcoming.length === 0) {

        const empty =
            document.createElement("p");

        empty.className =
            "no-event";

        empty.textContent =
            "予定はありません";

        upcomingEvents.appendChild(empty);

        return;

    }


    upcoming
        .slice(0, 5)
        .forEach(event => {

            const div =
                document.createElement("div");

            div.className =
                "event-item";


            let countdown;

            if (event.diff === 0) {

                countdown = "🔴 今日！";
                div.classList.add("event-today");

            } else if (event.diff === 1) {

                countdown = "🟠 明日！";
                div.classList.add("event-tomorrow");

            } else if (event.diff <= 3) {

                countdown = `🟡 あと${event.diff}日`;
                div.classList.add("event-soon");

            } else {

                countdown = `あと${event.diff}日`;

            }


            // 本文（入力された文字は textContent で入れる）
            const info =
                document.createElement("div");

            const dateEl =
                document.createElement("strong");

            dateEl.textContent =
                event.date;

            const textEl =
                document.createElement("div");

            textEl.textContent =
                event.text;

            const countdownEl =
                document.createElement("div");

            countdownEl.textContent =
                countdown;

            info.appendChild(dateEl);
            info.appendChild(textEl);
            info.appendChild(countdownEl);

            div.appendChild(info);


            // ボタン
            const buttons =
                document.createElement("div");

            buttons.className =
                "memo-buttons";


            // 編集
            const editButton =
                document.createElement("button");

            editButton.textContent =
                "✏️ 編集";

            editButton.className =
                "edit-button";

            editButton.addEventListener(
                "click",
                function() {

                    const target =
                        events.find(e => e.id === event.id);

                    if (!target) {
                        return;
                    }


                    const newDate =
                        prompt("日付を変更してください（YYYY-MM-DD）", target.date);

                    if (newDate === null) {
                        return;
                    }

                    const trimmedDate =
                        newDate.trim();

                    // 形式と、実在する日付か（2月30日などを弾く）を確認
                    if (
                        !/^\d{4}-\d{2}-\d{2}$/.test(trimmedDate) ||
                        getDateString(parseDateString(trimmedDate)) !== trimmedDate
                    ) {

                        alert("日付はYYYY-MM-DDの形式で、正しい日付を入力してください。");

                        return;

                    }


                    const newText =
                        prompt("予定を変更してください", target.text);

                    if (newText === null) {
                        return;
                    }

                    if (newText.trim() === "") {

                        alert("予定を空にすることはできません。");

                        return;

                    }


                    target.date = trimmedDate;
                    target.text = newText.trim();

                    saveEvents();


                    displayCalendar();
                    displayUpcomingEvents();

                }
            );


            // 削除
            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "🗑️ 削除";

            deleteButton.className =
                "delete-button";

            deleteButton.addEventListener(
                "click",
                function() {

                    if (!confirm("この予定を削除しますか？")) {
                        return;
                    }


                    events =
                        events.filter(e => e.id !== event.id);

                    saveEvents();


                    displayCalendar();
                    displayUpcomingEvents();

                }
            );


            buttons.appendChild(editButton);
            buttons.appendChild(deleteButton);

            div.appendChild(buttons);


            upcomingEvents.appendChild(div);

        });

}


// 最初に表示
displayCalendar();
displayUpcomingEvents();


// ====================
// 通知（今日・明日の予定）
// ・許可は「通知をオンにする」ボタンを押したときだけ聞く
// ・通知は1日1回だけ
// ====================

const notifyButton =
    document.getElementById("notifyButton");


function updateNotifyButton() {

    if (!("Notification" in window)) {

        notifyButton.textContent =
            "🔕 このブラウザは通知に対応していません";

        notifyButton.disabled =
            true;

        return;

    }


    if (Notification.permission === "granted") {

        notifyButton.textContent =
            "🔔 予定の通知はオンです";

        notifyButton.disabled =
            true;

    } else if (Notification.permission === "denied") {

        notifyButton.textContent =
            "🔕 通知はブラウザの設定でブロック中";

        notifyButton.disabled =
            true;

    } else {

        notifyButton.textContent =
            "🔔 予定の通知をオンにする";

        notifyButton.disabled =
            false;

    }

}


function notifyTodayTomorrowEvents(force = false) {

    if (
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ) {
        return;
    }


    // 今日すでに通知していたら出さない
    if (!force && localStorage.getItem("notifiedDate") === today) {
        return;
    }


    const tomorrowDate =
        new Date();

    tomorrowDate.setDate(tomorrowDate.getDate() + 1);

    const tomorrowString =
        getDateString(tomorrowDate);


    const targetEvents =
        events.filter(
            event =>
                event.date === today ||
                event.date === tomorrowString
        );


    if (targetEvents.length === 0) {
        return;
    }


    try {

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
                        icon: "タイトルロゴ.png"
                    }
                );

            }
        );

        localStorage.setItem("notifiedDate", today);

    } catch (e) {

        // スマホのブラウザなど、ページから直接通知を出せない環境では何もしない

    }

}


notifyButton.addEventListener(
    "click",
    function() {

        if (!("Notification" in window)) {
            return;
        }

        Notification.requestPermission().then(
            function() {

                updateNotifyButton();

                notifyTodayTomorrowEvents(true);

            }
        );

    }
);


updateNotifyButton();

notifyTodayTomorrowEvents();


// ====================
// テーマカラー
// ====================

const themeColorPicker =
    document.getElementById("themeColorPicker");

const themeSwatches =
    document.querySelectorAll(".theme-swatch");


// hex を rgb に変換
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


// 人の目に感じる明るさ（0〜255）
function getBrightness(hex) {

    const { r, g, b } =
        hexToRgb(hex);

    return r * 0.299 + g * 0.587 + b * 0.114;

}


// 明るくした色（amount: 0〜1）
function getLighterColor(hex, amount = 0.4) {

    const { r, g, b } =
        hexToRgb(hex);

    const lighten = value =>
        value + (255 - value) * amount;

    return "#" + toHex(lighten(r)) + toHex(lighten(g)) + toHex(lighten(b));

}


// 濃くした色（amount: 0〜1）
function getDarkerColor(hex, amount) {

    const { r, g, b } =
        hexToRgb(hex);

    const darken = value =>
        value * (1 - amount);

    return "#" + toHex(darken(r)) + toHex(darken(g)) + toHex(darken(b));

}


// テーマカラーの背景の上に乗せる文字色（白 or 濃いグレー）
function getOnThemeColor(hex) {

    return getBrightness(hex) > 170
        ? "#333333"
        : "#ffffff";

}


// カードの上でテーマカラーを文字色として使う時、読みにくい明るさなら自動調整
function getReadableThemeColor(hex, isDark) {

    const brightness =
        getBrightness(hex);


    if (isDark) {

        // ダークモード：暗すぎる色は明るくする
        if (brightness < 90)  return getLighterColor(hex, 0.6);
        if (brightness < 140) return getLighterColor(hex, 0.3);

        return hex;

    }


    // ライトモード：明るすぎる色は濃くする
    if (brightness > 210) return getDarkerColor(hex, 0.65);
    if (brightness > 170) return getDarkerColor(hex, 0.35);

    return hex;

}


// 現在のテーマカラー・ダークモード状態
let currentThemeColor = "#4a90e2";
let isDarkModeActive = false;


// テーマ関連の文字色を再計算して反映
function updateThemeTextColors() {

    document.documentElement.style.setProperty(
        "--theme-color-text",
        getReadableThemeColor(currentThemeColor, isDarkModeActive)
    );

}


// テーマカラーを適用
function applyThemeColor(color, save = true) {

    currentThemeColor = color;

    const root =
        document.documentElement.style;

    root.setProperty("--theme-color", color);
    root.setProperty("--theme-color-light", getLighterColor(color));
    root.setProperty("--on-theme-color", getOnThemeColor(color));

    updateThemeTextColors();


    themeColorPicker.value = color;


    themeSwatches.forEach(
        swatch => {

            swatch.classList.toggle(
                "selected",
                swatch.dataset.color.toLowerCase() === color.toLowerCase()
            );

        }
    );


    if (save) {

        localStorage.setItem("themeColor", color);

    }

}


// スウォッチをクリックしたとき
themeSwatches.forEach(
    swatch => {

        swatch.addEventListener(
            "click",
            () => applyThemeColor(swatch.dataset.color)
        );

    }
);


// カラーピッカーで自由に選んだとき
themeColorPicker.addEventListener(
    "input",
    () => applyThemeColor(themeColorPicker.value)
);


// 保存されているテーマカラーを読み込み（なければデフォルトの青）
const savedThemeColor =
    localStorage.getItem("themeColor");

applyThemeColor(
    savedThemeColor && /^#[0-9a-f]{6}$/i.test(savedThemeColor)
        ? savedThemeColor
        : "#4a90e2",
    false
);


// ====================
// ダークモード
// ====================

const darkModeToggle =
    document.getElementById("darkModeToggle");


function applyDarkMode(isDark, save = true) {

    isDarkModeActive =
        isDark;

    document.documentElement.dataset.theme =
        isDark ? "dark" : "light";

    darkModeToggle.checked =
        isDark;

    updateThemeTextColors();


    if (save) {

        localStorage.setItem("darkMode", isDark ? "1" : "0");

    }

}


darkModeToggle.addEventListener(
    "change",
    () => applyDarkMode(darkModeToggle.checked)
);


// 保存されている設定を読み込み（なければ端末のダークモード設定に合わせる）
const savedDarkMode =
    localStorage.getItem("darkMode");

if (savedDarkMode === "1") {

    applyDarkMode(true, false);

} else if (savedDarkMode === "0") {

    applyDarkMode(false, false);

} else {

    applyDarkMode(
        !!(window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches),
        false
    );

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

        deleteBtn.addEventListener("click", onDelete);

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


function createManagerEmpty(text) {

    const empty =
        document.createElement("p");

    empty.className = "manager-empty";
    empty.textContent = text;

    return empty;

}


// 一覧を作り直す
function renderMissionManager() {

    missionManagerList.innerHTML = "";


    // 自分で追加したミッション
    missionManagerList.appendChild(
        createManagerHeading("✍️ 自分で追加したミッション（手動でチェック）")
    );

    if (customMissions.length === 0) {

        missionManagerList.appendChild(
            createManagerEmpty("まだ自分で追加したミッションはありません")
        );

    }

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


    // 最初から入っているミッション
    missionManagerList.appendChild(
        createManagerHeading("📦 最初から入っているミッション（自動で達成）")
    );

    if (missions.length === 0) {

        missionManagerList.appendChild(
            createManagerEmpty("最初から入っているミッションは全て削除されています")
        );

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

        restoreBtn.addEventListener("click", restoreDefaultMissions);

        missionManagerList.appendChild(restoreBtn);

    }

}


// 今日のミッションから指定IDを取り除く
function removeFromTodayMissions(missionId) {

    const before =
        dailyMissions.length;

    dailyMissions =
        dailyMissions.filter(m => m.id !== missionId);

    if (dailyMissions.length !== before) {

        saveDailyMissions();

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
        customMissions.filter(m => m.id !== missionId);

    saveCustomMissions();

    removeFromTodayMissions(missionId);

    renderMissionManager();

}


openMissionManagerButton.addEventListener(
    "click",
    function() {

        // 設定メニューは閉じてから画面を開く
        document.getElementById("menuPanel").classList.remove("open");

        document.getElementById("menuButton").setAttribute("aria-expanded", "false");


        renderMissionManager();

        missionManagerOverlay.hidden =
            false;

    }
);


missionManagerCloseButton.addEventListener(
    "click",
    () => { missionManagerOverlay.hidden = true; }
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


    // ミッション：カレンダーを確認／予定のある日なら予定も確認
    completeMissionById("calendar");

    if (events.some(e => e.date === dateString)) {

        completeMissionById("event");

    }

}


// その日の予定一覧を作り直す
function renderDayModal() {

    dayModalList.innerHTML = "";


    const dayEvents =
        events.filter(e => e.date === selectedDayString);


    if (dayEvents.length === 0) {

        dayModalList.appendChild(
            createManagerEmpty("この日の予定はまだありません")
        );

        return;

    }


    dayEvents.forEach(
        event => {

            const item =
                createManagerItem(
                    { icon: "📌", name: event.text, reward: 0 },
                    function() {

                        if (!confirm("この予定を削除しますか？")) {
                            return;
                        }

                        events =
                            events.filter(e => e.id !== event.id);

                        saveEvents();

                        displayCalendar();
                        displayUpcomingEvents();
                        renderDayModal();

                    }
                );

            // 予定にはポイント表示はいらないので消す
            item.querySelector(".manager-reward").remove();

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

        saveEvents();


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

        // 日本語入力の変換確定の Enter では追加しない
        if (e.key === "Enter" && !e.isComposing) {

            dayModalAdd.click();

        }

    }
);


dayModalClose.addEventListener(
    "click",
    () => { dayModalOverlay.hidden = true; }
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


// ====================
// 起動時：今日のミッションを選ぶ
// （全部の準備が終わってから最後に行う）
// ====================

if (needsMissionSelection) {

    if (getMissionCandidates().length === 0) {

        // 選べるミッションが無い日は、ミッション無しで始める
        confirmMissionSelection([]);

    } else {

        buildMissionPicker();

        missionPickerOverlay.hidden =
            false;

    }

}
