import { CxVideoControlBar, Video } from "@App/mooc/chaoxing/video";
import {
    CxCourseQueryQuestion,
    CxCourseTopic,
    CxTopicControlBar,
    ExamTopic, HomeworkTopic,
    TopicAdapter
} from "@App/mooc/chaoxing/topic";
import { Question, QuestionStatusString, ToolsQuestionBankFacade } from "@App/internal/app/question";
import { CxQuestionFactory } from "@App/mooc/chaoxing/question";
import { Application } from "@App/internal/application";
import { CxTaskControlBar, CxTask } from "@App/mooc/chaoxing/task";
import { CssBtn } from "@App/mooc/chaoxing/utils";
import { createBtn } from "@App/internal/utils/utils";
import { CxAudioControlBar, CxAudioTask, CxDocumentTask } from "@App/mooc/chaoxing/special";
import { CxUncover } from "@App/fxxkmod";

// 任务工厂,创建对应的任务
export class TaskFactory {

    public static fix_cxsecret(document: Document): number {
        let captures: RegExpMatchArray = document.documentElement.outerHTML
            .match(/url\('data:application\/font-ttf;charset=utf-8;base64,(.*?)'\)/);
        Application.App.log.Debug("cxsecret", document.documentElement);
        Application.App.log.Debug("cxsecret", captures);
        Application.App.log.Debug(".cxsecret", document.querySelectorAll(".font-cxsecret"));
        if (!captures || captures.length < 2) return -1;
        let cxsecret: string = captures[1];
        let t0 = Date.now();
        const cxuncover = CxUncover.new_default();
        let t1 = Date.now();
        Application.App.log.Info(`[fxxk] 解压默认数据 (${(t1 - t0) / 1000}s)`);
        let t2 = Date.now();
        let trans: Map<string, string> = cxuncover.get_translate(cxsecret);
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
        document.querySelectorAll(".font-cxsecret").forEach(el => doFix(el.childNodes));
        let t3 = Date.now();
        Application.App.log.Info(`修复乱码 ${fix_count} 个字 (${(t3 - t2) / 1000}s)`);
        return trans.size;
    }

    public static CreateCourseTask(context: any, taskinfo: any): CxTask {
        if (taskinfo.property.module == "insertaudio") {
            taskinfo.type = "audio";
        }
        //TODO:优化
        if (taskinfo.type != "video" && taskinfo.type != "workid" && taskinfo.type != "document"
            && taskinfo.type != "audio") {
            return null;
        }
        let task: CxTask;
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
                let bar = new CxVideoControlBar(prev, new Video(taskIframe.contentWindow, taskinfo));
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
                TaskFactory.fix_cxsecret(contentWindow.document);
                let topic = new CxCourseTopic(contentWindow, new ToolsQuestionBankFacade("cx", {
                    refer: (<Window>context).document.URL, id: taskinfo.property.workid, info: taskinfo.property.workid,
                }));
                topic.SetQueryQuestions(new CxCourseQueryQuestion(contentWindow, (context: any, el: HTMLElement): Question => {
                    return CxQuestionFactory.CreateCourseQuestion(context, el);
                }));
                let bar = new CxTopicControlBar(prev, new TopicAdapter(context, taskinfo, topic));
                if (Application.App.config.answer_ignore) {
                    return null;
                }
                task = bar.task;
                break;
            }
            case "document": {
                let bar = new CxTaskControlBar(prev, new CxDocumentTask(taskIframe.contentWindow, taskinfo));
                bar.append(bar.download());
                task = bar.task;
                (<Video>task).muted = Application.App.config.video_mute;
                (<Video>task).playbackRate = Application.App.config.video_multiple;
                break;
            }
            case "audio": {
                let bar = new CxAudioControlBar(prev, new CxAudioTask(taskIframe.contentWindow, taskinfo));
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

    public static CreateExamTopicTask(context: any, taskinfo: any): CxTask {
        TaskFactory.fix_cxsecret(document);
        let topic = new ExamTopic(context, new ToolsQuestionBankFacade("cx", taskinfo));
        let task = new TopicAdapter(context, taskinfo, topic);
        if (document.URL.indexOf("exam/test/reVersionTestStartNew") > 0) {
            topic.SetQueryQuestions(topic);
            let btn = CssBtn(createBtn("搜索答案", "搜索题目答案"));
            document.querySelector(".Cy_ulBottom.clearfix.w-buttom,.Cy_ulTk,.Cy_ulBottom.clearfix").append(btn);
            btn.onclick = () => {
                btn.innerText = "答案搜索中...";
                try {
                    task.Start().then((ret: any) => {
                        ret = ret || "搜索题目";
                        btn.innerText = QuestionStatusString(ret);
                    });
                } catch (e) {
                }
                return false;
            };
        } else {
            topic.SetQueryQuestions(new CxCourseQueryQuestion(context, (context: any, el: HTMLElement): Question => {
                return CxQuestionFactory.CreateExamCollectQuestion(context, el);
            }));
        }
        return task;
    }

    public static CreateHomeworkTopicTask(context: any, taskinfo: any): CxTask {
        TaskFactory.fix_cxsecret(document);
        let bank = new ToolsQuestionBankFacade("cx", taskinfo);
        let topic = new HomeworkTopic(context, bank);
        topic.SetQueryQuestions(new CxCourseQueryQuestion(context, (context: any, el: HTMLElement): Question => {
            return CxQuestionFactory.CreateHomeWorkQuestion(context, el);
        }));
        let task = new TopicAdapter(context, taskinfo, topic);
        let btn = CssBtn(createBtn("搜索答案", "搜索题目答案"));
        if ((<HTMLInputElement>document.querySelector("input#workRelationId"))) {
            document.querySelector(".CyTop").append(btn);
            btn.onclick = async () => {
                btn.innerText = "答案搜索中...";
                task.Start().then((ret: any) => {
                    ret = ret || "搜索题目";
                    btn.innerText = QuestionStatusString(ret);
                });
            };
        }
        return task;
    }

}
