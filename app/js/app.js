var app = {
    getThings: function (type)
    {
        console.log("Fetching things: " + type);

        $('#content p').remove();

        var url = thingiverseOptions.apiUri + type + '?access_token=' + window.accessToken;

        $.get(url)
            .done(function (data)
            {
                console.log("Fetching success");

                /** @var item Thing */
                $.each(data, function(i, item) {
                    $('#content').append('<p>' + item.name + ' - by: ' + item.creator.full_name + '</p>');
                });
            })
            .fail(function ()
            {
                alert("Cannot fetch " + type + " things!");
            });
    }
};

