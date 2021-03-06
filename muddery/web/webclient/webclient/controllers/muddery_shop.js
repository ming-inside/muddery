
if (typeof(require) != "undefined") {
    require("../css/shop.css");

    require("../controllers/base_controller.js");
    require("../utils/paginator.js");
}

/*
 * Derive from the base class.
 */
MudderyShop = function(el) {
	BasePopupController.call(this, el);
	
	this.goods = [];
	this.paginator = new Paginator("#shop_goods_wrapper");
}

MudderyShop.prototype = prototype(BasePopupController.prototype);
MudderyShop.prototype.constructor = MudderyShop;

/*
 * Reset the view's language.
 */
MudderyShop.prototype.resetLanguage = function() {
	$("#shop_header_name").text($$.trans("NAME"));
	$("#shop_header_price").text($$.trans("PRICE"));
	$("#shop_header_desc").text($$.trans("DESC"));
}

/*
 * Bind events.
 */
MudderyShop.prototype.bindEvents = function() {
	this.onClick("#shop_close_box", this.onClose);
	this.onClick("#shop_goods_list", ".goods_name", this.onLook);
}
	
/*
 * Event when clicks the close button.
 */
MudderyShop.prototype.onClose = function(element) {
    $$.main.doClosePopupBox();
}

/*
 * Event then the user clicks the skill link.
 */
MudderyShop.prototype.onLook = function(element) {
	var dbref = $(element).data("dbref");
	for (var i in this.goods) {
		if (dbref == this.goods[i]["dbref"]) {
			var goods = this.goods[i];
			$$.main.showGoods(goods["dbref"],
								   goods["name"],
				 				   goods["number"],
								   goods["icon"],
								   goods["desc"],
								   goods["price"],
								   goods["unit"]);
			break;
		}
	}
}

/*
 * Event then the window resizes.
 */
MudderyShop.prototype.resetSize = function() {
    BasePopupController.prototype.resetSize.call(this);

	var height = this.el.innerHeight() - 20;
	this.paginator.tableHeight(height);
}

/*
 * Set shop's data.
 */
MudderyShop.prototype.setShop = function(name, icon, desc, goods) {
	this.goods = goods || [];
		
	// add name
	$("#shop_name").html($$.text2html.parseHtml(name));

	// add icon
	if (icon) {
		var url = settings.resource_url + icon;
		$("#shop_img_icon").attr("src", url);
		$("#shop_icon").show();
	}
	else {
		$("#shop_icon").hide();
	}

	// add desc
	$("#shop_desc").html($$.text2html.parseHtml(desc));

	// clear shop
	this.clearElements("#shop_goods_list");
	var template = $("#shop_goods_list>.template");	
	// set goods
	for (var i in this.goods) {
		var obj = this.goods[i];
		var item = this.cloneTemplate(template);

		if (obj["icon"]) {
			item.find(".img_icon").attr("src", settings.resource_url + obj["icon"]);
			item.find(".obj_icon").show();
		}
		else {
			item.find(".obj_icon").hide();
		}

		var goods_name = obj["name"];
		if (obj["number"] > 1) {
			goods_name += "×" + obj["number"];
		}
		
		item.find(".goods_name")
			.data("dbref", obj["dbref"])
			.html(goods_name);

		item.find(".price")
			.text(obj["price"]);
			
		item.find(".unit")
			.text(obj["unit"]);

		item.find(".goods_desc")
			.text($$.text2html.parseHtml(obj["desc"]));
	}

	var height = $(window).innerHeight() - $("#shop_goods_wrapper").offset().top - 16;
	this.paginator.refresh(height);
}
