export const displayTime = (time: number) => {
    if(time < 60){
        return time + 's'
    }
    if(time < 3600) {
        return Math.floor(time / 60) + 'min ' + (time % 60) + 's'
    }

    return Math.floor(time / 3600) + 'h ' + Math.floor((time % 3600) / 60) + 'min ' + Math.floor(time % 60) + 's'
}

export function convertMS(ms: number) {
    let d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;

    if(d == 0){
        if(h == 0){
            if(m == 0) {
                return 'a few seconds ago'
            }
            else {
                return m == 1 ? 'one minute ago' : m + ' minutes ago'
            }
        }
        else {
            return h == 1 ? 'one hour ago' : h + ' hours ago'
        }
    } else {
        return d == 1 ? 'yesterday' : d + ' days ago'
    }
}
