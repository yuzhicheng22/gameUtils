import os
import glob
import shutil
import numpy as np
import cv2 as cv
import math
import anim.EntityImageScale as EntityImageScale
import anim.EntityPngQuant as EntityPngQuant

if __name__ == '__main__':
    distFold = R"E:\project\projectLB\Lb-Tools\mapParse\TestData"
    # aniFold = R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\assets\bundle\Anim"
    # # aniFold = R"E:\project\projectLB\FightDemo249\assets\bundle\Ani"
    # # item = R""
    # item = R"\ZiLeiJue"
    # imageScale = EntityImageScale.EntityImageScale()
    # uiBaseDir = R"D:\Documents\WeChat Files\wang267036\FileStorage\File\2024-03\紫雷诀"
    # imageScale.sub_file(uiBaseDir, distFold + item, 0.35)
    # exit()
    #
    # imageGap = EntityAnimGap.EntityAnimGap()
    # imageGap = imageGap.read_item(distFold)
    # # imageGap = imageGap.read_item_sub(distFold + R"\M004")
    # # imageGap = imageGap.read_item_sub2(distFold + R"\M004\die")
    #
    # imageCopy = EntityCopy.EntityCopy()
    # # item = "
    # # imageCopy.copy_dir2(R"E:\project\projectLB\Lb-Tools\mapParse\AnimDist"+item,
    # #                     R"E:\project\projectLB\FightDemo249\assets\bundle\Ani"+item)
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

    imageQuant = EntityPngQuant.EntityPngQuant()
    # imageQuant.start_dir(R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\build\web-mobile\assets\Anim")
    # dir = R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\assets\bundle\Sprite\HeroLar"
    # dir = R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\build\web-mobile\assets\Anim"
    # dir = R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\build\web-mobile\assets\MonsterLar"
    # dir = R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\build\web-mobile\assets\MonsterMid"
    # dir = R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\build\web-mobile\assets\HeroLar"
    # dir = R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\build\web-mobile\assets\HeroMid"
    list1 = ['HeroLar','HeroCould']
    for dir in list1:
        imageQuant.start_dir(R"E:\project\projectLB\Tjp-LB-Fight\Tjp-Lb-Client\assets\bundle\Sprite" + "\\" + dir,
                             os.getcwd() + R"\anim\pngquant\pngquant.exe")
    # list1 = ['Anim']
    # for dir in list1:
    #     imageQuant.start_dir(R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\build\web-mobile\assets" + "\\" + dir,
    #                          os.getcwd() + R"\anim\pngquant\pngquant.exe")
    # imageQuant.start_dir(os.getcwd() +R"\AnimDist1", os.getcwd() + R"\anim\pngquant\pngquant.exe")
    # imageQuant.start_dir(R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\temp\TexturePacker\preview\assets\bundle\Anim\BaoEr\AutoAtlas.pac" ,os.getcwd() +  R"\anim\pngquant\pngquant.exe")
    # imagePrefab.load_str(os.getcwd()+R"/anim/")
    # if item != "":
    #     imagePrefab.read_item_sub(aniFold+item)
    # else :
    #     imagePrefab.read_item(aniFold, aniFold)

    exit()
