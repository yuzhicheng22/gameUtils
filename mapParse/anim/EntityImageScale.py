import subprocess
from os import path
import os
import glob
import shutil
import numpy as np
import cv2 as cv
import math


class EntityImageScale:

    @staticmethod
    def create_dir(dir_name):
        if os.path.exists(dir_name):
            return
        os.makedirs(dir_name)

    @staticmethod
    def check_file_sub(file_name, index):
        file_name1 = file_name + R"/" + str(index)
        return os.path.exists(file_name1) and os.path.isdir(file_name1)

    @staticmethod
    def check_file(file_name):
        return EntityImageScale.check_file_sub(file_name, 90)

    @staticmethod
    def check_png(file_name):
        if os.path.exists(file_name) and os.path.isfile(file_name):
            if ".png" == os.path.splitext(file_name)[1]:
                return True
        return False

    @staticmethod
    def rm_dir(dir_name):
        if os.path.isdir(dir_name):
            shutil.rmtree(dir_name)


    def scale_png(self, file_name, to_file, scale_value):
        img = cv.imdecode(np.fromfile(file_name, dtype=np.uint8), -1)
        # img = cv.imdecode(np.fromfile(file_name, dtype=np.uint8), cv.IMREAD_COLOR)
        # 缩放图像，后面的其他程序都是在这一行上改动
        size = img.shape

        # w = size[1]  # 宽度
        # h = size[0]  # 高度
        print(file_name, math.ceil(size[0] * scale_value))
        dst = cv.resize(img, (0, 0), None, scale_value, scale_value, cv.INTER_AREA)
        # dst = cv.resize(img, (int(math.ceil(size[1] * scale_value)), int(math.ceil(size[0] * scale_value))))
        cv.imwrite(to_file, dst)
        # if os.path.exists(file_name) and os.path.isfile(file_name):
        #     if ".png" == os.path.splitext(file_name)[1]:
        #         return True
        # return False

    def check_file_parent(self, file_name):
        for infile in glob.glob(file_name + R"/*"):
            return EntityImageScale.check_file(infile)
        # return check_file_sub(file_name, 90) or check_file_sub(file_name, 270)

    def sub_file(self, reset_name_sub, copy_name,scale_value=0.5):
        # entity_copy = EntityCopy()
        # reset_name1 = ""
        # print(reset_name_sub)
        # scale_value = 0.5
        # self.rm_dir(copy_name)
        for infile_sub in glob.glob(reset_name_sub + "/*"):
            copy_name1 = copy_name + R"/" + os.path.basename(infile_sub)
            if os.path.isdir(infile_sub):
                self.create_dir(copy_name1)
                self.sub_file(infile_sub, copy_name1)
            elif self.check_png(infile_sub):
                self.scale_png(infile_sub, copy_name1, scale_value)

    # @staticmethod
    # def start(res_mame, target_name):
    #     action_name = path.basename(res_mame)
    #     parent_name = path.dirname(res_mame)
    #     # print(parent_name)
    #     # return
    #     subprocess.run("TexturePacker " + parent_name +
    #                    " --format cocos2d-x --data " + target_name + "\\" + action_name +
    #                    ".plist --sheet " + action_name + ".png --texture-format png --opt RGBA8888 --png-opt-level 0")


if __name__ == '__main__':
    imageScale = EntityImageScale()
    uiBaseDir = R"E:\project\projectLB\Lb-Tools\mapParse\AnimSource"
    imageScale.sub_file(uiBaseDir, R"E:\project\projectLB\Lb-Tools\mapParse\AnimDist")



    exit()
