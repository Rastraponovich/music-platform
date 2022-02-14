import { getClientScope } from "@/hooks/useScope"
import { Nullable } from "@/types"
import { sample, createEffect, createEvent, createStore, guard, scopeBind, Effect } from "effector"
import StereoBalanceNode from "./StereoBalanceNode"

type Band = 60 | 170 | 310 | 600 | 1000 | 3000 | 6000 | 12000 | 14000 | 16000

const BANDS: Band[] = [60, 170, 310, 600, 1000, 3000, 6000, 12000, 14000, 16000]

type MediaElement = {
    _context: AudioContext
    _staticSource: GainNode
    __balance: GainNode
    _preamp: GainNode
    _analyser: AnalyserNode
    _gainNode: GainNode
    _audio: HTMLAudioElement
    _source: MediaElementAudioSourceNode
    _bands: { [key in Band]: BiquadFilterNode }
}

declare global {
    interface Window {
        webkitAudioContext: {
            new (contextOptions?: AudioContextOptions | undefined): AudioContext
            prototype: AudioContext
        }
    }
}
const initWinamp = createEvent()
const changeStatus = createEvent<any>()

const $Media = createStore<Nullable<MediaElement>>(null)

const createWinampFx = createEffect<any, any, any>(() => {
    const _context = new (window.AudioContext || window.webkitAudioContext)()
    const _staticSource = _context.createGain()
    const _balance = StereoBalanceNode(_context)
    const _preamp = _context.createGain()

    const _analyser = _context.createAnalyser()
    _analyser.fftSize = 2048
    _analyser.smoothingTimeConstant = 0.0
    const _gainNode = _context.createGain()
    const _audio = new Audio()
    const _source = _context.createMediaElementSource(_audio)
    _source.connect(_staticSource)
    _staticSource.connect(_preamp)

    let output = _preamp

    let _bands: { [key in Band]: BiquadFilterNode } = {} as { [key in Band]: BiquadFilterNode }
    BANDS.forEach((band, i) => {
        const filter = _context.createBiquadFilter()

        _bands[band] = filter

        if (i === 0) {
            // The first filter, includes all lower frequencies
            filter.type = "lowshelf"
        } else if (i === BANDS.length - 1) {
            // The last filter, includes all higher frequencies
            filter.type = "highshelf"
        } else {
            filter.type = "peaking"
        }
        filter.frequency.value = band
        filter.gain.value = 0

        output.connect(filter)
        output = filter
    })

    output.connect(_balance)

    _balance.connect(_gainNode)
    _balance.connect(_analyser)
    _gainNode.connect(_context.destination)

    return {
        _context,
        _staticSource,
        _audio,
        _source,
        _balance,
        _preamp,
        _bands,
        _gainNode,
        _analyser,
    }
})
sample({
    clock: initWinamp,
    target: createWinampFx,
})

sample({
    clock: createWinampFx.doneData,
    fn: (media) => media,
    target: $Media,
})

const loadUrl = createEvent<{ url: string; autoPlay: boolean }>()
$Media.watch(console.log)
sample({
    clock: loadUrl,
    source: $Media,
    fn: (media, loadUrl) => ({ media, loadUrl }),
    target: createEffect(({ media, loadUrl }: { media: any; loadUrl: any }) => {
        media._audio.src = loadUrl.url
        media._audio.play()
    }),
})

export { $Media, initWinamp, loadUrl }
