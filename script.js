// ==UserScript==
// @name GODville-script
// @description Мой самый первый юзерскрипт
// @author Vasya Pupkin
// @license MIT
// @version 1.0
// @include https://godville.net/superhero
// ==/UserScript==

const DELAY_SET = 10;
const TOP = 0, BOTTOM = 1, RIGHT = 2;
const HEALTH_SET = 30, MONEY_SET = 1500;

var delay_counter = 0, click_state = 0;;
var arr = {
  //[название], [подпись], [значение],
   TIME:  ['0', '0', '0'], // ["Прошло времени", "создан", "таймер между событиями"],
   KILL:  ['0', '0', '0'], // ["Убийств", "было", "стало"],
   EXP:   ['0', '0', '0'], // ["Опыт", "было", "стало"],
   TASK:  ['0', '0', '0'], // ["Задание", "было", "стало"],
   //HEALTH: ["Здоровье", "отсечка " + HEALTH_SET, ""],
   PRANA: ['0', '0', '0'], // ["Прана", "зарядов", ""],
   //GOLD: ["Денег", "отсечка " + MONEY_SET, ""],
   //ARENA: ["На арену", "возможность отправки", ""]
};
var hero = {};

function reset_data() {
    hero.start_date = + new Date();
    hero.start_kill = Number(get_value_idcn("hk_monsters_killed", "l_val"));
    hero.start_exp_level = Number(get_value_idcn("hk_level", "l_val"));
    hero.start_exp_percent = Number(get_title_idcn("hk_level", "p_bar").replace(/\D+/g,""));
    hero.start_task_level = Number(get_value_idcn("hk_quests_completed", "l_val").replace(/\D+/g,""));
    hero.start_task_percent = Number(get_title_idcn("hk_quests_completed", "p_bar").replace(/\D+/g,""));
    let start_date = new Date(hero.start_date);
    localStorage.setItem('GODville_script', JSON.stringify(hero));
    arr.TIME[BOTTOM] = start_date.getHours() + ":" + start_date.getMinutes() + ":" + start_date.getSeconds() + " - (" + start_date.getDate() + "." + (+start_date.getMonth()+1) +")";
}

function get_value_idcn(id, cn) {
    return (document.getElementById(id).getElementsByClassName(cn) )[0].innerHTML;
}
function get_title_idcn(id, cn) {
    return (document.getElementById(id).getElementsByClassName(cn) )[0].getAttribute("title");
}
function get_elem_idcn(id, cn) {
    return (document.getElementById(id).getElementsByClassName(cn) )[0];
}

function inic() {
    let local_data = JSON.parse(localStorage.getItem('GODville_script'));
    if (local_data === null) {
        reset_data();
    } else {
        hero = local_data;
    }
    let start_date = new Date(hero.start_date);

    arr.TIME[BOTTOM] = start_date.getHours() + ":" + start_date.getMinutes() + ":" + start_date.getSeconds() + " - (" + start_date.getDate() + "." + (+start_date.getMonth()+1) +")";
    arr.KILL[BOTTOM] = hero.start_kill;
    arr.EXP[BOTTOM] = hero.start_exp_percent + "%"
    arr.TASK[BOTTOM] = hero.start_task_percent + "%";

    var div_block = document.createElement('div'), div_block_content = document.createElement('div'), div_block_end_line = document.createElement('div');
    var div_equ = document.getElementById("equipment");
    var div_equ_block_h = div_equ.getElementsByClassName("block_h")[0];
    var div_equ_line = div_equ.getElementsByClassName("line");
    div_block.id = "my_test_block";
    div_block.className = "block";
    var div_block_h = div_equ_block_h.cloneNode(true);

    (div_block_h.getElementsByClassName("block_title"))[0].innerHTML = "My_test_block ))";
    div_block.appendChild(div_block_h);
    div_block.appendChild(div_block_content);
    div_block_content.className = "block_content";
    div_block_end_line.className = "line";

    var div_block_line = [], i = 0;
    for (var key in arr) {
        div_block_line[i] = div_equ_line[0].cloneNode(true);
        div_block_line[i].id = "my_line_" + i;
        ( div_block_line[i].getElementsByClassName("eq_capt") )[0].innerHTML = arr[key][TOP];
        ( div_block_line[i].getElementsByClassName("eq_name") )[0].innerHTML = arr[key][BOTTOM];
        ( div_block_line[i].getElementsByClassName("eq_level") )[0].innerHTML = arr[key][RIGHT];
        div_block_content.appendChild(div_block_line[i]);
        i++;
    };

    div_block_content.appendChild(div_block_end_line);
    document.getElementById("left_block").insertBefore( div_block , document.getElementById("pet") );

    div_block_h.style.cursor = "pointer";
    div_block_h.onclick = function(){
        click_state = click_state ^ 1;
        if ( click_state && get_elem_idcn("my_test_block", "block_title") ) {
            get_elem_idcn("my_test_block", "block_title").style.color = "red";
        } else {
            get_elem_idcn("my_test_block", "block_title").style.color = "";
        }
    }

    let div_block_timer = document.getElementById('my_line_0');
    div_block_timer.style.cursor = "pointer";
    div_block_timer.onclick = reset_data;
}

