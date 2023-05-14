<template>
    <a-spin :spinning="spinning" style="z-index: 9999;" size="large">
        <div id="app">
            <div class="contain">
                <!-- 用户信息 -->
                <div class="user_info">
                    <div v-if="data.user.isLogin">
                        <span>用户名: {{ data.user.name }}</span>
                        <a-button type="link" @click="userLogout">退出</a-button>
                    </div>
                    <div v-else>
                        <a-button type="link" @click="visible.user = true">登录</a-button>
                    </div>
                </div>
                <div class="title">
                    <h1>
                        Chat2doc
                    </h1>
                </div>
                <!-- 用户文件上传入口 -->
                <div class="load" style="margin-top:0px">
                    <a-card class="card" >
                        
                        <div class="upload" @click="visible.choose = true;">
                            <p class="icon">
                                <inbox-outlined></inbox-outlined>
                            </p>
                            <p class="text">
                                点击开始进行上传文件
                            </p>
                            <p class="hint">
                                支持.pdf & .docx 文件
                            </p>
                        </div>

                        <a-upload-dragger 
                            style="display: none;"
                            ref = "upload"
                            v-model:fileList="fileList" 
                            name="paper_file" 
                            :multiple="false"
                            :withCredentials="true" 
                            action="http://localhost:8000/chat2doc/paper/upload_doc" 
                            :headers="{
                                'X-Requested-With': null
                            }" 
                            @change="handleChange" 
                            @drop="handleDrop"
                        >
                        </a-upload-dragger>
                    </a-card>
                </div>

                <!-- 用户上传文件列表 -->
                <div class="list">
                    <a-card class="card">
                        <div class="folder">
                            <a-button @click="visible.folder = true" style="margin-right:50px">
                                <PlusOutlined />
                                新建文件夹
                            </a-button>
                            <a-button @click="visible.choose = true;">
                                <PlusOutlined />
                                上传文件
                            </a-button>
                            <a-table 
                                size="small" 
                                :pagination="{ disabled: true, hideOnSinglePage: true }"
                                :columns="FolderColumns" 
                                :data-source="data.folders"
                                :expandRowByClick = "true"
                                style="margin-top: 10px;"
                            >
                                <template #expandedRowRender="{ record }">
                                    <a-table 
                                        size="small" :pagination="{ disabled: true, hideOnSinglePage: true }"
                                        :columns="ItemsColumns" 
                                        :data-source="record.docs"
                                        :showHeader="false"
                                        v-if="record.docs.length"
                                    >
                                        <template #operation="{ record, index }">
                                            <a-spin :spinning=" record.id == undefined">
                                                <span>
                                                    <a @click="put_question(record)">提问</a>
                                                    <a-divider type="vertical" />
                                                    <a @click="del_doc(record.id)">删除</a>
                                                    <a-divider type="vertical" />
                                                    <a @click="visible.modify[0] = true;modify.doc = {
                                                        id: record.id,
                                                        title: record.title,
                                                        description: record.description,
                                                        authors: record.authors.split(','),
                                                        abstract: record.abstract,
                                                    }">修改</a> 
                                                </span>
                                            </a-spin>
                                        </template>
                                    </a-table>
                                </template>
                                <template #name>
                                    <span>
                                        文件夹
                                        <QuestionCircleOutlined />
                                    </span>
                                </template>
                                <template #operation="{ record }">
                                    <span>
                                        <a @click="put_question_folder(record);">提问</a>
                                        <a-divider type="vertical" />
                                        <a @click="del_doc_store(record.id)">删除</a>
                                        <a-divider type="vertical" />
                                        <a @click="visible.choose = true; chooseFile.docstore_id = record.id;">上传</a>
                                        <a-divider type="vertical" />
                                        <a @click="visible.modify[1] = true;modify.doc_store = {
                                            id: record.id,
                                            name: record.name,
                                            description: record.description,
                                        }">修改</a>
                                    </span>
                                </template>
                            </a-table>
                        </div>
                    </a-card>
                </div>
            </div>

            <!-- 用户登录 -->
            <a-modal :visible="visible.user" width="400px" :closable=false :footer="null">
                <div class="title" style="text-align: center;margin-bottom: 30px;">
                    <h2>
                        登录
                    </h2>
                </div>
                <div class="form">
                    <a-form ref="userInfoForm" :model="data.userInfo" :rules="userInfoRules" labelAlign="left">
                        <a-form-item label="用户" :required="true" prop="name">
                            <a-input v-model:value="data.userInfo.name" />
                        </a-form-item>
                        <a-form-item label="密码" :required="true" prop="password" style="padding-top: 10px;">
                            <a-input-password v-model:value="data.userInfo.password" />
                        </a-form-item>
                        <a-form-item>
                            <div class="flexCenter">
                                <a-button type="primary" style="margin-right:2rem" @click="userLogin" @enter="userLogin">登录</a-button>
                                <a-button type="primary">注册</a-button>
                            </div>
                        </a-form-item>
                    </a-form>
                </div>
            </a-modal>

            <!-- 新建文件夹信息 -->
            <a-modal 
                :visible="visible.folder" 
                width="400px" 
                :footer="null"
                @cancel="visible.folder = false;data.newFolder.name = '';data.newFolder.description = ''"    
            >
                <div class="title" style="text-align: center;margin-bottom: 30px;">
                    <h2>
                        新建文件夹
                    </h2>
                </div>

                <div class="form">
                    <a-form :model="data.newFolder" labelAlign="left" layout="vertical">
                        <a-form-item label="文件夹名称">
                            <a-input v-model:value="data.newFolder.name" />
                        </a-form-item>
                        <a-form-item label="描述信息">
                            <a-input v-model:value="data.newFolder.description" />
                        </a-form-item>
                        <a-form-item>
                            <div class="flexCenter">
                                <a-button type="primary" @click="create_doc_store">
                                    创建文件夹
                                </a-button>
                            </div>
                        </a-form-item>
                    </a-form>
                </div>
            </a-modal>


            <!-- 上传文件后选择所放置的文件夹 -->
            <a-modal 
                :visible="visible.choose" 
                width="400px" 
                :footer="null"
                @cancel="visible.choose = false;
                Object.assign(chooseFile,{
                    docstore_id: undefined,
                    path: '',
                    authors: [],
                    title: '',
                    description: '',
                    abstract: ''
                })"    
            >
                <div class="title" style="text-align: center;margin-bottom: 30px;">
                    <h2>
                        上传文件相关信息
                    </h2>
                </div>

                <div class="form">
                    <a-form :model="chooseFile" layout="vertical" ref="chooseFileForm" :rules="chooseFolderRules">
                        <a-form-item label="文件标题">
                            <a-input v-model:value="chooseFile.title" />
                        </a-form-item>

                        <a-form-item label="放置文件夹">
                            <a-select v-model:value="chooseFile.docstore_id">
                                <a-select-option v-for="item in data.folders" :value="item.id">
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>

                        <a-form-item label="文件描述">
                            <a-input v-model:value="chooseFile.description" />
                        </a-form-item>

                        <a-form-item label="作者名">
                            <div 
                                class="authors" 
                                v-for="( item, index ) in chooseFile.authors"
                                style="display: flex;
                                margin: 0 0 0.8rem 0;"
                            >
                                <a-input style="margin-right: 1rem;" v-model:value="chooseFile.authors[index]" />
                                <a-button @click="chooseFile.authors.splice(index, 1)">
                                    <MinusOutlined />
                                </a-button>
                            </div>

                            <div>
                                <a-button @click="chooseFile.authors.push('')">
                                    <PlusOutlined />
                                </a-button>
                            </div>
                        </a-form-item>

                        <a-form-item>
                            <a-button type="primary" style="margin-right:2rem" @click="ConfirmFolder">
                                确认
                            </a-button>
                        </a-form-item>
                    </a-form>
                </div>

            </a-modal>

            <!-- 对话框 -->
            <a-modal 
                v-model:visible="visible.chat" 
                :centered="true" 
                width="800px"
                @cancel="visible.chat = false;data.chatInfo = {
                    name: '',
                    id: undefined,
                    query: '',
                    history: [],
                    docs: undefined
                }"
                :bodyStyle="{
                    padding: '0 0 0 1rem',
                    height: '600px'
                }"
            >
                
                <div class="dialog" style="height: calc(100vh - 164px);">
                    <el-scrollbar ref="scrollbarRef">
                        <div ref="scrollInnerRef">
                            <div v-if="data.chatInfo.docs" style="margin-top: 0.4rem">
                                同时对下列文件进行提问:
                                <div class="docs">
                                    <div v-for=" item  in  data.chatInfo.docs " :key="item.id">
                                        <FileTextOutlined />{{ ' ' + item.title }}
                                    </div>
                                </div> 
                            </div>
                        
                            <div class="chat-message-row" v-for=" item in data.chatInfo.history ">
                                <div class="chat-message" :class="item.role">
                                    <a-spin :spinning="!item.text">
                                        {{ item.text }}
                                    </a-spin>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>

                <template #title>
                    <span style="font-weight: 700;">
                        {{ '对 AI 提问 ' + '> '}}
                        <FolderOutlined v-if="data.chatInfo.docs"/>
                        <FileTextOutlined v-else/>
                        {{ data.chatInfo.name }}
                    </span>
                </template>

                <template #footer>
                    <a-input-search v-model:value="data.chatInfo.query" placeholder="请输入您的问题" size="middle"
                        @search="sendQuery">
                        <template #enterButton>
                            <a-button>
                                <SendOutlined />
                            </a-button>
                        </template>
                    </a-input-search>
                </template>
            </a-modal>
        
            <!-- 论文修改 -->
            <a-modal 
                v-model:visible="visible.modify[0]" 
                :centered="true" 
                width="400px"
                @cancel="visible.modify[0] = false;modify.doc = {
                    title: '',
                    id: undefined,
                    abstract: '',
                    authors: [],
                    description: ''
                }"
                :footer="null"
            >
                <div class="title" style="text-align: center;margin-bottom: 30px;">
                    <h2>
                        修改论文信息
                    </h2>
                </div>
                <div class="form">
                    <a-form :model="chooseFile" layout="vertical" ref="chooseFileForm" :rules="chooseFolderRules">
                        <a-form-item label="文件标题">
                            <a-input v-model:value="modify.doc.title" />
                        </a-form-item>

                        <a-form-item label="文件描述">
                            <a-input v-model:value="modify.doc.description" />
                        </a-form-item>

                        <a-form-item label="作者名">
                            <div 
                                class="authors" 
                                v-for="( item, index ) in modify.doc.authors"
                                style="display: flex;
                                margin: 0 0 0.8rem 0;"
                            >
                                <a-input style="margin-right: 1rem;" v-model:value="modify.doc.authors[index]" />
                                <a-button @click="modify.doc.authors.splice(index, 1)">
                                    <MinusOutlined />
                                </a-button>
                            </div>

                            <div>
                                <a-button @click="modify.doc.authors.push('')">
                                    <PlusOutlined />
                                </a-button>
                            </div>
                        </a-form-item>

                        <a-form-item>
                            <a-button type="primary" style="margin-right:2rem" @click="ModifyDoc">
                                确认
                            </a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </a-modal>

            <a-modal 
                v-model:visible="visible.modify[1]" 
                :centered="true" 
                width="400px"
                @cancel="visible.modify[1] = false;modify.doc_store = {
                    id: undefined,
                    name: '',
                    description: ''
                }"
                :footer="null"
            >
                <div class="title" style="text-align: center;margin-bottom: 30px;">
                    <h2>
                        修改论文集信息
                    </h2>
                </div>
                <div class="form">
                    <a-form :model="chooseFile" layout="vertical" ref="chooseFileForm" :rules="chooseFolderRules">
                        <a-form-item label="论文集标题">
                            <a-input v-model:value="modify.doc_store.name" />
                        </a-form-item>

                        <a-form-item label="论文集描述">
                            <a-input v-model:value="modify.doc_store.description" />
                        </a-form-item>

                        <a-form-item>
                            <a-button type="primary" style="margin-right:2rem" @click="ModifyDocStore">
                                确认
                            </a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </a-modal>
        </div>
    </a-spin>
