
# 七牛上传说明
## 命令行工具qshell
[qshell文档](https://developer.qiniu.com/kodo/tools/1302/qshell)

先从上面下载七牛qshell， 将qshell配置到环境变量，配置密钥，`qshell account ak sk name`，ak是AccessKey，sk是SecretKey， 然后切换到此目录下，执行`qshell qupload upload.conf`上传。

## 其他命令
    qshell listbucket skymusic -o all.txt //列出所有文件
    qshell batchdelete --force skymusic -i all.txt //根据all.txt删除文件