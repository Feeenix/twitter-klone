import png
import os
import numpy as np

def fjerninnside(filnavn):
    print ("fikser på fargen til", filnavn)
    with open(filnavn,"rb") as f:
        img = png.Reader(file=f)
        read = img.read()
        width, height, pixels, metadata = read
        img_array = np.array(list(pixels))
        print(img_array.shape, width, height)
        for y in range(height): # 0 to 500
            if y % 10 == 0:
                print(y/height*100, "%")
            for x in range(width): # 0 to 500
                pixeldata = img_array[y][x*4:x*4+4]
                if pixeldata[3] == 0:
                    continue
                img_array[y][x*4:x*4+3] = [186, 170, 255]

        png.from_array(img_array, mode="RGBA").save("output/"+filnavn.split("/")[-1])


for fil in os.listdir("output"):
    if fil.endswith(".png"):
        fjerninnside("output/"+fil)
# fjerninnside("bilder/home.png")