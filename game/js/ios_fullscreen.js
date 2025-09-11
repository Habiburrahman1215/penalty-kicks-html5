
function buildIOSMeta(){

    var aMetaTags = [
        { name : "viewport",
          content : 'width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no'},
        { name: 'apple-mobile-web-app-capable',
          content: 'yes'},
        { name: 'apple-mobile-web-app-status-bar-style',
          content: 'black'}      
    ];
    
    for( var i = 0; i < aMetaTags.length; i++ ){
        var oNewMeta = document.createElement('meta');
        oNewMeta.name = aMetaTags[i].name;
        oNewMeta.content = aMetaTags[i].content;

        var oOldMeta = window.document.head.querySelector('meta[name="'+oNewMeta.name+'"]');
        if (oOldMeta) {
            oOldMeta.parentNode.removeChild(oOldMeta);
        }
        window.document.head.appendChild(oNewMeta);           
    }
  
};

function hideIOSFullscreenPanel(){   

    document.querySelector(".xxx-ios-fullscreen-message").style.display = "none";
    document.querySelector(".xxx-ios-fullscreen-scroll").style.display = "none";
    document.querySelector(".xxx-game-iframe-full").classList.remove('xxx-game-iframe-iphone-se');
};

function buildIOSFullscreenPanel(){   
    var html = '';

    html += '<div class="xxx-ios-fullscreen-message">';
        html += '<div class="xxx-ios-fullscreen-swipe">';
        html += '</div>';    
    html += '</div>';

    html += '<div class="xxx-ios-fullscreen-scroll">';
    html += '</div>';    

    document.body.insertAdjacentHTML( 'beforeend', html );   
};

function showIOSFullscreenPanel(){   
    document.querySelector(".xxx-ios-fullscreen-message").style.display = "none";
    document.querySelector(".xxx-ios-fullscreen-scroll").style.display = "none";
};

function __iosResize(){

    window.scrollTo(0, 0);

	console.log(window.devicePixelRatio);
	console.log(window.innerWidth);
	console.log(window.innerHeight);

    if( platform.product === "iPhone" ){
        switch(window.devicePixelRatio){
            case 2:{
                switch(window.innerWidth){
                    case 568:{
                        //console.log("iPhone 5/5s/5c/se"); 
                        if( window.innerHeight === 320 ){
                            //console.log("fullscreen");   
                            //this.hideIOSFullscreenPanel();
                        }else{         
                            document.querySelector(".xxx-game-iframe-full").classList.add('xxx-game-iframe-iphone-se');                           
                        } 
                    }break;
                    case 667:{
                        //console.log("iPhone 6/6s/7/8"); 
                        if( window.innerHeight === 375 ){
                          //  console.log("fullscreen");   
                            hideIOSFullscreenPanel();
                        }else{
                            //console.log("windowed"); 
                            showIOSFullscreenPanel();
                        }                      
                    }break;
                    case 808:{
                         //console.log("iPhone Xr"); 
                        if( window.innerHeight === 414 ){
                            hideIOSFullscreenPanel();
                        }else{
                            showIOSFullscreenPanel();
                        }                     	
                    }break;
                    default:{
                        hideIOSFullscreenPanel();
                    }
                }
            }break;
            case 3:{
                switch(window.innerWidth){
                    case 736:{ 
                        //console.log("iPhone 6/6s/7/8 plus");    
                        if( window.innerHeight === 414 ){
                          //  console.log("fullscreen");   
                            hideIOSFullscreenPanel();
                        }else{
                            showIOSFullscreenPanel();
                        }                            
                    }break;
                    // iphone X
                    case 724:{    
                      //  console.log("iPhone X/Xs"); 
                        if( window.innerHeight === 375 ){
                            hideIOSFullscreenPanel();
                        }else{
                            showIOSFullscreenPanel();
                        }                          
                    }break; 
                    case 808:{
                         //console.log("iPhone Xs Max"); 
                        if( window.innerHeight === 414 ){
                            hideIOSFullscreenPanel();
                        }else{
                            showIOSFullscreenPanel();
                        }                     	
                    }break;                         
                    default:{
                        hideIOSFullscreenPanel();
                    }                
                }                    
            }break;
            default:{
                hideIOSFullscreenPanel();
            }            
        }
    }   
};

function iosResize(){
    __iosResize();

    setTimeout(function(){
        __iosResize();
    },500);
};

function iosInIframe() {
   try {
       return window.self !== window.top;
   } catch (e) {
       return true;
   }
}

function isIOSLessThen13(){
    var oOs = platform.os;
    var szFamily = oOs.family.toLowerCase();
    var iVersion = parseFloat( oOs.version );

    if(szFamily === "ios"){
        if(iVersion < 13){
            return true;
        }
    }
    return false;
}
    
document.addEventListener("DOMContentLoaded", () =>{
    if(platform && 
       platform.product === "iPhone" && 
       platform.name.toLowerCase() === "safari" &&
       ////AND < ver 13
            isIOSLessThen13() &&
       
       !iosInIframe()){
        buildIOSFullscreenPanel();
        buildIOSMeta();     
    } 
});

window.addEventListener('resize', function(event) {

    if(platform && 
       platform.product === "iPhone"  && 
       platform.name.toLowerCase() === "safari" &&
       ////AND < ver 13
			isIOSLessThen13() &&
               
       !iosInIframe()){
        iosResize();   
    }        
}); 