import { RemoveInjected } from "./internal/utils/utils";
import { Application, Frontend, Launcher } from "./internal/application";
import { ChromeConfigItems, NewFrontendGetConfig } from "./internal/utils/config";
import { PageLog, Logger, ConsoleLog } from "./internal/utils/log";
import { mooc } from "./mooc/mooc";
import { DefaultMoocFactory } from "@App/internal/app/mooc";


import initWasm, { CxUncover } from "@App/fxxkmod";
import wasmData from "@App/fxxkmod/index_bg.wasm";

console.log("mooc.js init", window.name);

let logger: Logger;
if (top == self) {
    logger = new PageLog();
} else {
    logger = new ConsoleLog();
}

Application.GlobalContext = window;
let component = new Map<string, any>()
    .set("config", new ChromeConfigItems(NewFrontendGetConfig()))
    .set("logger", logger);

initWasm(wasmData).then(() => {
    let app = new Application(Frontend, new mooc(new DefaultMoocFactory()), component);
    logger.Info("Fxxk mod " + CxUncover.version_name());
    app.run();
    RemoveInjected(document);
});