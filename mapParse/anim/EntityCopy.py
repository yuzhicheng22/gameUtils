import glob
import os
import os.path
import shutil


class EntityCopy:

    @staticmethod
    def check_png(file_name):
        if os.path.exists(file_name) and os.path.isfile(file_name):
            if ".png" == os.path.splitext(file_name)[1]:
                return True
        return False

    @staticmethod
    def create_dir(dir_name):
        if os.path.exists(dir_name):
            return
        os.makedirs(dir_name)

    def start(self, reset_mame, copy_name):
        index = 0
        self.create_dir(copy_name)
        shutil.rmtree(copy_name)
        self.copy_dir(reset_mame, copy_name)

    def copy_dir(self, dir_name, to_dir_name):
        for infile in glob.glob(dir_name + "/*"):
            if os.path.isdir(infile):
                self.copy_dir2(infile, to_dir_name + R"/" + os.path.basename(infile))

    def copy_dir2(self, dir_name, to_dir_name):
        for infile in glob.glob(dir_name + "/*"):
            if os.path.isdir(infile):
                print(infile)
                self.copy_image(infile, to_dir_name + R"/" + os.path.basename(infile))

    def copy_image(self, dir_name, to_dir_name):  # 修改方向
        self.create_dir(to_dir_name)
        # index = 1
        for infile in glob.glob(dir_name + "/*.png"):
            # print(infile)
            shutil.copyfile(infile, to_dir_name + R"/" + os.path.basename(infile))
            # print(to_dir_name + "\\" + str(index) + ".png")
            # index += 1


if __name__ == '__main__':
    copy = EntityCopy()
    # copy.copy_dir(R"E:\project\projectLB\Lb-Tools\mapParse\AnimSource",
    #                 R"E:\project\projectLB\Lb-Tools\mapParse\AnimDist")

    # copy.copy_dir2(R"E:\project\projectLB\Lb-Tools\mapParse\AnimDist\W101",
    #                 R"E:\project\projectLB\FightDemo249\assets\bundle\Ani\W101")
    exit()
