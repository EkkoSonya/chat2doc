<template>
    <div id="app">
        <div class="contain">
            <div class="title">
                <h1>
                    Chat2doc
                </h1>
            </div>
            <!-- 用户文件上传入口 -->
            <div class="load" style="margin-top:0px">
                <a-card class="card">
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
                </a-card>
            </div>

            <!-- 用户上传文件列表 -->
            <div class="list">
                <a-card class="card">
                    <div class="folder" >
                        <a-button 
                            @click="visible.folderVisible = true"
                            style="margin-right:50px"
                        >
                            <PlusOutlined />新建文件夹
                        </a-button>    
                        <a-button><PlusOutlined />上传文件</a-button> 
                        <a-table 
                            size="small"
                            :pagination={disabled:true,hideOnSinglePage:true} 
                            :columns="columns" 
                            :data-source="data.folders"
                            style="margin-top: 10px;"
                        >
                            <template #name>
                                <span>
                                    文件夹
                                    <QuestionCircleOutlined />
                                </span>
                            </template>
                            <template #operation>
                                <span>
                                    <a>提问</a>
                                    <a-divider type="vertical" />
                                    <a>删除</a>
                                    <a-divider type="vertical" />
                                    <a>上传</a>
                                </span>
                            </template>
                        </a-table>
                    </div>

                    <div class="items" style="margin-top: 20px;">   
                        <a-table 
                            size="small"
                            :pagination={disabled:true,hideOnSinglePage:true} 
                            :columns="columns" 
                            :data-source="data.items"
                        >
                            <template #name>
                                <span>
                                    所有文件
                                    <UpOutlined v-if="!data.flag" @click="changeItemsDisplay"/>
                                    <DownOutlined v-if="data.flag" @click="changeItemsDisplay"/>
                                </span>
                            </template>
                            <template #operation>
                                <span>
                                    <a>提问</a>
                                    <a-divider type="vertical" />
                                    <a>删除</a>
                                </span>
                            </template>
                        </a-table>
                    </div>
                </a-card>
            </div>
        </div>
        <a-modal
            :visible="visible.userVisible"
            width="400px"
            :closable = false
            :footer = "null"
        >
            <div class="title" style="text-align: center;margin-bottom: 30px;">
                <h2>
                    登录
                </h2>
            </div>
            <div class="form">
                <a-form
                    :model="data.userInfo"
                    labelAlign="left"
                >
                    <a-form-item label="用户">
                        <a-input v-model:value="data.userInfo.name" />
                    </a-form-item>
                    <a-form-item label="密码">
                        <a-input v-model:value="data.userInfo.password"/>
                    </a-form-item>
                    <a-form-item>
                        <div class="flexCenter">    
                            <a-button 
                                type="primary" 
                                style="margin-right:2rem"
                                @click="userLogin"
                            >登录</a-button>
                            <a-button type="primary">注册</a-button>
                        </div>
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>

        <a-modal
            :visible="visible.folderVisible"
            width="400px"
            :closable = false
            :footer = "null"
        >
            <div class="title" style="text-align: center;margin-bottom: 30px;">
                <h2>
                    新建文件夹
                </h2>
            </div>

            <div class="form">
                <a-form
                    :model="data.newFolder"
                    labelAlign="left"
                >
                    <a-form-item label="文件夹名称">
                        <a-input v-model:value="data.newFolder.name" />
                    </a-form-item>
                    <a-form-item label="描述信息">
                        <a-input v-model:value="data.newFolder.description"/>
                    </a-form-item>
                    <a-form-item>
                        <div class="flexCenter">    
                            <a-button 
                                type="primary" 
                                @click="create_doc_store"
                            >
                                创建文件夹
                            </a-button>
                        </div>
                    </a-form-item>
                </a-form>
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { InboxOutlined, PlusOutlined, QuestionCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { reactive, ref, onMounted } from 'vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { get, post } from './api/index'
import qs from 'qs'


import type {Data,Visible} from './types'
// 数据样式


// 表格样式
const columns = [
    {
        dataIndex: 'name',
        key: 'name',
        slots: {title: 'name'},
    },
    {
        dataIndex: 'operation',
        key: 'operation',
        title: '操作',
        slots:{customRender: 'operation'},
        align: 'center',
        width: 150,
        customHeaderCell: ()=>({
            style: {
                textAlign: 'center'
            }
        })
    }
]

const visible = reactive<Visible>({
    userVisible: false,
    folderVisible: false,
})

const data = reactive<Data>({
    userInfo: {
        name: '',
        password: ''
    },
    folders: [],
    items: [],
    flag: true,
    newFolder: {
        name: '',
        description: ''
    }
})

const fileList = ref([])
const handleDrop = (e: DragEvent) => {
    console.log(e);
}

// 模拟数据
data.folders = [
    {
        name:'folder1',
        docs:[
            {
                name:'doc1',
            },
            {
                name:'doc2',
            }
        ]
    },
    {
        name:'folder2',
        docs:[
            {
                name:'doc3',
            },
            {
                name:'doc4',
            },
            {
                name:'doc5',
            }
        ]
    }
]

data.folders.forEach(folder => {
    if(folder.docs){
        folder.docs.forEach(doc => {
            data.items.push(doc)
        })
    }
})


// 函数

// 登录
const userLogin = () => {
    post('/paper/login', qs.stringify(data.userInfo)).then(res => {
        if (res.code == 0){
            message.success('登录成功')
            visible.userVisible = false
        }
        else{
            message.error('登录失败')
            visible.userVisible = true
        }
    })
}

// 获取文档信息
const get_docs = () => {
    return get('/paper/get_docs').then(res => {
        // 需要修改下数据结构 与后端类型对应
        if(res.code == 0){
            data.folders = res.data as any
            return true
        }
        else{
            message.error('获取文档信息失败')
            return false
        }
    })
    .catch(err => {
        message.error('获取文档信息失败')
        return false
    })
}

// 新建文件夹
const create_doc_store = () => {
    return post('/paper/create_doc_store', qs.stringify(data.newFolder)).then(res => {
        console.log(res)
        if (res.code == 0){
            message.success('创建成功')
        }
        else{
            message.error('创建失败')
        }
        data.newFolder = {
            name: '',
            description: ''
        }
        visible.folderVisible = false
    })
}

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

const changeItemsDisplay = () => {
    let table = <HTMLImageElement>document.querySelector('.items .ant-table-tbody')
    if(data.flag)
        table.style.display = ''
    else
        table.style.display = 'none'
    data.flag = !data.flag
}

onMounted(async () => {
    let table = <HTMLImageElement>document.querySelector('.items .ant-table-tbody')
    table.style.display = 'none'
   
    if(!await get_docs())
        visible.userVisible = true
})
</script>

<style scoped lang="scss">
#app {
    width: 100%;
    padding-left: calc(100vw - 100%);
    min-height: 100vh;
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
        
        .card {
            width: 100%;
            border-radius: 10px;
            min-height: 200px;
        }

        .list, .load {
            width: 100%;
            margin-top: 1rem;
        }
    }
}
.flexCenter {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
}
</style>
