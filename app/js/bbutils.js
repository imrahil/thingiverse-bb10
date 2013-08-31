var bbutils = {
    showToast: function (str)
    {
        //create a div to overlay so user can't click behind it
        var message, buttonText = "Ok", toastId;
        message = str;

        var onToastDismissed = function ()
        {
            console.log('Toast disappeared: ' + toastId);
        };

        var options = {
            buttonText: buttonText,
            dismissCallback: onToastDismissed,
            //buttonCallback : goToMainScreen,
            timeout: 4000
        };
        toastId = blackberry.ui.toast.show(message, options);
    },

    showConnectionDialog: function ()
    {
        if (!inRipple)
        {
            function dialogCallBack(selection)
            {
                // alert(selection.return);
            }

            try
            {
                blackberry.ui.dialog.standardAskAsync("To use this app, please enable network connections", blackberry.ui.dialog.D_OK, dialogCallBack, {
                    title: "Network Connection Required"
                });
            }
            catch (e)
            {
                alert("Exception in standardDialog: " + e);
            }
        }
        else
            console.log("Network Connection Required");
    }
};