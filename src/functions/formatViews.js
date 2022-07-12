export const formatViews = (n, d) => {
    if (n < 1e3) return n;
    if (n >= 1e3 && n < 1e6) return + (n / 1e3).toFixed(d) + "K";
    if (n >= 1e6 && n < 1e9) return + (n / 1e6).toFixed(d) + "M";
    if (n >= 1e9 && n < 1e12) return + (n / 1e9).toFixed(d) + "B";
    if (n >= 1e12) return + (n / 1e12).toFixed(1) + "T";
};