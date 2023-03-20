---
nav:
  title: 博客
  order: 2
group:
  title: GIT
  order: 2
title: 常用git命令
description: 常用git命令
order: 1
---
### 1.查看、添加、提交、删除、找回，重置修改文件
`git help` <command> # 显示command的help
`git show` # 显示某次提交的内容 git show $id
`git add <file>` # 将工作文件修改提交到本地暂存区
`git add .` # 将所有修改过的工作文件提交暂存区
`git reset <file>` # 从暂存区恢复到工作文件
`git reset -- .` # 从暂存区恢复到工作文件
`git reset --hard` # 恢复最近一次提交过的状态，即放弃上次提交后的所有本次修改
`git reset --hard commitId`  # 恢复到置顶commitId
`git revert <$id>` # 恢复某次提交的状态，恢复动作本身也创建次提交对象
`git revert HEAD` # 恢复最后一次提交的状态

### 2.查看文件diff
`git diff <file>` # 比较当前文件和暂存区文件差异 git diff
`git diff <id1><id2>` # 比较两次提交之间的差异
`git diff <branch1>..<branch2>` # 在两个分支之间比较
`git diff --staged` # 比较暂存区和版本库差异
`git diff --cached` # 比较暂存区和版本库差异
`git diff --stat` # 仅仅比较统计信息


### 3.本地分支管理
`git branch -r` # 查看远程分支
`git branch -a` # 查看全部分支
`git branch <new_branch>` # 创建新的分支
`git checkout <branch> `# 切换到某个分支
`git checkout -b <new_branch>` # 创建新的分支，并且切换过去
`git checkout <commitId> -b <分支名字>` # 切换到某个commit 并新建分支
`git branch -d <branch>` # 删除某个本地分支
`git branch -D <branch>` # 强制删除某个本地分支 (未被合并的分支被删除的时候需要强制)
`git fetch -p` # 清理本地无效分支(远程已删除本地没删除的分支)
`git branch | grep 'branchName'`  # 如果分支太多，还可以用此命令进行分支模糊查找


### 4.Git暂存管理
`git stash save 'save mesage'` # 执行存储时，添加备注，方便查找，只有git stash 也要可以的，但查找时不方便识别
`git stash list` # 列所有stash
`git stash show` # 显示做了哪些改动，默认show第一个存储,如果要显示其他存贮，后面加`stash@{$num}`，比如第二个 `git stash show stash@{1}`
`git stash show -p` # 显示第一个存储的改动，如果想显示其他存存储，命令：`git stash show  stash@{$num}  -p` ，比如第二个：`git stash show  stash@{1}  -p`
`git stash apply` # 应用某个存储,但不会把存储从存储列表中删除，默认使用第一个存储,即 `stash@{0}`，如果要使用其他，`git stash apply stash@{$num}` ， 比如第二个：`git stash apply stash@{1} `
`git stash pop ` # 命令恢复之前缓存的工作目录，将缓存堆栈中的对应stash删除，并将对应修改应用到当前的工作目录下,默认为第一个stash,即`stash@{0}`，如果要应用并删除其他stash，命令：`git stash pop stash@{$num} `，比如应用并删除第二个：`git stash pop stash@{1}`
`git stash drop stash@{$num}` # 丢弃stash@{$num}存储，从列表中删除这个存储
`git stash clear ` # 删除所有缓存的stash

### 5.远程分支管理
`git pull` # 抓取远程仓库所有分支更新并合并到本地
git pull --no-ff # 抓取远程仓库所有分支更新并合并到本地，不要快进合并
`git fetch origin` # 抓取远程仓库更新
`git merge origin/master` # 将远程主分支合并到本地当前分支
`git push` # push所有分支
`git push origin master` # 将本地主分支推到远程主分支
`git push -u origin master` # 将本地主分支推到远程(如无远程主分支则创建，用于初始化远程仓库)
`git push origin <local_branch>` # 创建远程分支， origin是远程仓库名
`git push origin --delete <remote_branch>` 删除远程分支
`git push origin <local_branch>:<remote_branch>` # 通过本地分支创建新的远程分支
`git push origin :<remote_branch>` # 先删除本地分支(git br -d <branch>)，然后再push删除远程分支

### 6.远程仓库管理
`git remote -v` # 查看远程服务器地址和仓库名称
`git remote show origin` # 查看远程服务器仓库状态
`git remote add origin <repository>` # 添加远程仓库地址
`git remote rm <repository>` # 删除远程仓库
`git remote set-url origin <repository>` # 设置远程仓库地址(用于修改远程仓库地址) 


### 7.tag 管理
`git tag` # 查询本地所有tag
`git tag <标签名> `# 本地新增无备注的（默认在当前分支最后一个commit上添加tag)
`git tag -a <标签名> -m <“备注内容”> ` # 本地新增有备注的tag（默认在当前分支最后一个commit上添加tag）
`git tag <标签名> <commitId>` # 在指定commit上新增tag
`git push origin <标签名> `# 将tag推送到远程分支
`git tag -d <标签名>` # 删除本地分支标签
`git push origin :refs/tags/<标签名>` # 删除远程分支标签

### 8.具体情况下操作

1. 修改本地分支名称：
`git branch -m feat-业务指标 feat-业务指标33`

2. 取消add的内容
`git reset --mixed`

3. 删除本地没有add 的文件
`git clean` 参数
具体：
`git clean -n`     # 显示将要删除的文件和目录
`git clean -f`     # 删除文件
`git clean -df`    # 删除文件和目录

4. 丢弃工作区的改动
`git restore <文件 path>` 



5. git 同步远程已删除的分支
`git branch -a`
`git remote show origin`
`git remote prune origin`

6. 更改commit 提交信息
(1).`git commit --amend` 移到最上面commit 信息处
(2).按 i，在#的最上方删掉错误的描述，然后重新输入注释。
(3).按 __Esc__ 退出编辑模式，按 :wq 键， 保存并退出即可。

7. git 更换远端仓库
`git remote`
`git remote -v` # 查看远端仓库
`git remote rm origin ` # 移除当前仓库地址
`git remote add origin git@github.com:animasling/create-artemis.git` # 添加仓库
`git branch -M main`
`git push -u origin main`


在当前项目中，早先创建并已经push到远程的文件及文件夹，将名称大小写更改后，git无法检测出更改。出现这种情况的原因是，git默认配置为忽略大小写，因此无法正确检测大小写的更改。那么，解决办法是，在当前项目中，运行git config core.ignorecase false，关闭git忽略大小写配置，即可检测到大小写名称更改.
