function CPause() {

    var _oContainer;
    var _oFade;

    this._init = function () {
        _oContainer = new createjs.Container();
        _oContainer.alpha = 0;

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.5;

        _oFade.on("click", function () {});

        _oContainer.addChild(_oFade);

        var oPauseText = new createjs.Text(TEXT_PAUSE, "70px " + FONT_GAME, TEXT_COLOR);
        oPauseText.x = CANVAS_WIDTH * 0.5;
        oPauseText.y = CANVAS_HEIGHT * 0.5 - 100;
        oPauseText.textAlign = "center";
        _oContainer.addChild(oPauseText);

        var oPauseTextStroke = new createjs.Text(TEXT_PAUSE, "70px " + FONT_GAME, TEXT_COLOR_STROKE);
        oPauseTextStroke.x = CANVAS_WIDTH * 0.5;
        oPauseTextStroke.y = CANVAS_HEIGHT * 0.5 - 100;
        oPauseTextStroke.outline = OUTLINE_WIDTH;
        oPauseTextStroke.textAlign = "center";
        _oContainer.addChild(oPauseTextStroke); 

        var oSpriteContinue = s_oSpriteLibrary.getSprite("but_continue");
        var oButContinue;
        oButContinue = new CGfxButton(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 + 70, oSpriteContinue, _oContainer);
        oButContinue.addEventListener(ON_MOUSE_UP, this._onLeavePause, this);

        s_oStage.addChild(_oContainer);

        var oParent = this;
        createjs.Tween.get(_oContainer).to({alpha: 1}, 150, createjs.Ease.quartOut).call(function () {
            oParent.onPause(true);
        });

    };

    this.onPause = function (bVal) {
        s_oGame.pause(bVal);
    };

    this.unload = function () {
        _oFade.off("click", function () {});
        s_oStage.removeChild(_oContainer);
    };

    this._onLeavePause = function () {
        playSound("click", 1, false);
        createjs.Ticker.paused = false;
        createjs.Tween.removeTweens(_oContainer);
        var oParent = this;
        createjs.Tween.get(_oContainer).to({alpha: 0}, 150, createjs.Ease.quartIn).call(function () {
            oParent.onPause(false);
            s_oInterface.unloadPause();
        });
    };

    this._init();

    return this;
}