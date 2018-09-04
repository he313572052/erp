var selectedOrder;
layui.config({
	base: '../../js/modules/'
}).use(['element', 'mainTab', 'jquery', 'form', 'layer', 'laydate'], function() {
	var element = layui.element,
		$ = layui.jquery,
		form = layui.form,
		layer = layui.layer,
		laydate = layui.laydate,
		tab = layui.mainTab();
	//美化滚动条
	$.mCustomScrollbar.defaults.axis = "y";
	$(".scroll").mCustomScrollbar({
		theme: "minimal-dark"
	});
	$('.order-list').on('click', 'li', function() {
		$(this).siblings('li').removeClass('selected');
		selectedOrder = $(this).addClass('selected').children('span').eq(0).html();
		var orderId = $(this).attr('data-id');
		window.sessionStorage.setItem('orderId', orderId);
	})
	if(window.sessionStorage.getItem('orderId') != undefined) {
		selectedOrder = window.sessionStorage.getItem('orderId');
		$('.order-list').find('li').each(function() {
			var id = $(this).attr('data-id');
			if(id === selectedOrder) {
				$(this).addClass('selected')
			}
		})
	}
	$('#conditionBtn').on('click', function() {;
		layer.open({
			type: 1,
			skin: 'layer-skin-class',
			title: '条件搜索',
			area: ['950px', '420px'],
			content: $('#condition'),
			btn: ['查询'],
			yes: function(index, layero) {

			}
		})
	});
	$('#moreBtn_1').click(function() {
		layer.open({
			title: '选择下单人员',
			type: 2,
			area: ['900px', '650px'],
			skin: 'layer-skin-class',
			content: '../layer/staff.html'
		})
	})
	laydate.render({
		elem: '#date-input1',
		range: true
	})
	laydate.render({
		elem: '#date-input2',
		range: true
	})
	//右侧边栏收缩
	var right_shrink = false;
	$('.aside-right').on('click', '.shrink', function() {
		console.log(right_shrink);
		if(!right_shrink) {
			$(this).find('i').removeClass('layui-icon-spread-left').addClass('layui-icon-shrink-right');
			$(this).parent().css('width', 0).siblings('.main-tab').css('right', 0);
		} else {
			$(this).find('i').addClass('layui-icon-spread-left').removeClass('layui-icon-shrink-right');
			$(this).parent().css('width', '335px').siblings('.main-tab').css('right', '335px');
		}
		right_shrink = !right_shrink;
		window.sessionStorage.setItem('right_shrink', right_shrink);
	})

	//菜单导航
	function addTab(node) {
		tab.tabAdd(node);
	}
	element.on('nav(topNav)', function(elem) {
		var navA = $(elem);
		var id = navA.attr('data-id');
		var url = navA.attr('data-url');
		var title = navA.attr('data-title');
		var isOrder = navA.attr('data-order');
		if(!url) return;
		if(isOrder === 'false') {
			var node = {
				title: title,
				id: id,
				url: url
			}
			addTab(node);
			return;
		}
		if(selectedOrder == undefined) {
			layer.msg('请选择订单');
		} else {
			var node = {
				title: title,
				id: id,
				url: url
			}
			addTab(node);
		}
	});
	$('.discuss-list').mouseenter(function() {
		layer.tips('双击行查看详情', this, {
			tips: [4, '#1E82D2']
		})
	}).on('dblclick', 'li', function() {
		page('详情', 'main-discuss-info.html', '600px', '400px')
	});
	$('.addBtn').click(function() {
		page('新讨论', 'main-discuss-edit.html', '600px', '445px')
	})
	//刷新后还原打开的窗口
	if(window.sessionStorage.getItem("nodes") != null) {
		nodes = JSON.parse(window.sessionStorage.getItem("nodes"));
		curnode = window.sessionStorage.getItem("curnode");
		var openTitle = '';
		for(var i = 0; i < nodes.length; i++) {
			openTitle = '';
			openTitle += '<cite>' + nodes[i].title + '</cite>';
			openTitle += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + nodes[i].layId +
				'">&#x1006;</i>';
			element.tabAdd("mainTab", {
				title: openTitle,
				content: "<iframe src='" + nodes[i].href + "' data-id='" + nodes[i].layId + "'></frame>",
				id: nodes[i].layId
			})
			//定位到刷新前的窗口
			if(curnode != "undefined") {
				if(JSON.parse(curnode).title == nodes[i].title) { //定位到刷新前的页面
					element.tabChange("mainTab", nodes[i].layId);
				}
			} else {
				element.tabChange("mainTab", nodes[nodes.length - 1].layId);
			}
		}
	}

	function page(title, url, w, h) {
		if(title == null || title == '') {
			title = false;
		};
		if(url == null || url == '') {
			url = "404.html";
		};
		var index = layer.open({
			type: 2,
			skin: 'layer-skin-class',
			resize: false,
			title: title,
			area: [w, h],
			fixed: false, //不固定
			content: url
		});
	}
});