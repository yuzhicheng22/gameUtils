import os
import anim.EntityAnimRename as EntityAnimRename

if __name__ == '__main__':

    distFold = R"F:\afk_ui\模型"
    aniFold = R"F:\self\gameUtils\mapParse\AnimSource"
    imageQuant = EntityAnimRename.EntityAnimRename()
    # item = ""
    # 白起序列图
    item = "小白序列帧"
    
    if item == "":
        imageQuant.rename_dir(distFold, aniFold)
    else:
        new_item = imageQuant.rename_dir_get(item)
        imageQuant.rename_dir2(distFold + "\\" + item, aniFold + "\\" + new_item)

    exit()
