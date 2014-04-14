/*! energy-dash-frontend v0.1.0 2014-04-14 */
"use strict";

chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create("../index.html", {
        id: "AngularApp",
        bounds: {
            width: 960,
            height: 640
        },
        minWidth: 960,
        minHeight: 640
    });
});

chrome.runtime.onInstalled.addListener(function() {
    console.log("installed");
});

chrome.runtime.onSuspend.addListener(function() {
    console.log("suspended");
});