</template>

<script lang="ts" setup>
import { InboxOutlined, PlusOutlined, QuestionCircleOutlined, DownOutlined, UpOutlined, MinusOutlined, SendOutlined, FolderOutlined, FileTextOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { reactive, ref, onMounted } from 'vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { get, post } from './api/index'
import { userInfoRules, chooseFolderRules } from './utils/FormValidate'
import qs from 'qs'

// 数据样式
import type { Data, Visible, DocInfo, ChatInfo, Item, ModifyInfo, NewFolder } from './types'

message.config({
    duration: 1
})

const spinning = ref<boolean>(false);
const changeSpinning = () => {
    spinning.value = !spinning.value;
};

// 绑定Uplaod组件，用于上传文件
const upload = ref()
// const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
// const scrollInnerRef = ref<HTMLDivElement>()

// 表格样式
const FolderColumns = [
    {
        dataIndex: 'name',
        slots: { title: 'name' },
    },
    {
        dataIndex: 'operation',
        key: 'operation',
        title: '操作',
        slots: { customRender: 'operation' },
        align: 'center',
        width: 200,
        customHeaderCell: () => ({
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
        slots: { title: 'name' },
    },
    {
        dataIndex: 'operation',
        key: 'operation',
        title: '操作',
        slots: { customRender: 'operation' },
        align: 'center',
        width: 200,
        customHeaderCell: () => ({
            style: {
                textAlign: 'center'
            }
        })
    }
]

const visible = reactive<Visible>({
    user: false,
    folder: false,
    choose: false,
    chat: false,
    modify: [false, false]
})

const data = reactive<Data>({
    userInfo: {
        name: '',
        password: ''
    },
    user: {
        name: '',
        first_name: '',
        last_name: '',
        email: '',
        isLogin: false
    },
    folders: [],
    items: [],
    flag: true,
    newFolder: {
        name: '',
        description: ''
    },
    uploadFiles: [],
    chatInfo: {
        name: '',
        id: undefined,
        query: '',
        history: [],
        docs: undefined
    }
})

const chooseFile = reactive<DocInfo>({
    docstore_id: undefined,
    path: '',
    authors: [],
    title: '',
    description: '',
    abstract: ''
})

const modify = reactive<ModifyInfo>({
    doc_store: {
        name:'',
        description:'',
        id:undefined
    },
    doc: {
        id:undefined,
        title:'',
        authors:[],
        description:"",
        abstract:""
    }
})

const userInfoForm = ref()
const chooseFileForm = ref()
const fileList = ref([])


// 函数

// 登录
const userLogin = () => {
    userInfoForm.value.validate()
        .then(() => {
            post('/paper/login', qs.stringify(data.userInfo)).then((res: any) => {
                if (res.code == 0) {
                    message.success('登录成功')
                    data.user = {
                        name: res.data.name,
                        first_name: res.data.first_name,
                        last_name: res.data.last_name,
                        email: res.data.email,
                        isLogin: true
                    }
                    visible.user = false
                    data.userInfo = {
                        name: '',
                        password: ''
                    }
                    get_docs()
                }
                else {
                    message.error('登录失败')
                    visible.user = true
                }
            })
        })
        .catch(() => {
            message.error('登录失败')
            visible.user = true
        })
};

// 登出
const userLogout = () => {
    get('/paper/logout').then(res => {
        if (res.code == 0) {
            message.success('登出成功')
            data.user = {
                name: '',
                first_name: '',
                last_name: '',
                email: '',
                isLogin: false
            }
            data.folders = []
            data.items = []
        }
        else {
            message.error('登出失败')
        }
    })
};

// 获取文档信息
const get_docs = () => {
    return get('/paper/get_docs').then(res => {
        // 需要修改下数据结构 与后端类型对应
        if (res.code == 0) {
            data.items = []
            data.folders = res.data as any

            data.folders.forEach(folder => {
                folder.key = folder.id
                if (folder.docs) {
                    folder.docs.forEach(doc => {
                        doc.key = doc.id
                        data.items.push(doc)
                    })
                }
            })
            return true
        }
        else {
            message.error('获取文档信息失败')
            return false
        }
    })
        .catch(err => {
            message.error('获取文档信息失败')
            return false
        })
};

// 新建论文集
const create_doc_store = () => {
    return post('/paper/create_doc_store', qs.stringify(data.newFolder)).then(res => {
        console.log(res)
        if (res.code == 0) {
            message.success('创建成功')
            get_docs()
        }
        else {
            message.error('创建失败')
        }
        data.newFolder = {
            name: '',
            description: ''
        }
        visible.folder = false
    })
};

// 修改论文集
const modify_doc_store = ( doc_store: NewFolder ) => {
    return post('/paper/modify_doc_store', qs.stringify(modify.doc_store)).then(res => {
        console.log(res)
        if (res.code == 0) {
            message.success('修改成功')
            return true
        }
        else {
            message.error('修改失败')
            return false
        }
    })
};

// 删除论文集
const del_doc_store = (id: number) => {
    console.log(id)
    return post('/paper/del_doc_store', qs.stringify({ id })).then(res => {
        if (res.code == 0) {
            message.success('删除成功')
            get_docs()
        }
        else {
            message.error('删除失败')
        }
    })
};

// 创建论文
const create_doc = (info: DocInfo) => {
    // 匹配最后一个.之前的内容
    console.log(info)
    return post('/paper/create_doc', JSON.stringify(info)).then(res => {
        if (res.code == 0) {
            message.success('创建成功')
            return true
        }
        else {
            message.error('创建失败')
            return false
        }
    })
};

// 修改论文
const modify_doc = (info: DocInfo) => {
    return post('/paper/modify_doc', JSON.stringify(modify.doc)).then(res => {
        if (res.code == 0) {
            message.success('修改成功')
            return true
        }
        else {
            message.error('修改失败')
            return false
        }
    })
};

// 上传文件
const handleChange = (info: UploadChangeParam) => {
    const status = info.file.status;
    if (status !== 'uploading') {
        console.log(info.file, info.fileList);
    }
    if (status === 'done') {
        let res = info.file.response
        if (res.code == 0) {
            message.success(`${info.file.name} file uploaded successfully.`);
            chooseFile.path = res.data.path
            let nowFile = <Item>{
                id: undefined,
                key: undefined,
                docstore_id: chooseFile.docstore_id,
                title: chooseFile.title,
            }
 
            data.folders.forEach(folder => {
                if (folder.id == nowFile.docstore_id) {
                    console.log(folder.id,123)
                    folder.docs.push(nowFile)
                    console.log(folder)
                }
            })
        

            create_doc(chooseFile)
            .then(res => {
                if (res) {
                    get_docs()
                }
            })
            .catch(err => {
                message.error('创建失败')
                get_docs()
            })
        }
        else {
            message.error(`${info.file.name} file upload failed.`);
        }
    } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
    }
};

// 获取论文总结
const get_doc_summary = (id: number) => {
    return get('/paper/get_doc_summary', { id }).then((res: any) => {
        if (res.code == 0) {
            return res.data.summary
        }
        else {
            return '获取文档总结失败'
        }
    })
};

// 对论文进行提问
const put_question = async (record: any) => {
    visible.chat = true;
    data.chatInfo.docs = undefined;
    data.chatInfo.id = record.id;
    data.chatInfo.name = record.title;
    let summary = await get_doc_summary(record.id)
    data.chatInfo.history = [
        {
            role: 'assistant',
            text: summary
        }
    ]
}

// 对论文集进行提问
const put_question_folder = async (record: any) => {
    visible.chat = true;
    data.chatInfo.id = record.id;
    data.chatInfo.name = record.name;
    data.chatInfo.docs = record.docs;
    console.log(data.chatInfo)
}

// 论文问答
const get_chat = (info: ChatInfo) => {
    let question
    if(!info.docs){
        question = {
            doc_id: info.id,
            query: info.query
        }
    }
    else {
        question = {
            docstore_id: info.id,
            query: info.query
        }
    }
    data.chatInfo.query = ''
    console.log(question)
    return post('/paper/get_doc_qa', qs.stringify(question)).then(res => {
        if (res.code == 0) {
            return res.data
        }
        else {
            return false
        }
    })
};

const sendQuery = (searchValue: string) => {
    data.chatInfo.query = searchValue
    data.chatInfo.history.push({
        role: 'user',
        text: searchValue
    })
    data.chatInfo.history.push({
        role: 'assistant',
        text: ''
    })

    // scrollbarRef.value!.setScrollTop(scrollInnerRef.value!.clientHeight)
    // console.log(scrollInnerRef.value!.clientHeight)
    get_chat(data.chatInfo).then((res: any) => {
        if (res) {
            console.log(res.answer)
            data.chatInfo.history[data.chatInfo.history.length - 1].text = res.answer
        }
        else {
            data.chatInfo.history[data.chatInfo.history.length - 1].text = '获取问答失败'
        }
    })
};

// 删除论文
const del_doc = (id: number) => {
    return post('/paper/del_doc', qs.stringify({ id })).then(res => {
        if (res.code == 0) {
            message.success('删除成功')
            get_docs()
        }
        else {
            message.error('删除失败')
        }
    })
};

const handleDrop = (e: DragEvent) => {
    console.log(e);
};

const ConfirmFolder = () => {
    upload.value.$el.querySelector('input').click()
    console.log(chooseFile)
    visible.choose = false
    // chooseFileForm.value.validate()
    //     .then(async () => {
    //         visible.choose = false
    //         changeSpinning()
    //         await create_doc(chooseFile)
    //         changeSpinning()
    //         get_docs()
    //     })

};

const ModifyDoc = async () => {
    visible.modify[0] = false
    await modify_doc(modify.doc)
    get_docs()

    modify.doc =  {
        id:undefined,
        title:'',
        authors:[],
        description:"",
        abstract:""
    }
};

const ModifyDocStore = async () => {
    visible.modify[1] = false
    await modify_doc_store(modify.doc_store)
    get_docs()
    
    modify.doc_store = {
        name: '',
        description: '',
        id: undefined
    }
};

onMounted(async () => {
    if (!await get_docs())
        visible.user = true
    
    console.log(import.meta.env)
});
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

        .list,
        .load {
            width: 100%;
            margin-top: 1rem;
            .upload:hover {
                border-color: #1890ff;;
            }
            .upload {
                border: 1px dashed #d9d9d9;
                border-radius: 6px;
                padding: 40px 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                .icon {
                    font-size: 48px;
                    color: #40a9ff;
                    line-height: 0;
                    text-align: center;
                    margin-bottom: 20px;
                }
                .text {
                    margin: 0 0 4px;
                    color: #000000d9;
                    font-size: 1rem;
                }
                .hint {
                    color: #00000073;
                    font-size: 0.8rem;
                }
            }
        }
    }
}

.user_info {
    position: fixed;
    top: 1rem;
    left: 1rem;
}
// :deep(.modalSty .ant-modal-content) {
//     min-width: 1000px;
//     margin: auto;
// }
.dialog { 
    .chat-message-row {
        display: flex;
        flex-direction: column;

        .chat-message {
            text-align: left;
            padding: 10px;
            min-width: 50px;
            max-width: 600px;
            margin-top: 10px;
            margin-bottom: 10px;
            border-radius: 8px;
            font-size: 14px;
            line-height: 1.5;
            white-space: pre-line;
            display: flex;
            justify-content: center;
        }

        .user {
            align-self: flex-end;
            background-color: #0a65ef;
            border: 1px solid #e3e3e3;
            box-shadow: 0 0 3px #d1d2da;
            color: #fff;
            margin-right: 1rem;
        }

        .assistant {
            align-self: flex-start;
            background-color: #f9f9f9;
            border: 1px solid #e3e3e3;
            box-shadow: 0 0 3px #d1d2da;
            color: #000;
        }
    }
}

.ps {
    height: 600px;
}
.flexCenter {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
}

</style>
