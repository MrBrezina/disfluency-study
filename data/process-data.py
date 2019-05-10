import glob
import numpy as np
import pandas as pd

columns = [
    "Study ID", "Participant ID", "Fluent", "Training",
    "Test ID", "Test type", "Trial ID",
    "Font", "Sample", "Category",
    "Response", "Correct", "Seen", "Foil", "Response time",
    "JoM", "JoL", "Date",
]
d = pd.DataFrame(columns=columns)

x = 0
rawfilenames = "data__*.csv"
resultfilename = "data.csv"
for fn in glob.glob(rawfilenames):
    raw = pd.read_csv(fn)

    options = {}
    for i, rraw in raw.iterrows():
        rd_temp = pd.Series(index=d.columns)
        if "studyid" in rraw:
            rd_temp["Study ID"] = rraw["studyid"]
        else:
            rd_temp["Study ID"] = 0 # pilot study
        rd_temp["Participant ID"] = int(x)
        if "Fluent" in rraw:
            rd_temp["Fluent"] = rraw["Fluent"]
        elif "Native" in rraw:
            rd_temp["Fluent"] = rraw["Native"] # legacy
        if "Designer" in rraw:
            rd_temp["Training"] = rraw["Designer"] # legacy
        else:
            rd_temp["Training"] = rraw["Design_skills"] # legacy
        # save results for individual trials in rows
        for c in rraw.index:
            if c.startswith("test_") and not (c.endswith("_remember") or c.endswith("_legibility")):
                # e.g. test_1_lexical_5
                rd = pd.Series(rd_temp)
                rd["Category"], rd["Seen"], rd["Foil"] = np.nan, np.nan, np.nan # force defaults
                _, rd["Test ID"], rd["Test type"], rd["Trial ID"] = c.strip().split("_")
                try:
                    response = rraw[c].strip().split(",")
                except:
                    print("Error with:", c, rraw[c])
                    print("Date:", rraw[-1])
                    print("Skipping")
                    continue

                # tackle legacy formats of responses
                rd["Font"] = response[0].strip()
                rd["Response"] = response[-2].strip()
                rd["Response time"] = response[-1].strip()
                if rd["Test type"] == "lexical":
                    if len(response) == 4:
                        rd["Sample"] = response[1].strip()
                    else:
                        rd["Category"] = response[1].strip()
                        rd["Sample"] = response[2].strip()
                else:
                    if len(response) == 5:
                        rd["Sample"] = response[1].strip()
                        rd["Seen"] = response[2].strip()
                    elif len(response) == 6:
                        rd["Category"] = response[1].strip()
                        rd["Sample"] = response[2].strip()
                        rd["Seen"] = response[3].strip()
                    else:
                        rd["Category"] = response[1].strip()
                        rd["Sample"] = response[2].strip()
                        rd["Seen"] = response[3].strip()
                        rd["Foil"] = response[4].strip()

                # fix legacy values
                if isinstance(rd["Category"], str):
                    rd["Category"] = rd["Category"].replace("nonword", "non-word")
                if isinstance(rd["Seen"], str):
                    rd["Seen"] = rd["Seen"].replace("non-seen", "not seen")
                rd["Response"] = rd["Response"].replace("non-seen", "not seen")
                # add the judgement of learning for this part (from test_1_remember)
                rd["JoM"] = rraw["test_%s_remember" % rd["Test ID"]]
                # add the judgement of legibility for this part (from test_1_legibility)
                rd["JoL"] = rraw["test_%s_legibility" % rd["Test ID"]]
                rd["Date"] = rraw[-1]

                d.loc[x] = rd
                x += 1
# fix types
d["Study ID"] = d["Study ID"].astype(int)
d["Participant ID"] = d["Participant ID"].astype(int)

print("Loaded %d responses" % len(d))

# add missing data & evaluate responses

categories = {}
for cat in ["words", "non-words"]:
    with open(cat + ".txt") as f:
        for w in f.readlines():
            categories[w.strip()] = cat[:-1] # remove the final "s"

for i, rd in d.iterrows():
    rd["Fluent"] = rd["Fluent"] == "yes"
    if isinstance(rd["Category"], float) or rd["Category"] is np.nan:
        # get missing category
        rd["Category"] = categories[rd["Sample"]]
    # evaluate responses and check values
    if rd["Test type"] == "lexical":
        if rd["Response"] == ("Sure " + rd["Category"]) :
            rd["Correct"] = 1
        elif rd["Response"] == ("Probably " + rd["Category"]) :
            rd["Correct"] = 1
        else:
            rd["Correct"] = 0
    else: # recognition
        if rd["Response"] == ("Sure " + rd["Seen"]) :
            rd["Correct"] = 1
        elif rd["Response"] == ("Probably " + rd["Seen"]) :
            rd["Correct"] = 1
        else:
            rd["Correct"] = 0
    d.loc[i] = rd

# save the processed data
d.to_csv(resultfilename.replace(".csv", "_processed.csv"))
print("Saved to CSV")
