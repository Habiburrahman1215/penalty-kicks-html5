function CInterface() {
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosPause;
    var _pStartPosGuiBox;
    var _pStartPosFullscreen;

    var _oButExit;
    var _oButPause;
    var _oButFullscreen;

    var _oAudioToggle;
    var _oWinPanel = null;
    var _oPause;
    var _oScoreBoard;
    var _oLaunchBoard;
    var _oHelpText;

    var _iStep;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    this._init = function () {
        _pStartPosGuiBox = {x: 0, y: 0};

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height / 2) - 10, y: (oSprite.height / 2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var oSprite = s_oSpriteLibrary.getSprite('but_pause');
        _pStartPosPause = {x: _pStartPosExit.x - oSprite.height - 10, y: _pStartPosExit.y};
        _oButPause = new CGfxButton(_pStartPosPause.x, _pStartPosPause.y, oSprite);
        _oButPause.addEventListener(ON_MOUSE_UP, this.onButPauseRelease, this);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: _pStartPosPause.x - oSprite.height - 10, y: _pStartPosExit.y};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if (ENABLE_FULLSCREEN === false) {
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && screenfull.isEnabled) {
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
            _pStartPosFullscreen = {x: oSprite.width / 4 + 10, y: oSprite.height / 2 + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x, _pStartPosFullscreen.y, oSprite, s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreen, this);
        }

        _oScoreBoard = new CScoreBoard(s_oStage);
        _oLaunchBoard = new CLaunchBoard(s_oStage);
        _oHelpText = new CHelpText(s_oStage);
        _oHelpText.fadeAnim(1, null);

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        _oButExit.setPosition(_pStartPosExit.x - iNewX, iNewY + _pStartPosExit.y);
        _oButPause.setPosition(_pStartPosPause.x - iNewX, iNewY + _pStartPosPause.y);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX, iNewY + _pStartPosAudio.y);
        }

        var oPosScoreBoard = _oScoreBoard.getStartPosScore();
        _oScoreBoard.setPosScore(oPosScoreBoard.x + iNewX, oPosScoreBoard.y - iNewY);

        var oPosLaunchBoard = _oLaunchBoard.getStartPos();
        _oLaunchBoard.setPos(oPosLaunchBoard.x - iNewX, oPosLaunchBoard.y - iNewY);

        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }
    };

    this.unloadHelpText = function () {
        if (_oHelpText !== null) {
            _oHelpText.fadeAnim(0, _oHelpText.unload);
            _oHelpText = null;
        }
    };

    this.unload = function () {
        _oButExit.unload();
        _oButExit = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        if (_fRequestFullScreen && screenfull.isEnabled) {
            _oButFullscreen.unload();
            _oButFullscreen = null;
        }

        s_oInterface = null;
    };

    this.createWinPanel = function (iScore) {
        _oWinPanel = new CWinPanel(s_oSpriteLibrary.getSprite("msg_box"));
        _oWinPanel.show(iScore);
    };


    this.refreshTextScoreBoard = function (iScore, fMultiplier, iScoreNoMult, bEffect) {
        _oScoreBoard.refreshTextScore(iScore);
        if (bEffect)
            _oScoreBoard.effectAddScore(iScoreNoMult, fMultiplier);
    };
    
    this.resetFullscreenBut = function(){
	if (_fRequestFullScreen && screenfull.isEnabled){
		_oButFullscreen.setActive(s_bFullscreen);
	}
    };
    
    this._onFullscreen = function () {
        if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };

    this.createAnimText = function (szText, iSize, bStrobo, szColor, szColorStroke) {//TEXT_BALL_OUT, 90, false, TEXT_COLOR_1, TEXT_COLOR_STROKE
        var oContainer = new createjs.Container();

        var oTextStroke = new createjs.Text(szText, iSize + "px " + FONT_GAME, szColorStroke);
        oTextStroke.x = 0;
        oTextStroke.y = 0;
        oTextStroke.textAlign = "center";
        oTextStroke.outline = 4;
        oContainer.addChild(oTextStroke);

        var oText = new createjs.Text(oTextStroke.text, iSize + "px " + FONT_GAME, szColor);
        oText.x = 0;
        oText.y = 0;
        oText.textAlign = "center";
        oContainer.addChild(oText);

        oContainer.x = CANVAS_WIDTH_HALF;
        oContainer.y = -oTextStroke.getBounds().height;

        if (bStrobo) {
            s_oInterface.strobeText(oText);

        }

        s_oStage.addChild(oContainer);

        createjs.Tween.get(oContainer).to({y: CANVAS_HEIGHT_HALF}, 500, createjs.Ease.cubicOut).call(function () {
            createjs.Tween.get(oContainer).wait(250).to({y: CANVAS_HEIGHT + oTextStroke.getBounds().height}, 500, createjs.Ease.cubicIn).call(function () {
                if (bStrobo) {
                    createjs.Tween.removeTweens(oText);
                }
                s_oStage.removeChild(oContainer);
            });
        });
    };

    this.strobeText = function (oText) {
        createjs.Tween.get(oText).wait(30).call(function () {
            if (_iStep < TEXT_EXCELLENT_COLOR.length - 1) {
                _iStep++;
            } else {
                _iStep = 0;
            }
            oText.color = TEXT_EXCELLENT_COLOR[_iStep];
            s_oInterface.strobeText(oText);
        });
    };

    this.refreshLaunchBoard = function (iLaunch, iMaxLaunch) {
        _oLaunchBoard.refreshTextLaunch(iLaunch, iMaxLaunch);
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this._onExit = function () {
        var _oAreYouSure = new CAreYouSurePanel(s_oStage);
        _oAreYouSure.show();
    };

    this.unloadPause = function () {
        _oPause.unload();
        _oPause = null;
    };

    this.onButPauseRelease = function () {
        playSound("click", 1, false);
        _oPause = new CPause();
    };

    s_oInterface = this;

    this._init();

    return this;
}

var s_oInterface = null;