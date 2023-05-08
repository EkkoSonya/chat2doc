export const userInfoRules = {
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur'},
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur'},
    ]
}

export const chooseFolderRules = {
    title : [
        { required: true, message: '请输入文档标题', trigger: 'blur'}
    ],
    docstore_id : [
        { required: true, message: '请选择文档所放入的文件夹', trigger: 'blur' }
    ],
}