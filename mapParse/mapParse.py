from cv2 import cv2
import numpy as np
import os

pic_path = os.getcwd() + R'\mohe.jpg'  # 分割的图片的位置
# action_name = os.path.basename(pic_path)
# print(os.getcwd())
# exit()
pic_target = './result/'  # 分割后的图片保存的文件夹
if not os.path.exists(pic_target):  # 判断是否存在文件夹如果不存在则创建为文件夹
    os.makedirs(pic_target)
# 要分割后的尺寸
cut_width = 1024
cut_length = 1024
# 读取要分割的图片，以及其尺寸等数据
picture = cv2.imread(pic_path, cv2.IMREAD_UNCHANGED)
(width, length, depth) = picture.shape
# 预处理生成0矩阵
pic = np.zeros((cut_width, cut_length, depth))
# 计算可以划分的横纵的个数
num_width = int(width / cut_width) + 1
num_length = int(length / cut_length) + 1
# for循环迭代生成
for i in range(0, num_width):
    for j in range(0, num_length):
        pic = picture[i * cut_width: (i + 1) * cut_width, j * cut_length: (j + 1) * cut_length, :]
        # (width1, length1, depth1) = pic.shape
        # if width1 < cut_width or length1 < cut_length:
        #     pic = cv2.copyMakeBorder(pic, 0, cut_width - width1, 0, cut_length - length1, cv2.BORDER_CONSTANT,
        #                              value=[255, 255, 255, 0])
        result_path = pic_target + '{}_{}.jpg'.format( j + 1,i + 1)
        # cv2.imwrite(result_path, pic)
        cv2.imwrite(result_path, pic, [int(cv2.IMWRITE_JPEG_QUALITY), 100])

print("done!!!")
exit()
