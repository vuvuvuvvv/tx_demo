var current_result = 0;
var is_dragging = false;
var offsetX, offsetY, f_offsetX, f_offsetY;
var ct = null, cl = null, cr = null;

var is_opened = false;
var is_shacking = false;

var started = false;

var gen_rs;

const intro = $("#intro");
const fr_main = $("#fr_main");
const btn_start = $("#btn_start");
const header = $("#header_txt");
const cover = $('#cover');

$(document).ready(function () {
    randCube();
    //Xác nhận điều khoản
    btn_start.on({
        mouseenter: function () {
            if ($("#confirm").prop("checked")) {
                $(this).click(() => {
                    intro.hide(500);
                    fr_main.show(500);
                });
            } else {
                var randomTop = Math.floor(Math.random() * (intro.outerHeight() - btn_start.outerHeight() * 2)) + btn_start.outerHeight() / 2;
                var randomLeft = Math.floor(Math.random() * (intro.outerWidth() - btn_start.outerWidth() * 2)) + btn_start.outerWidth() / 2;
                $(this).css({ top: randomTop, left: randomLeft });
                $(this).click(() => {
                    $(this).css({ top: randomTop, left: randomLeft });
                });
            }
        },
    });
    //End confirm

    //Hoạt ảnh kéo thả bát úp
    f_offsetX = 33;
    f_offsetY = 12;

    cover.mousedown(function (e) {
        is_dragging = true;

        offsetX = e.pageX;
        offsetY = e.pageY;

        var coverPos = cover.position();
        offsetX -= coverPos.left;
        offsetY -= coverPos.top;
    });

    $(document).mouseup(function () {
        is_dragging = false;
    });

    cover.mousemove(function (e) {
        if (is_dragging && !is_opened && !is_shacking) {
            var x = e.pageX - offsetX;
            var y = e.pageY - offsetY;

            var maxX = $('#fr_animation').width() - cover.width() / 2;
            var maxY = $('#fr_animation').height() - cover.height() / 2;

            x = Math.min(Math.max(x, 0 - cover.width() / 2), maxX);
            y = Math.min(Math.max(y, 0 - cover.height() / 2), maxY);

            if (x <= 112 || x >= 550 || y <= -145 || y >= 238 || (y >= 505 && x <= -64) || (x >= 149 && y >= 505) || (y <= -64 && x <= 182) || (y >= 175 && x <= 235)) {
                clearTimeout(gen_rs);
                result();
            } else {
                cover.css({ left: x, top: y });
            }
        }
    });
    //End hoạt ảnh
    $("#btn_shake").click(() => {
        started = true;
        if (is_opened) {
            cover.removeClass("open");
            cover.css({ left: `${f_offsetX}%`, top: `${f_offsetY}%` });
            is_opened = false;
            setTimeout(function () {
                shakePlate()
            }, 500);
        } else {
            shakePlate();
        }
    });
});

function shakePlate() {
    if (!is_shacking) {
        is_shacking = true;
        $("#fr_animation").addClass("shake");
        header.html("Xóc-ing...");
        randCube();
        setTimeout(function () {
            is_shacking = false;
            $("#fr_animation").removeClass("shake");
            header.html("Mời mở");
            //Tự mở sau 10s
            gen_rs =
                setTimeout(function () {
                    result();
                }, 10000);
        }, 2000);
    } else {
        let note = $("<span class='note'>Đang xóc! Bấm ít thôi :))</span>");
        $("#notify").append(note);
        setTimeout(function () {
            note.remove();
        }, 1500);
    }
}

// Random mặt xúc xắc
function rollADice() {
    let cube = [1, 2, 3, 4, 5, 6];
    let rand_i = Math.floor(Math.random() * cube.length);

    ct = cube[rand_i];
    //xóa đi top và bottom
    cube.splice(rand_i, 1);
    cube.splice((5 - rand_i), 1);
    //Thứ tụ in: top-> left-> right => left can not max(...cube)
    rand_i = Math.floor(Math.random() * (cube.length - 1));
    cl = cube[rand_i];
    cr = cube[rand_i + 1];
}

function randCube() {
    for (let i = 1; i <= 3; i++) {
        let fr_cube = $(`#c${i}`);
        if (fr_cube.length > 0) {
            fr_cube.remove();
        }

        fr_cube = $(`<div class='cube' id='c${i}'></div>`);
        rollADice();
        let top = $(`<span class="ct"></span>`);
        top.css('background-image', `url("./web/material/t${ct}.png")`);
        let left = $(`<span class="cl"></span>`);
        left.css('background-image', `url("./web/material/l${cl}.png")`);
        let right = $(`<span class="cr"></span>`);
        right.css('background-image', `url("./web/material/r${cr}.png")`);
        fr_cube.append(top);
        fr_cube.append(left);
        fr_cube.append(right);
        $("#cubes").append(fr_cube);
        current_result += ct;
        ct = cl = cr = null;
    }
}

function result() {
    let rs = current_result;
    is_opened = true;
    cover.addClass("open");
    if(started) {
        header.html(`${rs} điểm - ${(rs>10)?"Tài":"Xỉu"}`);
    }
}