<script>
import { Application } from "../internal/application";
import { SystemConfig } from "../config";
import { boolToString, protocolPrompt, toBool } from "../internal/utils/utils";
export default {
    data() {
        return {
            selectKey: 'cx',
            configs: SystemConfig.config,
        }
    },
    async created() {
        for (let key in this.configs) {
            for (let index in this.configs[key].items) {
                let item = this.configs[key].items[index];
                let val = Application.App.config.GetNamespaceConfig(key, item.key, undefined);
                if (val == undefined) {
                    val = Application.App.config.GetConfig(item.key, item.value);
                }
                item.value = this.toVal(item.type, val);
            }
        }
    },
    methods: {
        toVal(type, val) {
            switch (type) {
                case "checkbox": {
                    return toBool(val);
                }
                default: {
                    return val;
                }
            }
        },
        changeTab(key) {
            this.selectKey = key;
        },
        async change(namespace, key, type, val, index, prompt) {
            if (prompt !== undefined) {
                // 弹出信息框,还原值
                if (!protocolPrompt(prompt, key)) {
                    let val = Application.App.config.GetNamespaceConfig(namespace, key, undefined);
                    if (val == undefined) {
                        val = Application.App.config.GetConfig(key, this.configs[namespace].items[index].value);
                    }
                    this.configs[namespace].items[index].value = this.toVal(type, val);
                    return false;
                }
            }
            if (namespace == "common") {
                namespace = "";
            }
            switch (type) {
                case "checkbox": {
                    await Application.App.config.SetNamespaceConfig(namespace, key, boolToString(val));
                    break;
                }
                default: {
                    await Application.App.config.SetNamespaceConfig(namespace, key, val);
                }
            }
        }
    }
}
</script>

<template>
    <div class="platform-header">
        <div v-for="(config,key) in configs" :key="key"
            v-bind:class="[selectKey==key?'platform-header-item active':'platform-header-item']"
            @click="changeTab(key)">
            <div class="platform-name">{{ config.name }}</div>
        </div>
    </div>
    <div class="platform-content">
        <div v-for="(config,key) in configs" :key="key" class="platform-items">
            <div v-if="selectKey==key" v-for="(item,index) in config.items" :key="item.key" class="platform-item">
                <div v-if="item.type=='text'">
                    <label :for="item.key" :title="item.description">{{ item.title }}:</label>
                    <input type="text" class="input_text" :id="item.key" :title="item.description" v-model="item.value"
                        @input="change(key,item.key,'text',item.value,index,item.prompt)">
                    <label v-if="item.unit!=''" :for="item.key" :title="item.description">{{
                    item.unit
                    }}
                    </label>
                </div>
                <div v-else-if="item.type== 'checkbox'">
                    <input class="rdo" type="checkbox" :id="item.key" v-model="item.value"
                        @change="change(key,item.key,'checkbox',item.value,index,item.prompt)">
                    <label class="shou" :for="item.key" :title="item.description">{{ item.title }}</label>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

</style>