function loop() {
    var start_date = new Date(hero.start_date);
    var dif, new_date = new Date(), time = (new_date - start_date) / (1000*60*60); //time in hours
    arr.TIME[TOP] = new_date.getHours() + ":" + new_date.getMinutes() + ":" + new_date.getSeconds();
    arr.TIME[RIGHT] = delay_counter;
    if (arr.HEALTH != undefined) {
        arr.HEALTH[RIGHT] = get_value_idcn("hk_health", "l_val");
        arr.HEALTH[RIGHT] = arr.HEALTH[RIGHT].substring( 0 , arr.HEALTH[RIGHT].indexOf("/") - 1 );
        hero.health = +arr.HEALTH[RIGHT];
    }
    arr.PRANA[RIGHT] = get_value_idcn("cntrl", "gp_val");
    arr.PRANA[RIGHT] = arr.PRANA[RIGHT].slice( 0 , -1 );
    hero.prana = +arr.PRANA[RIGHT];
    arr.PRANA[BOTTOM] = get_value_idcn("cntrl", "acc_val");
    hero.acc = +arr.PRANA[BOTTOM];
    arr.PRANA[BOTTOM] = "аккумулятор: " + arr.PRANA[BOTTOM];
    if (arr.GOLD != undefined) {
        arr.GOLD[RIGHT] = get_value_idcn("hk_gold_we", "l_val");
        arr.GOLD[RIGHT] = Number(arr.GOLD[RIGHT].replace(/\D+/g,""));
        hero.gold = +arr.GOLD[RIGHT];
    }
    arr.KILL[RIGHT] = get_value_idcn("hk_monsters_killed", "l_val");
    hero.kill = +arr.KILL[RIGHT];
    dif = hero.kill - hero.start_kill;
    arr.KILL[TOP] = "Убийств " + (time < 1 ? dif : (dif / time)).toFixed(2) + " в час";

    hero.exp_level = Number(get_value_idcn("hk_level", "l_val"));
    hero.exp_percent = Number(get_title_idcn("hk_level", "p_bar").replace(/\D+/g,""));
    arr.EXP[RIGHT] = hero.exp_percent + "%";
    dif = hero.exp_percent - hero.start_exp_percent + 100 * (hero.exp_level - hero.start_exp_level);
    arr.EXP[TOP] = "Опыт " + (time < 1 ? dif : (dif / time)).toFixed(2) + "% в час";

    hero.task_level = Number(get_value_idcn("hk_quests_completed", "l_val").replace(/\D+/g,""));
    hero.task_percent = Number(get_title_idcn("hk_quests_completed", "p_bar").replace(/\D+/g,""));
    arr.TASK[RIGHT] = hero.task_percent + "%"
    dif = hero.task_percent - hero.start_task_percent + 100 * (hero.task_level - hero.start_task_level);
    arr.TASK[TOP] = "Задание " + (time < 1 ? dif : (dif / time)).toFixed(2) + "% в час";

    //----------------------
    // prana_auto_charge
    if (click_state && (delay_counter >= DELAY_SET)) {
        if ( get_elem_idcn("acc_links_wrap", "ch_link") && (hero.acc < 3) && (hero.prana == 100) ){
            delay_counter = 0;
            get_elem_idcn("acc_links_wrap", "ch_link").click();
        }
    }
    //-----------------------

    var div_block_line, i = 0;
    for(var key in arr) {
        div_block_line = document.getElementById("my_line_" + i);
        if ( ( div_block_line.getElementsByClassName("eq_capt") )[0].innerHTML != arr[key][TOP] ) ( div_block_line.getElementsByClassName("eq_capt") )[0].innerHTML = arr[key][TOP];
        if ( ( div_block_line.getElementsByClassName("eq_name") )[0].innerHTML != arr[key][BOTTOM] ) ( div_block_line.getElementsByClassName("eq_name") )[0].innerHTML = arr[key][BOTTOM];
        if ( ( div_block_line.getElementsByClassName("eq_level") )[0].innerHTML != arr[key][RIGHT] ) ( div_block_line.getElementsByClassName("eq_level") )[0].innerHTML = arr[key][RIGHT];
        i++;
    };

    if (delay_counter < DELAY_SET) delay_counter++;
}

//--------------------------------------------run--------------------------------------

var delay_id = setInterval(function() {
    if (document.getElementById("equipment") !== null) {
        if (document.getElementById("my_test_block") === null) {
            inic();
        } else {
            loop();
        }
    }
}, 1000);