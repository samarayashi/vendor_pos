/*
尚未解決模組化的問題，理想預設是import productsBeans.js 來使用
現在只能先讓兩邊同步，app.js 是require  productsBeans.js 
這邊同步複製productsBean.sj的內容
*/
productsBean = {
    product1: {
        html_name: '火腿熱狗',
        input_name: "normal_hot_dog",
        price: "10"
    },
    product2: {
        html_name: '裹粉熱狗',
        input_name: "corn_hot_dog",
        price: "20"
    },
    product3: {
        html_name: '脆薯熱狗',
        input_name: "french_fries_dog",
        price: "30"
    }
}

var storage = sessionStorage;
var now_sheet_number = 1
var now_total_price = 0
var show_order_sheet
var show_order_price

function ShowTime() {
    var NowDate = new Date();
    var year = NowDate.getFullYear();
    var month = NowDate.getMonth() + 1;
    var day = NowDate.getDate();
    var hour = NowDate.getHours();
    var minute = NowDate.getMinutes();
    var sec = NowDate.getSeconds();
    document.getElementById('datebox').innerHTML = year + '年' + month + '月' + day + '日';
    document.getElementById('timebox').innerHTML = hour + '時' + minute + '分' + sec + '秒';
    setTimeout('ShowTime()', 1000);
}

function get_total_price() {
    var purchase_items = $(':checked')
    now_total_price = 0
    for (let i = 0; i < purchase_items.length; i++) {
        now_total_price += purchase_items[i].value * productsBean['product' + (i + 1)].price
    }
    $("#price_show").text(now_total_price);
    $("#total_price").val(now_total_price);
}



function update_serial_number() {
    now_sheet_number = now_sheet_number + 1;
    $('#sheet_number').val(now_sheet_number);
}

function add_check_table() {
    var template = `<table id="sheet_${now_sheet_number}" class="check_table">
            <tr>
                <td>單號</td>
                <td>${now_sheet_number}</td>
            </tr>
            <tr>
                <td>金額</td>
                <td>${now_total_price}</td>
            </tr>
        </table>`
    $("#check_area_container").append(template);

}

function get_order_detail() {
    var show = $(this).find('td:odd');
    show_order_sheet = show[0].innerHTML;
    show_order_price = show[1].innerHTML;
}

function show_order_detail() {
    var order_detail = JSON.parse(storage['sheet' + show_order_sheet]);
    var template = `<table id="show_${show_order_sheet}" class="detail_table">
                <tr>
                    <td>單號:${show_order_sheet}</td>
                </tr>
                <tr>
                    <td>${productsBean.product1.html_name}:${order_detail[productsBean.product1.input_name]}</td>
                </tr>
                <tr>
                    <td>${productsBean.product2.html_name}:${order_detail[productsBean.product2.input_name]}</td>
                </tr>
                <tr>
                    <td>${productsBean.product3.html_name}:${order_detail[productsBean.product3.input_name]}</td>
                </tr>
                <tr>
                    <td>金額:${show_order_price}</td>
                </tr>
            </table>
            <button id="confirm_button" class="button">確認結帳</button>
            <button id="cancel_button" class="button">取消訂單</button>`
    $('#detail_table_area').empty()
        .prepend(template);
}

function reset_form() {
    $("#first_" + productsBean.product1.input_name).prop("checked", true);
    $("#first_" + productsBean.product2.input_name).prop("checked", true);
    $("#first_" + productsBean.product3.input_name).prop("checked", true);
    $("#price_show").text(0);
    $("#total_price").val(0);
    now_total_price = 0;
}

function set_sheet_storage() {
    var purchase_items = $(':checked')
    var data = {
        sheet_number: now_sheet_number,
        total_price: now_total_price
    }
    for (var item of purchase_items) {
        data[item.name] = item.value
    }
    storage['sheet' + now_sheet_number] = JSON.stringify(data)
}

function finish_payment() {
    $('#detail_area_container').on('click', '#confirm_button', function () {
        console.log('confirm')
        $.ajax({
            url: '/payment',                        // url位置
            type: 'post',                   // post/get
            data: { checked_sheet_number: show_order_sheet }      // 輸入的資料
        });
    })
}

