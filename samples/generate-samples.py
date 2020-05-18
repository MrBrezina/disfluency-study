import drawBot as db
import os

# sample settings
w, h = 500, 200
margin = 20
typefaces = {}
typefaces["practice"] = [
    # code, font PS name, font size
    # choose size that allows for words up to ca 14 characters
    # and keeps the x-height same for all typefaces
    ("timesnewroman", "TimesNewRomanPSMT", h/2.5),
    ]
typefaces["word"] = [
    ("arial", "ArialMT", h/2.5),
    ("sansforgetica", "SansForgetica-Regular", h/3),
    ("brushscript", "BrushScriptStd", h/2.5),
    ("inputmono", "InputMono-Medium", h/2.5),
    ("alcoholica", "Alcoholica", h/3)
    ]
typefaces["non-word"] = typefaces["word"]

# produce samples
script = []
for what in ["practice", "word", "non-word"]:
    # text files with words and non-words
    path = os.path.join("..", "data", "samples-databases", what + "s.txt")

    # compile Javascript code
    if what == "practice":
        script.append("var source_%s = [" % what)
    elif what == "word":
        script.append("var source = [[")
    else:
        script.append("], [")
    with open(path, mode="r") as f:
        for sample in f.readlines():
            sample = sample.strip()
            if sample != "":
                script.append("  '%s'," % sample)
    if what == "practice":
        script.append("];\n\n")
    elif what == "non-word":
        script.append("]];\n\n")

    # generate SVGs
    for code, fontname, h_offset in typefaces[what]:
        db.font(fontname)
        # increase fontsize to match x-height to ca 1/6 of the page height
        fontsize = 20
        db.fontSize(fontsize)
        xh = db.fontXHeight()
        while xh < h/6:
            fontsize += 1
            db.fontSize(fontsize)
            xh = db.fontXHeight()
        print(fontname, "Calculated font size:", fontsize)
        target_dir = os.path.join(what, code)
        if not os.path.exists(target_dir):
            os.makedirs(target_dir)
        with open(path, mode="r") as f:
            for sample in f.readlines():
                sample = sample.strip()
                if sample != "":
                    db.newDrawing()
                    db.newPage(w, h)
                    p = db.BezierPath()
                    db.fill(1)
                    db.stroke(None)
                    db.rect(0, 0, w, h)
                    db.fill(0)
                    # produce SVGs with the text converted
                    # to outlines
                    fs = db.FormattedString(sample, font=fontname, fontSize=fontsize)
                    p.text(fs, (w/2, h_offset), align="center")
                    db.drawPath(p)
                    db.saveImage(os.path.join(target_dir, sample + ".svg"))
                    tw, _ = db.textSize(fs)
                    if tw > (w - 2*margin):
                        print("Text '%s' in typeface %s is too wide." % (sample, code))
# save Javascript code
with open("sequences.js", "w") as jsf:
    jsf.write("\n".join(script))
