var MS_ROLLING_SCORE = 750;
function CRollingScore() {

    var _oTweenText = null;
    var _oTweenTextStroke = null;

    this.rolling = function (oScoreText, oScoreTextStruct, iScore) {

        _oTweenText = createjs.Tween.get(oScoreText, {override: true}).to({text: iScore}, MS_ROLLING_SCORE, createjs.Ease.cubicOut).addEventListener("change", function () {
            oScoreText.text = Math.floor(oScoreText.text);
        }).call(function () {
            createjs.Tween.removeTweens(_oTweenText);
        });

        if (oScoreTextStruct !== null) {
            _oTweenTextStroke = createjs.Tween.get(oScoreTextStruct, {override: true}).to({text: iScore}, MS_ROLLING_SCORE, createjs.Ease.cubicOut).addEventListener("change", function () {
                oScoreTextStruct.text = Math.floor(oScoreTextStruct.text);
            }).call(function () {
                createjs.Tween.removeTweens(_oTweenTextStroke);
            });

        }
    };

    return this;
}

