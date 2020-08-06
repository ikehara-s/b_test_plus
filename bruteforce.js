//=============================================================================
// BruteForce.js
//=============================================================================
/*:ja
 * @plugindesc ぼくらのブルートフォース用プラグイン
 * @author きつねうどん 
 * 
 */

(function() {
    var pluginName = 'BRUTEFORCE';

    //=============================================================================
    // Scene_Boot
    //  プラグイン設定よりデバッグフラグONでパズル画面に直行します。
    //=============================================================================
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function(){
        _Scene_Boot_start.apply(this, arguments);
        if (!DataManager.isBattleTest() && !DataManager.isEventTest()){
            SceneManager.push(Scene_BRUTEFORCE);
        }
    };

    //=============================================================================
    // Utility
    //  既存ファンクションを拡張定義します。
    //=============================================================================
    Input.keyMapper['8']  = 'backspace';
    Input.keyMapper['13'] = 'enter';
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

    function lp(filename){
        return ImageManager.loadPicture(filename);
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


    //=============================================================================
    // Images_Archive
    //  画像関連のあれやこれを定義します。
    //=============================================================================
    var img_window = {
        wood_upper: lp('window_upper'),
        wood_lower: lp('window_lower'),
        frame: lp('window_frame'),
        paper: lp('window_main'),
    };

    var img_keys = {
        enter: lp('key_enter'), backspace: lp('key_backspace'), a: lp('key_a'),
        b: lp('key_b'), c: lp('key_c'), d: lp('key_d'), e: lp('key_e'), f: lp('key_f'),
        g: lp('key_g'), h: lp('key_h'), i: lp('key_i'), j: lp('key_j'), k: lp('key_k'),
        l: lp('key_l'), m: lp('key_m'), n: lp('key_n'), o: lp('key_o'), p: lp('key_p'),
        q: lp('key_q'), r: lp('key_r'), s: lp('key_s'), t: lp('key_t'), u: lp('key_u'),
        v: lp('key_v'), w: lp('key_w'), x: lp('key_x'), y: lp('key_y'), z: lp('key_z'),
    };

    
    //=============================================================================
    // Scene_BRUTEFORCE
    //  ゲーム用にシーンを定義します。
    //=============================================================================
    function Scene_BRUTEFORCE(){
        this.initialize.apply(this, arguments);
    };

    Scene_BRUTEFORCE.prototype = Object.create(Scene_Base.prototype);
    Scene_BRUTEFORCE.prototype.constructor = Scene_BRUTEFORCE;

    Scene_BRUTEFORCE.prototype.initialize = function(){
        Scene_Base.prototype.initialize.call(this);
    };

    Scene_BRUTEFORCE.prototype.create = function(){
        Scene_Base.prototype.create.call(this);
        this.initRenderer();
        this.createBackGround();
    };

    Scene_BRUTEFORCE.prototype.update = function(){
        Scene_Base.prototype.update.call(this);
    };

    Scene_BRUTEFORCE.prototype.initRenderer = function(){
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

    Scene_BRUTEFORCE.prototype.createBackGround = function(){
        this.background_upper = new Sprite(new Bitmap(816, 376));
        this.background_upper.bitmap.createImagePatched(img_window.wood_upper, 50, 50);
        //this.background_upper.bitmap.createImagePatched(img_window.paper, 50, 50, 48, 32, 816 - 96, 376 - 64);
        this.background_upper.move(0, 0);
        this.renderer.lower.addChild(this.background_upper);
        this.background_lower = new Sprite(new Bitmap(816, 248));
        this.background_lower.bitmap.createImagePatched(img_window.wood_lower, 50, 50);
        this.background_lower.move(0, 376);
        this.renderer.lower.addChild(this.background_lower);
    };

})();
