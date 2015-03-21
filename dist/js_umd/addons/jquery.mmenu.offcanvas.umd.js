(function ( factory ) {
    if ( typeof define === 'function' && define.amd )
    {
        // AMD. Register as an anonymous module.
        define( [ 'jquery' ], factory );
    }
    else if ( typeof exports === 'object' )
    {
        // Node/CommonJS
        factory( require( 'jquery' ) );
    }
    else
    {
        // Browser globals
        factory( jQuery );
    }
}( function ( jQuery ) {


/*	
 * jQuery mmenu offCanvas addon
 * mmenu.frebsite.nl
 *
 * Copyright (c) Fred Heusschen
 */
!function(t){var e="mmenu",o="offCanvas";t[e].addons[o]={setup:function(){if(this.opts[o]){var s=this.opts[o],i=this.conf[o];a=t[e].glbl,this._api=t.merge(this._api,["open","close","setPage"]),("top"==s.position||"bottom"==s.position)&&(s.zposition="front"),"string"!=typeof i.pageSelector&&(i.pageSelector="> "+i.pageNodetype),a.$allMenus=(a.$allMenus||t()).add(this.$menu),this.vars.opened=!1;var p=[n.offcanvas];"left"!=s.position&&p.push(n.mm(s.position)),"back"!=s.zposition&&p.push(n.mm(s.zposition)),this.$menu.addClass(p.join(" ")).parent().removeClass(n.wrapper),this.setPage(a.$page),this._initBlocker(),this["_initWindow_"+o](),this.$menu[i.menuInjectMethod+"To"](i.menuWrapperSelector)}},add:function(){n=t[e]._c,s=t[e]._d,i=t[e]._e,n.add("offcanvas slideout modal background opening blocker page"),s.add("style"),i.add("resize")},clickAnchor:function(t){if(!this.opts[o])return!1;var e=this.$menu.attr("id");if(e&&e.length&&(this.conf.clone&&(e=n.umm(e)),t.is('[href="#'+e+'"]')))return this.open(),!0;if(a.$page){var e=a.$page.attr("id");return e&&e.length&&t.is('[href="#'+e+'"]')?(this.close(),!0):!1}}},t[e].defaults[o]={position:"left",zposition:"back",modal:!1,moveBackground:!0},t[e].configuration[o]={pageNodetype:"div",pageSelector:null,menuWrapperSelector:"body",menuInjectMethod:"prepend"},t[e].prototype.open=function(){if(!this.vars.opened){var t=this;this._openSetup(),setTimeout(function(){t._openFinish()},this.conf.openingInterval),this.trigger("open")}},t[e].prototype._openSetup=function(){var t=this;this.closeAllOthers(),a.$page.data(s.style,a.$page.attr("style")||""),a.$wndw.trigger(i.resize,[!0]);var e=[n.opened];this.opts[o].modal&&e.push(n.modal),this.opts[o].moveBackground&&e.push(n.background),"left"!=this.opts[o].position&&e.push(n.mm(this.opts[o].position)),"back"!=this.opts[o].zposition&&e.push(n.mm(this.opts[o].zposition)),this.opts.extensions&&e.push(this.opts.extensions),a.$html.addClass(e.join(" ")),setTimeout(function(){t.vars.opened=!0},this.conf.openingInterval),this.$menu.addClass(n.current+" "+n.opened)},t[e].prototype._openFinish=function(){var t=this;this.__transitionend(a.$page,function(){t.trigger("opened")},this.conf.transitionDuration),a.$html.addClass(n.opening),this.trigger("opening")},t[e].prototype.close=function(){if(this.vars.opened){var t=this;this.__transitionend(a.$page,function(){t.$menu.removeClass(n.current).removeClass(n.opened),a.$html.removeClass(n.opened).removeClass(n.modal).removeClass(n.background).removeClass(n.mm(t.opts[o].position)).removeClass(n.mm(t.opts[o].zposition)),t.opts.extensions&&a.$html.removeClass(t.opts.extensions),a.$page.attr("style",a.$page.data(s.style)),t.vars.opened=!1,t.trigger("closed")},this.conf.transitionDuration),a.$html.removeClass(n.opening),this.trigger("close"),this.trigger("closing")}},t[e].prototype.closeAllOthers=function(){a.$allMenus.not(this.$menu).each(function(){var o=t(this).data(e);o&&o.close&&o.close()})},t[e].prototype.setPage=function(e){e&&e.length||(e=t(this.conf[o].pageSelector,a.$body),e.length>1&&(e=e.wrapAll("<"+this.conf[o].pageNodetype+" />").parent())),e.attr("id",e.attr("id")||this.__getUniqueId()),e.addClass(n.page+" "+n.slideout),a.$page=e,this.trigger("setPage",e)},t[e].prototype["_initWindow_"+o]=function(){a.$wndw.on(i.keydown,function(t){return a.$html.hasClass(n.opened)&&9==t.keyCode?(t.preventDefault(),!1):void 0});var s=0;a.$wndw.on(i.resize,function(t,e){if(e||a.$html.hasClass(n.opened)){var o=a.$wndw.height();(e||o!=s)&&(s=o,a.$page.css("minHeight",o))}}),t[e].prototype["_initWindow_"+o]=function(){}},t[e].prototype._initBlocker=function(){if(!a.$blck){var e=this;a.$blck=t('<div id="'+n.blocker+'" class="'+n.slideout+'" />').appendTo(a.$body).on(i.touchstart+" "+i.touchmove,function(t){t.preventDefault(),t.stopPropagation(),$blck.trigger(i.mousedown)}).on(i.mousedown,function(t){t.preventDefault(),a.$html.hasClass(n.modal)||(e.closeAllOthers(),e.close())})}};var n,s,i,a}(jQuery);
}));