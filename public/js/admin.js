$(function () {
    $('.del').click(function (e) {
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-' + id)
        $.ajax({
            type: 'DELETE',
            url: '/admin/movie/list?id=' + id
        })
            .done(function (result) {
                if (result.success === 1) {
                    if (tr.length > 0) {
                        tr.remove();
                    }
                }
            })
    })

    $('.deluser').click(function (e) {
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-' + id)
        $.ajax({
            type: 'DELETE',
            url: '/admin/user/list?id=' + id
        })
            .done(function (result) {
                if (result.success === 1) {
                    if (tr.length > 0) {
                        tr.remove();
                    }
                }
            })
    })

    $('.delcategory').click(function (e) {
        var target = $(e.target)
        var id = target.data('id')
        var tr = $('.item-id-' + id)
        $.ajax({
            type: 'DELETE',
            url: '/admin/category/list?id=' + id
        })
            .done(function (result) {
                console.log(JSON.stringify(result))
                if (result.success === 1) {
                    if (tr.length > 0) {
                        tr.remove();
                    }
                }
            })
    })

    $('#douban').blur(function () {
        var douban = $(this)
        var id = douban.val()
        if (id) {
            $.ajax({
                type: 'get',
                dataType : 'jsonp',
                url: 'https://api.douban.com/v2/movie/' + id
            })
                .done(function (result) {
                    $('#inputDirector').val(result.author[0].name)
                    $('#inputTitle').val(result.title)
                    $('#inputCountrie').val(result.attrs.country)
                    $('#inputLanguage').val(result.attrs.language)
                    $('#inputPoster').val(result.image)
                    $('#inputYear').val(result.attrs.year)
                    $('#inputDescript').val(result.summary)
                })
        }
    })
})