function cancel_order() {
    $('#detail_area_container').on('click', '#cancel_button', function () {
        console.log('cancel');
        $.ajax({
            url: '/cancel',                        // url位置
            type: 'post',                   // post/get
            data: { cancel_sheet_number: show_order_sheet }
        });
    })
}

function get_unpayment() {
    $('#restore_button').on('click', function () {
        $.ajax({
            url: '/restore',                        // url位置
            type: 'post',                   // post/get
            success: function (data) {
                for (let sheet of data) {
                    storage['sheet' + sheet.sheet_num] = JSON.stringify(sheet);
                }
                restore_unfinish_order()
            }
        });
    })
}

function restore_unfinish_order() {
    $('#check_area_container>table').remove();
    var sorted_keys = Object.keys(storage).sort(function (a, b) {
        return a.localeCompare(b, undefined, { numeric: true });
    })
    var max_sheet_number = 0
    for (var i = 0; i < sorted_keys.length; i++) {
        var key = sorted_keys[i]
        if (!(key.startsWith('sheet'))) { continue; }
        var value = JSON.parse(storage[key]);
        let restore_sheet_number = value.sheet_num;
        var restore_total_price = value.total_price;
        if (restore_sheet_number > max_sheet_number) max_sheet_number = restore_sheet_number;
        var template = `<table id="sheet_${restore_sheet_number}" class="check_table">
            <tr>
                <td>單號</td>
                <td>${restore_sheet_number}</td>
            </tr>
            <tr>
                <td>金額</td>
                <td>${restore_total_price}</td>
            </tr>
        </table>`
        $("#check_area_container").append(template);
    }
    now_sheet_number = max_sheet_number + 1
    $('#sheet_number').val(now_sheet_number);
}

function clean_order() {
    $('#detail_area_container').on('click', '.button', function () {
        $('#detail_table_area').empty();
        $('#sheet_' + show_order_sheet).remove();
        delete storage['sheet' + show_order_sheet];
    })
}

function discard_all_orders() {
    console.log('discard')
    $.ajax({
        url: '/discard',
        type: 'post'
    });

    for (const key in storage) {
        if (key.startsWith('sheet')) {
            storage.removeItem(key);
        }
    }
    $('#check_area_container .check_table').remove();

}

function mount_ajaxForm() {
    $('#order_form').ajaxForm(function () {
        add_check_table()
        set_sheet_storage()
        update_serial_number()
        reset_form()
    });
}

function check_count() {
    let observer = new MutationObserver(function (mutations) {
        $("#check_count").text($('.check_table').length)
    });
    var config = { childList: true };
    observer.observe($("#check_area_container")[0], config);
}



$(function () {
    $('#check_area_container').css('height', window.innerHeight * 0.95)
    $('table input').on('click', get_total_price)
    $('#check_area_container').on('click', '.check_table', function () {
        $(this).addClass('checked_table');
        $(this).siblings('.check_table').removeClass('checked_table')
    })
    // 讓detail_area帶有check_area的狀態
    $('#check_area_container').on('click', '.check_table', function () {
        get_order_detail.call(this);
        show_order_detail();
    })
    $('#discard_button').on('click', discard_all_orders)

    ShowTime()
    mount_ajaxForm()
    finish_payment()
    cancel_order()
    clean_order()
    check_count()
    get_unpayment()

    $('.quantity-input').on('input', function() {
        const radioName = $(this).data('radio-name');
        const value = parseInt($(this).val());
        
        // 檢查是否為有效的非負整數
        if (value >= 0) {
            // 取消選中該組的所有 radio buttons
            $(`input[name="${radioName}"]`).prop('checked', false);
            // 創建新的 radio button 並設置為選中
            const newRadio = $('<input>')
                .attr('type', 'radio')
                .attr('name', radioName)
                .val(value)
                .prop('checked', true)
                .hide();
            $(this).after(newRadio);
        } else {
            // 如果輸入無效（負數或非數字），清空輸入框
            $(this).val('');
        }
        get_total_price();
    });

    // 當選擇 radio button 時清空對應的輸入框
    $('.radio-group input[type="radio"]').on('change', function() {
        $(this).closest('.quantity-selector')
               .find('.quantity-input')
               .val('');
    });
})