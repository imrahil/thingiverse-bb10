var viewer = {
    init: function ()
    {
        $('#viewer').height(window.innerHeight - 200);

        var thingiurlbase = "js/lib";
        var thingiview = new Thingiview("viewer");
        thingiview.setObjectColor('#C0D8F0');
        thingiview.setBackgroundColor('#242424');
        thingiview.initScene();
        thingiview.loadSTL("../../stl/cube.stl");
    }
};

