<template>
    <div id="app">
        <div class="contain">
            <div class="title">
                <h1>
                    Chat2doc
                </h1>
            </div>
            <!-- 用户文件上传入口 -->
            <div class="load">
                <a-upload-dragger 
                    v-model:fileList="fileList" 
                    name="file" 
                    :multiple="true"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76" 
                    @change="handleChange" 
                    @drop="handleDrop"
                >
                    <div class="upload">
                        <p class="ant-upload-drag-icon">
                            <inbox-outlined></inbox-outlined>
                        </p>
                        <p class="ant-upload-text">
                            拖拽文件到此处 或 点击上传文件
                        </p>
                        <p class="ant-upload-hint">
                            支持.pdf & .docx 文件
                        </p>
                    </div>

                </a-upload-dragger>
            </div>
            <!-- 用户上传文件列表 -->
            <div class="list">

            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { InboxOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { defineComponent, ref } from 'vue';
import type { UploadChangeParam } from 'ant-design-vue';

export default defineComponent({
    components: {
        InboxOutlined,
    },
    setup() {
        const handleChange = (info: UploadChangeParam) => {
            const status = info.file.status;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        };
        return {
            handleChange,
            fileList: ref([]),
            handleDrop: (e: DragEvent) => {
                console.log(e);
            },
        };
    },
})
</script>

<style scoped lang="scss">
#app {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
    display: flex;
    flex-direction: column;
    .contain {
        max-width: 960px;
        width: 100%;
        margin: 0 auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .load, .list {
            min-height: 14rem;
            width: 100%;
            padding: 0.4rem;
            border: 1px solid #d9d9d9;
            border-radius: 0.4rem;
            background-color: #fff;
            .upload {
                display: flex;
                height: 100%;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
        }

        .list {
            margin-top: 1rem;
        }
    }
}

.main {
    width: 100%;
    height: 100%;
}
</style>
