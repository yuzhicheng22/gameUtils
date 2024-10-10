import glob
import subprocess
import os


class EntityPngQuant:
    """
        png压缩图片类
    """

    @staticmethod
    def start_pngquant(res_mame, out_path="", process_path=""):
        """
        :param res_mame: 资源名称
        :param out_path:  输出地图 如果为空 覆盖更新
        :param process_path:  处理器的路径
        :return:
        """


        if out_path == "":
            process_str = process_path + "  --force --verbose 256 --ext .png " + res_mame
        else:
            process_str = process_path + "  --force --verbose 256  " + res_mame + "  --output " + out_path
        print(process_str)
        subprocess.run(process_str)

    @staticmethod
    def check_png(file_name):
        if os.path.exists(file_name) and os.path.isfile(file_name):
            if ".png" == os.path.splitext(file_name)[1]:
                return True
        return False

    def start_dir(self, png_dir, process_path=None):
        """
        图片目录循环压缩
        :param png_dir: 图片目录
        :param process_path: 图片目录
        :return:
        """
        if process_path is None:
            process_path = os.getcwd() + R"\pngquant\pngquant.exe"

        for infile in glob.glob(png_dir + "/*"):
            if not os.path.isdir(infile):
                if (self.check_png(infile)):
                    self.start_pngquant(infile, "", process_path)
            else:
                self.start_dir(infile, process_path)


if __name__ == '__main__':
    quant = EntityPngQuant()
    # quant.start_dir(R"E:\project\projectLB\Tjp-LB\Tjp-Lb-Client\assets\bundle\Sprite\HeroLar")
    quant.start_dir(R"E:\project\projectLB\Lb-Tools\mapParse\AnimDist\WangXiang\atk")
    exit()
