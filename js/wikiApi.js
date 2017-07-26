$(function() {
    $(".list-item").on("click", function() {
        var listItem = $(".list-item").val();
        var url = "https://pt.wikipedia.org/w/api.php?action=opensearch&search="+ listItem +"&format=json&callback=?"; 
            $.ajax({
                url: url,
              type: 'GET',
               contentType: "application/json; charset=utf-8",
                async: false,
                dataType: "json",
               success: function(data) {
                    console.log(data[1][0]);
               }
    
        });
    });
});