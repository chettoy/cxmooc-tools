import { NewExtensionServerMessage } from "./internal/utils/message";
import { HttpUtils } from "./internal/utils/utils";
import { Application, Backend, Launcher } from "./internal/application";
import { ConsoleLog } from "./internal/utils/log";
import { ChromeConfigItems, NewBackendConfig } from "./internal/utils/config";
import { SystemConfig } from "./config";

class background implements Launcher {

    public start() {
        console.log("background start");
        let server = NewExtensionServerMessage("cxmooc-tools");
        server.Accept((client, data) => {
            switch (data.type) {
                case "GM_xmlhttpRequest": {
                    HttpUtils.SendRequest(client, data);
                    break;
                }
                case "GM_notification": {
                    chrome.notifications.create({
                        title: data.details.title, message: data.details.text,
                        iconUrl: chrome.runtime.getURL("img/logo.png"), type: "basic"
                    }, (id) => {
                        if (data.details.timeout) {
                            setTimeout(() => {
                                chrome.notifications.clear(id);
                            }, data.details.timeout);
                        }
                    });
                    break;
                }
                case "GM_setValue": {
                    Application.App.config.SetConfig(data.details.key, data.details.val);
                    break;
                }
            }
        });
        /* disable hotupdate for manifest v3 */
        // // call update to get source code from hotupdate
        // this.update();
        // setInterval(() => {
        //     this.update();
        //     // update per hour
        // }, 60 * 60 * 1000);
        this.injectedScript();
        this.event();
        this.menu();
    }

    protected menu() {
        const menuItemId: string = "search-selected-topic";
        chrome.contextMenus.removeAll();
        chrome.contextMenus.create({
            id: menuItemId,
            title: "使用 网课小工具 搜索题目",
            contexts: ["selection"]
        });
        chrome.contextMenus.onClicked.addListener((info, _tab) => {
            if (info.menuItemId !== menuItemId) return;
            chrome.tabs.create({ url: "https://cx.icodef.com/query.html?q=" + encodeURIComponent(info.selectionText) });
        });
    }

    protected event() {
        if (Application.App.debug) {
            return;
        }
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason == "install") {
                chrome.tabs.create({ url: "https://err.pw/cxmooc-tools" });
            } else if (details.reason == "update") {
                chrome.tabs.create({ url: "https://github.com/chettoy/cxmooc-tools/releases" });
            }
        });
    }

    protected update() {
        Application.CheckUpdate((isnew, data) => {
            if (isnew) {
                chrome.action.setBadgeText({
                    text: 'new'
                });
                chrome.action.setBadgeBackgroundColor({
                    color: [255, 0, 0, 255]
                });
            }
        });
    }

    protected dealScript(source: string, version: any): string {
        source = "//# sourceURL=" + chrome.extension.getURL("src/mooc.js?v=" + version) + "\n" + source;
        return this.dealSymbol(source);
    }

    protected dealSymbol(source: string): string {
        source = source.replace(/("|\\)/g, "\\$1");
        source = source.replace(/(\r\n|\n)/g, "\\n");
        return source;
    }

    protected async injectedScript() {
        // if (Application.App.debug) {
        //     return;
        // }
        // rules for distinguishing between platforms
        let regex = new Array();
        for (let key in SystemConfig.match) {
            for (let i = 0; i < SystemConfig.match[key].length; i++) {
                let v = SystemConfig.match[key][i];
                v = v.replace(/(\.\?\/)/g, "\\$1");
                v = v.replace(/\*/g, ".*?");
                regex.push(v);
            }
        }
        let cache = await Application.App.config.ConfigList();
        let cacheJsonText = JSON.stringify(cache);
        Application.App.config.Watch("*", function (key: string, value: string) {
            cache[key] = value;
            cacheJsonText = JSON.stringify(cache);
        });
        console.log("bg add listener");
        chrome.runtime.onMessage.addListener((msg, details) => {
            console.log("bg receive message", msg);
            if (!msg.status && msg.status != "loading") {
                return null;
            }
            for (let i = 0; i < regex.length; i++) {
                let reg = new RegExp(regex[i]);
                if (reg.test(details.url)) {
                    let target: chrome.scripting.InjectionTarget = {
                        tabId: details.tab.id,
                        frameIds: [details.frameId],
                    };
                    console.log("execute mooc.js", details);
                    chrome.scripting.executeScript({
                        target,
                        files: ["src/mooc.js"]
                    }).then(() => {
                        console.log("mooc.js executed");
                    }).catch(reason => {
                        console.log("mooc.js failed to execute: " + reason);
                    });
                    break;
                }
            }
        });
    }
}

async function init() {
    console.log("cxmooc-tools background worker init");
    let component = new Map<string, any>()
        .set("logger", new ConsoleLog())
        .set("config", new ChromeConfigItems(await NewBackendConfig(), true));

    let application = new Application(Backend, new background(), component);
    application.run();
}

init();
