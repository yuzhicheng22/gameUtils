import os
import anim.EntityAnimRename as EntityAnimRename

if __name__ == '__main__':

    distFold = R"E:\project\projectLB\Lb-Tools\mapParse\所有序列帧"
    aniFold = R"E:\project\projectLB\Lb-Tools\mapParse\AnimSource"
    imageQuant = EntityAnimRename.EntityAnimRename()
    # item = ""
    # 白起序列图
    item = "w010"
    if item == "":
        imageQuant.rename_dir(distFold, aniFold)
    else:
        new_item = imageQuant.rename_dir_get(item)
        imageQuant.rename_dir2(distFold + "\\" + item, aniFold + "\\" + new_item)

    exit()
