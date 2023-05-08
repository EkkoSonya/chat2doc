<template>
    <a-spin :spinning="spinning" style="z-index: 9999;" size="large" > 
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
                        name="paper_file" 
                        :multiple="false"
                        :withCredentials="true"
                        action="http://localhost:5173/chat2doc/paper/upload_doc" 
                        :headers="{
                            'X-Requested-With': null
                        }"
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
                            <PlusOutlined />
                            新建文件夹
                        </a-button>    
                        <a-button>
                            <PlusOutlined />
                            上传文件
                        </a-button> 
                        <a-table 
                            size="small"
                            :pagination={disabled:true,hideOnSinglePage:true} 
                            :columns="FolderColumns" 
                            :data-source="data.folders"
                            style="margin-top: 10px;"
                        >
                            <template #name>
                                <span>
                                    文件夹
                                    <QuestionCircleOutlined />
                                </span>
                            </template>
                            <template #operation="{ record }">
                                <span>
                                    <a>提问</a>
                                    <a-divider type="vertical" />
                                    <a @click="del_doc_store( record.id )">删除</a>
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
                            :columns="ItemsColumns" 
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

        <!-- 用户登录 -->
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
                    ref="userInfoForm"
                    :model="data.userInfo"
                    :rules="userInfoRules"
                    labelAlign="left"
                >
                    <a-form-item 
                        label="用户" 
                        :required="true" 
                        prop="name"
                    >
                        <a-input v-model:value="data.userInfo.name" />
                    </a-form-item>
                    <a-form-item 
                        label="密码" 
                        :required="true" 
                        prop="password"
                        style="padding-top: 10px;"
                    >
                        <a-input-password v-model:value="data.userInfo.password"/>
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

        <!-- 新建文件夹信息 -->
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
        
        
        <!-- 上传文件后选择所放置的文件夹 -->
        <a-modal
            :visible="visible.chooseVisible"
            width="400px"
            :closable = false
            :footer = "null"
        >
            <div class="title" style="text-align: center;margin-bottom: 30px;">
                <h2>
                    请选择文件夹放置文件
                </h2>
            </div>

            <div class="form">
                <a-form
                    :model="chooseFile"
                    layout = "vertical"
                    ref = "chooseFileForm"
                    :rules = "chooseFolderRules"
                >
                    <a-form-item label="文件标题">
                        <a-input v-model:value="chooseFile.title"/>
                    </a-form-item>
                    
                    <a-form-item label="放置文件夹">
                        <a-select v-model:value="chooseFile.docstore_id">
                            <a-select-option
                                v-for="item in data.folders"
                                :value = "item.id"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                    <a-form-item label="文件描述">
                        <a-input v-model:value="chooseFile.description"/>
                    </a-form-item>

                    <a-form-item label="作者名">
                        <div 
                            class="authors"
                            v-for="(item, index) in chooseFile.authors" 
                            style="display: flex;margin: 0 0 0.8rem 0;"
                        >
                            <a-input 
                                style="margin-right: 1rem;"
                                v-model:value="chooseFile.authors[index]"
                            />
                            <a-button @click="chooseFile.authors.splice(index,1)"><MinusOutlined /></a-button>
                        </div>

                        <div>
                            <a-button @click="chooseFile.authors.push('')"><PlusOutlined /></a-button>
                        </div>
                    </a-form-item>


                    <a-form-item>
                        <a-button 
                            type="primary" 
                            style="margin-right:2rem"
                            @click="ConfirmFolder"
                        >
                        确认
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>

        </a-modal>
        
    </div></a-spin>
</template>

<script lang="ts" setup>
import { InboxOutlined, PlusOutlined, QuestionCircleOutlined, DownOutlined, UpOutlined, MinusOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { reactive, ref, onMounted } from 'vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { get, post } from './api/index'
import { userInfoRules, chooseFolderRules } from './utils/FormValidate'
import qs from 'qs'
// 数据样式
import type { Data, Visible, DocInfo} from './types'

const spinning = ref<boolean>(false);
const changeSpinning = () => {
      spinning.value = !spinning.value;
};

// 表格样式
const FolderColumns = [
    {
        dataIndex: 'name',
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
const ItemsColumns = [
    {
        dataIndex: 'title',
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
    chooseVisible: false
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
    },
})

const chooseFile = reactive<DocInfo>({
    docstore_id: undefined,
    path: '',
    authors: [],
    title: '',
    description: '',
    abstract: ''
})

const userInfoForm = ref()
const chooseFileForm = ref()

const fileList = ref([])


// 函数

// 登录
const userLogin = () => {
    userInfoForm.value.validate()
        .then(() => {
            post('/paper/login', qs.stringify(data.userInfo)).then(res => {
                if (res.code == 0){
                    message.success('登录成功')
                    visible.userVisible = false
                    get_docs()
                }
                else{
                    message.error('登录失败')
                    visible.userVisible = true
                }
            })
        })
        .catch(() => {
            message.error('登录失败')
            visible.userVisible = true
        })
}

// 获取文档信息
const get_docs = () => {
    return get('/paper/get_docs').then(res => {
        // 需要修改下数据结构 与后端类型对应
        if(res.code == 0){
            data.folders = res.data as any
            data.folders.forEach(folder => {
                if(folder.docs){
                    folder.docs.forEach(doc => {
                        data.items.push(doc)
                    })
                }
            })
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

// 新建论文集
const create_doc_store = () => {
    return post('/paper/create_doc_store', qs.stringify(data.newFolder)).then(res => {
        console.log(res)
        if (res.code == 0){
            message.success('创建成功')
            get_docs()
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

// 删除论文集
const del_doc_store = (id: number) => {
    console.log(id)
    return post('/paper/del_doc_store', qs.stringify({id})).then(res => {
        if (res.code == 0){
            message.success('删除成功')
            get_docs()
        }
        else{
            message.error('删除失败')
        }
    })
}

// 创建论文
const create_doc = (info: DocInfo) => {
    // 匹配最后一个.之前的内容
    console.log(info)
    return post('/paper/create_doc',JSON.stringify(info)).then(res => {
        if (res.code == 0){
            message.success('创建成功')
            return true
        }
        else{
            message.error('创建失败')
            return false
        }
    })
}

// 上传文件
const handleChange = (info: UploadChangeParam) => {
    const status = info.file.status;
    if (status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (status === 'done') {
        let res = info.file.response
        if (res.code == 0){
            message.success(`${info.file.name} file uploaded successfully.`);
            chooseFile.path = res.data.path
            visible.chooseVisible = true
        }
        else{
            message.error(`${info.file.name} file upload failed.`);
        }
    } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }
};

const handleDrop = (e: DragEvent) => {
    console.log(e);
}

const changeItemsDisplay = () => {
    let table = <HTMLImageElement>document.querySelector('.items .ant-table-tbody')
    if(data.flag)
        table.style.display = ''
    else
        table.style.display = 'none'
    data.flag = !data.flag
}

const ConfirmFolder = () => {
    console.log(chooseFile)
    chooseFileForm.value.validate()
    .then(async () => {
        visible.chooseVisible = false
        changeSpinning()
        await create_doc(chooseFile)
        changeSpinning()
        get_docs()
    })

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
