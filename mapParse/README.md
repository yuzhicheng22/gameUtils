# 序列帧
## 环境
1. 确保依赖库的正确安装
2. 安装TexturePcakerUI命令行工具，并添加到环境变量中，确保可以正常使用`TexturePacker`

### 1. UIImageRaname.py

对文件进行规范重命名
**`item`需要设置为目标序列帧文件夹名（大部分情况下为中文）**  
设置对应文件夹的正确路径  
`distFold` = R"C:\Users\dev\Desktop\demo\所有序列帧"  
`aniFold`为`AnimSource`对应路径，执行后会生成整理好的`AnimSource`文件夹  

### 2. UIImageParse.py

**正确设置`item`为`AnimSource`下目标文件夹名**  
`distFold`为`AnimDist`目标生成文件路径  
设置`uiBaseDir`为`AnimSource`的路径后，对`AnimSource`中的序列帧图片进行压缩  
并生成压缩后的序列帧图片在`AnimDist`中  

### 3. UIImagePlist.py

设置`distFold`为对应`AnimDist`的文件路径  
设置`item_list`为正确的角色名，例如`item_list = [R"\ShenManJun"]`  
分别设置`genStep`变量为1,2,3执行步骤  
步骤1：  
生成序列帧动画plist文件  
步骤2：  
生成动画文件  
步骤3：  
生成CocosCreator中需要使用的Prefab。  
PS：需要确保引用到上面生成的Prefab的Prefab中对序列帧动画有正确的引用关系，手动设置  