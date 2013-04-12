/***
 * Copyright (c) 2012 http://www.dforge.net
 *
 * More information can be found at:
 * http://www.dforge.net/2012/11/19/slidingpane-slide-page-to-reveal-content-underneath-using-html5javascript
 *
 * This software is released under MIT license:
 * http://www.dforge.net/mit-license.txt
 *
 * Version 0.8 - Last updated: 2012.11.17
 * Version 0.8.1 - Last updated: 2012.12.11 - Fixed bug with complex SlidingPanes embedded in table cells where the
 *                                            hidden div was not positioned correctly. Component wrapper needed to be
 *                                            set to relative positioning.
 */

var SlidingPane = function (config) {
  /* Internal use, but exposed in case you want to query it */
  this.targetElement = null;
  this.hiddenPaneElement = null;
  this.isOpen = false;
  this.pre = 'dforge-';

  /* Options */
  this.targetId = null;
  this.id = this.pre + 'hidden-pane';
  this.side = 'left';
  this.width = 200;
  this.duration = 1;
  this.timingFunction = 'ease-out';
  this.shadowStyle = '0px 0px 30px #000';

  /* Private variables */
  var $ = function (selector) { return document.querySelector(selector); },
    parentElement = null,
    transitionStyle = '',
    boxShadowStyle = '',
    dimensionStyle = '',
    wrapperOrigPos = 0,
    visiblePaneWrapper = null;

  this.setSide = function (s) {
    var me = this;
    if(['top', 'right', 'bottom', 'left'].indexOf(s) > -1) {
      me.side = s;
      wrapperOrigPos = visiblePaneWrapper.getBoundingClientRect()[me.side];
    };
    return me;
  };
  this.getTranslate = function (s, w) {
    var t = '';
      switch(s) {
      case 'top':
        t = 'translateY(' + w.toString() + 'px)';
        break;
      case 'bottom':
        t = 'translateY(-' + w.toString() + 'px)';
        break;
      case 'right':
        t = 'translateX(-' + w.toString() + 'px)';
        break;
      case 'left':
      default:
        t = 'translateX(' + w.toString() + 'px)';
        break;
    };
    return t;
  };
  this.open = function () {
    var me = this,
      s = boxShadowStyle + ';' + transitionStyle + ';' + dimensionStyle,
      t = me.getTranslate(me.side, me.width);
    visiblePaneWrapper.setAttribute('style', s + '-webkit-transform: ' + t + '; -moz-transform: ' + t + '; -o-transform: ' + t + '; transform: ' + t + ';');
    me.isOpen = true;
    return me;
  };
  this.close = function () {
    var me = this,
      s = boxShadowStyle + ';' + transitionStyle + ';' + dimensionStyle,
      t = me.getTranslate(me.side, 0);
    visiblePaneWrapper.setAttribute('style', s + '-webkit-transform: ' + t + '; -moz-transform: ' + t + '; -o-transform: ' + t + '; transform: ' + t + ';');
    me.isOpen = false;
    return me;
  };
  this.toggle = function () {
    var me = this;
    if(me.isOpen) {
      me.close();
    }
    else {
      me.open();
    };
    return me;
  };
  this.init = function () {
    var me = this;
    me.hiddenPaneElement = $('#' + me.id) || document.createElement('div');
    me.targetElement = $('#' + me.targetId);
    var componentWrapper = document.createElement('div');
    var hiddenPaneWrapper = document.createElement('div');
    visiblePaneWrapper = document.createElement('div');

    componentWrapper.id = me.targetId + '-component';
    hiddenPaneWrapper.id = me.id + '-wrapper';
    visiblePaneWrapper.id = me.targetId + '-wrapper';
    me.hiddenPaneElement.id = me.id;

    /* Before we start, get parent node of target element */
    parentElement = me.targetElement.parentNode;
    /* Set perspective style to enable 3d animation */
    parentElement.setAttribute('style', (parentElement.getAttribute('style') ? parentElement.getAttribute('style') + ';' : '') + '-webkit-perspective: 0px; -moz-perspective: 0px; -o-perspective: 0px; perspective: 0px;');

    /* Set styles */
    boxShadowStyle = 'box-shadow: ' + me.shadowStyle;
    transitionStyle = 'transition: transform ' + me.duration.toString() + 's ' + me.timingFunction + '; -moz-transition: -moz-transform ' + me.duration.toString() + 's ' + me.timingFunction + '; -webkit-transition: -webkit-transform ' + me.duration.toString() + 's ' + me.timingFunction + '; -o-transition: -o-transform ' + me.duration.toString() + 's ' + me.timingFunction;
    dimensionStyle = 'width: ' + me.targetElement.getBoundingClientRect().width + 'px; height: ' + me.targetElement.getBoundingClientRect().height + 'px;';

    /* Wrap target element so we don't mess around with the contents of the target element */
    visiblePaneWrapper.appendChild(me.targetElement);
    visiblePaneWrapper.setAttribute('style', boxShadowStyle + ';' + transitionStyle + ';' + dimensionStyle);
    /* Wrap hidden element to set absolute positioning and ensure the contents clips */
    hiddenPaneWrapper.setAttribute('style', 'position: absolute; overflow: hidden; ' + dimensionStyle + (me.hiddenPaneElement.getAttribute('style') ? me.hiddenPaneElement.getAttribute('style') : ''));
    hiddenPaneWrapper.appendChild(me.hiddenPaneElement);
    /* Wrap the whole thing up to set preserve-3d */
    componentWrapper.setAttribute('style', 'position: relative; overflow: hidden; -webkit-transform-style: preserve-3d; -moz-transform-style: preserve-3d; -o-transform-style: preserve-3d; transform-style: preserve-3d; ' + dimensionStyle);
    componentWrapper.appendChild(hiddenPaneWrapper);
    componentWrapper.appendChild(visiblePaneWrapper);

    /* Finally, attach the component wrapper to the parent */
    parentElement.appendChild(componentWrapper);

    /* Determine original position of wrapper for toggle function */
    me.setSide(me.side);
    me.close();
  };
  this.constructor = function (c) {
    c = c || {};
    for(p in c) { this[p] = c[p]; };
    this.init();
  };
  this.constructor(config);
};
