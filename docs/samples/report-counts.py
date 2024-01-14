"""
Report counts of words and non-words in the CSV files.
"""

import os

for what in ["practice", "word", "nonword"]:
    print(what)
    d = {}
    path = os.path.join(what + "s.txt")
    with open(path, mode="r") as f:
        for sample in f.readlines():
            sample = sample.strip()
            if sample != "":
                if sample[0] in d:
                    d[sample[0]] += [sample]
                else:
                    d[sample[0]] = [sample]

    for k, v in d.items():
        print("%s: %d %s samples" % (k, len(v), what))
