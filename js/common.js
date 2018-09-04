layui.use(['element', 'jquery', 'flow'], function() {
	var element = layui.element,
		$ = layui.jquery,
		flow = layui.flow;
	var height = $('.base').height();
	$('.panel-content').height((height - 88) + 'px');
	$.mCustomScrollbar.defaults.axis = "y";
	$(".scroll").mCustomScrollbar({
		theme: "minimal-dark"
	});
	$(window).resize(function() {
		var height = $('.base').height();
		$('.panel-content').height((height - 88) + 'px');
	})
	var options = {
		elem: '#mCSB_3_container',
		done: function(page, next) { //到达临界点（默认滚动触发），触发下一页
			var lis = [];
			$.get('json/media-list.json', function(res) {
				//假设你的列表返回在data集合中
				layui.each(res.data, function(index, item) {
					lis.push('<li><a href="">' + item.content + '</a></li>');
				});
				next(lis.join(''), page < res.pages);
			});
		}
	}
	flow.load(options);
}); //加载入口