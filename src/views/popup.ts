import { NewBackendConfig, ChromeConfigItems, Config, NewFrontendGetConfig } from "../internal/utils/config";
import { Application, Backend, Launcher } from "../internal/application";
import { SystemConfig } from "../config";
import { dealHotVersion} from "../internal/utils/utils";
import * as Vue from 'vue';
import popupComponent from './popup.vue';

class popup implements Launcher {
    protected vm: Vue.ComponentPublicInstance;

    constructor() {
    }

    public start() {
        this.vm = Vue.createApp(popupComponent).mount("#platform-config");

        let vtoken = <HTMLInputElement>document.querySelector("#vtoken");
        vtoken.onchange = function () {
            Application.App.config.SetConfig("vtoken", vtoken.value || "");
        }
        vtoken.value = Application.App.config.GetConfig("vtoken");

        Application.CheckUpdate(function (isnew, data) {
            let v: any;
            if (data === undefined) {
                (<HTMLImageElement>document.getElementById("tiku")).src = "./../img/error.svg";
                v = SystemConfig.version + ".0";
            } else {
                if (isnew) {
                    var p = document.createElement('p');
                    p.style.color = "#ff0000";
                    p.innerHTML = '有新的版本更新:<a href="' + data.url + '" style="float:right;" target="_blank">点我去下载</a>  最新版本:v' + data.version;
                    document.getElementsByTagName('body')[0].appendChild(p);
                }
                if (Application.App.remastered) {
                    console.log(data.injection);
                } else {
                    document.getElementById("injection").innerHTML = data.injection;
                }
                v = (SystemConfig.version >= dealHotVersion(data.hotversion) ? SystemConfig.version + ".0" : data.hotversion);
            }
            document.getElementById('version').innerHTML = 'v' + v + (Application.App.remastered ? " special" : "") + (Application.App.debug ? " debug" : "");
        });
    }

}

window.onload = async () => {
    let config = new ChromeConfigItems(await NewBackendConfig());
    let component = new Map<string, any>().set("config", config);
    let app = new Application(Backend, new popup(), component);
    app.run();
}