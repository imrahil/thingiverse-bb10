oAuthBrowserWindow = null;

thingiverseOptions = {
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URL
};

var oAuth = {
  connect : function() {
    document.getElementById('oAuthIndicator').show();
    bbutils.showToast('Contacting Thingiverse...');
    setTimeout(function(){ oAuth.start(); }, 500);
  },

  start : function() {
    // if the childWindow is already open, don't allow user to click the button
		if(oAuthBrowserWindow !== null) {
			return false;
		}
    
    // open the authorization url
    var url = 'https://www.thingiverse.com/login/oauth/authorize?client_id=' + thingiverseOptions.clientId + '&edirect_uri=' + thingiverseOptions.redirectUri;
    oAuthBrowserWindow = window.open(url, '_blank');

    if (!inRipple) {
      // evaluate the url every second, when Foursquare redirects to our callback url, the following if statements gets fired
      window.int = self.setInterval(function(){
        var currentURL = oAuthBrowserWindow.window.location.href;
        var callbackURL = thingiverseOptions.redirectUri;
        var inCallback = currentURL.indexOf(callbackURL);

        // location has changed to our callback url, parse the oauth code
        if (inCallback == 0) {

          // stop the interval from checking for url changes	
          window.clearInterval(int)

          // parse the oauth code
          var code = oAuthBrowserWindow.window.location.href;
          code = code.split('code=');
          code = code[1];

          // close the oAuthBrowserWindow
          oAuthBrowserWindow.close();
          setTimeout(function(){ 
            oAuth.getAccessToken(code);
          }, 1000);
        }
      },1000);
    }
  },
  
  prompt : function() {
    var code = prompt("Enter the code:", "Code");
    oAuth.getAccessToken(code);
  },
  /**
  *  exchange the oauth code, from an access token
  */
  getAccessToken : function(code) {
    bbutils.showToast('Fetching access token...');
    var url = 'https://www.thingiverse.com/login/oauth/access_token';

    data = {
      client_id: thingiverseOptions.clientId,
      client_secret: thingiverseOptions.clientSecret,
      redirect_uri: thingiverseOptions.redirectUri,
      code: code
    };

    $.post(url, data)
      .done(function(data) {
        console.log("Success!");
        var response = data;

        // parse 'access_token' from the response
        var response = response.split('&');
        var accessToken = response[0].split('=');
        accessToken = accessToken[1];

        console.log("Token: " + accessToken);

        window.accessToken = accessToken;

        if (accessToken != '') {
          localStorage.setItem("tviewerAccessToken", accessToken);
        }
        
        bb.pushScreen('view/dashboard.html', 'dashboard');
      })
      .fail(function(data) {
          alert('Error getting access_token: ' + data.responseText);
          return false;
      });
  }
}


