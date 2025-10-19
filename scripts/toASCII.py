import numpy as np
from PIL import Image
import math

p_size = 3
ascii_vals = """▓▒░B@%8WM#*ZQOLCJUXohqmzrjft|)1]?+-i!l:"' """

def create_patches(img_array):
    vert_p_size = math.floor(p_size * 2)
    h, w, c = img_array.shape
    h_patches = h // vert_p_size
    w_patches = w // p_size

    img_array = img_array[:h_patches * vert_p_size, :w_patches * p_size]

    patches = (
        img_array
        .reshape(h_patches, vert_p_size, w_patches, p_size, c)
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
    brightness = lum * len(ascii_vals) - 1
    brightness = int(brightness)
    symbol = ascii_vals[brightness]
    return symbol


def ascii_output(imagePath):
    with Image.open(imagePath) as im:
        test = np.array(im)
    patches = create_patches(test)
    h_patches, w_patches = patches.shape[:2]

    output = ""
    for h in range(h_patches):
        for w in range(w_patches):
            patch = patches[h,w]
            lumi = luminance(patch)
            character = brightness_matching(lumi)
            output += character
        output += '\n'
    return output

def colored_ascii(imagePath):
    with Image.open(imagePath) as im:
        test = np.array(im)
    patches = create_patches(test)
    h_patches, w_patches = patches.shape[:2]

    ascii_chars = []

    for h in range(h_patches):
        row_chars = []
        for w in range(w_patches):
            patch = patches[h,w]
            r = (patch[0, 0][0])
            g = (patch[0, 0][1])
            b = (patch[0, 0][2])
            lumi = luminance(patch)
            character = brightness_matching(lumi)
            row_chars.append({
                'char': character,
                'color': f'rgb({r},{g},{b})'
            })
        ascii_chars.append(row_chars)
            #ascii_im += (f"\033[38;2;{r};{g};{b}m{character}\033[0m")
        #ascii_im += '\n'
    return ascii_chars

def col_matching(color):
    saturation = color * len(ascii_vals) - 1
    saturation = int(saturation)
    symbol = ascii_vals[saturation]
    return symbol

def multilayered(imagePath):
    with Image.open(imagePath) as im:
        test = np.array(im)
    patches = create_patches(test)
    h_patches, w_patches = patches.shape[:2]

    red_grid = []
    green_grid = []
    blue_grid = []

    for h in range(h_patches):
        r_row = []
        g_row = []
        b_row = []

        for w in range(w_patches):
            patch = patches[h,w]
            r = (patch[0, 0][0])/255
            g = (patch[0, 0][1])/255
            b = (patch[0, 0][2])/255

            red_char = col_matching(r)
            green_char = col_matching(g)
            blue_char = col_matching(b)

            r_row.append(red_char)
            g_row.append(green_char)
            b_row.append(blue_char)
            # red_grid += (f"\033[38;2;{255};{0};{0}m{red}\033[0m")
            # green_grid += (f"\033[38;2;{0};{255};{0}m{green}\033[0m")
            # blue_grid += (f"\033[38;2;{0};{0};{255}m{blue}\033[0m")
        red_grid.append(r_row)
        green_grid.append(g_row)  
        blue_grid.append(b_row)  
        # red_grid += '\n'
        # green_grid += '\n'
        # blue_grid += '\n'

    return {
        'red': red_grid,
        'green': green_grid,
        'blue': blue_grid
    }

def create_ascii(imagePath, style):
    if style == "bw":
        result = ascii_output(imagePath)
    elif style == "color":
        result = colored_ascii(imagePath)
    elif style == "rgb":
        result = multilayered(imagePath)
    else:
        result = ""
        print("Invalid Style!")
        
    return result

if __name__ == "__main__":
    print(create_ascii())

