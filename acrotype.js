//=============================================================================
// ACROTYPE.js
//=============================================================================
/*:ja
 * @plugindesc タイプゲーム用プラグイン
 * @author きつねうどん
 * 
 * @param DebugFlag
 * @desc デバッグフラグ（ONにするとゲームタイトルを飛ばしてゲーム画面に直行する）
 * @type boolean
 * @default false
 * 
 * 
 * 
 */

//=============================================================================
// _Word
//  _Wordクラスを定義します。
//  外部ファイルとの兼ね合いで、メインスコープ外での定義となっています。
//=============================================================================

var wordlist = [];
function _Word(division, initial, character, spell, meaning, ){
    this.division = division;
    this.initial = initial;
    this.character = character
    this.spell = spell;
    this.meaning = meaning;
};

_Word.prototype.getDivision = function() {
    return this.division;
};

_Word.prototype.getInitial = function() {
    return this.initial;
};

_Word.prototype.getCharacter = function() {
    return this.character;
};

_Word.prototype.getSpell = function() {
    return this.spell;
};

_Word.prototype.getMeaning = function() {
    return this.meaning;
};

PluginManager.loadScript('WordBasket_Information.js');
PluginManager.loadScript('WordBasket_Common.js');


(function() {
    var pluginName = 'ACROTYPE';
    
    //=============================================================================
    // プラグインパラメータ取得
    //=============================================================================
    var parameters = PluginManager.parameters(pluginName);
    var paramDebugFlag = parameters['DebugFlag'];


    //=============================================================================
    // Scene_Boot
    //  デバッグ用にシーンを改造します。
    //  プラグイン設定よりデバッグフラグONでパズル画面に直行します。
    //=============================================================================
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function(){
        _Scene_Boot_start.apply(this, arguments);
        if (!DataManager.isBattleTest() && !DataManager.isEventTest()){
            if(paramDebugFlag == 'true'){
                SceneManager.push(Scene_ACROTYPE);
            }
        }
    };


    //=============================================================================
    // Utility
    //  既存ファンクションを拡張定義します。
    //=============================================================================
    Input.keyMapper['8']  = 'backspace';
    Input.keyMapper['13'] = 'enter';
    Input.keyMapper['18'] = 'alt';
    Input.keyMapper['32'] = 'space';
    Input.keyMapper['65'] = 'a';
    Input.keyMapper['66'] = 'b';
    Input.keyMapper['67'] = 'c';
    Input.keyMapper['68'] = 'd';
    Input.keyMapper['69'] = 'e';
    Input.keyMapper['70'] = 'f';
    Input.keyMapper['71'] = 'g';
    Input.keyMapper['72'] = 'h';
    Input.keyMapper['73'] = 'i';
    Input.keyMapper['74'] = 'j';
    Input.keyMapper['75'] = 'k';
    Input.keyMapper['76'] = 'l';
    Input.keyMapper['77'] = 'm';
    Input.keyMapper['78'] = 'n';
    Input.keyMapper['79'] = 'o';
    Input.keyMapper['80'] = 'p';
    Input.keyMapper['81'] = 'q';
    Input.keyMapper['82'] = 'r';
    Input.keyMapper['83'] = 's';
    Input.keyMapper['84'] = 't';
    Input.keyMapper['85'] = 'u';
    Input.keyMapper['86'] = 'v';
    Input.keyMapper['87'] = 'w';
    Input.keyMapper['88'] = 'x';
    Input.keyMapper['89'] = 'y';
    Input.keyMapper['90'] = 'z';

    function _lp(filename){
        return ImageManager.loadPicture(filename);
    };

    function getByte(string){
        var length = 0;
        for(var i = 0; i < string.length; i++){
            var c = string.charCodeAt(i);
            if(checkUpper(c)){
                length ++;
            } else {
                length += 2;
            }
        }
        return length;
    };

    function checkUpper(character){
        if((character >= 0x0 && character < 0x81) || (character === 0xf8f0) || (character >= 0xff61 && character < 0xffa0) || (character >= 0xf8f1 && character < 0xf8f4)){
            return true;
        } else {
            return false;
        }
    };

    Bitmap.prototype.createImagePatched = function(img, gx, gy, x = 0, y = 0, sx = this.width, sy = this.height){
        this.blt(img, 0, 0, gx, gy, x, y);
        this.blt(img, gx, 0, gx, gy, x + gx, y, sx - gx * 2, gy);
        this.blt(img, gx * 2, 0, gx, gy, x + sx - gx, y);
        this.blt(img, 0, gy, gx, gy, x, y + gy, gx, sy - gy * 2);
        this.blt(img, gx, gy, gx, gy, x + gx, y + gy, sx - gx * 2, sy - gy * 2);
        this.blt(img, gx * 2, gy, gx, gy, x + sx - gx, y + gy, gx, sy - gy * 2)
        this.blt(img, 0, gy * 2, gx, gy, x, y + sy - gy);
        this.blt(img, gx, gy * 2, gx, gy, x + gx, y + sy - gy,  sx - gx * 2, gy);
        this.blt(img, gx * 2, gy * 2, gx, gy, x + sx - gx, y + sy - gy);
    };

    Bitmap.prototype.createImagePatched_h = function(img, gx, gy, x = 0, y = 0, sx = this.width){
        this.blt(img, 0, 0, gx, gy, x, y);
        this.blt(img, gx, 0, gx, gy, x + gx, y, sx - gx * 2, gy);
        this.blt(img, gx * 2, 0, gx, gy, x + sx - gx, y);
    };

    Sprite.prototype.setAnchor = function(x, y){
        this.anchor.x = x;
        this.anchor.y = y;
    };

    Sprite.prototype.setScale = function(x, y){
        this.scale.x = x;
        this.scale.y = y;
    };

    Sprite.prototype.setOpacity = function(value){
        this.opacity = value;
    };
   
    Sprite.prototype.show= function(){
        this.opacity = 255;
    };

    Sprite.prototype.hide = function(){
        this.opacity = 0;
    };

    Sprite.prototype.fadein = function(value){
        this.opacity += value;
        if(this.opacity >= 255){
            return true;
        } else {
            return false;
        }
    };

    Sprite.prototype.fadeout = function(value){
        this.opacity -= value;
        if(this.opacity <= 0){
            return true;
        } else {
            return false;
        }
    };


    //=============================================================================
    // Images_Archive
    //  画像関連のあれやこれを定義します。
    //=============================================================================
    var img_window = {
        wood_upper: _lp('window_upper'),
        wood_lower: _lp('window_lower'),
        frame: _lp('window_frame'),
        paper: _lp('window_main'),
    };
    var img_keys = {
        up: _lp('key_up'), left: _lp('key_left'), right: _lp('key_right'),  down: _lp('key_down'),
        enter: _lp('key_enter_2'), space: _lp('key_space'), backspace: _lp('key_backspace'),
        shift: _lp('key_shift'), control: _lp('key_control'), alt: _lp('key_alt'),
        zero: _lp('key_0'), one: _lp('key_1'), two: _lp('key_2'), three: _lp('key_3'), four: _lp('key_4'),
        five: _lp('key_5'), six: _lp('key_6'), seven: _lp('key_7'), eight: _lp('key_8'), nine: _lp('key_9'),
        a: _lp('key_a'), b: _lp('key_b'), c: _lp('key_c'), d: _lp('key_d'), e: _lp('key_e'), f: _lp('key_f'),
        g: _lp('key_g'), h: _lp('key_h'), i: _lp('key_i'), j: _lp('key_j'), k: _lp('key_k'),
        l: _lp('key_l'), m: _lp('key_m'), n: _lp('key_n'), o: _lp('key_o'), p: _lp('key_p'),
        q: _lp('key_q'), r: _lp('key_r'), s: _lp('key_s'), t: _lp('key_t'), u: _lp('key_u'),
        v: _lp('key_v'), w: _lp('key_w'), x: _lp('key_x'), y: _lp('key_y'), z: _lp('key_z'),
    };
    var img_clock = {
        back: _lp('clock_back'),
        frame: _lp('clock_frame'),
        hand: _lp('clock_hand'),
    };
    var img_score = {
        excellent: _lp('score_excellent'),
        great: _lp('score_great'),
        good: _lp('score_good'),
    };


    //=============================================================================
    // ACROTYPE_Specifications
    //  タイプゲームの基本仕様を定義します。
    //=============================================================================
    var KEY_SIZE_X              = 32;
    var KEY_SIZE_Y              = 32;
    var KEY_SIZE_X_SHIFT        = 60;
    var KEY_SIZE_X_SPACE        = 90;
    var KEY_SIZE_X_ENTER_TOP    = 48;
    var KEY_SIZE_X_ENTER_BOTTOM = 36;
    var KEY_SIZE_X_ENTER_GAP    = 12;
    var KEY_SIZE_Y_ENTER        = 64;
    var KEY_SIZE_RATE           = 2.0;
    var KEY_OFFSET_X            = 72;
    var KEY_OFFSET_Y            = 368;
    var KEY_PADDING_X           = 66;
    var KEY_PADDING_Y           = 66;
    var KEY_TIMER               = 16;

    var TEXTBOARD_SIZE_X        = 640;
    var TEXT_SIZE               = 28;
    var TEXT_SIZE_HEADER        = 32;
    var TEXT_SIZE_OUTLINE       = 4;
    var TEXT_COLOR              = '#402020';
    var TEXT_COLOR_OUTLINE      = '#FFF8F8';
    var TEXTBOARD_OFFSET_X      = 88;
    var TEXTBOARD_OFFSET_Y      = 96;
    var TEXTBOARD_OFFSET_Y_HEADER = 56;
    var TEXT_MAX_LENGTH         = 45;
    var TEXT_MAX_LENGTH_HEADER  = 40;
    var TEXT_TIMER              = 48; 

    var SCOREBOARD_SIZE_X       = 240;
    var SCOREBOARD_OFFSET_X     = 552;
    var SCOREBOARD_OFFSET_Y     = 56;

    var CARET_SIZE_X            = 10;
    var CARET_SIZE_Y            = 28;
    var CARET_SIZE_OUTLINE      = 2;
    var CARET_COLOR             = '#FFFFFF';
    var CARET_COLOR_OUTLINE     = '#FFFFFF';
    var CARET_OFFSET_X          = -8;
    var CARET_TIMER             = 20;

    var CLOCK_OFFSET_X          = 756;
    var CLOCK_OFFSET_Y          = 248;
    var CLOCK_SPEED             = 4500;

    var IMAGE_TIMER             = 48;
    var FADE_SPEED              = 16;

    var SOCER_VERYHARD          = 4;
    var SOCER_HARD              = 2;
    var SOCER_NORMAL            = 1;

    var GET_KEYCODE             = {
        a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6, h: 7, i: 8, j: 9, k: 10, l: 11, m: 12, n: 13,
        o: 14, p: 15, q: 16, r: 17, s: 18, t: 19, u: 20, v: 21, w: 22, x: 23, y: 24, z: 25,
        enter: 26, space: 27, backspace: 28, shift: 29, control: 30, alt: 31, up: 32, left: 33, down: 34, right: 35,
    };

    var GET_DEVISION_NAME       = ['情報技術', '一般教養'];

    //=============================================================================
    // Shader
    //  Shaderクラスを定義します。
    //=============================================================================
    function Shader(color = '#000000'){
        this.sprite = new Sprite(new Bitmap(816, 624));
        this.sprite.bitmap.fillAll(color);
    };

    Shader.prototype.show = function(){
        this.sprite.show();
    };

    Shader.prototype.hide = function(){
        this.sprite.hide();
    };

    Shader.prototype.fadein = function(value){
        if(this.sprite.fadein(value)){
            return true;
        } else {
            return false;
        }
    };

    Shader.prototype.fadeout = function(value){
        if(this.sprite.fadeout(value)){
            return true;
        } else {
            return false;
        }
    };


    //=============================================================================
    // Key
    //  Keyクラスを定義します。
    //=============================================================================
    function Key(code, x, y){
        this.code = code;
        this.sprite = new Sprite(img_keys[code]);
        this.sprite.move(x, y);
        this.sprite.setAnchor(0.5, 0.5);
        this.sprite.setScale(KEY_SIZE_RATE, KEY_SIZE_RATE);
        this.pressed = false;
        this.toggle = false;
        this.timer = 0;
    };

    Key.prototype.show = function(){
        this.sprite.show();
    };

    Key.prototype.hide = function(){
        this.sprite.hide();
    };

    Key.prototype.press = function(){
        switch(this.code){
            case 'shift':
            case 'control':
            case 'alt':
                break;
            default:
                this.pressed = true;
                this.timer = KEY_TIMER;
                break;
        }
    };

    Key.prototype.trigger = function(){
        switch(this.code){
            case 'shift':
            case 'control':
            case 'alt':
                if(this.toggle){
                    this.sprite.setColorTone([0, 0, 0, 0]);
                    this.toggle = false;
                } else {
                    this.sprite.setColorTone([128, 128, 128, 0]);
                    this.toggle = true;
                }
                break;
            default:
                break;
        }
    };

    Key.prototype.decay = function(){
        this.timer --;
        if(this.timer == 0){
            this.sprite.setColorTone([0, 0, 0, 0]);
            this.pressed = false;
        } else {
            this.sprite.setColorTone([255 * (this.timer) / KEY_TIMER, 0, 0, 0]);
        }
    };

    Key.prototype.checkPressed = function(){
        if(this.pressed){
            return true;
        } else {
            return false;
        }
    };

    Key.prototype.checkTimer = function(){
        if(this.timer > 0){
            return true;
        } else {
            return false;
        }
    };

    Key.prototype.checkTouch= function(x, y){
        switch(this.code){
            case 'backspace':
            case 'alt':
            case 'a':
            case 'b':
            case 'c':
            case 'd':
            case 'e':
            case 'f':
            case 'g':
            case 'h':
            case 'i':
            case 'j':
            case 'k':
            case 'l':
            case 'm':
            case 'n':
            case 'o':
            case 'p':
            case 'q':
            case 'r':
            case 's':
            case 't':
            case 'u':
            case 'v':
            case 'w':
            case 'x':
            case 'y':
            case 'z':
            case 'up':
            case 'left':
            case 'down':
            case 'right':
                if(x >= this.sprite.x - KEY_SIZE_X && x < this.sprite.x + KEY_SIZE_X && y >= this.sprite.y - KEY_SIZE_Y && y < this.sprite.y + KEY_SIZE_Y){
                    return true;
                } else {
                    return false;
                }
            case 'shift':
            case 'control':
                if(x >= this.sprite.x - KEY_SIZE_X_SHIFT && x < this.sprite.x + KEY_SIZE_X_SHIFT  && y >= this.sprite.y - KEY_SIZE_Y && y < this.sprite.y + KEY_SIZE_Y){
                    return true;
                } else {
                    return false;
                }
            case 'space':
                if(x >= this.sprite.x - KEY_SIZE_X_SPACE && x < this.sprite.x + KEY_SIZE_X_SPACE && y >= this.sprite.y - KEY_SIZE_Y && y < this.sprite.y + KEY_SIZE_Y){
                    return true;
                } else {
                    return false;
                }
            case 'enter':
                if((x >= this.sprite.x - KEY_SIZE_X_ENTER_TOP && x < this.sprite.x + KEY_SIZE_X_ENTER_TOP && y >= this.sprite.y - KEY_SIZE_Y_ENTER && y < this.sprite.y) ||
                (x >= this.sprite.x - KEY_SIZE_X_ENTER_BOTTOM + KEY_SIZE_X_ENTER_GAP && x < this.sprite.x + KEY_SIZE_X_ENTER_BOTTOM + KEY_SIZE_X_ENTER_GAP && y >= this.sprite.y && y < this.sprite.y + KEY_SIZE_Y_ENTER)){
                    return true;
                } else {
                    return false;
                }
            default:
                return false;
        }
    };


    //=============================================================================
    // Textboard
    //  Textboardクラスを定義します。
    //=============================================================================
    function Textboard(x, y, headerflag = false, scoreflag = false){
        if(headerflag){
            if(scoreflag){
                this.sprite = new Sprite(new Bitmap(SCOREBOARD_SIZE_X, TEXT_SIZE_HEADER + TEXT_SIZE_OUTLINE + 2));
            } else {
                this.sprite = new Sprite(new Bitmap(TEXTBOARD_SIZE_X, TEXT_SIZE_HEADER + TEXT_SIZE_OUTLINE + 2));
            }
        } else {
            this.sprite = new Sprite(new Bitmap(TEXTBOARD_SIZE_X, TEXT_SIZE + TEXT_SIZE_OUTLINE + 2));
        }
        this.sprite.move(x, y);
        if(headerflag){
            this.sprite.bitmap.fontSize = TEXT_SIZE_HEADER;
        } else {
            this.sprite.bitmap.fontSize = TEXT_SIZE;
        }
        this.sprite.bitmap.outlineWidth = TEXT_SIZE_OUTLINE;
        this.sprite.bitmap.textColor = TEXT_COLOR;
        this.sprite.bitmap.outlineColor = TEXT_COLOR_OUTLINE;
        this.text = '';
        this.mask = 0;
        this.headerflag = headerflag;
        this.timer = 0;
        this.state = 'normal';
    };

    Textboard.prototype.show = function(){
        this.sprite.show();
    };

    Textboard.prototype.hide = function(){
        this.sprite.hide();
    };

    Textboard.prototype.fadein = function(value){
        if(this.sprite.fadein(value)){
            return true;
        } else {
            return false;
        }
    };

    Textboard.prototype.fadeout = function(value){
        if(this.sprite.fadeout(value)){
            return true;
        } else {
            return false;
        }
    };

    Textboard.prototype.clear = function(){
        this.setText('');
    };

    Textboard.prototype.pushText = function(value){
        this.sprite.bitmap.clear();
        this.text += value;
        if(this.headerflag){
            this.sprite.bitmap.drawText(this.text, 0, 0, TEXTBOARD_SIZE_X, TEXT_SIZE + TEXT_SIZE_OUTLINE);
        } else {
            this.sprite.bitmap.drawText(this.text, 0, 0, TEXTBOARD_SIZE_X, TEXT_SIZE_HEADER + TEXT_SIZE_OUTLINE);
        }
    };

    Textboard.prototype.setText = function(value){
        this.sprite.bitmap.clear();
        this.text = value;
        if(this.headerflag){
            this.sprite.bitmap.drawText(this.text, 0, 0, TEXTBOARD_SIZE_X, TEXT_SIZE + TEXT_SIZE_OUTLINE);
        } else {
            this.sprite.bitmap.drawText(this.text, 0, 0, TEXTBOARD_SIZE_X, TEXT_SIZE_HEADER + TEXT_SIZE_OUTLINE);
        }
    };

    Textboard.prototype.colorCharacter = function(color, pos, shift){
        var string = '';
        for(var i = 0; i < this.text.length; i ++){
            for(var j = 0; j < pos.length; j ++){
                if(i == pos[j] + shift){
                    string += this.text.slice(i, i + 1);
                    break;
                }
                if(j == pos.length - 1){
                    if(getByte(this.text.slice(i, i + 1)) == 1){
                        string += ' ';
                    } else {
                        string += '  ';
                    }
                }
            }
        }
        this.sprite.bitmap.textColor = color;
        if(this.headerflag){
            this.sprite.bitmap.drawText(string, 0, 0, TEXTBOARD_SIZE_X, TEXT_SIZE + TEXT_SIZE_OUTLINE);
        } else {
            this.sprite.bitmap.drawText(string, 0, 0, TEXTBOARD_SIZE_X, TEXT_SIZE_HEADER + TEXT_SIZE_OUTLINE);
        }
        this.sprite.bitmap.textColor = TEXT_COLOR;
    };

    Textboard.prototype.fill = function(){
        var length = TEXT_MAX_LENGTH - getByte(this.text);
        for(var i = 0; i < length; i ++){
            this.text += '_';
        }   
        this.setText();
    };

    Textboard.prototype.setState = function(value){
        this.timer = 0;
        this.state = value;
    };

    Textboard.prototype.setMask = function(value){
        this.mask = value;
    };

    Textboard.prototype.getMask = function(){
        return this.mask;
    };

    Textboard.prototype.getByte = function(){
        return getByte(this.text);
    };

    Textboard.prototype.update = function(){
        switch(this.state){
            case 'normal':
            default:
                break;
            case 'fadein':
                if(this.fadein(FADE_SPEED)){
                    this.state = 'normal';
                }
                break;
            case 'fadeout':
                if(this.fadeout(FADE_SPEED)){
                    this.state = 'normal';
                }
                break;
            case 'wait_fadein':
                if(this.timer >= TEXT_TIMER){
                    this.state = 'fadein';
                    this.timer = 0;
                } else {
                    this.timer ++;
                }
                break;
            case 'wait_fadeout':
                if(this.timer >= TEXT_TIMER){
                    this.state = 'fadeout';
                    this.timer = 0;
                } else {
                    this.timer ++;
                }
                break;
        }
    };


    //=============================================================================
    // Caret
    //  Caretクラスを定義します。
    //=============================================================================
    function Caret(index_x = 0, index_y = 0){
        this.sprite = new Sprite(new Bitmap(CARET_SIZE_X, CARET_SIZE_Y + CARET_SIZE_OUTLINE));
        this.sprite.bitmap.outlineWidth = CARET_SIZE_OUTLINE;
        this.sprite.bitmap.textColor = CARET_COLOR;
        this.sprite.bitmap.outlineColor = CARET_COLOR_OUTLINE;
        this.sprite.bitmap.drawText('|', 0, 0, CARET_SIZE_X, CARET_SIZE_Y + CARET_SIZE_OUTLINE);
        this.index_x = index_x;
        this.index_y = index_y;
        this.timer = 0;
        this.state = 'command';
        this.set();
    };

    Caret.prototype.set = function(x = 0, y = 0){
        if(x < 0){
            this.index_x = 0;
        } else {
            if(x >= TEXT_MAX_LENGTH){
                this.index_x = TEXT_MAX_LENGTH;
            } else {
                this.index_x = x;
            }
        }
        if(y < 0){
            this.index_y = 0;
        } else {
            if(y >= 5){
                this.index_y = 4;
            } else {
                this.index_y = y;
            }
        }
        this.sprite.x = TEXTBOARD_OFFSET_X + CARET_OFFSET_X + 14 * this.index_x + 8;
        this.sprite.y = TEXTBOARD_OFFSET_Y + (CARET_SIZE_Y + CARET_SIZE_OUTLINE + 2) * this.index_y;
    };

    Caret.prototype.move = function(x = 0, y = 0, mask = 0){
        if(this.index_x + x < mask){
            this.index_x = mask;
        } else {
            if(this.index_x + x >= TEXT_MAX_LENGTH){
                this.index_x = TEXT_MAX_LENGTH;
            } else {
                this.index_x += x;
            }
        }
        if(this.index_y + y < 0){
            this.index_y = 0;
        } else {
            if(this.index_y + y >= 5){
                this.index_y = 4;
            } else {
                this.index_y += y;
            }
        }
        this.sprite.x = TEXTBOARD_OFFSET_X + CARET_OFFSET_X + 14 * this.index_x + 8;
        this.sprite.y = TEXTBOARD_OFFSET_Y + (CARET_SIZE_Y + CARET_SIZE_OUTLINE + 2) * this.index_y;
    };

    Caret.prototype.blink = function(){
        this.timer ++;
        if(this.timer % (CARET_TIMER * 3) == 0){
            this.show();
        } else {
            if(this.timer % (CARET_TIMER * 3) == CARET_TIMER * 2){
                this.hide();
            }
        }
    };

    Caret.prototype.setState = function(value){
        this.state = value;
    };

    Caret.prototype.show = function(){
        this.sprite.show();
    };

    Caret.prototype.hide = function(){
        this.sprite.hide();
    };

    Caret.prototype.up = function(){
        if(this.index_y > 0){
            this.index_y --;
            this.set();
            return true;
        } else {
            return false;
        }
    };

    Caret.prototype.left = function(){
        if(this.index_x > 0){
            this.index_x --;
            this.set();
            return true;
        } else {
            if(this.index_y > 0){
                this.index_x = TEXT_MAX_LENGTH - 1;
                this.index_y --;
                this.set();
                return true;
            } else {
                return false;
            }
        }
    };

    Caret.prototype.down = function(){
        if(this.index_y < 4){
            this.index_y ++;
            this.set();
            return true;
        } else {
            return false;
        }
    };

    Caret.prototype.right = function(){
        if(this.index_x < TEXT_MAX_LENGTH - 1){
            this.index_x ++;
            this.set();
            return true;
        } else {
            if(this.index_y < 4){
                this.index_x = 0;
                this.index_y ++;
                this.set();
                return true;
            } else {
                return false;
            }
        }
    };


    //=============================================================================
    // Clock
    //  Clockクラスを定義します。
    //=============================================================================
    function Clock(x, y){
        this.back = new Sprite(img_clock.back);
        this.back.move(x, y);
        this.back.setAnchor(0.5, 0.5);
        this.back.setScale(0.5, 0.5);
        this.frame = new Sprite(img_clock.frame);
        this.frame.move(x, y);
        this.frame.setAnchor(0.5, 0.5);
        this.frame.setScale(0.5, 0.5);
        this.hand = new Sprite(img_clock.hand);
        this.hand.move(x, y);
        this.hand.setAnchor(0.5, 0.5);
        this.hand.setScale(0.5, 0.5);
        this.state = '';
        this.timer = 0;
    };
        
    Clock.prototype.setOpacity = function(value){
        this.back.setOpacity(value);
        this.frame.setOpacity(value);
        this.hand.setOpacity(value);
    };

    Clock.prototype.show = function(){
        this.back.show();
        this.frame.show();
        this.hand.show();
    };

    Clock.prototype.hide = function(){
        this.back.hide();
        this.frame.hide();
        this.hand.hide();
    };

    Clock.prototype.fadein = function(value){
        var b = this.back.fadein(value);
        var f = this.frame.fadein(value);
        var h = this.hand.fadein(value);
        if(b && f && h){
            return true;
        } else {
            return false;
        }
    };

    Clock.prototype.fadeout = function(value){
        var b = this.back.fadeout(value);
        var f = this.frame.fadeout(value);
        var h = this.hand.fadeout(value);
        if(b && f && h){
            return true;
        } else {
            return false;
        }
    };

    Clock.prototype.gain = function(){
        this.hand.rotation = Math.PI * 2 * this.timer / CLOCK_SPEED;
    };

    Clock.prototype.setState = function(value){
        this.timer = 0;
        this.state = value;
    };

    Clock.prototype.update = function(){
        switch(this.state){
            case 'normal':
            default:
                return false;
            case 'fadein':
                if(this.fadein(FADE_SPEED)){
                    this.state = 'normal';
                }
                return false;
            case 'fadeout':
                if(this.fadeout(FADE_SPEED)){
                    this.state = 'normal';
                }
                return false;
            case 'wait_fadein':
                if(this.timer >= IMAGE_TIMER){
                    this.state = 'fadein';
                    this.timer = 0;
                } else {
                    this.timer ++;
                }
                return false;
            case 'wait_fadeout':
                if(this.timer >= IMAGE_TIMER){
                    this.state = 'fadeout';
                    this.timer = 0;
                } else {
                    this.timer ++;
                }
                return false;
            case 'gain':
                this.timer ++;
                this.gain();
                if(this.timer >= CLOCK_SPEED){
                    return true;
                } else {
                    return false;
                }
        }
    };


    //=============================================================================
    // Animation
    //  Animationクラスを定義します。
    //=============================================================================
    function Animation(x, y, type){
        switch(type){
            case 'score_excellent':
                this.sprite = new Sprite(img_score.excellent);
                break;
            case 'score_great':
                this.sprite = new Sprite(img_score.great);
                break;
            case 'score_good':
                this.sprite = new Sprite(img_score.good);
                break;
            default:
                this.sprite = new Sprite(new Bitmap(16, 16));
                break;
        }
        this.type = type;
        this.sprite.move(x, y);
        this.sprite.setAnchor(0.5, 0.5);
        this.timer = 0;
    };

    Animation.prototype.update = function(){
        this.timer ++;
        switch(this.type){
            case 'score_excellent':
            case 'score_great':
            case 'score_good':
                this.sprite.y --;
                this.sprite.opacity -= 4;
                if(this.timer >= 60){
                    return true;
                } else {
                    return false;
                }
            default:
                if(this.timer >= 0){
                    return true;
                } else {
                    return false;
                }
        }
    };


    //=============================================================================
    // Scene_ACROTYPE
    //  ゲーム用にシーンを定義します。
    //=============================================================================
    function Scene_ACROTYPE(){
        this.initialize.apply(this, arguments);
    };

    Scene_ACROTYPE.prototype = Object.create(Scene_Base.prototype);
    Scene_ACROTYPE.prototype.constructor = Scene_ACROTYPE;

    Scene_ACROTYPE.prototype.initialize = function(){
        Scene_Base.prototype.initialize.call(this);
        this.initData();
        this.initRenderer();
    };

    Scene_ACROTYPE.prototype.create = function(){
        Scene_Base.prototype.create.call(this);
        this.createShader();
        this.createBackGround();
        this.createFrame();
        this.createClock();
        this.createKey();
        this.createTextBoard();
        this.createCaret();
        this.createScoreBoard();
        this.hideBackGround();
        this.hideFrame();
        this.hideClock();
        this.hideKey();
        this.hideCaret();
        this.hideScoreBoard();
        this.makeFilteredList();
    };

    Scene_ACROTYPE.prototype.update = function(){
        Scene_Base.prototype.update.call(this);
        this.updateTimer();
        switch(this.scene){
            case 'loadBoot':
                this.loadBoot();
                break;
            case 'free_input':
                this.updateInput();
                this.updateKey();
                this.updateCaret();
                this.updateTextBoard();
                break;
            case 'loadReady':
                this.loadReady();
                this.updateKey();
                this.updateTextBoard();
                this.updateScoreBoard();
                this.updateClock();
                break;
            case 'main':
                this.updateInput();
                this.updateKey();
                this.updateCaret();
                this.updateTextBoard();
                this.updateScoreBoard();
                this.updateClock();
                break;
            default:
                break;
        }
        this.updateAnimation();
    };

    Scene_ACROTYPE.prototype.updateTimer = function(){
        this.timer ++;
    };

    Scene_ACROTYPE.prototype.setTimer = function(value){
        this.timer = value;
    };

    Scene_ACROTYPE.prototype.setScene = function(value){
        this.scene = value;
    };

    Scene_ACROTYPE.prototype.setDifficulty = function(value){
        this.difficulty = value;
    };

    Scene_ACROTYPE.prototype.updateInput = function(){
        if(TouchInput.isTriggered()){
            this.keymap.forEach(keycode => this.checkKeyTouch(keycode, TouchInput.x, TouchInput.y));
        } else {
            this.keymap.forEach(keycode => this.checkKeyInput(keycode));
        }
    };

    Scene_ACROTYPE.prototype.loadBoot = function(){
        if(this.load_boot[this.timer] !== undefined){
            this.pushTextTextBoard_Header(this.load_boot[this.timer])
        }
        if(this.timer == 140){
            this.soundType_3();
        }
        if(this.timer >= 228 && this.timer < 236){
            this.fadeinShader(32);
        }
        if(this.timer == 236){
            this.clearTextBoard_Header();
            this.showBackGround();
            this.showKey();
        }
        if(this.timer >= 236 && this.timer < 252){
            this.fadeoutShader(16);
        }
        if(this.timer == 308){
            this.setTextTextBoard(0, '[help: コマンド一覧を表示する]');       
            this.setTextTextBoard(4, 'command: ');
            this.setMaskTextBoard(4, 9);
            this.setCaret(9, 4);
            this.setScene('free_input');
        }
    };

    Scene_ACROTYPE.prototype.loadReady = function(){
        if(this.timer == 60){
            this.setCaret();
            this.setStateClock('wait_fadein');
            this.setScoreScoreBoard();
            this.setStateScoreBoard('wait_fadein')
        }
        if(this.timer == 120){
            this.showTextBoard_Header();
            this.setTextTextBoard_Header('Ready');
        }
        if(this.load_ready[this.timer] !== undefined){
            this.pushTextTextBoard_Header(this.load_ready[this.timer]);
        }
        if(this.timer == 301){
            this.setStateTextBoard_Header('wait_fadeout');
        }
        if(this.timer == 390){
            this.makeQuestion();
            this.showTextBoard_Header();
            this.showTextBoard(0);
            this.setScene('main');
            this.setStateClock('gain');
            this.music_1();
            switch(this.difficulty){
                case 'veryhard':
                    this.setTextTextBoard(0, '[赤字のアルファベットを英単語に戻せ: SCORE +4]');
                    this.setStateCaret('answer_first');
                    break;
                case 'hard':
                    this.setTextTextBoard(0, '[赤字のアルファベットを英単語に戻せ: SCORE +2]');
                    this.setStateCaret('answer_first');
                    this.showTextBoard(3);
                    break;
                case 'normal':
                default:
                    this.setTextTextBoard(0, '[正解を見て正しくスペリングせよ: SCORE +1]');
                    this.setStateCaret('answer_second');
                    this.showTextBoard(3);
                    this.showTextBoard(4);
                    break;
            }
        }
    };

    Scene_ACROTYPE.prototype.initData = function(){
        this.animation_list = [];
        this.textboard_list = [];
        this.keylist = [];
        this.keymap = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                        'enter', 'space', 'backspace', 'shift', 'control', 'alt', 'up', 'left', 'down', 'right'];
        this.keypos = {
            a: {x: KEY_OFFSET_X + 16, y: KEY_OFFSET_Y + (KEY_PADDING_Y * 1)},
            b: {x: KEY_OFFSET_X + (KEY_PADDING_X * 4 + 36), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 2)},
            c: {x: KEY_OFFSET_X + (KEY_PADDING_X * 2 + 36), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 2)},
            d: {x: KEY_OFFSET_X + (KEY_PADDING_X * 2 + 16), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 1)},
            e: {x: KEY_OFFSET_X + (KEY_PADDING_X * 2), y: KEY_OFFSET_Y},
            f: {x: KEY_OFFSET_X + (KEY_PADDING_X * 3 + 16), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 1)},
            g: {x: KEY_OFFSET_X + (KEY_PADDING_X * 4 + 16), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 1)},
            h: {x: KEY_OFFSET_X + (KEY_PADDING_X * 5 + 16), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 1)},
            i: {x: KEY_OFFSET_X + (KEY_PADDING_X * 7), y: KEY_OFFSET_Y},
            j: {x: KEY_OFFSET_X + (KEY_PADDING_X * 6 + 16), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 1)},
            k: {x: KEY_OFFSET_X + (KEY_PADDING_X * 7 + 16), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 1)},
            l: {x: KEY_OFFSET_X + (KEY_PADDING_X * 8 + 16), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 1)},
            m: {x: KEY_OFFSET_X + (KEY_PADDING_X * 6 + 36), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 2)},
            n: {x: KEY_OFFSET_X + (KEY_PADDING_X * 5 + 36), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 2)},
            o: {x: KEY_OFFSET_X + (KEY_PADDING_X * 8), y: KEY_OFFSET_Y},
            p: {x: KEY_OFFSET_X + (KEY_PADDING_X * 9), y: KEY_OFFSET_Y},
            q: {x: KEY_OFFSET_X, y: KEY_OFFSET_Y},
            r: {x: KEY_OFFSET_X + (KEY_PADDING_X * 3), y: KEY_OFFSET_Y},
            s: {x: KEY_OFFSET_X + (KEY_PADDING_X * 1 + 16), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 1)},
            t: {x: KEY_OFFSET_X + (KEY_PADDING_X * 4), y: KEY_OFFSET_Y},
            u: {x: KEY_OFFSET_X + (KEY_PADDING_X * 6), y: KEY_OFFSET_Y},
            v: {x: KEY_OFFSET_X + (KEY_PADDING_X * 3 + 36), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 2)},
            w: {x: KEY_OFFSET_X + (KEY_PADDING_X * 1), y: KEY_OFFSET_Y},
            x: {x: KEY_OFFSET_X + (KEY_PADDING_X * 1 + 36), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 2)},
            y: {x: KEY_OFFSET_X + (KEY_PADDING_X * 5), y: KEY_OFFSET_Y},
            z: {x: KEY_OFFSET_X + 36, y: KEY_OFFSET_Y + (KEY_PADDING_Y * 2)},
            enter: {x: KEY_OFFSET_X + (KEY_PADDING_X * 10), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 1 + 30)},
            space: {x: KEY_OFFSET_X + (KEY_PADDING_X * 5 + 56), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 3)},
            backspace: {x: KEY_OFFSET_X + (KEY_PADDING_X * 10 + 16), y: KEY_OFFSET_Y},
            shift: {x: KEY_OFFSET_X + 28, y: KEY_OFFSET_Y + (KEY_PADDING_Y * 3)},
            control: {x: KEY_OFFSET_X + (KEY_PADDING_X * 2 + 20), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 3)},
            alt: {x: KEY_OFFSET_X + (KEY_PADDING_X * 3 + 50), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 3)},
            up: {x: KEY_OFFSET_X + (KEY_PADDING_X * 8 + 62), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 2)},
            left: {x: KEY_OFFSET_X + (KEY_PADDING_X * 7 + 62), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 3)},
            down: {x: KEY_OFFSET_X + (KEY_PADDING_X * 8 + 62), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 3)},
            right: {x: KEY_OFFSET_X + (KEY_PADDING_X * 9 + 62), y: KEY_OFFSET_Y + (KEY_PADDING_Y * 3)},
        }
        this.load_boot = {
            '30': '.', '60': '.', '90': '.',
            '140': 'S', '143': 'Y', '146': 'S', '149': 'T', '152': 'E', '155': 'M', '158': '_', 
            '167': 'B', '170': 'O', '173': 'O', '176': 'T', '179': '_',
            '188': 'C', '191': 'O', '194': 'M', '197': 'P', '200': 'L', '203': 'E', '206': 'T', '209': 'E', '212': 'D',
            '256': 'コ', '259': 'マ', '262': 'ン', '265': 'ド', '268': 'を',
            '271': '入', '274': '力', '277': 'し', '280': 'て', '283': 'く', '286': 'だ', '289': 'さ', '292': 'い',
        }
        this.load_ready = {
            '160': '.', '163': '.', '166': '.', '169': '3',
            '200': '.', '203': '.', '206': '.', '209': '2',
            '240': '.', '243': '.', '246': '.', '249': '1',
            '280': '.', '283': '.', '286': '.', '292': 'G', '295': 'O', '298': '!', '301': '!',
        }
        this.difficulty = 'normal';
        this.scene = 'loadBoot';
        this.timer = 0;
        this.score = 0;

        this.answered_list = [];
        this.question = undefined;
        this.question_index = 0;
        this.question_pos = 0;
        this.question_filter = undefined;
        this.filtered_list = [];
    };

    Scene_ACROTYPE.prototype.initRenderer = function(){
        this.renderer = {
            lower : new Stage(),
            middle : new Stage(),
            upper : new Stage(),
            animation : new Stage()
        }
        this.addChild(this.renderer.lower);
        this.addChild(this.renderer.middle);
        this.addChild(this.renderer.upper);
        this.addChild(this.renderer.animation);
    };


    //=============================================================================
    // Scene_ACROTYPE.Shader
    //  Shaderを定義します
    //=============================================================================
    Scene_ACROTYPE.prototype.createShader = function(){
        this.shader = new Shader();
        this.renderer.upper.addChild(this.shader.sprite);
        this.shader.hide();
    };

    Scene_ACROTYPE.prototype.fadeinShader = function(value){
        this.shader.fadein(value);
    };

    Scene_ACROTYPE.prototype.fadeoutShader = function(value){
        this.shader.fadeout(value);
    };


    //=============================================================================
    // Scene_ACROTYPE.BackGround
    //  BackGroundを定義します
    //=============================================================================
    Scene_ACROTYPE.prototype.createBackGround = function(){
        this.background_upper = new Sprite(new Bitmap(816, 312));
        this.background_upper.bitmap.createImagePatched(img_window.wood_upper, 50, 50);
        this.background_upper.bitmap.createImagePatched(img_window.paper, 50, 50, 48, 32, 816 - 96, 312 - 64);
        this.background_upper.move(0, 0);
        this.renderer.lower.addChild(this.background_upper);
        this.background_lower = new Sprite(new Bitmap(816, 312));
        this.background_lower.bitmap.createImagePatched(img_window.wood_lower, 50, 50);
        this.background_lower.move(0, 312);
        this.renderer.lower.addChild(this.background_lower);
    };

    Scene_ACROTYPE.prototype.hideBackGround = function(){
        this.background_upper.hide();
        this.background_lower.hide();
    };

    Scene_ACROTYPE.prototype.showBackGround = function(){
        this.background_upper.show();
        this.background_lower.show();
    };


    //=============================================================================
    // Scene_ACROTYPE.Frame
    //  Frameを定義します
    //=============================================================================
    Scene_ACROTYPE.prototype.createFrame = function(){
        this.background_frame = new Sprite(new Bitmap(816, 624));
        this.background_frame.bitmap.createImagePatched(img_window.frame, 80, 80);
        this.background_frame.move(0, 0);
        this.renderer.lower.addChild(this.background_frame);
    };

    Scene_ACROTYPE.prototype.showFrame = function(){
        this.background_frame.show();
    };

    Scene_ACROTYPE.prototype.hideFrame = function(){
        this.background_frame.hide();
    };


    //=============================================================================
    // Scene_ACROTYPE.Clock
    //  Clockを定義します
    //=============================================================================
    Scene_ACROTYPE.prototype.createClock = function(){
        this.clock = new Clock(CLOCK_OFFSET_X, CLOCK_OFFSET_Y);
        this.renderer.lower.addChild(this.clock.back);
        this.renderer.lower.addChild(this.clock.frame);
        this.renderer.lower.addChild(this.clock.hand);
    };

    Scene_ACROTYPE.prototype.showClock = function(){
        this.clock.show();
    };

    Scene_ACROTYPE.prototype.hideClock = function(){
        this.clock.hide();
    };

    Scene_ACROTYPE.prototype.updateClock = function(){
        if(this.clock.update()){
            this.endGame();
        }
    };

    Scene_ACROTYPE.prototype.setStateClock = function(state){
        this.clock.setState(state);
    };


    //=============================================================================
    // Scene_ACROTYPE.Key
    //  Keyを定義します
    //=============================================================================
    Scene_ACROTYPE.prototype.createKey = function(){
        this.keymap.forEach(key => this.keylist.push(new Key(key, this.keypos[key].x, this.keypos[key].y)));
        for(var i = 0; i < this.keylist.length; i ++){
            this.renderer.middle.addChild(this.keylist[i].sprite);
        }
    };

    Scene_ACROTYPE.prototype.showKey = function(){
        this.keymap.forEach(keycode => this.keylist[GET_KEYCODE[keycode]].show());
    };

    Scene_ACROTYPE.prototype.hideKey = function(){
        this.keymap.forEach(keycode => this.keylist[GET_KEYCODE[keycode]].hide());
    };

    Scene_ACROTYPE.prototype.updateKey = function(){
        this.keymap.forEach(keycode => this.checkKeyTimer(keycode));
    };

    Scene_ACROTYPE.prototype.checkKeyTimer = function(keycode){
        if(this.keylist[GET_KEYCODE[keycode]].checkTimer()){
            this.keylist[GET_KEYCODE[keycode]].decay();
        }
    };

    Scene_ACROTYPE.prototype.checkKeyToggle = function(keycode){
        return this.keylist[GET_KEYCODE[keycode]].toggle;
    };

    Scene_ACROTYPE.prototype.checkKeyInput = function(keycode){
        if(Input.isPressed(keycode)){
            this.keylist[GET_KEYCODE[keycode]].press();
            if(Input.isTriggered(keycode)){
                this.soundType_1();
                if(this.checkModifier(keycode)){
                    this.keylist[GET_KEYCODE[keycode]].trigger();
                } else {
                    this.eventKeycode(keycode);
                }
            }
        }
    };

    Scene_ACROTYPE.prototype.checkKeyTouch = function(keycode, x, y){
        if(this.keylist[GET_KEYCODE[keycode]].checkTouch(x, y)){
            this.soundType_1();
            if(this.checkModifier(keycode)){
                this.keylist[GET_KEYCODE[keycode]].trigger();
            } else {
                this.keylist[GET_KEYCODE[keycode]].press();
                this.eventKeycode(keycode);
            }
        }
    };

    Scene_ACROTYPE.prototype.checkModifier = function(keycode){
        switch(keycode){
            case 'shift':
            case 'control':
            case 'alt':
                return true;
            default:
                return false;
        }
    };


    //=============================================================================
    // Scene_ACROTYPE.TextBoard
    //  TextBoardを定義します
    //=============================================================================
    Scene_ACROTYPE.prototype.createTextBoard = function(){
        this.textboard_header = new Textboard(TEXTBOARD_OFFSET_X, TEXTBOARD_OFFSET_Y_HEADER, true);
        this.renderer.middle.addChild(this.textboard_header.sprite);
        for(var i = 0; i < 5; i ++){
            this.textboard_list.push(new Textboard(TEXTBOARD_OFFSET_X, TEXTBOARD_OFFSET_Y + (TEXT_SIZE + TEXT_SIZE_OUTLINE) * i))
            this.renderer.middle.addChild(this.textboard_list[i].sprite);
        }
    };

    Scene_ACROTYPE.prototype.updateTextBoard = function(){
        this.textboard_header.update();
        for(var i = 0; i < this.textboard_list.length; i ++){
            this.textboard_list[i].update();
        }
    };

    Scene_ACROTYPE.prototype.setMaskTextBoard = function(line = 0, mask = 0){
        this.textboard_list[line].setMask(mask);
    };

    Scene_ACROTYPE.prototype.getMaskTextBoard = function(line = 0){
        return this.textboard_list[line].getMask();
    };

    Scene_ACROTYPE.prototype.getByteTextBoard = function(line = 0){
        return this.textboard_list[line].getByte();
    };

    Scene_ACROTYPE.prototype.clearTextBoard = function(line = 0){
        this.textboard_list[line].clear();
    };

    Scene_ACROTYPE.prototype.clearTextBoard_Header = function(){
        this.textboard_header.clear();
    };

    Scene_ACROTYPE.prototype.pushTextTextBoard = function(line = 0, text = ''){
        this.textboard_list[line].pushText(text);
    };

    Scene_ACROTYPE.prototype.pushTextTextBoard_Header = function(text = ''){
        this.textboard_header.pushText(text);
    };

    Scene_ACROTYPE.prototype.setTextTextBoard = function(line = 0, text = ''){
        this.textboard_list[line].setText(text);
    };

    Scene_ACROTYPE.prototype.setTextTextBoard_Header = function(text = ''){
        this.textboard_header.setText(text);
    };

    Scene_ACROTYPE.prototype.showTextBoard = function(line = 0){
        this.textboard_list[line].show();
    };

    Scene_ACROTYPE.prototype.hideTextBoard = function(line = 0){
        this.textboard_list[line].hide();
    };

    Scene_ACROTYPE.prototype.showTextBoard_Header = function(){
        this.textboard_header.show();
    };

    Scene_ACROTYPE.prototype.hideTextBoard_Header = function(){
        this.textboard_header.hide();
    };

    Scene_ACROTYPE.prototype.setStateTextBoard = function(line = 0, state = ''){
        this.textboard_list[line].setState(state);
    };

    Scene_ACROTYPE.prototype.setStateTextBoard_Header = function(state = ''){
        this.textboard_header.setState(state);
    };

    Scene_ACROTYPE.prototype.colorTextBoard = function(line = 0, color = '#FF0000', pos, shift){
        this.textboard_list[line].colorCharacter(color, pos, shift);
    };

    Scene_ACROTYPE.prototype.colorTextBoard_Header = function(color = '#FF0000', pos, shift){
        this.textboard_header.colorCharacter(color, pos, shift);
    };


    //=============================================================================
    // Scene_ACROTYPE.ScoreBoard
    //  ScoreBoardを定義します
    //=============================================================================
    Scene_ACROTYPE.prototype.createScoreBoard = function(){
        this.scoreboard = new Textboard(SCOREBOARD_OFFSET_X, SCOREBOARD_OFFSET_Y, true, true);
        this.renderer.middle.addChild(this.scoreboard.sprite);
    };

    Scene_ACROTYPE.prototype.showScoreBoard = function(){
        this.scoreboard.show();
    };

    Scene_ACROTYPE.prototype.hideScoreBoard = function(){
        this.scoreboard.hide();
    };

    Scene_ACROTYPE.prototype.updateScoreBoard = function(){
        this.scoreboard.update();
    };

    Scene_ACROTYPE.prototype.pushTextScoreBoard = function(text = ''){
        this.scoreboard.pushText(text);
    };

    Scene_ACROTYPE.prototype.setTextScoreBoard = function(text = ''){
        this.scoreboard.setText(text);
    };

    Scene_ACROTYPE.prototype.setStateScoreBoard = function(state){
        this.scoreboard.setState(state);
    };

    Scene_ACROTYPE.prototype.setScoreScoreBoard = function(){
        if(this.score < 10){
            this.scoreboard.setText('[SCORE:   ' + this.score + ']');
        } else {
            if(this.score < 100){
                this.scoreboard.setText('[SCORE:  ' + this.score + ']');
            } else {
                this.scoreboard.setText('[SCORE: ' + this.score + ']');
            }
        }
    };


    //=============================================================================
    // Scene_ACROTYPE.Caret
    //  Caretを定義します
    //=============================================================================
    Scene_ACROTYPE.prototype.createCaret = function(){
        this.caret = new Caret();
        this.renderer.middle.addChild(this.caret.sprite);
    };

    Scene_ACROTYPE.prototype.updateCaret = function(){
        this.caret.blink();
    };

    Scene_ACROTYPE.prototype.showCaret = function(){
        this.caret.show();
    };

    Scene_ACROTYPE.prototype.hideCaret = function(){
        this.caret.hide();
    };

    Scene_ACROTYPE.prototype.setCaret = function(x = 0, y = 0){
        this.caret.set(x, y);
    };

    Scene_ACROTYPE.prototype.moveCaret = function(x = 0, y = 0, mask = 0){
        this.caret.move(x, y, mask);
    };

    Scene_ACROTYPE.prototype.setStateCaret = function(state){
        this.caret.setState(state);
    };


    //=============================================================================
    // Scene_ACROTYPE.Animation
    //  Animationを定義します
    //=============================================================================
    Scene_ACROTYPE.prototype.createAnimation = function(x, y, type){
        this.animation_list.push(new Animation(x, y, type));
        this.renderer.animation.addChild(this.animation_list[this.animation_list.length - 1].sprite);
    };

    Scene_ACROTYPE.prototype.updateAnimation = function(){
        for(var i = 0; i < this.animation_list.length; i ++){
            if(this.animation_list[i].update()){
                this.renderer.animation.removeChildAt(i);
                this.animation_list.splice(i, 1);
            }
        }
    };


    //=============================================================================
    // Scene_ACROTYPE.Event
    //  Eventを定義します
    //=============================================================================
    Scene_ACROTYPE.prototype.eventKeycode = function(keycode){
        switch(keycode){
            case 'a':
            case 'b':
            case 'c':
            case 'd':
            case 'e':
            case 'f':
            case 'g':
            case 'h':
            case 'i':
            case 'j':
            case 'k':
            case 'l':
            case 'm':
            case 'n':
            case 'o':
            case 'p':
            case 'q':
            case 'r':
            case 's':
            case 't':
            case 'u':
            case 'v':
            case 'w':
            case 'x':
            case 'y':
            case 'z':
            case 'space':
                if(this.checkKeyToggle('alt')){
                    if(this.checkKeyToggle('shift')){
                        this.pushCharacter(keycode.toUpperCase());
                    } else {
                        this.pushCharacter(keycode);
                    }
                } else {
                    if(this.checkKeyToggle('shift')){
                        this.pushCharacter(keycode.toUpperCase());
                    } else {
                        this.pushCharacter(keycode);
                    }
                }
                break;
            case 'backspace':
                this.pushBackSpace();
                break;
            case 'enter':
                this.pushEnter();
            default:
                break;
        }
    };

    Scene_ACROTYPE.prototype.pushCharacter = function(character){
        if(this.getByteTextBoard(this.caret.index_y) < TEXT_MAX_LENGTH){
            if(character == 'space' || character == 'SPACE'){
                this.pushTextTextBoard(this.caret.index_y, '_');
            } else {
                this.pushTextTextBoard(this.caret.index_y, character);
            }
            this.moveCaret(1, 0);
        }
    };

    Scene_ACROTYPE.prototype.pushBackSpace = function(){
        if(this.checkKeyToggle('control')){
            this.setCaret(this.getMaskTextBoard(this.caret.index_y), this.caret.index_y);
            this.setTextTextBoard(this.caret.index_y, this.textboard_list[this.caret.index_y].text.slice(0, this.caret.index_x));
        } else {
            if(getByte(this.textboard_list[this.caret.index_y].text) >= 0){
                this.moveCaret(-1, 0, this.getMaskTextBoard(this.caret.index_y));
                this.setTextTextBoard(this.caret.index_y, this.textboard_list[this.caret.index_y].text.slice(0, this.caret.index_x));
            }
        }
    };

    Scene_ACROTYPE.prototype.pushEnter = function(){
        switch(this.caret.state){
            case 'command':
                var input = this.textboard_list[this.caret.index_y].text.slice(9);
                var split = input.toLowerCase().split('_');
                switch(split[0].toLowerCase()){
                    case '':
                        if(input != ''){
                            this.showTextBoard(3);
                            this.setTextTextBoard(3, '[' + this.textboard_list[4].text.slice(this.getMaskTextBoard(this.caret.index_y), this.caret.index_x) + ': 不正なコマンドです]');
                            this.setStateTextBoard(3, 'wait_fadeout');
                            this.setCaret(this.getMaskTextBoard(this.caret.index_y), this.caret.index_y);
                            this.setTextTextBoard(4, 'command: ');
                        }
                        break;
                    case 'game':
                        this.setDifficulty('normal');
                        if(split.contains('h')){
                            this.setDifficulty('hard');
                        }
                        if(split.contains('vh')){
                            this.setDifficulty('veryhard');
                        }
                        this.startGame();
                        break;
                    case 'help':
                        this.showTextBoard(3);
                        this.setTextTextBoard(3, 'コマンド一覧を表示します（未実装）');
                        this.setStateTextBoard(3, 'wait_fadeout');
                        this.setCaret(this.getMaskTextBoard(this.caret.index_y), this.caret.index_y);
                        this.setTextTextBoard(4, 'command: ');
                        break;
                    case 'ranking':
                        window.RPGAtsumaru.scoreboards.display(1);
                        break;
                    default:
                        this.showTextBoard(3);
                        this.setTextTextBoard(3, '[' + this.textboard_list[4].text.slice(this.getMaskTextBoard(this.caret.index_y), this.caret.index_x) + ': 不正なコマンドです]');
                        this.setStateTextBoard(3, 'wait_fadeout');
                        this.setCaret(this.getMaskTextBoard(this.caret.index_y), this.caret.index_y);
                        this.setTextTextBoard(4, 'command: ');
                        break;
                }
                break;
            case 'answer_first':
            case 'answer_second':
                var input = this.textboard_list[this.caret.index_y].text.slice(this.getMaskTextBoard(this.caret.index_y));
                switch(input.toLowerCase()){
                    case '':
                        break;
                    case '_exit':

                        break;
                    default:
                        if(input.toLowerCase() == this.question.getSpell()[this.question_pos]){
                            this.soundUp_3();
                            this.moveQuestion();
                        } else {
                            this.mistakeQuestion();
                        }
                    break;
                }
            default:
                break;
        }
    };

    Scene_ACROTYPE.prototype.startGame = function(){
        this.showTextBoard(3);
        this.setTextTextBoard(3, 'ゲームを開始します');
        this.setStateTextBoard(3, 'wait_fadeout');
        this.setTextTextBoard(4, 'command: ');
        this.setStateTextBoard_Header('wait_fadeout');
        this.setStateTextBoard(0, 'wait_fadeout');
        this.setStateTextBoard(4, 'wait_fadeout');
        this.hideCaret();
        this.setScene('loadReady');
        this.setTimer(0);
    };

    Scene_ACROTYPE.prototype.endGame = function(){
        if(window.RPGAtsumaru){
            window.RPGAtsumaru.scoreboards.setRecord(1, this.score).then(function(){
                window.RPGAtsumaru.scoreboards.display(1);
            })
        }
        this.resetGame();
        this.showTextBoard(4);
        this.setTextTextBoard_Header('コマンドを入力してください');
        this.setTextTextBoard(0, '[help: コマンド一覧を表示する]');       
        this.setTextTextBoard(4, 'command: ');
        this.setMaskTextBoard(4, 9);
        this.setCaret(9, 4);
        this.setScene('free_input');
        this.setStateCaret('command');
    };

    Scene_ACROTYPE.prototype.resetGame = function(){
        this.stopMusic();
        this.setTextTextBoard_Header('');
        this.setTextTextBoard(0, '');
        this.setTextTextBoard(1, '');
        this.setTextTextBoard(2, '');
        this.setTextTextBoard(3, '');
        this.setTextTextBoard(4, '');
        this.setMaskTextBoard(0, 0);
        this.setMaskTextBoard(1, 0);
        this.setMaskTextBoard(2, 0);
        this.setMaskTextBoard(3, 0);
        this.setMaskTextBoard(4, 0);
        this.setStateClock('');
        this.hideClock();
        this.hideScoreBoard();
        this.setCaret(0, 0);
        this.score = 0;
        this.setScoreScoreBoard();
    };


    //=============================================================================
    // Scene_ACROTYPE.Wordlist
    //  Wordlistを定義します
    //=============================================================================
    Scene_ACROTYPE.prototype.makeFilteredList = function(div){
        if(div == undefined){
            this.filtered_list = wordlist;
        } else {
            this.filtered_list = wordlist.filter(word => word.division == div);
        }
    };

    Scene_ACROTYPE.prototype.makeQuestion = function(){
        if(this.filtered_list.length < 1){
            this.makeFilteredList();
        }
        this.question_index = Math.randomInt(this.filtered_list.length);
        this.question_pos = 0;
        this.question = this.filtered_list[this.question_index];
        this.filtered_list.splice(this.question_index, 1);       
        this.setTextTextBoard_Header('【' + this.question.getInitial() + '】- ' + GET_DEVISION_NAME[this.question.getDivision()] + ' -');
        this.colorTextBoard_Header('#FF0000', this.question.getCharacter()[this.question_pos], 1);
        var initial = '';
        for(var i = 0; i < this.question.getCharacter()[this.question_pos].length; i ++){
            initial += this.question.getInitial()[this.question.getCharacter()[this.question_pos][i]];
        }
        switch(this.difficulty){
            case 'veryhard':
                this.setTextTextBoard(2, initial + ') ');
                this.setMaskTextBoard(2, this.getByteTextBoard(2));
                this.setCaret(this.getByteTextBoard(2), 2);
                break;
            case 'hard':
                this.setTextTextBoard(3, '[意: ' + this.question.getMeaning()[this.question_pos] + ' ]');
                this.setTextTextBoard(2, initial + ') ');
                this.setMaskTextBoard(2, this.getByteTextBoard(2));
                this.setCaret(this.getByteTextBoard(2), 2);
                break;
            case 'normal': 
            default:
                this.setTextTextBoard(3, '[正: ' + this.question.getSpell()[this.question_pos] + ' | 意: ' + this.question.getMeaning()[this.question_pos] + ' ]');
                this.setTextTextBoard(4, initial + ') ');
                this.setMaskTextBoard(4, this.getByteTextBoard(4));
                this.setCaret(this.getByteTextBoard(4), 4);
                break;
        }
    };

    Scene_ACROTYPE.prototype.moveQuestion = function(){
        this.question_pos ++;
        if(this.question_pos >= this.question.getCharacter().length){
            this.makeQuestion();
        } else {
            this.setTextTextBoard_Header('【' + this.question.getInitial() + '】- ' + GET_DEVISION_NAME[this.question.getDivision()] + ' -');
            this.colorTextBoard_Header('#FF0000', this.question.getCharacter()[this.question_pos], 1);
            var initial = '';
            for(var i = 0; i < this.question.getCharacter()[this.question_pos].length; i ++){
                initial += this.question.getInitial()[this.question.getCharacter()[this.question_pos][i]];
            }
            switch(this.difficulty){
                case 'veryhard':
                    this.setTextTextBoard(2, initial + ') ');
                    this.setMaskTextBoard(2, this.getByteTextBoard(2));
                    this.setCaret(this.getByteTextBoard(2), 2);
                    break;
                case 'hard':
                    this.setTextTextBoard(2, initial + ') ');
                    this.setMaskTextBoard(2, this.getByteTextBoard(2));
                    this.setCaret(this.getByteTextBoard(2), 2);             
                    break;
                case 'normal':
                default:
                    this.setTextTextBoard(4, initial + ') ');
                    this.setMaskTextBoard(4, this.getByteTextBoard(4));
                    this.setCaret(this.getByteTextBoard(4), 4);
                    break;     
            }
        }
        if(this.caret.state == 'answer_second'){
            switch(this.difficulty){
                case 'veryhard':
                    this.setTextTextBoard(0, '[赤字のアルファベットを英単語に戻せ: SCORE +4]');
                    this.hideTextBoard(3);
                    this.setStateCaret('answer_first');
                    this.hideTextBoard(4);
                    break;
                case 'hard':
                    this.setTextTextBoard(3, '[意: ' + this.question.getMeaning()[this.question_pos] + ' ]');
                    this.setTextTextBoard(0, '[赤字のアルファベットを英単語に戻せ: SCORE +2]');
                    this.setStateCaret('answer_first');
                    this.hideTextBoard(4);
                    break;
                case 'normal':
                default:
                    this.setTextTextBoard(3, '[正: ' + this.question.getSpell()[this.question_pos] + ' | 意: ' + this.question.getMeaning()[this.question_pos] + ' ]');
                    this.setTextTextBoard(0, '[正解を見て正しくスペリングせよ: SCORE +1]');
                    this.setStateCaret('answer_second');
                    break;
            }
            this.score += SOCER_NORMAL;
            this.createAnimation(648, 60, 'score_good');
        } else {
            switch(this.difficulty){
                case 'veryhard':
                    this.score += SOCER_VERYHARD;
                    this.createAnimation(648, 60, 'score_excellent');
                    break;
                case 'hard':
                    this.setTextTextBoard(3, '[意: ' + this.question.getMeaning()[this.question_pos] + ' ]');
                    this.score += SOCER_HARD;
                    this.createAnimation(648, 60, 'score_great');
                    break;
                case 'normal':
                default:       
                    this.score += SOCER_NORMAL;
                    this.createAnimation(648, 60, 'score_good');
                    break;             
            }
        }
        this.setScoreScoreBoard();   
    };

    Scene_ACROTYPE.prototype.mistakeQuestion = function(){
        if(this.caret.state == 'answer_first'){
            this.setStateCaret('answer_second');
            var initial = '';
            for(var i = 0; i < this.question.getCharacter()[this.question_pos].length; i ++){
                initial += this.question.getInitial()[this.question.getCharacter()[this.question_pos][i]];
            }
            switch(this.difficulty){
                case 'veryhard':
                case 'hard':
                    this.setTextTextBoard(4, initial + ') ');
                    this.showTextBoard(4);
                    this.setMaskTextBoard(4, this.getByteTextBoard(4));           
                    this.setTextTextBoard(0, '[正解を見て正しくスペリングせよ: SCORE +1]');
                    this.showTextBoard(3);
                    this.setTextTextBoard(3, '[正: ' + this.question.getSpell()[this.question_pos] + ' | 意: ' + this.question.getMeaning()[this.question_pos] + ' ]');
                    break;
                case 'normal':
                default:
                    break;
            }
            this.setCaret(this.getByteTextBoard(4), 4);
        } else {
            var initial = '';
            for(var i = 0; i < this.question.getCharacter()[this.question_pos].length; i ++){
                initial += this.question.getInitial()[this.question.getCharacter()[this.question_pos][i]];
            }
            this.setTextTextBoard(4, initial + ') ');
            this.setCaret(this.getMaskTextBoard(this.caret.index_y), this.caret.index_y);
        }
    };

    //=============================================================================
    // Sounds_Archive
    //  音声関連のあれやこれを定義します。
    //=============================================================================
    Scene_ACROTYPE.prototype.music_1 = function(){
        AudioManager.playBgm({'name':'bgm_1', 'volume':20, 'pitch':100, 'pan':0});
    };

    Scene_ACROTYPE.prototype.stopMusic = function(){
        AudioManager.stopBgm();
    };

    Scene_ACROTYPE.prototype.soundType_1 = function(){
        var pitch = 75 + Math.random() * 50;
        AudioManager.playSe({'name':'se_type_1', 'volume':70, 'pitch':pitch, 'pan':0});
    };

    Scene_ACROTYPE.prototype.soundType_2 = function(){
        AudioManager.playSe({'name':'se_type_2', 'volume':100, 'pitch':100, 'pan':0});
    };

    Scene_ACROTYPE.prototype.soundType_3 = function(){
        AudioManager.playSe({'name':'se_type_3', 'volume':100, 'pitch':80, 'pan':0});
    };

    Scene_ACROTYPE.prototype.soundUp_3 = function(){
        AudioManager.playSe({'name':'se_up_3', 'volume':20, 'pitch':100, 'pan':0});
    };
})();
