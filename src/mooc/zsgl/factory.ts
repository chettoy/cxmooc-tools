import { Application } from "@App/internal/application";
import { zsglTask } from "./task";


// 任务工厂,创建对应的任务
export class TaskFactory {
    public static fix_zsglsecret(document: Document): number {
        let captures: RegExpMatchArray = document.documentElement.outerHTML
            .match(/url\('data:application\/font-ttf;charset=utf-8;base64,(.*?)'\)/);
        Application.App.log.Debug("zsglsecret", document.documentElement);
        Application.App.log.Debug("zsglsecret", captures);
        Application.App.log.Debug(".zsglsecret", document.querySelectorAll(".font-zsglsecret"));
        if (!captures || captures.length < 2) return -1;
        let zsglsecret: string = captures[1];
        let t0 = Date.now();
        const zsgluncover = zsglUncover.new_default();
        let t1 = Date.now();
        Application.App.log.Info(`[fxxk] 解压默认数据 (${(t1 - t0) / 1000}s)`);
        let t2 = Date.now();
        let trans: Map<string, string> = zsgluncover.get_translate(zsglsecret);
        let fix_count = 0;
        const doFix = (nodes: NodeListOf<ChildNode>) => {
            nodes.forEach(n => {
                if (n.nodeType === 3) { // text
                    let text = <Text>n;
                    if (text.data.trim().length === 0) {
                        return;
                    }
                    trans.forEach((v, k) => {
                        let offset = text.data.indexOf(k);
                        while (offset != -1) {
                            text.replaceData(offset, k.length, v);
                            fix_count += 1;
                            offset = text.data.indexOf(k, offset + v.length);
                        }
                    });
                } else if (n.hasChildNodes()) {
                    doFix(n.childNodes);
                }
            });
        };
        document.querySelectorAll(".font-zsglsecret").forEach(el => doFix(el.childNodes));
        let t3 = Date.now();
        Application.App.log.Info(`修复乱码 ${fix_count} 个字 (${(t3 - t2) / 1000}s)`);
        return trans.size;
    }

    public static CreateCourseTask(context: any, taskinfo: any): zsglTask {
        if (taskinfo.property.module == "insertaudio") {
            taskinfo.type = "audio";
        }
        //TODO:优化
        if (taskinfo.type != "video" && taskinfo.type != "workid" && taskinfo.type != "document"
            && taskinfo.type != "audio") {
            return null;
        }
        let task: zsglTask;
        let taskIframe = <HTMLIFrameElement>(<Window>context).document.querySelector(
            "iframe[jobid='" + taskinfo.jobid + "']"
        );
        let prev: HTMLElement;
        if (taskIframe == undefined) {
            taskIframe = <HTMLIFrameElement>(<Window>context).document.querySelector(
                "iframe[data*='" + taskinfo.property.mid + "'],iframe[objectid='" + taskinfo.property.objectid + "']"
            );
            prev = document.createElement("div");
            taskIframe.parentElement.prepend(prev);
        } else {
            prev = <HTMLElement>taskIframe.previousElementSibling
        }
        switch (taskinfo.type) {
            case "video": {
                let bar = new zsglVideoControlBar(prev, new Video(taskIframe.contentWindow, taskinfo));
                task = bar.task;
                (<Video>task).muted = Application.App.config.video_mute;
                (<Video>task).playbackRate = Application.App.config.video_multiple;
                break;
            }
            case "workid": {
                let contentWindow = (<HTMLIFrameElement>taskIframe.contentWindow.document.querySelector("#frame_content")).contentWindow;
                taskinfo.refer = (<Window>context).document.URL;
                taskinfo.id = taskinfo.property.workid;
                taskinfo.info = taskinfo.property.workid;
                TaskFactory.fix_zsglsecret(contentWindow.document);
                let topic = new zsglCourseTopic(contentWindow, new ToolsQuestionBankFacade("zsgl", {
                    refer: (<Window>context).document.URL, id: taskinfo.property.workid, info: taskinfo.property.workid,
                }));
                topic.SetQueryQuestions(new zsglCourseQueryQuestion(contentWindow, (context: any, el: HTMLElement): Question => {
                    return zsglQuestionFactory.CreateCourseQuestion(context, el);
                }));
                let bar = new zsglTopicControlBar(prev, new TopicAdapter(context, taskinfo, topic));
                if (Application.App.config.answer_ignore) {
                    return null;
                }
                task = bar.task;
                break;
            }
            case "document": {
                let bar = new zsglTaskControlBar(prev, new zsglDocumentTask(taskIframe.contentWindow, taskinfo));
                bar.append(bar.download());
                task = bar.task;
                (<Video>task).muted = Application.App.config.video_mute;
                (<Video>task).playbackRate = Application.App.config.video_multiple;
                break;
            }
            case "audio": {
                let bar = new zsglAudioControlBar(prev, new zsglAudioTask(taskIframe.contentWindow, taskinfo));
                task = bar.task;
                (<Video>task).muted = Application.App.config.video_mute;
                (<Video>task).playbackRate = Application.App.config.video_multiple;
                break;
            }
            default:
                return null;
        }
        return task;
    }
}
