import glob
import os
import os.path
import shutil
import json

#
#
#
from anim.EntityCopy import EntityCopy


class EntityAnimGap:

    def start(self, reset_mame, copy_name):
        index = 0
        EntityCopy.create_dir(copy_name)
        shutil.rmtree(copy_name)
        self.read_dir(reset_mame, copy_name)

    def read_dir(self, dir_name, to_dir_name):
        pass

    def read_item(self, reset_mame):
        for infile in glob.glob(reset_mame + "/*"):
            if not os.path.isdir(infile):
                continue
            self.read_item_sub(infile)

    def read_item_sub(self, reset_mame):
        for infile in glob.glob(reset_mame + "/*"):
            if not os.path.isdir(infile):
                continue
            self.read_item_sub2(infile)

    def read_item_sub2(self, reset_mame):
        png_list = glob.glob(reset_mame + "/*.png")
        for index in range(1, len(png_list) - 1, 2):
            print(png_list[index])
            os.remove(png_list[index])


if __name__ == '__main__':
    # anim = EntityAnimGap()
    # anim.read_item_sub(R"E:\project\projectLB\Lb-Tools\mapParse\AnimDist\W101")

    exit()
