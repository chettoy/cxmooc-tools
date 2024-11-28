import { MoocTaskSet } from './../../internal/app/mooc';
/*
 * @Author: guotao
 * @Date: 2024-11-28 10:17:42
 * @LastEditors: guotao
 * @LastEditTime: 2024-11-28 17:04:33
 * @FilePath: \zsgl-tools\src\mooc\zsgl\course.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by lzlj, All Rights Reserved. 
 */
//

import { MoocEvent } from "@App/internal/app/mooc";
import { EventListener } from "@App/internal/utils/event";
import { CxTask } from '../chaoxing/task';
import { Task } from '@App/internal/app/task';
import { zsglTask } from '@App/mooc/zsgl/task';
import { Application } from '@App/internal/application';

// 课程任务
export class zsglCourse extends EventListener<MoocEvent> implements MoocTaskSet{
    protected taskList: Array<zsglTask>
    protected attachments:Array<any>
    constructor() {
        super();
    }
    public Init(): Promise<any> {

        return new Promise((resolve, reject) => {
            let first = true;
            Application.App.log.Debug('zsglCourse Init');
            document.addEventListener("load", ev => {
                let el = <HTMLIFrameElement>(ev.target);
                if (el.id == 'iframe'){
                    Application.App.log.Debug('zsglCourse Init iframe loaded');
                    this.OperateCard(el)
                    first && resolve(undefined)
                    first=false
                }
            },true)
        });
    }
    Stop(): Promise<any> {
        throw new Error('Method not implemented.');
    }
        protected taskIndex: number = 0;
    Next(): Promise<Task> {
        return new Promise((resolve, reject) => {
            if (this.taskIndex > this.taskList.length) {
                resolve(this.taskList[this.taskList.length])
                this.taskIndex++
            }
            this.addEventListener("reload", async () => {
                resolve(await this.Next())
            })
                        this.nextPage(null);
        })
    }
        protected afterPage(): HTMLElement {
        //感觉奇葩的方法...
        let els = document.querySelectorAll("div.ncells > *:not(.currents) > .orange01");
        let now = <HTMLElement>document.querySelector("div.ncells > .currents");
        for (let i = 0; i < els.length; i++) {
            if (now.getBoundingClientRect().top < els[i].getBoundingClientRect().top) {
                return <HTMLElement>els[i];
            }
        }
        return null;
    }
    protected nextPage(num: number) {
                let el = <HTMLElement>document.querySelector("span.currents ~ span") || <HTMLElement>document.querySelector(".prev_next.next");
        if (el != undefined) {
            return el.click();
        }
        
        //只往后执行
        el = this.afterPage();
        if (el == undefined) {
            //进行有锁任务查找
            if (document.querySelector("div.ncells > *:not(.currents) > .lock") == undefined) {
                return this.callEvent("complete");
            }
            return setTimeout(() => {
                if (num > 5) {
                    return this.callEvent("error", "被锁卡住了,请手动处理");
                }
                Application.App.log.Info("等待解锁");
                this.nextPage(num + 1);
            }, 5000);
        }
        (<any>el.parentElement.querySelector("a>span")).click();
    }
    
    SetTaskPointer(index: number): void {
        throw new Error('Method not implemented.');
    }

    // 操作任务卡,一个页面会包含很多任务,取出来
    public async OperateCard(iframe: HTMLIFrameElement) {
        let iframeWindow: any = iframe.contentWindow;
        // 判断任务的参数
        if (iframeWindow.mArg == undefined) {
            let match = iframeWindow.document.body.innerHTML.match(/try{\s+?mArg = (.*?);/);
            if (!match) {
                return;
            }
            iframeWindow.mArg = JSON.parse(match[1]);
        }
        // 任务的属性
        this.attachments = <Array<any>>iframeWindow.mArg.attachments;
        this.taskList = new Array();
        // 构建任务
        for (let index = 0; index < this.attachments.length; index++) {
            let value = this.attachments[index];
            value.defaults = <Array<any>>iframeWindow.mArg.defaults;
            let task: zsglTask;
            // 任务工厂去创建对应的任务对象
            task = TaskFactory.CreateCourseTask(iframeWindow, value);
            if (!task) {
                Application.App.log.Debug("!task: " + JSON.stringify(value));
                continue;
            }
            task.jobIndex = index;
            this.taskList.push(task);
            task.addEventListener("complete", () => {
                this.callEvent("taskComplete", index, task);
            });
            await task.Init();
        }
        this.taskIndex = 0;
        this.callEvent("reload");
    }
}