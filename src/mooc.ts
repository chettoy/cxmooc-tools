/*
 * @Author: guotao
 * @Date: 2024-11-29 15:27:38
 * @LastEditors: guotao
 * @LastEditTime: 2024-11-29 16:00:12
 * @FilePath: \cxmooc-tools\src\mooc.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by lzlj, All Rights Reserved. 
 */
import {RemoveInjected} from "./internal/utils/utils";
import {Application, Frontend, Launcher} from "./internal/application";
import {ChromeConfigItems, NewFrontendGetConfig} from "./internal/utils/config";
import {PageLog, Logger, ConsoleLog} from "./internal/utils/log";
import {mooc} from "./mooc/mooc";
import {DefaultMoocFactory} from "@App/internal/app/mooc";


let logger: Logger;
if (top == self) {
    logger = new PageLog();
} else {
    logger = new ConsoleLog();
}

let component = new Map<string, any>()
    .set("config", new ChromeConfigItems(NewFrontendGetConfig()))
    .set("logger", logger);

Application.GlobalContext = window;
let app = new Application(Frontend, new mooc(new DefaultMoocFactory()), component);
app.run();

RemoveInjected(document);