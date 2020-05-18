"""
Basic functions and constants
"""

import numpy as np

alpha = 0.05


def normalize_auc(auc):
    """
    Transform the square root of AUC
    using arcsin and multiply by 2.
    """

    return 2 * np.arcsin(np.sqrt(auc))


def normalize_rt(rt):
    """
    Tranform RTs
    using natural logarithm.
    """

    return np.log(rt)


def denormalize_auc(aucnorm):
    """
    Transform the normalized AUC back
    using a square of the sine value of its half.
    """

    return np.sin(aucnorm / 2) ** 2


def denormalize_rt(rtnorm):
    """
    Tranform the normalized RTs back
    using the exponential function.
    """

    return np.exp(rtnorm)


def cummulative(x):
    return [sum(x[0:i+1]) for i in range(len(x))]


def get_auc(x, y):
    # make cummulative
    x, y = cummulative(x), cummulative(y)
    # normalize
    x = [xi/max(x) for xi in x]
    y = [yi/max(y) for yi in y]
    auc = 0
    x1, y1 = 0, 0
    for x2, y2 in zip(x, y):
        auc += (x2 - x1) * (y1 + y2) / 2
        x1, y1 = x2, y2
    return auc


def plot_roc(x, y):
    x, y = cummulative(x), cummulative(y)
    plt.plot((min(x), max(x)), (min(y), max(y)), color='red', linewidth=1, linestyle='--')
    for i in range(len(x)-1):
        plt.plot((x[i], x[i+1]), (y[i], y[i+1]), color='black', linewidth=1)
    for i in range(len(x)):
        plt.scatter(x[i], y[i], marker='o', s=30, color='black')
    #plt.xlim(0.0, 1.0)
    #plt.ylim(0.0, 1.0)
    plt.show()
