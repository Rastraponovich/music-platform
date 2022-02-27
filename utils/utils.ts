const BAND_MID_POINT_VALUE = 50
const BAND_SNAP_DISTANCE = 5

const BALANCE_MID_POINT_VALUE = 0
const BALANCE_SNAP_DISTANCE = 5

export const _snapBandValue = (value: number): number => {
    if (
        value < BAND_MID_POINT_VALUE + BAND_SNAP_DISTANCE &&
        value > BAND_MID_POINT_VALUE - BAND_SNAP_DISTANCE
    ) {
        return BAND_MID_POINT_VALUE
    }
    return value
}

export const _snapBalanceValue = (value: number): number => {
    if (
        value < BALANCE_MID_POINT_VALUE + BALANCE_SNAP_DISTANCE &&
        value > BALANCE_MID_POINT_VALUE - BALANCE_SNAP_DISTANCE
    ) {
        return BALANCE_MID_POINT_VALUE
    }
    return value
}

export const convertTimeToString = (duration: number): string => {
    const seconds = duration % 60
    const minutes = Math.floor(duration / 60)

    const firstSecond = Math.floor(seconds / 10)
    const lastSecond = Math.floor(seconds % 10)
    const firstMinute = Math.floor(minutes / 10)
    const lastMinute = Math.floor(minutes % 10)

    const string = `${firstMinute}${lastMinute}:${firstSecond}${lastSecond}`

    return string
}
export const convertTimeToObj = (duration: number) => {
    const seconds = duration % 60
    const minutes = Math.floor(duration / 60)

    const firstSecond = Math.floor(seconds / 10)
    const lastSecond = Math.floor(seconds % 10)
    const firstMinute = Math.floor(minutes / 10)
    const lastMinute = Math.floor(minutes % 10)

    return {
        firstMinute,
        lastMinute,
        firstSecond,
        lastSecond,
    }
}
