import os
import glob
import shutil
import numpy as np
import cv2 as cv
import math
import anim.EntityImageScale as EntityImageScale
import anim.EntityAnimGap as EntityAnimGap
import anim.EntityCopy as EntityCopy
import anim.EntityAnim as EntityAnim
import anim.EntityPrefab as EntityPrefab

if __name__ == '__main__':
    distFold = R"E:\project\projectLB\Lb-Tools\mapParse\AnimDist"
    aniFold = R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\assets\bundle\Anim"
    # aniFold = R"E:\project\projectLB\FightDemo249\assets\bundle\Ani"
    # item = R""
    item = R"\ChuXinYun"
    # R"\ChuZhaoYun", R"\LiuRuYue", R"\XiaoYuLan", R"\XiaoJian", R"\YinYue", R"\MainJian",
    # R"\TaoWu", R"\TaoTie", R"\QiongQi", R"\HunDun", R"\ShenManJun",
    # R"\XuanYuanZhanTian", R"\WenRou", R"\XiaoHong", R"\XiaXiYan", R"\WanShan",
    # R"\WanFen", R"\ShuXiaoXiao", R"\SongQianHe", R"\SiMaLingXuan", R"\ShaoYang",
    # R"\MuChenXue", R"\LiuSuiFeng", R"\LenLiuSu", R"\JiangMuHeng", R"\JiangZiMo",
    # R"\FengFeiXue", R"\DingFengChou", R"\BaiLiXi", R"\BaiZhan", R"\BaiQi",

    imageScale = EntityImageScale.EntityImageScale()
    uiBaseDir = R"E:\project\projectLB\Lb-Tools\mapParse\AnimSource" + item
    distItem = distFold + item
    # 删除对应的目录
    EntityImageScale.EntityImageScale.rm_dir(distItem)
    imageScale.sub_file(uiBaseDir, distItem)


    imageGap = EntityAnimGap.EntityAnimGap()
    if item != "":
        imageGap.read_item_sub(distItem)
    else:
        imageGap.read_item(distItem)

    # imageCopy = EntityCopy.EntityCopy()
    # if item != "":
    #     imageCopy.copy_dir2(distFold + item, aniFold + item)
    # else:
    #     imageCopy.copy_dir(distFold, aniFold)

    # imageAnim = EntityAnim.EntityAnim()
    # imageAnim.load_str(os.getcwd() + R"/anim/")
    # if item != "":
    #     imageAnim.read_item_sub(aniFold + item, aniFold + item)
    # else:
    #     imageAnim.read_item(aniFold, aniFold)

    # imagePrefab = EntityPrefab.EntityPrefab()
    # imagePrefab.load_str(os.getcwd()+R"/anim/")
    # if item != "":
    #     imagePrefab.read_item_sub(aniFold+item)
    # else :
    #     imagePrefab.read_item(aniFold, aniFold)

    exit()
