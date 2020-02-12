layui.use('element', function () {
    // var layer = layui.layer;
    var element = layui.element;
    var $ = layui.jquery;

    var active={
        tabAdd:function(url,id,title){
            window.parent.layui.element.tabAdd('tab',{
                title:title,
                content: '<iframe src="' + url + '" name="iframe' + id + '" class="iframe" framborder="0" data-id="' + id + '" scrolling="auto" width="100%"  height="100%"></iframe>',
                id: id
            })
        },
        tabchange:function(id){
            window.parent.layui.element.tabChange('tab',id)
        }
    };
    $('.detail').on('click',function(){
        console.log(1)
        var datas = $(this);
        console.log(datas,55)
        if ($(".layui-tab-title li[lay-id]").length <= 0) {
            active.tabAdd(datas.attr('data-url'),datas.attr('data-id'),datas.attr('data-title'));
        }else{
            var isOpen =false;
            $.each($(".layui-tab-title li[lay-id]"),function(){
                if($(this).attr('lay-id') == datas.attr('data-id')){
                    isOpen = true;
                }
            });
            if(!isOpen){
                active.tabAdd(datas.attr('data-url'),datas.attr('data-id'),datas.attr('data-title'));
            }
        }
        active.tabchange(datas.attr('data-id'))
    })
})
    