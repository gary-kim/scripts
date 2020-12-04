// ==UserScript==
// @name      Discord User Status Collector
// @namespace https://garykim.dev/gary-kim/scripts
// @version   1
// @include   https://discord.com/*
// @grant     GM.getValue
// @grant     GM.setValue
// @grant     GM.notification
// @grant     GM.setClipboard
// @grant     GM.info
// @run-at    document-idle
// ==/UserScript==


// USER_ID should be the numerical user id of the user. For "https://discord.com/channels/@me/575112976524752148", it is "575112976524752148".
const USER_ID = "PROVIDE_USER_ID_HERE"
const LOCATION_REGEX = new RegExp('^https://discord.com/channels/@me');

async function main () {
    if (!LOCATION_REGEX.test(window.location.href)) {
        return;
    }

    const message = document?.querySelector('#private-channels')?.querySelector(`[href="/channels/@me/${USER_ID}"]`)?.querySelector('[class^="activityText-"]')?.innerText;
    if (!message)
        return;
    const data = await readInValues();
    if (data.length === 0 || data[data.length - 1].message !== message) {
        data.push({
            message: message,
            date: new Date(),
        });
        saveValues(data, message);
        return;
    }
    data[data.length - 1].date = new Date();
    saveValues(data, message);
}

async function readInValues () {
    let tr = JSON.parse(await GM.getValue('discord_status_collector_' + USER_ID, "[]"))    
    tr = tr.map(m => {
        return {
            message: m.message,
            date: new Date(m.date),
        };
    });
    return tr;
}

function saveValues (data, message) {
    GM.notification('Information Collected, status is: "' + message + '". Click this notification to copy csv to the clipboard.', GM.info.name, undefined, copyToClipboard.bind(this, data));
    GM.setValue('discord_status_collector_' + USER_ID, JSON.stringify(data));
}

function copyToClipboard (data) {
    let toCopy = "id,date,message";
    for (let i = 0; i < data.length; i++) {
        toCopy += `${"\n"}${i},"${data[i].date}","${data[i].message.replaceAll('"', '\\"')}"`;
    }
    GM.setClipboard(toCopy);
    GM.notification('Information copied onto clipboard', GM.info.name)
}

setTimeout(main, 3000);
