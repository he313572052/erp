var tabFilter, nodes = [],
	liIndex, curNav, delMenu;
layui.define(["element", "jquery"], function(exports) {
	var element = layui.element,
		$ = layui.jquery,
		layId,
		Tab = function() {
			this.tabConfig = {
				closed: true,
				openTabNum: 10,
				tabFilter: "mainTab"
			}
		};
	//参数设置
	Tab.prototype.set = function(option) {
		var _this = this;
		$.extend(true, _this.tabConfig, option); //深度拷贝
		return _this;
	};

	//通过title获取lay-id
	Tab.prototype.getLayId = function(title) {
		$(".layui-tab-title.mainTab-title li").each(function() {
			if($(this).find("cite").text() == title) {
				layId = $(this).attr("lay-id");
			}
		})
		return layId;
	}
	//通过title判断tab是否存在
	Tab.prototype.hasTab = function(title) {
		var tabIndex = -1;
		$(".layui-tab-title.mainTab-title li").each(function() {
			if($(this).find("cite").text() == title) {
				tabIndex = 1;
			}
		})
		return tabIndex;
	}

	//内容tab操作
	var tabIdIndex = 0;
	Tab.prototype.tabAdd = function(node) {
		if(window.sessionStorage.getItem("nodes")) {
			nodes = JSON.parse(window.sessionStorage.getItem("nodes"));
		}
		var _this = this;
		var closed = _this.tabConfig.closed,
			openTabNum = _this.tabConfig.openTabNum,
			tabFilter = _this.tabConfig.tabFilter;
		var title = '';
		if(_this.hasTab(node.title) == -1) {
			if($(".layui-tab-title.mainTab-title li").length == openTabNum) {
				layer.msg('只能同时打开' + openTabNum + '个选项卡！');
				return;
			}
			tabIdIndex++;
			title += '<cite>' + node.title + '</cite>';
			title += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + tabIdIndex + '">&#x1006;</i>';
			element.tabAdd(tabFilter, {
				title: title,
				content: "<iframe src='" + node.url + "' data-id='" + tabIdIndex + "'></frame>",
				id: new Date().getTime()
			})
			//当前窗口内容
			var curnode = {
				"title": node.title,
				"href": node.url,
				"layId": new Date().getTime()
			}
			nodes.push(curnode);
			window.sessionStorage.setItem("nodes", JSON.stringify(nodes)); //打开的窗口
			window.sessionStorage.setItem("curnode", JSON.stringify(curnode)); //当前的窗口
			element.tabChange(tabFilter, _this.getLayId(node.title));
		} else {
			//当前窗口内容
			var curnode = {
				"title": node.title,
				"href": node.url,
				"layId": new Date().getTime()
			}
			window.sessionStorage.setItem("curnode", JSON.stringify(curnode)); //当前的窗口
			element.tabChange(tabFilter, _this.getLayId(node.title));
		}
	}
	$("body").on("click", ".mainTab-title li", function() {
		//切换后获取当前窗口的内容
		var curnode = '';
		var nodes = JSON.parse(window.sessionStorage.getItem("nodes"));
		curnode = nodes[$(this).index()];
		window.sessionStorage.setItem("curnode", JSON.stringify(curnode));
		if(window.sessionStorage.getItem("curnode") == undefined) {
			//如果删除的不是当前选中的tab,则将curmenu设置成当前选中的tab
			if(curNav != JSON.stringify(delMenu)) {
				window.sessionStorage.setItem("curnode", curNav);
			} else {
				window.sessionStorage.setItem("curnode", JSON.stringify(nodes[liIndex - 1]));
			}
		}
		element.tabChange(tabFilter, $(this).attr("lay-id")).init();
	})

	//删除tab
	$("body").on("click", ".mainTab-title li i.layui-tab-close", function() {
		//删除tab后重置session中的node和curnode
		liIndex = $(this).parent("li").index();
		var nodes = JSON.parse(window.sessionStorage.getItem("nodes"));
		//获取当前被删除元素
		delMenu = nodes[liIndex];
		//获取当前的tab
		var curnode = window.sessionStorage.getItem("curnode") == "undefined" ? "undefined" : window.sessionStorage.getItem(
			"curnode") == "" ? "" : JSON.parse(window.sessionStorage.getItem("curnode"));
		if(JSON.stringify(curnode) != JSON.stringify(delMenu)) { //如果删除的不是当前的
			window.sessionStorage.setItem("curnode", JSON.stringify(curnode))
			curNav = JSON.stringify(curnode);
		} else { //删除的是当前的tab
			if($(this).parent("li").length > liIndex) { //删除的不是最后一个
				window.sessionStorage.setItem("curnode", curnode);
				curNav = curnode;
			} else {
				window.sessionStorage.setItem("curnode", JSON.stringify(nodes[liIndex - 1]));
				curNav = JSON.stringify(nodes[liIndex - 1]);
			}
		}
		nodes.splice((liIndex), 1);
		window.sessionStorage.setItem("nodes", JSON.stringify(nodes));
		element.tabDelete(
			"mainTab", $(this).parent("li").attr("lay-id")).init();
	})

	var mainTab = new Tab();
	exports("mainTab", function(option) {
		return mainTab.set(option);
	});
})