
if (typeof(require) != "undefined") {
    require("../css/confirm_combat.css");

    require("../controllers/base_controller.js");
}

/*
 * Derive from the base class.
 */
MudderyConfirmCombat = function(el) {
	BasePopupController.call(this, el);
	
    this.prepare_time = 0;
    this.interval_id = null;
    this.confirmed = false;
}

MudderyConfirmCombat.prototype = prototype(BasePopupController.prototype);
MudderyConfirmCombat.prototype.constructor = MudderyConfirmCombat;

/*
 * Reset the view's language.
 */
MudderyConfirmCombat.prototype.resetLanguage = function() {
	$("#confirm_combat_popup_body").text($$.trans("Found an opponent."));
	$("#confirm_combat_button_confirm").text($$.trans("Confirm"));
}
	
/*
 * Bind events.
 */
MudderyConfirmCombat.prototype.bindEvents = function() {
    this.onClick("#confirm_combat_close_box", this.onRejectCombat);
    this.onClick("#confirm_combat_button_confirm", this.onConfirmCombat);
}

/*
 * Init the dialog with confirm time..
 */
MudderyConfirmCombat.prototype.init = function(time) {
	this.confirmed = false;
	this.prepare_time = new Date().getTime() + time * 1000;
	$("#confirm_combat_time").text(parseInt(time - 1) + $$.trans(" seconds to confirm."));

	this.interval_id = window.setInterval("refreshPrepareTime()", 1000);

	$("#confirm_combat_popup_body").text($$.trans("Found an opponent."));
	$("#confirm_combat_button_confirm").text($$.trans("Confirm"));
	$("#confirm_combat_button_confirm").show();
}

/*
 * Event when clicks the confirm button.
 */
MudderyConfirmCombat.prototype.onConfirmCombat = function(element) {
	if (this.confirmed) {
		return;
	}
	this.confirmed = true;

	$$.commands.confirmCombat();

	$("#confirm_combat_popup_body").text($$.trans("Confirmed."));
	$("#confirm_combat_button_confirm").hide();
	refreshPrepareTime();
}
	
/*
 * Event when clicks the close button.
 */
MudderyConfirmCombat.prototype.onRejectCombat = function(element) {
	if (this.confirmed) {
		return;
	}

	$$.commands.rejectCombat();
	this.closeBox();
}

/*
 * Close this box.
 */
MudderyConfirmCombat.prototype.closeBox = function() {
	if (this.interval_id != null) {
		this.interval_id = window.clearInterval(this.interval_id);
	}

	$$.main.closePrepareMatchBox();
}

function refreshPrepareTime() {
    var current_time = new Date().getTime();
    var remain_time = Math.floor(($$.component.confirm_combat.prepare_time - current_time) / 1000);
    if (remain_time < 0) {
        remain_time = 0;
    }
    var text;
    if ($$.component.confirm_combat.confirmed) {
        text = $$.trans(" seconds to start the combat.");
    }
    else {
        text = $$.trans(" seconds to confirm.");
    }

    $("#confirm_combat_time").text(parseInt(remain_time) + text);
    
    if (remain_time <= 0) {
        $$.component.confirm_combat.closeBox();
    }
}
