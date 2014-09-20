/*** Directives and services for responding to idle users in AngularJS
 * @author Mike Grabski <me@mikegrabski.com>
 * @version v0.3.2
 * @link https://github.com/HackedByChinese/ng-idle.git
 * @license MIT
 */
(function (a, b) {
	"use strict";
	function c() {
		var a = {http: null, interval: 600};
		this.http = function (c) {
			if (!c)throw new Error("Argument must be a string containing a URL, or an object containing the HTTP request configuration.");
			b.isString(c) && (c = {url: c, method: "GET"}), c.cache = !1, a.http = c
		}, this.interval = function (b) {
			if (b = parseInt(b), isNaN(b) || 0 >= b)throw new Error("Interval must be expressed in seconds and be greater than 0.");
			a.interval = b
		}, this.$get = function (c, d, e, f) {
			function g(a, b, d) {
				c.$broadcast("$keepaliveResponse", a, b), d || h()
			}

			function h() {
				j.ping = e(i, 1e3 * a.interval)
			}

			function i(d) {
				c.$broadcast("$keepalive"), b.isObject(a.http) ? f(a.http).success(function (a, b) {
					g(a, b, d)
				}).error(function (a, b) {
					g(a, b, d)
				}) : d || h()
			}

			var j = {ping: null};
			return{_options: function () {
				return a
			}, start       : function () {
				e.cancel(j.ping), h()
			}, stop        : function () {
				e.cancel(j.ping)
			}, ping        : function () {
				i(!0)
			}}
		}, this.$get.$inject = ["$rootScope", "$log", "$timeout", "$http"]
	}

	function d() {
		var a = {idleDuration: 1200, warningDuration: 30, autoResume: !0, events: "mousemove keydown DOMMouseScroll mousewheel mousedown touchstart", keepalive: !0};
		this.activeOn = function (b) {
			a.events = b
		}, this.idleDuration = function (b) {
			if (0 >= b)throw new Error("idleDuration must be a value in seconds, greater than 0.");
			a.idleDuration = b
		}, this.warningDuration = function (b) {
			if (0 > b)throw new Error("warning must be a value in seconds, greatner than 0.");
			a.warningDuration = b
		}, this.autoResume = function (b) {
			a.autoResume = b === !0
		}, this.keepalive = function (b) {
			a.keepalive = b === !0
		}, this.$get = function (b, c, d, e, f) {
			function g() {
				a.keepalive && (k.running && f.ping(), f.start())
			}

			function h() {
				a.keepalive && f.stop()
			}

			function i() {
				k.idling = !k.idling;
				var b = k.idling ? "Start" : "End";
				d.$broadcast("$idle" + b), k.idling ? (h(), k.countdown = a.warningDuration, j()) : g()
			}

			function j() {
				k.countdown <= 0 ? d.$broadcast("$idleTimeout") : (d.$broadcast("$idleWarn", k.countdown), k.warning = b(j, 1e3)), k.countdown--
			}

			var k = {idle: null, warning: null, idling: !1, running: !1, countdown: null}, l = {_options: function () {
				return a
			}, running                                                                                  : function () {
				return k.running
			}, idling                                                                                   : function () {
				return k.idling
			}, watch                                                                                    : function () {
				b.cancel(k.idle), b.cancel(k.warning), k.idling ? i() : k.running || g(), k.running = !0, k.idle = b(i, 1e3 * a.idleDuration)
			}, unwatch                                                                                  : function () {
				b.cancel(k.idle), b.cancel(k.warning), k.idling = !1, k.running = !1
			}}, m = function () {
				k.running && a.autoResume && l.watch()
			};
			return e.find("body").on(a.events, m), l
		}, this.$get.$inject = ["$timeout", "$log", "$rootScope", "$document", "$keepalive"]
	}

	b.module("ngIdle.keepalive", []).provider("$keepalive", c), b.module("ngIdle.idle", []).provider("$idle", d), b.module("ngIdle.ngIdleCountdown", []).directive("ngIdleCountdown", function () {
		return{restrict: "A", scope: {value: "=ngIdleCountdown"}, link: function (a) {
			a.$on("$idleWarn", function (b, c) {
				a.$apply(function () {
					a.value = c
				})
			}), a.$on("$idleTimeout", function () {
				a.$apply(function () {
					a.value = 0
				})
			})
		}}
	}), b.module("ngIdle", ["ngIdle.keepalive", "ngIdle.idle", "ngIdle.ngIdleCountdown"])
}(window, window.angular));
//# sourceMappingURL=angular-idle.map