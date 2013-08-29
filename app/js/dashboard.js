var dashboard = {
  removeToken : function() {
    localStorage.removeItem("tviewerAccessToken");
  },
  
  showViewer : function() {
    bb.pushScreen('view/viewer.html', 'viewer');
  }
}

