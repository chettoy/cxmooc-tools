import { Task, TaskEvent } from "@App/internal/app/task";
import { CssBtn } from "./utils";
import { createBtn, get } from "@App/internal/utils/utils";
import { Application } from "@App/internal/application";

export abstract class zsglTask extends Task {
    public jobIndex: Number
    public taskInfo: any
    protected context: any
    public done: boolean 
    public constructor(context:any,taskInfo:any) {
        super();
        this.context = context
        this.taskInfo = taskInfo
        if(this.taskInfo?.job){
            this.done = false
        }else{
            this.done = true
        }
    }

    protected callEvent(event: TaskEvent, ...args: any): void {
        if(event == "complete"){
            this.done = true
        }
        super.callEvent(event, ...args);
    }
    public async Init(): Promise<any>{
        
    }
    public Submit(): Promise<void> {
        return new Promise(resolve => {
            resolve()
        })
    }
    public Stop(): Promise<void> {
        return new Promise(resolve => {
            resolve();
        });
    }
        public Done(): boolean {
        return this.done;
    }
}

export class zsglTaskController{
        public task: zsglTask;
    protected prev: HTMLElement;
    constructor(prev: HTMLElement, task: zsglTask) {
        this.task=task
        this.prev = prev
        prev.style.textAlign = "center";
        prev.style.width = "100%";
        prev.prepend(this.prev);
        this.defaultBtn();
    }
   public defaultBtn() {
        let startBtn = CssBtn(createBtn(Application.App.config.auto ? "暂停挂机" : "开始挂机", "点击开始自动挂机", "zsgl-btn"));
        startBtn.innerText = "开始"
        startBtn.onclick = () => {
            if (startBtn.innerText == '暂停挂机') {
                Application.App.config.auto = false;
                startBtn.innerText = "开始挂机";
                startBtn.title = "点击开始自动挂机";
                Application.App.log.Info("挂机停止了");
            } else {
                Application.App.config.auto = true;
                startBtn.innerText = '暂停挂机';
                startBtn.title = "停止挂机,开始好好学习";
                Application.App.log.Info("挂机开始了");
                this.task.Start();
            }
        };
        this.prev.append(startBtn);
    }
    
    public append(el: HTMLElement): void {
        this.prev.append(el);
    }

    public download(): HTMLElement {
        if (!this.task.taskInfo.property.objectid) {
            return;
        }
        let download = CssBtn(createBtn("下载资源", "我要下载下来好好学习", "cx-btn"));
        download.style.background = "#999999";
        download.onclick = () => {
            (<any>get("https://mooc1-1.chaoxing.com/ananas/status/" + this.task.taskInfo.property.objectid, (data: string) => {
                let json = JSON.parse(data);
                prompt("如果打开下载失败，请复制下面链接手动下载", json.download);
                window.open(json.download);
            })).error(() => {
                alert("资源信息获取失败");
            });
        };
        return download;
    }
}