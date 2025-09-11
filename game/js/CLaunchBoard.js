function CLaunchBoard(oParentContainer) {

    var _pContainerPos;
    var _oLaunchText;
    var _oLaunchTextStroke;
    var _oLaunch;
    var _oParentContainer = oParentContainer;
    var _oContainer;
    var _oBounds;

    this._init = function () {

        _pContainerPos = {x: CANVAS_WIDTH_HALF + 660, y: CANVAS_HEIGHT - 60};
        _oContainer = new createjs.Container();
        _oContainer.x = _pContainerPos.x;
        _oContainer.y = _pContainerPos.y;
        _oParentContainer.addChild(_oContainer);

        _oLaunchText = new createjs.Text("99" + TEXT_OF + NUM_OF_PENALTY, "50px " + FONT_GAME, TEXT_COLOR);
        _oLaunchText.textAlign = "right";
        _oLaunchText.y = -4;
        _oContainer.addChild(_oLaunchText);

        _oContainer.y = _pContainerPos.y;
        _oParentContainer.addChild(_oContainer);

        _oLaunchTextStroke = new createjs.Text("99" + TEXT_OF + NUM_OF_PENALTY, "50px " + FONT_GAME, TEXT_COLOR_STROKE);
        _oLaunchTextStroke.textAlign = "right";
        _oLaunchTextStroke.y = _oLaunchText.y;
        _oLaunchTextStroke.outline = OUTLINE_WIDTH;
        _oContainer.addChild(_oLaunchTextStroke);

        var oSprite = s_oSpriteLibrary.getSprite("shot_left");
        _oLaunch = createBitmap(oSprite);
        _oLaunch.x = -_oLaunchText.getBounds().width * 1.4;
        _oLaunch.regX = oSprite.width * 0.5;
        _oLaunch.regY = 10;

        _oContainer.addChild(_oLaunch);

        _oBounds = _oContainer.getBounds();
        this.updateCache();
    };

    this.updateCache = function () {
        _oContainer.cache(-_oBounds.width, -_oBounds.height, _oBounds.width * 2, _oBounds.height * 2);
    };

    this.getStartPos = function () {
        return _pContainerPos;
    };

    this.setPos = function (iX, iY) {
        _oContainer.x = iX;
        _oContainer.y = iY;
    };

    this.refreshTextLaunch = function (iLaunch, iNumLaunch) {
        _oLaunchText.text = iLaunch + TEXT_OF + iNumLaunch;
        _oLaunchTextStroke.text = _oLaunchText.text;
        _oLaunch.x = -_oLaunchText.getBounds().width * 1.4;
        this.updateCache();
    };
    this._init();

    return this;
}