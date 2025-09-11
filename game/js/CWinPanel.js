function CWinPanel(oSpriteBg) {

    var _oBg;
    var _oTitleTextStoke;
    var _oTitleText;
    var _oNewScoreTextStroke;
    var _oNewScoreText;
    var _oBestScoreTextStroke;
    var _oBestScoreText;
    var _oGroup;
    var _oButMenu;
    var _oButRestart;
    var _oFlagContainer;

    this._init = function (oSpriteBg) {
        var iSizeFontSecondaryText = 50;

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible = false;

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        oFade.alpha = 0.5;
        _oGroup.addChild(oFade);

        _oBg = createBitmap(oSpriteBg);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;
        _oGroup.addChild(_oBg);

        _oTitleTextStoke = new CTLText(_oGroup, 
                    CANVAS_WIDTH / 2 -oSpriteBg.width/2, CANVAS_HEIGHT_HALF-180, oSpriteBg.width, 90, 
                    80, "center", TEXT_COLOR_STROKE, FONT_GAME, 1.1,
                    50, 0,
                    TEXT_GAMEOVER,
                    true, true, false,
                    false );
        
        _oTitleTextStoke.setOutline(6);

        _oTitleText = new CTLText(_oGroup, 
                    CANVAS_WIDTH / 2 -oSpriteBg.width/2, CANVAS_HEIGHT_HALF-180, oSpriteBg.width, 90, 
                    80, "center",TEXT_COLOR, FONT_GAME, 1.1,
                    50, 0,
                    TEXT_GAMEOVER,
                    true, true, false,
                    false );
                    

        _oNewScoreTextStroke = new CTLText(_oGroup, 
                    CANVAS_WIDTH / 2 -oSpriteBg.width/2, CANVAS_HEIGHT_HALF-70, oSpriteBg.width, 50, 
                    50, "center", TEXT_COLOR_STROKE, FONT_GAME, 1.1,
                    50, 0,
                    "",
                    true, true, false,
                    false );
                
        _oNewScoreTextStroke.setOutline(5);

        _oNewScoreText = new CTLText(_oGroup, 
                    CANVAS_WIDTH / 2 -oSpriteBg.width/2, CANVAS_HEIGHT_HALF-70, oSpriteBg.width, 50, 
                    50, "center", TEXT_COLOR, FONT_GAME, 1.1,
                    50, 0,
                    "",
                    true, true, false,
                    false );


        _oBestScoreTextStroke = new CTLText(_oGroup, 
                    CANVAS_WIDTH / 2 -oSpriteBg.width/2+120, CANVAS_HEIGHT_HALF-10, oSpriteBg.width-240, 50, 
                    50, "center", TEXT_COLOR_STROKE, FONT_GAME, 1.1,
                    0, 0,
                    "",
                    true, true, false,
                    false );
                    
        _oBestScoreTextStroke.setOutline(5);

        _oBestScoreText = new CTLText(_oGroup, 
                    CANVAS_WIDTH / 2 -oSpriteBg.width/2+120, CANVAS_HEIGHT_HALF-10, oSpriteBg.width-240, 50, 
                    50, "center", TEXT_COLOR, FONT_GAME, 1.1,
                    0, 0,
                    "",
                    true, true, false,
                    false );

        var oSpriteButRestart = s_oSpriteLibrary.getSprite("but_restart");
        _oButRestart = new CGfxButton(CANVAS_WIDTH * 0.5 + 250, CANVAS_HEIGHT * 0.5 + 120, oSpriteButRestart, _oGroup);
        _oButRestart.pulseAnimation();
        _oButRestart.addEventListener(ON_MOUSE_DOWN, this._onRestart, this);

        var oSpriteButHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton(CANVAS_WIDTH * 0.5 - 250, CANVAS_HEIGHT * 0.5 + 120, oSpriteButHome, _oGroup);
        _oButMenu.addEventListener(ON_MOUSE_DOWN, this._onExit, this);

        _oFlagContainer = new createjs.Container();

        _oGroup.addChild(_oFlagContainer);

        _oGroup.on("click", function () {});

        s_oStage.addChild(_oGroup);

    };

    this.unload = function () {
        _oGroup.removeAllEventListeners();
        s_oStage.removeChild(_oGroup);
        if (_oButMenu) {
            _oButMenu.unload();
            _oButMenu = null;
        }

        if (_oButRestart) {
            _oButRestart.unload();
            _oButRestart = null;
        }

    };

    this.show = function (iScore) {
        _oTitleTextStoke.refreshText(TEXT_GAMEOVER);
        _oTitleText.refreshText(TEXT_GAMEOVER);

        _oNewScoreTextStroke.refreshText(TEXT_SCORE + ": " + iScore);
        _oNewScoreText.refreshText( TEXT_SCORE + ": " + iScore);

        _oBestScoreTextStroke.refreshText( TEXT_BEST_SCORE + ": " + s_iBestScore);
        _oBestScoreText.refreshText( TEXT_BEST_SCORE + ": " + s_iBestScore);

        _oGroup.visible = true;

        createjs.Tween.get(_oGroup).wait(MS_WAIT_SHOW_GAME_OVER_PANEL).to({alpha: 1}, 1250, createjs.Ease.cubicOut).call(function () {
            if (s_iAdsLevel === NUM_LEVEL_FOR_ADS) {
                $(s_oMain).trigger("show_interlevel_ad");
                s_iAdsLevel = 1;
            } else {
                s_iAdsLevel++;
            }
        });

        $(s_oMain).trigger("save_score", iScore);
        $(s_oMain).trigger("share_event", iScore);
    };

    this._onContinue = function () {
        var oParent = this;
        createjs.Tween.get(_oGroup, {override: true}).to({alpha: 0}, 750, createjs.Ease.cubicOut).call(function () {
            oParent.unload();
        });

        _oButContinue.block(true);
        _oButMenu.block(true);
        s_oGame.onContinue();
    };

    this._onRestart = function () {
        _oButRestart.block(true);
        this.unload();
        s_oGame.restartGame();
    };

    this._onExit = function () {

        this.unload();

        s_oGame.onExit();
    };

    this._init(oSpriteBg);

    return this;
}