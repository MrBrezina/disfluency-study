# Studies exploring disfluency effect and influence of fonts on memory

Designed and conducted by: Mary Dyson, David Březina

This repo contains materials for two studies we have conducted in the first half of 2018 with the goal to explore a disfluency effect and influence of fonts and their legibility on memory.

We described the studies and some of the results in a conference presentation at the [ICTVC](https://ictvc.org/2019/en/) conference in Patras in June 2019. We are in the process of writing up reports. These will be published at some point in 2020.

This repo includes:

- the website we used to collect participants responses
- the data/responses collected
- Jupyter notebooks used to process and analyze the data

We have also used other software to analyze the data, but we tried to make the most important statistics available in the Jupyter notebooks here.

## Website

The website is served using GH Pages directly from this repo.
It uses Javascript to navigate between inidividual steps of the study and request responses from participants. The responses from each participant are saved using a [GetForm](https://getform.io) service.

The samples (words and non-words set in one of two studied fonts) are generated using a Python script and [Drawbot](http://drawbot.com) as a module (see `samples/generate-samples.py`) based on the `data/samples-databases`.

## Data

For the databases of words and non-words, see `data/samples-databases`.

The “raw“ data collected from the website before any processing is saved in `data/raw/` folder. The processed data is stored in `data/data.csv` and `data/data_aggregated.csv`. For description of the data format, see the [data-processing notebook](https://nbviewer.jupyter.org/github/MrBrezina/dstudy.mrbrezina.com/blob/master/notebooks/1%20Process%20raw%20data.ipynb).

## Jupyter notebooks

Jupyter notebooks used to process and analyze the data are stored in the `notebooks/` folder.

- `notebooks/1 Process raw data.ipynb` [View using NBViewer](https://nbviewer.jupyter.org/github/MrBrezina/dstudy.mrbrezina.com/blob/master/notebooks/1%20Process%20raw%20data.ipynb)
- `notebooks/2 Descriptive statistics.ipynb` [View using NBViewer](https://nbviewer.jupyter.org/github/MrBrezina/dstudy.mrbrezina.com/blob/master/notebooks/2%20Descriptive%20statistics.ipynb)
- `notebooks/3 Main analysis.ipynb` [View using NBViewer](https://nbviewer.jupyter.org/github/MrBrezina/dstudy.mrbrezina.com/blob/master/notebooks/3%20Main%20analysis.ipynb)
- `notebooks/4 Results and charts.ipynb` [View using NBViewer](https://nbviewer.jupyter.org/github/MrBrezina/dstudy.mrbrezina.com/blob/master/notebooks/4%20Results%20and%20charts.ipynb)
- `notebooks/5 Exploration of correlations.ipynb` [View using NBViewer](https://nbviewer.jupyter.org/github/MrBrezina/dstudy.mrbrezina.com/blob/master/notebooks/5%20Exploration%20of%20correlations.ipynb)
