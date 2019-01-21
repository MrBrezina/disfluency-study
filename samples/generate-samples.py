import drawBot as db
import os
import csv

# sample settings
w, h = 800, 200
margin = 20
typefaces = {}
typefaces["practice"] = [
    # code, font PS name, font size
    # choose size that allows for words up to ca 14 characters
    # and keeps the x-height same for all typefaces
    ("timesnewroman", "TimesNewRomanPSMT", 100),
    ]
typefaces["word"] = [
    ("arial", "ArialMT", 100),
    ("sansforgetica", "SansForgetica-Regular", 100),
    ("inputsans", "InputSansCompressed-Medium", 100),
    ]
typefaces["nonword"] = typefaces["word"]

# produce samples
script = []
for what in ["practice", "word", "nonword"]:
    # dictionary with words and lures
    path = os.path.join(what + "s.csv")
    
    # compile Javascript code
    script.append("var source_%s = [" % what)
    with open(path, mode="r") as f:
        csv_reader = csv.DictReader(f)
        for row in csv_reader:
            script.append("  '%s'," % row["string"])
        script.append("];\n\n")
    
    # generate SVGs
    for code, fontname, fontsize in typefaces[what]:
        db.font(fontname)
        db.fontSize(fontsize)
        xh = db.fontXHeight()
        target_dir = os.path.join(what, code)
        if not os.path.exists(target_dir):
            os.mkdir(target_dir)
        with open(path, mode="r") as f:
            csv_reader = csv.DictReader(f)
            for i, row in enumerate(csv_reader):
                txt = row["string"]
                db.newDrawing()
                db.newPage(w, h)
                p = db.BezierPath()
                db.fill(1)
                db.stroke(None)
                db.rect(0, 0, w, h)
                db.fill(0)
                # produce SVGs with the text converted
                # to outlines
                fs = db.FormattedString(txt, font=fontname, fontSize=fontsize)
                p.text(fs, (w/2, (h - xh)/2), align="center")
                db.drawPath(p)
                db.saveImage(os.path.join(target_dir, "%s_%s.svg" % (i, txt)))
                tw, _ = db.textSize(fs)
                if tw > (w - 2*margin):
                    print("Text '%s' in typeface %s is too wide." % (row["string"], code))
# save Javascript code
with open("sequences.js", "w") as jsf:
    jsf.write("\n".join(script))
