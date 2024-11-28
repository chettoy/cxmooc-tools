import { MoocTaskSet } from './../../internal/app/mooc';
/*
 * @Author: guotao
 * @Date: 2024-11-28 10:17:42
 * @LastEditors: guotao
 * @LastEditTime: 2024-11-28 10:26:08
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

// 课程任务
export class zsglCourse extends EventListener<MoocEvent> implements MoocTaskSet{
    constructor() {
        super();
    }
    Init(): Promise<any> {
        throw new Error('Method not implemented.');
    }
    Stop(): Promise<any> {
        throw new Error('Method not implemented.');
    }
    Next(): Promise<Task> {
        throw new Error('Method not implemented.');
    }
    SetTaskPointer(index: number): void {
        throw new Error('Method not implemented.');
    }
    protected tasklist:Array<CxTask>
}