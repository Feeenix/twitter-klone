import png
import os
import numpy as np
import numba

@numba.jit(nopython=True)
def searchAroundPixel(x:int, y:int, radius:float, img_array: np.ndarray, new_array: np.ndarray, width: int, height: int) -> np.ndarray:
    pixeldata = img_array[y][x*4:x*4+4]
    pixeldiffuse = 2
    steps = 6
    for i in np.arange(-1,pixeldiffuse-1, 1/steps):
        for y2 in range(y-int(radius+i),y+int(radius+i)):
            for x2 in range(x-int(radius+i),x+int(radius+i)):
                
                # keep if distance to border is less than radius
                if abs(x) < radius+i or abs(y) < radius+i or abs(x-width) < radius+i or abs(y-height) < radius+i:
                    return np.array([pixeldata[0],pixeldata[1],pixeldata[2],pixeldata[3]* (1 - (i+1)/pixeldiffuse)], dtype=np.uint8) 
                if x2 == x and y2 == y:
                    continue
                if (x2-x)**2 + (y2-y)**2 > (radius+i)**2:
                    continue
                if y2 < 0 or y2 >= height or x2 < 0 or x2 >= width:
                    return np.array([pixeldata[0],pixeldata[1],pixeldata[2],pixeldata[3]* (1 - (i+1)/pixeldiffuse)], dtype=np.uint8) 
                
                                        
                pixeldata2 = img_array[y2][x2*4:x2*4+4]
                
                if pixeldata2[3] <= 127:
                    return np.array([pixeldata[0],pixeldata[1],pixeldata[2],pixeldata[3]* (1 - (i+1)/pixeldiffuse)], dtype=np.uint8) 
    
    return np.array([0,0,0,0], dtype=np.uint8)
                # print(pixeldata)

def fjerninnside(filnavn):
    print ("Fjerner innside av", filnavn)
    with open(filnavn,"rb") as f:
        img = png.Reader(file=f)
        read = img.read()
        width, height, pixels, metadata = read
        img_array = np.array(list(pixels))
        # same shape but all 0
        print(img_array.shape, width, height)
        new_array = np.zeros(img_array.shape, dtype=np.uint8) # 500x2000
        for y in range(height): # 0 to 500
            if y % 10 == 0:
                print(y/height*100, "%")
            for x in range(width): # 0 to 500
                pixeldata = img_array[y][x*4:x*4+4]
                if pixeldata[3] == 0:
                    continue
                radius = 28/500*height # 28 pixels is 500 pixels high
                # search in a 28 pixel circular radius if there is a pixel with 0 alpha, then keep the current pixel
                new_array[y][x*4:x*4+4] = searchAroundPixel(x, y, radius, img_array, new_array, width, height)



        png.from_array(new_array, mode="RGBA").save("output/"+"_hul.".join(filnavn.split("/")[-1].split(".")))


for fil in os.listdir("output"):
    if fil.endswith(".png"):
        fjerninnside("output/"+fil)
# fjerninnside("bilder/home.png")