def acne_score(count, area_norm):
    # area_norm is total lesion area / skin area
    raw = 0.6*min(1.0, count/30.0) + 0.4*min(1.0, area_norm/0.12)
    return round(100.0*(1.0 - raw), 2)

def pig_score(area_pct):
    return round(100.0*(1.0 - min(1.0, area_pct/25.0)), 2)

def wrinkle_score(density):
    return round(100.0*(1.0 - min(1.0, density/0.08)), 2)

def overall(acne, pig, wrinkle, w=(0.45,0.35,0.20)):
    return round(w[0]*acne + w[1]*pig + w[2]*wrinkle, 2)
