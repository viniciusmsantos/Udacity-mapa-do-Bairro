$(".list-item").on("click", function() {
    var searchItem = $(".search-item").val();
    var url = "https://pt.wikipedia.org/w/api.php?action=opensearch&search="+ searchItem +"&format=json&callback=?"; 
        $.ajax({
            url: url,
            type: 'GET',
            contentType: "application/json; charset=utf-8",
            async: false,
            dataType: "json",
            success: function() {
        
            
            }

        }
    })
        
});