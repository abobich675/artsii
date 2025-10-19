import numpy as np
from PIL import Image

def create_patches(img_array, p_size): 
    h, w, c = img_array.shape
    h_patches = h // p_size
    w_patches = w // p_size

    img_array = img_array[:h_patches * p_size, :w_patches * p_size]

    patches = (
        img_array
        .reshape(h_patches, p_size, w_patches, p_size, c)
        .swapaxes(1, 2)  # swap patch grid order
    )
    return patches

def luminance(patch):
    R = (patch[0, 0][0])/255
    if R <= 0.0405:
        R = R/12.92
    elif R > 0.0404:
        R = ((R + 0.055)/1.055)**2.4
    G = (patch[0, 0][1])/255
    if G <= 0.0405:
        G = G/12.92
    elif G > 0.0404:
        G = ((G + 0.055)/1.055)**2.4
    B = (patch[0, 0][2])/255
    if B <= 0.0405:
        B = B/12.92
    elif B > 0.0404:
        B = ((B + 0.055)/1.055)**2.4
    L = 0.2126 * R + 0.7152 * G + 0.0722 * B
    return L

def brightness_matching(lum):
    brightness = lum * 59
    brightness = int(brightness)
    ascii_vals = """▓B%8&WM▒#*oahkqmZO0QLCJUYXzcxrjft░\|)1{}[]?-_+~>i!lI;:,"^`' """
    symbol = ascii_vals[brightness]
    return symbol


def ascii_output():
    p_size = 2
    with Image.open("bulba.jpeg") as im:
        test = np.array(im)
    patches = create_patches(test, p_size)
    h_patches, w_patches = patches.shape[:2]

    for h in range(h_patches):
        for w in range(w_patches):
            patch = patches[h,w]
            lumi = luminance(patch)
            print(brightness_matching(lumi), end="")
        print()

def colored_ascii():
    p_size = 25
    with Image.open("starry_night.jpg") as im:
        test = np.array(im)
    patches = create_patches(test, p_size)
    h_patches, w_patches = patches.shape[:2]

    ascii_im = ""

    for h in range(h_patches):
        for w in range(w_patches):
            patch = patches[h,w]
            r = (patch[0, 0][0])
            g = (patch[0, 0][1])
            b = (patch[0, 0][2])
            lumi = luminance(patch)
            character = brightness_matching(lumi)
            ascii_im += (f"\033[38;2;{r};{g};{b}m{character}\033[0m")
        ascii_im += '\n'
        
    print(ascii_im)

def col_matching(color):
    saturation = color * 59
    saturation = int(saturation)
    ascii_vals = """▓B%8&WM▒#*oahkqmZO0QLCJUYXzcxrjft░\|)1{}[]?-_+~>i!lI;:,"^`' """
    symbol = ascii_vals[saturation]
    return symbol

def multilayered():
    p_size = 10
    with Image.open("/Users/teganmyers/Downloads/mountain_test.jpg") as im:
        test = np.array(im)
    patches = create_patches(test, p_size)
    h_patches, w_patches = patches.shape[:2]

    red_grid = ""
    green_grid = ""
    blue_grid = ""

    for h in range(h_patches):
        for w in range(w_patches):
            patch = patches[h,w]
            r = (patch[0, 0][0])/255
            g = (patch[0, 0][1])/255
            b = (patch[0, 0][2])/255

            red = col_matching(r)
            green = col_matching(g)
            blue = col_matching(g)
            red_grid += (f"\033[38;2;{255};{0};{0}m{red}\033[0m")
            green_grid += (f"\033[38;2;{0};{255};{0}m{green}\033[0m")
            blue_grid += (f"\033[38;2;{0};{0};{255}m{blue}\033[0m")
        red_grid += '\n'
        green_grid += '\n'
        blue_grid += '\n'

    print(red_grid)
    print(green_grid)
    print(blue_grid)    

def run():
    function = input("Enter 'BW' for black and white art, 'RGB' for RGB variations, or 'C' for colored art: ")
    if function == "BW":
        ascii_output()
    if function == "C":
        colored_ascii()
    if function == "RGB":
        multilayered()
    else:
        print("Please enter a valid choice.")



if __name__ == "__main__":
    run()

