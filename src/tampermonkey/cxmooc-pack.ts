import { ChromeConfigItems, NewFrontendGetConfig } from "@App/internal/utils/config";
import { ConsoleLog, Logger, PageLog } from "@App/internal/utils/log";
import { Application, Frontend } from "@App/internal/application";
import { mooc } from "@App/mooc/mooc";
import { CxPlatform } from "@App/mooc/chaoxing/platform";

import initWasm, { CxUncover } from "@App/fxxkmod";
import wasmData from "@App/fxxkmod/index_bg.wasm";

let logger: Logger;
if (top == self) {
    logger = new PageLog();
} else {
    logger = new ConsoleLog();
}

Application.GlobalContext = (<any>window).unsafeWindow;
let component = new Map<string, any>().
    set("config", new ChromeConfigItems(NewFrontendGetConfig())).
    set("logger", logger);

initWasm(wasmData).then(() => {
    let app = new Application(Frontend, new mooc(new CxPlatform()), component);
    logger.Info("Fxxk mod " + CxUncover.version_name());
    app.run();
});